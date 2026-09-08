# B-Lance: refinamiento visual sobre la identidad original

## Alcance corregido

Se conserva la paleta original (crema, coral, rosa, lila, menta y tinta oscura), el logo, el contenido, las secciones, la navegación y todos los componentes originales. Se retiró la propuesta de dashboard salvia y sus flujos añadidos.

Los cambios de presentación están aislados en `src/visual-refinements.css`. El único cambio en el código de entrada es importar esa hoja de estilos. `App.tsx`, los componentes, el algoritmo de orientación y la hoja de estilos base coinciden con la versión original del repositorio.

## Ajustes visuales

- Jerarquía tipográfica más equilibrada, con títulos menos grandes e interlineado más cómodo.
- Conversación original con opciones más legibles y superficies más ligeras.
- Espaciado consistente, bordes suaves y sombras menos marcadas.
- Tarjetas y gráficos institucionales refinados sin cambiar sus controles o datos.
- Diálogos de check-in, ayuda y respiración con mejor tamaño y distribución en escritorio y móvil.
- Fotografía de costa usada únicamente como fondo decorativo de la sección sensorial, con una superposición del color oscuro original.

## Funcionalidad conservada

Conversación por cinco temas, check-in con consentimiento y cinco preguntas, tres rutas de orientación, pausa original de 50 segundos con sus controles, sonido opcional, ayuda telefónica, navegación a secciones, gráficos institucionales y página 404.

## Verificación

- Lint, cinco pruebas originales y build de producción correctos.
- Comparación con Git: los componentes funcionales y la paleta base no tienen diferencias.
- Comprobación en navegador de selección de tema, check-in, salida urgente y alternancia de gráficos.
- Respiración comprobada en móvil: inicio, finalización a los 50 segundos, repetición y pausa.
- Vista móvil de 390 px sin desbordamiento horizontal y revisión visual de escritorio.
- Axe sin infracciones detectadas en inicio e instituciones, esperando a que termine la animación de entrada.
- Sin errores ni advertencias de consola en la revisión final del navegador.

No se ha publicado una nueva versión fuera del entorno local.
