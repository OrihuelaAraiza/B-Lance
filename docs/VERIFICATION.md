# Verificación local — demo 0.2.0

Fecha: 18 de septiembre de 2026.

## Resultado

| Comprobación | Evidencia |
| --- | --- |
| Instalación reproducible | `pnpm install --frozen-lockfile` correcto con pnpm 11.19.0 |
| Calidad y paquete | `pnpm run release`: lint, 17 pruebas y build correctos |
| Reglas | 8 pruebas, incluidos límites 6/7, caso `sometimes` y 300 combinaciones que deben ser urgentes |
| Check-in | 7 pruebas de componente: consentimiento, foco, retroceso, ayuda, cierre/reapertura y tres rutas |
| Respiración | 2 pruebas de componente: reloj compartido, fracciones de segundo, pausa, cambio de visibilidad, fin a 50 s y reinicio |
| Navegador | 20 escenarios correctos en Chromium a 320, 390, 768 y 1440 px |
| Ajuste visual final | Tras ampliar el espacio del encabezado a 320 px, se repitieron los 4 escenarios de diseño/teclado: correctos |
| Accesibilidad automatizada | Axe sin infracciones de las reglas WCAG A/AA seleccionadas en página, check-in, ayuda y respiración |
| Privacidad del recorrido | Sin solicitudes después de la carga inicial, sin cookies, sin local/sessionStorage ni escrituras detectadas a IndexedDB durante los flujos probados |
| Apache real | Apache 2.4.67: inicio 200, recursos correctos, 404 real, caché, cabeceras, `.htaccess` protegido y ausencia de sourcemaps |
| Integridad del paquete | SHA-256 del comprimido y checksums de los 16 archivos verificados; ensayo Apache del paquete extraído correcto |
| Revisión del diff | `git diff --check` correcto; sin cambios en `src/lib/screening.ts` |

El estado de Git se pudo consultar mediante `/Library/Developer/CommandLineTools/usr/bin/git`, sin aceptar ni modificar la licencia de Xcode.

## Artefacto final

`releases/b-lance-0.2.0-46ae53fa901e.tar.gz`

SHA-256: `770bfa37ff984eb6d00411dd42224b9f060cbce3ae4e6a5d705c2ca8c6e0d114`

El manifiesto `.json` y el archivo `.sha256` están en el mismo directorio. Estos artefactos generados están excluidos de Git. Las instrucciones de publicación y recuperación están en [HOSTGATOR.md](HOSTGATOR.md).

## Límites

No se ha desplegado, hecho push ni ejecutado el workflow remoto de GitHub Actions. HTTPS y configuración de la cuenta HostGator siguen pendientes de comprobación en el dominio real. No se ejecutaron pruebas en dispositivos físicos, Safari, Firefox o lectores de pantalla reales. Axe no demuestra conformidad completa con WCAG. Los resultados son evidencia técnica de una demo; no son una validación clínica ni autorización para procesar datos reales. Ver [DEMO-READINESS.md](DEMO-READINESS.md).
