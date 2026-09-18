import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve, relative } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
async function inventory(dir) {
  const items = await readdir(dir, { withFileTypes: true });
  const entries = [];
  for (const item of items.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const path = resolve(dir, item.name);
    if (item.isDirectory()) entries.push(...await inventory(path));
    else if (item.isFile()) entries.push({ path: relative(dist, path), sha256: hash(await readFile(path)) });
    else throw new Error(`Unsupported release entry: ${path}`);
  }
  return entries;
}
const files = await inventory(dist);
for (const required of ['index.html', '.htaccess', '404.html', 'site.webmanifest']) {
  if (!files.some((file) => file.path === required)) throw new Error(`Missing ${required}`);
}
if (files.some((file) => file.path.endsWith('.map'))) throw new Error('Source maps must not be published');
const { version } = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const contentHash = hash(JSON.stringify(files));
const name = `b-lance-${version}-${contentHash.slice(0, 12)}`;
const output = resolve(root, 'releases');
await mkdir(output, { recursive: true });
const archive = resolve(output, `${name}.tar.gz`);
execFileSync('tar', ['-czf', archive, '-C', dist, '.'], { env: { ...process.env, COPYFILE_DISABLE: '1' } });
const archiveHash = hash(await readFile(archive));
await writeFile(resolve(output, `${name}.json`), JSON.stringify({ version, contentHash, archive: `${name}.tar.gz`, archiveSha256: archiveHash, files }, null, 2) + '\n');
await writeFile(resolve(output, `${name}.sha256`), `${archiveHash}  ${name}.tar.gz\n`);
console.log(`Release: ${archive}\nSHA-256: ${archiveHash}\nManifest: ${name}.json`);
