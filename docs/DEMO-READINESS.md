# Demo institucional: alcance y revisión pendiente

Actualizado con el feedback del 22 de septiembre de 2026. La demo incorpora el logo oficial, Nabi, Manrope, secciones para jóvenes y profesionales, y Zona segura. La estructura continúa siendo una página con anclas. No incorpora backend, cuentas, base de datos, IA, analítica real ni conexión institucional.

## Qué se puede demostrar

- Elección de temas con respuestas prefijadas. La selección no realiza análisis semántico.
- Check-in breve con consentimiento demostrativo, preguntas de seguridad, intensidad, impacto y red de apoyo.
- Recorrido académico basado en la propuesta Euler/SISCO SV-21: perfil ficticio opcional, reflexión ficticia opcional, seguridad explícita, aceptación, filtro, intensidad y 21 reactivos. Pausa, retroceso, omisión y salida.
- Promedios descriptivos separados solo cuando existen 21 respuestas válidas. No se genera clasificación clínica.
- Ayuda durante los recorridos; 911 y Línea de la Vida visibles también en Zona segura.
- Enlace a WhatsApp de B-lance con saludo genérico. No envía mensajes automáticamente ni adjunta respuestas.
- Pausa guiada de 50 segundos; audio opcional con seis ambientes locales.
- Gráficos institucionales ficticios por esfera/semana, independientes de las respuestas del usuario y entre sí.

## Reglas clínicas pendientes

El antiguo corte de 7 y las ponderaciones del check-in se retiraron. La intensidad y el impacto ya no generan una derivación clínica. Peligro actual o pensamientos actuales de autolesión muestran ayuda urgente; preocupaciones pasadas por seguridad o falta de apoyo ofrecen recursos humanos; el resto recibe opciones generales sin clasificación de riesgo.

`clinical_referral_rule` y `yellow_cutoffs` están expresamente en `null` en `src/lib/clinicalProtocol.ts`. El triage clínico está deshabilitado. No se asigna verde por defecto al faltar una regla amarilla. El documento recibido no define fórmula de puntuación global: la demo solo calcula medias descriptivas de las tres dimensiones por separado y conserva la intensidad por separado.

Antes de uso clínico se requiere revisar instrumento/redacción, cálculo, reglas de referencia, seguridad, adecuación por edad, consentimiento/asentimiento y operación humana, con responsables y versiones documentadas. El texto libre no se analiza automáticamente y se advierte antes de escribirlo. No hay bot de WhatsApp conectado ni motor de seguridad semántico.

## Datos y prueba

Usar escenarios ficticios. La casilla expresa comprensión de una demo, no un registro legal de consentimiento. Las respuestas permanecen en memoria mientras el diálogo está abierto; cerrar las elimina. No se guardan ni envían al abrir WhatsApp. Los recursos de crisis son de México; fuera del país se indica usar el servicio local.

Guion: probar un check-in breve; entrar a «La escuela me pesa»; omitir datos, aceptar el cuestionario, responder las 21 preguntas y ver un resumen sin clasificación. Repetir con filtro negativo u omisión para confirmar que no hay resultados inventados. Probar «Ayuda ahora» sin realizar llamadas ni enviar mensajes durante la demostración.

Ver [FEEDBACK-2026-09-22.md](FEEDBACK-2026-09-22.md) para la correspondencia con los materiales y [VERIFICATION.md](VERIFICATION.md) para pruebas. Chromium y axe no sustituyen dispositivos físicos, lectores de pantalla ni validación clínica. La ausencia de almacenamiento de respuestas no controla registros de acceso del proveedor de hosting.
