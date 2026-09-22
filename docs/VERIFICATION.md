# Verificación local — feedback del 22 de septiembre de 2026

Validación ejecutada sobre la integración del logo oficial, Nabi, contenido para jóvenes/profesionales, Zona segura, enlace a WhatsApp y recorrido académico. Demo 0.2.0 con feedback de septiembre; cambios locales, sin publicación en esta entrega.

| Comprobación | Evidencia ejecutada |
| --- | --- |
| Calidad | `pnpm run check`: ESLint, TypeScript, 24 pruebas y build Vite correctos. |
| Check-in breve | 8 pruebas de rutas y 7 de componente. Se elimina el corte inventado de 7; preocupaciones pasadas por seguridad siempre ofrecen apoyo humano. |
| Recorrido académico | 7 pruebas de aritmética/validez: medias separadas, respuestas faltantes, valores inválidos y ausencia de clasificación clínica. |
| Respiración | 2 pruebas de componente, más los recorridos de navegador existentes. |
| Navegador final | `pnpm run test:e2e`: **48 escenarios correctos** en Chromium a 320, 390, 768 y 1440 px; ejecución final en 1.6 minutos. |
| Recorrido completo | Consentimiento, omisión, filtro negativo, intensidad, 21 respuestas, retroceso, pausa, resumen, cierre, borrado y recuperación de foco. |
| Contexto ficticio | Comprobación adicional en Chromium a 390 px: edad 11 rechazada, edad 18 válida, selección de sexo/nivel/plantel de demo, reflexión opcional y cierre. |
| WhatsApp | Enlaces al número `525667769449`, saludo genérico y atributos seguros. Apertura comprobada interceptando el destino externo; no se contactó al número ni se enviaron mensajes. |
| Ayuda | Enlaces `tel:911` y `tel:8009112000`, acceso directo desde Zona segura y desde los cuestionarios. No se hicieron llamadas. |
| Privacidad | Durante los recorridos probados no se emiten solicitudes tras la carga, no hay cookies ni almacenamiento local/de sesión, ni escrituras detectadas en IndexedDB. La apertura externa de WhatsApp es independiente. |
| Accesibilidad | Axe sin infracciones de las reglas WCAG A/AA seleccionadas en las secciones y diálogos probados; teclado, foco y movimiento reducido. |
| Audio | Seis ambientes locales: reproducción, bucle, pausa, selección, cancelación de carga y recuperación tras error. |
| Diseño | Inspección visual de portada, pedir apoyo, página completa, zona segura y resumen. Sin desbordamiento horizontal en los cuatro tamaños. |
| Apache | `pnpm run verify:apache`: PASS; inicio 200, 8 assets de build, caché, cabeceras, 404 real, `.htaccess` protegido y ausencia de sourcemaps. |
| Diff | `git diff --check` correcto. |

Se corrigieron durante la verificación el contraste de dos textos pequeños, la carga de una fuente incrustada incompatible con CSP y el ancho intrínseco de una tabla accesible en móvil. Todas las secciones quedan disponibles al navegador y a las herramientas de accesibilidad sin depender de su entrada en pantalla.

Las capturas locales están en `releases/feedback-2026-09-22/` (directorio excluido de Git); el reporte de navegador se genera en `playwright-report/`. El paquete HostGator del 18 de septiembre es anterior a este feedback y no contiene estos cambios. Para generar uno nuevo se mantiene `pnpm run release`.

## Límites

Esta entrega no incluye commit/push, despliegue público ni verificación de recepción/atención por WhatsApp. El enlace web no configura un bot, una cuenta empresarial, un webhook ni un sistema clínico. No se ejecutaron pruebas en dispositivos físicos, Safari, Firefox o lectores de pantalla reales. Axe no demuestra conformidad completa con WCAG. Las reglas `clinical_referral_rule` y `yellow_cutoffs` permanecen sin definir; no hay validación clínica ni operación con datos reales. Ver [FEEDBACK-2026-09-22.md](FEEDBACK-2026-09-22.md) y [DEMO-READINESS.md](DEMO-READINESS.md).
