# Recurso visual externo

`public/images/soft-coast.webp` se utiliza solo como fondo decorativo en la sección sensorial existente. La fotografía se sirve localmente y se integra mediante una superposición del color tinta original (`#252238`).

- Fuente: https://images.unsplash.com/photo-1475924156734-496f6cac6ec1
- Licencia: https://unsplash.com/license

DM Sans, Fraunces y Lucide son las dependencias visuales que ya utilizaba el proyecto original. Sus licencias se incluyen en `public/licenses/`.

## Audio ambiental

`public/audio/ambiente-suave.mp3` es una composición sintética original para B Lance, sin grabaciones ni muestras externas. Es un ambiente estéreo suave de 40 segundos que se repite al activar «Sonido». Se sirve localmente y solo se descarga al pulsar el botón. Se detiene al desactivarlo, ocultar la pestaña o salir de la página; al volver, se activa manualmente.

Se puede regenerar con `python3 scripts/generate-ambience.py` (requiere FFmpeg con libmp3lame). El volumen está atenuado en el propio archivo para conservarlo también en navegadores móviles que controlan el volumen desde el dispositivo.
