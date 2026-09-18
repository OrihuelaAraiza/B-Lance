#!/usr/bin/env python3
"""Serve a release with real Apache and exercise its .htaccess, without root or Docker."""
import argparse
import getpass
import grp
import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import tarfile
import tempfile
import time
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--archive', type=Path, help='Verify the extracted release archive instead of dist/')
parser.add_argument('--serve', action='store_true', help='Keep Apache running after checks for browser QA')
parser.add_argument('--port', type=int, default=0)
args = parser.parse_args()

def stop_on_signal(_number, _frame):
    raise KeyboardInterrupt

signal.signal(signal.SIGTERM, stop_on_signal)
httpd = os.environ.get('APACHE_BIN') or shutil.which('httpd') or shutil.which('apache2')
if not httpd:
    raise SystemExit('Apache missing. Install apache2 (Linux), or use /usr/sbin/httpd (macOS).')
modules = next((p for p in [Path('/usr/libexec/apache2'), Path('/usr/lib/apache2/modules')] if p.is_dir()), None)
if modules is None:
    raise SystemExit('Apache module directory not found.')

with tempfile.TemporaryDirectory(prefix='b-lance-apache-') as temporary:
    work = Path(temporary)
    docroot = work / 'site'
    if args.archive:
        docroot.mkdir()
        with tarfile.open(args.archive.resolve()) as archive:
            archive.extractall(docroot, filter='data')
    else:
        shutil.copytree(ROOT / 'dist', docroot)
    if not (docroot / '.htaccess').is_file():
        raise SystemExit('Build the release first: pnpm run build')
    with socket.socket() as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('127.0.0.1', args.port))
        port = sock.getsockname()[1]
    names = ['mpm_event', 'unixd', 'authz_core', 'authz_host', 'dir', 'mime', 'headers', 'log_config']
    builtins = subprocess.check_output([httpd, '-l'], text=True)
    loads = '\n'.join(
        f'LoadModule {name}_module "{modules}/mod_{name}.so"'
        for name in names if f'mod_{name}.c' not in builtins
    )
    mime = next(p for p in [Path('/etc/apache2/mime.types'), Path('/etc/mime.types')] if p.is_file())
    user = 'www-data' if os.getuid() == 0 else getpass.getuser()
    group = 'www-data' if os.getuid() == 0 else grp.getgrgid(os.getgid()).gr_name
    # Root CI workers serve as www-data; all temporary ancestors must be traversable.
    work.chmod(0o755)
    config = work / 'httpd.conf'
    config.write_text(f'''ServerRoot "{work}"
ServerName localhost
Listen 127.0.0.1:{port}
PidFile "{work}/httpd.pid"
{loads}
User {user}
Group {group}
ErrorLog "{work}/error.log"
LogLevel warn
TypesConfig "{mime}"
AddType application/javascript .js
AddType font/woff2 .woff2
AddType image/webp .webp
DocumentRoot "{docroot}"
<Directory "{docroot}">
  AllowOverride All
  Require all granted
</Directory>
''')
    subprocess.run([httpd, '-t', '-f', str(config)], check=True)
    log = (work / 'process.log').open('w+')
    server = subprocess.Popen([httpd, '-f', str(config), '-DFOREGROUND'], stdout=log, stderr=log)
    base = f'http://127.0.0.1:{port}'

    def request(path):
        try:
            with urllib.request.urlopen(base + path, timeout=5) as response:
                return response.status, response.headers, response.read()
        except urllib.error.HTTPError as error:
            return error.code, error.headers, error.read()

    def check_headers(headers):
        assert headers['X-Content-Type-Options'] == 'nosniff'
        assert headers['X-Frame-Options'] == 'DENY'
        assert "frame-ancestors 'none'" in headers['Content-Security-Policy']
        assert "connect-src 'none'" in headers['Content-Security-Policy']
        assert headers['Referrer-Policy'] == 'strict-origin-when-cross-origin'
        assert 'microphone=()' in headers['Permissions-Policy']

    try:
        for _ in range(80):
            if server.poll() is not None:
                log.seek(0)
                raise RuntimeError(log.read() + (work / 'error.log').read_text() if (work / 'error.log').exists() else 'Apache stopped')
            try:
                request('/')
                break
            except (urllib.error.URLError, ConnectionError):
                time.sleep(0.1)
        status, headers, body = request('/')
        assert status == 200 and b'id="root"' in body
        check_headers(headers)
        assert headers['Cache-Control'] == 'no-cache'
        assets = sorted((docroot / 'assets').iterdir())
        assert assets and not list(docroot.rglob('*.map'))
        for asset in assets:
            status, headers, body = request('/assets/' + asset.name)
            assert status == 200 and body == asset.read_bytes()
            assert headers['Cache-Control'] == 'public, max-age=31536000, immutable'
            check_headers(headers)
        for path in ['/missing-page', '/assets/missing-abcdefgh.js', '/missing.js.map']:
            status, headers, body = request(path)
            assert status == 404 and 'Esta ruta no está disponible'.encode() in body
            assert headers['Cache-Control'] == 'no-cache'
            check_headers(headers)
        status, _, _ = request('/.htaccess')
        assert status == 403
        status, headers, _ = request('/images/soft-coast.webp')
        assert status == 200 and headers['Cache-Control'] == 'no-cache'
        print(json.dumps({'apache': 'PASS', 'baseURL': base, 'assets': len(assets), 'checks': ['index', 'asset bytes', 'real 404', 'HTML revalidation', 'hashed asset cache', 'security headers', 'no source maps', 'protected .htaccess']}, ensure_ascii=False), flush=True)
        if args.serve:
            print('Ready for browser QA. Ctrl-C to stop.', flush=True)
            server.wait()
    except KeyboardInterrupt:
        pass
    except Exception:
        if (work / 'error.log').exists():
            print((work / 'error.log').read_text(), flush=True)
        raise
    finally:
        server.terminate()
        try:
            server.wait(timeout=5)
        except subprocess.TimeoutExpired:
            server.kill()
            server.wait()
        log.close()
