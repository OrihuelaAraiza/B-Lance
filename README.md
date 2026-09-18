# B Lance by ROMI

Maqueta web funcional para una experiencia de contención emocional y orientación dirigida a jóvenes de 10 a 29 años en Iberoamérica.

## Qué incluye

- Landing responsive con una evolución editorial de la identidad visual de ROMI.
- Check-in interactivo de aproximadamente dos minutos.
- Rutas deterministas de autorregulación, acompañamiento y ayuda inmediata.
- Pausa sensorial guiada de 50 segundos.
- Acceso persistente a 911 y Línea de la Vida en México.
- Vista conceptual de ROMI Real Time con datos ilustrativos y agregados.
- Sonidos de interacción opcionales y desactivados de forma predeterminada.
- Página 404 personalizada, favicon y manifiesto del sitio.
- Respeto a `prefers-reduced-motion` y navegación por teclado.

## Límite clínico del prototipo

Esta maqueta no realiza un diagnóstico, no sustituye la atención profesional y no debe usarse como un sistema clínico en producción. El flujo de riesgo es demostrativo y debe pasar por validación clínica, regulatoria, de seguridad y de factores humanos antes de procesar datos reales.

La demo funciona completamente en el navegador y no envía ni almacena respuestas.

## Desarrollo

```bash
pnpm install
pnpm dev
```

Validaciones:

```bash
pnpm run lint
pnpm run test
pnpm run build
```

## Publicación en HostGator

El proyecto genera un sitio estático. Después de `pnpm run build`, se debe copiar el contenido de `dist/` al directorio público del dominio configurado en HostGator. El archivo `.htaccess` se incluye automáticamente en el build.

## Demo institucional 0.2

Se conserva la identidad visual y el algoritmo demostrativo. El menú móvil, la ayuda en cada pregunta, el foco del check-in y la pausa sincronizada refuerzan el recorrido. Los gráficos son cantidades ficticias, no porcentajes ni datos recibidos de usuarios.

- Alcance, guion y revisión clínica pendiente: [docs/DEMO-READINESS.md](docs/DEMO-READINESS.md).
- Paquete versionado, verificación Apache, publicación y restauración: [docs/HOSTGATOR.md](docs/HOSTGATOR.md).
- Usar las versiones de Node y pnpm fijadas en `.nvmrc` y `package.json`, con `pnpm install --frozen-lockfile`.
- `pnpm run test:e2e` prueba el build con Chromium y Apache; `pnpm run release` genera el paquete en `releases/`. Ningún comando publica en HostGator.

## Publicación en Vercel

El proyecto existente `blance` está conectado a este repositorio y publica los pushes de `main`. `vercel.json` fija Vite, pnpm 11.19.0, salida `dist`, cabeceras y 404 con código HTTP real. Node se selecciona por la rama 24.x en Vercel; `.nvmrc` fija la versión local/CI. La configuración Apache sigue disponible para HostGator.

Las reglas de Vercel equivalen a las de `.htaccess`: no conexiones API, protección contra enmarcado, revalidación HTML y caché de assets con hash. No se añade una reescritura global a `index.html` que convierta las rutas inexistentes en respuestas 200.
