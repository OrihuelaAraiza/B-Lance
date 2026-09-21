# Recurso visual externo

`public/images/soft-coast.webp` se utiliza solo como fondo decorativo en la sección sensorial existente. La fotografía se sirve localmente y se integra mediante una superposición del color tinta original (`#252238`).

- Fuente: https://images.unsplash.com/photo-1475924156734-496f6cac6ec1
- Licencia: https://unsplash.com/license

DM Sans, Fraunces y Lucide son las dependencias visuales que ya utilizaba el proyecto original. Sus licencias se incluyen en `public/licenses/`.

## Audio ambiental

Los seis archivos en `public/audio/` son ambientes sintéticos originales para B Lance, sin grabaciones ni muestras externas. Las opciones de naturaleza son interpretaciones sonoras generadas, no grabaciones de campo.

| Archivo | Ambiente | Tipo |
| --- | --- | --- |
| `ambiente-suave.mp3` | Notas cálidas sostenidas | Música |
| `lluvia.mp3` | Lluvia ligera | Naturaleza |
| `oleaje.mp3` | Oleaje tranquilo | Naturaleza |
| `brisa.mp3` | Brisa entre hojas | Naturaleza |
| `ruido-marron.mp3` | Ruido grave uniforme | Textura |
| `campanas.mp3` | Campanas suaves espaciadas | Música |

Cada pista dura 40 segundos y se repite al activar «Sonido». El selector junto al botón permite cambiar de ambiente: si ya está sonando, sustituye la pista; si está desactivado, conserva el silencio. Solo existe un reproductor y únicamente se descarga la pista que se reproduce. El sonido se detiene al desactivarlo, ocultar la pestaña o salir de la página; al volver, se activa manualmente. La selección no se guarda entre visitas.

Se puede regenerar con `python3 scripts/generate-ambience.py` (requiere FFmpeg con libmp3lame). El volumen está atenuado en el propio archivo para conservarlo también en navegadores móviles que controlan el volumen desde el dispositivo.
