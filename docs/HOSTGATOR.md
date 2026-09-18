# Publicación estática en HostGator

El destino sigue siendo Apache en la raíz de un dominio o subdominio dedicado. No se ha realizado un despliegue con esta entrega. No necesita procesos Node en el servidor ni secretos de aplicación. No sobrescribir un WordPress u otra aplicación existente.

## Preparar y verificar la versión

Usar Node indicado en `.nvmrc` y pnpm indicado en `package.json`. Después:

```sh
pnpm install --frozen-lockfile
pnpm run release
pnpm exec playwright install chromium
pnpm run test:e2e
python3 scripts/verify_apache.py --archive releases/b-lance-VERSION-HASH.tar.gz
```

Sustituir VERSION-HASH por el nombre real generado. Python 3.12+ y Apache 2.4 son necesarios para la verificación local. En macOS se usa `/usr/sbin/httpd`; en Ubuntu, instalar `apache2`. El verificador utiliza un puerto local temporal, un directorio temporal y un proceso propio sin modificar el Apache del sistema ni requerir permisos de administrador. `--serve --port 4174` permite conservarlo para revisión manual; Ctrl-C lo detiene.

`release` produce un `.tar.gz`, un manifiesto JSON con SHA-256 por archivo y un `.sha256` del archivo comprimido. El identificador combina versión y huella del contenido. Los timestamps de tar pueden cambiar los bytes del comprimido; comprobar su SHA-256 contra su propio manifiesto. El contenido público está directamente en la raíz del comprimido, incluidos `.htaccess` y `404.html`. No contiene mapas de código fuente, fuentes TSX, dependencias ni documentación interna.

GitHub Actions ejecuta instalación congelada, lint, pruebas, build, paquete, verificación Apache y pruebas de navegador. Solo después de los checks publica el artefacto `hostgator-release` en Actions; **no lo despliega**. La ejecución remota requiere que los cambios estén en GitHub.

## Publicación cuando se autorice

1. Confirmar el dominio/subdominio y su document root en cPanel. Usar un destino dedicado y habilitar el certificado SSL/AutoSSL y Force HTTPS Redirect en cPanel. No se añade redirección genérica en `.htaccess` para evitar bucles con proxies.
2. Descargar un respaldo completo de la versión actual, incluido `.htaccess`, fuera del directorio público. Registrar fecha, destino y hash de la versión anterior.
3. Subir y extraer el paquete en una carpeta temporal **fuera** del document root. Verificar SHA-256 antes de extraer. En cPanel, activar «Mostrar archivos ocultos».
4. Copiar primero los recursos nuevos con hash, luego imágenes, fuentes/licencias, favicon, manifiesto y `404.html`. Conservar los assets de la versión anterior durante el período de rollback. Actualizar `.htaccess` y finalmente `index.html`; si existe acceso SSH, usar un renombrado dentro del mismo filesystem para reemplazar cada archivo de forma atómica. Sin SSH, usar las operaciones de cPanel y realizar la publicación en una ventana controlada.
5. No dejar el `.tar.gz`, manifiestos de release ni respaldos en una carpeta pública. Guardarlos fuera del document root para recuperación.
6. Ejecutar las comprobaciones siguientes antes de dar la publicación por terminada. Si fallan, restaurar la versión anterior.

## Comprobaciones del dominio

Sustituir DOMINIO y ASSET-CON-HASH por valores reales:

```sh
curl -I http://DOMINIO/
curl -I https://DOMINIO/
curl -I https://DOMINIO/assets/ASSET-CON-HASH.js
curl -I https://DOMINIO/ruta-inexistente
curl -I https://DOMINIO/.htaccess
```

Esperado: redirección HTTP → HTTPS con certificado válido; inicio 200; recurso 200 con `Cache-Control: public, max-age=31536000, immutable`; HTML con `Cache-Control: no-cache`; ruta inexistente 404 con la página personalizada; `.htaccess` 403. Verificar también cabeceras en el 404.

Revisar `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` y `Content-Security-Policy`. La CSP impide scripts remotos, inline scripts, conexiones API y enmarcado; permite estilos inline porque Motion, gráficos y 404 los necesitan. No habilitar HSTS hasta comprobar HTTPS de forma estable en el dominio real; no aplicar includeSubDomains sin verificar todos los subdominios.

Comprobar en navegador inicio, menú, check-in, ayuda (sin efectuar llamadas de prueba), respiración, instituciones y 404. Revisar consola, red y caché después de recargar. Los botones telefónicos son enlaces del sistema, no un servicio de llamadas del sitio.

La configuración depende de que el proveedor permita `.htaccess`, `mod_headers`, `mod_dir` y autorización Apache. El ensayo local no demuestra que la cuenta HostGator los tenga activos. Si cPanel/CDN agrega cabeceras, comprobar que no duplique o contradiga la caché o la CSP.

## Restauración

Restaurar desde el respaldo las páginas, recursos sin hash y `.htaccess` de la versión anterior, reemplazando `index.html` al final. Sus assets deben seguir disponibles; si no, restaurarlos antes. Repetir las comprobaciones HTTP y de navegador. Registrar versión restaurada y motivo. Conservar ambas versiones fuera del directorio público; retirar assets obsoletos solo cuando termine el período de recuperación acordado.

## Referencias

- [Apache mod_headers](https://httpd.apache.org/docs/2.4/mod/mod_headers.html)
- [OWASP Content Security Policy](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
