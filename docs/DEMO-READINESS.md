# Demo institucional: alcance y revisión pendiente

Esta versión refina la demo existente y conserva la identidad ROMI. No incorpora backend, cuentas, base de datos, IA, analítica ni conexión institucional. Las respuestas viven únicamente en memoria; cerrar el check-in elimina su estado. No hay un registro de consentimiento: la casilla solo confirma que se entendió el carácter demostrativo.

## Qué se puede demostrar

- Elección de temas con respuestas prefijadas; la selección no personaliza el algoritmo del check-in.
- Check-in con cinco preguntas, retroceso, cierre, repetición y rutas deterministas existentes.
- Opciones de ayuda accesibles en cada pregunta y en todos los resultados.
- Pausa de 50 segundos, inhalación de 4 y exhalación de 6, pausa/continuación y detención al ocultar la pestaña. Volver a la pestaña no reinicia la respiración automáticamente.
- Gráficos con cantidades de selecciones ficticias por esfera y por semana, sin significado clínico. Ambas vistas son fixtures independientes; no representan una misma cohorte ni porcentajes.
- Menú móvil con los enlaces existentes y ayuda en el encabezado, sin botones flotantes que cubran contenido.

QR por plantel, adaptación por edad, resúmenes clínicos e indicadores reales son capacidades futuras. La interfaz las identifica como tales. El ejemplo institucional no está conectado al check-in.

## Regla pendiente de revisión clínica antes de un piloto

Caso reproducible: peligro inmediato = false, intensidad = 0, impacto = 0, safety = "sometimes", apoyo = "yes". El puntaje actual es 4 y la ruta resultante es `steady` (el corte de `support` sigue siendo 7). Con peligro inmediato o safety = "now", el resultado sigue siendo siempre `urgent`.

Se conserva deliberadamente el algoritmo en `src/lib/screening.ts`. Las nuevas pruebas describen su comportamiento; **no validan su idoneidad clínica**. Se retiró la frase «Lo que sientes parece manejable» y se ofrece apoyo también en `steady`. Antes de cualquier piloto, el responsable clínico debe revisar las preguntas, el puntaje, la respuesta a antecedentes de autolesión, las rutas y su adecuación por edad; documentar versión, responsable y aprobación.

No usar esta demo como herramienta clínica ni presentar un resultado como evaluación individual. Para demostraciones institucionales, utilizar escenarios ficticios. Antes de datos reales también deben definirse operación humana, permisos, privacidad, retención y atención a menores. Los recursos de ayuda incluidos están orientados a México; no se ha implementado localización por país.

## Guion breve con datos ficticios

1. Inicio: mostrar un tema y explicar que la respuesta es prefijada.
2. Check-in: consentimiento; a salvo; casi nada; poco; no; sí sé con quién. Mostrar salida neutral, apoyo y pausa.
3. Repetir con intensidad e impacto máximos para mostrar acompañamiento.
4. Repetir con peligro inmediato para mostrar la interrupción y enlaces de ayuda, sin realizar llamadas durante la demostración.
5. Instituciones: cambiar entre esferas y tendencia; leer las unidades y la tabla accesible. Explicar qué capacidades siguen pendientes.

## Verificación

- `pnpm run check`: lint, pruebas de componentes/reglas y build.
- `pnpm run test:e2e`: Chromium servido por Apache, cuatro tamaños, teclado, foco, axe, movimiento reducido y comprobación de solicitudes/almacenamiento.
- `pnpm run verify:apache`: configuración real de Apache, caché, cabeceras y códigos HTTP.

Axe y Chromium no sustituyen pruebas con VoiceOver/NVDA, dispositivos físicos ni revisión clínica. Las pruebas de privacidad cubren el código de esta demo; no controlan registros de acceso del proveedor de hosting. No publicar respuestas o identificadores en URLs ni logs.
