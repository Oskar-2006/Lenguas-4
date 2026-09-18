# Bitácora de reflexiones — Agente de Talleres

Una entrada breve por sesión de clase: qué se aprendió o qué costó más, escrita al cierre de cada
sesión. **No es la bitácora del curso** (esa la lleva el profesor, en `bitacora_sesiones_curso.csv`,
fuera de esta carpeta) — esta es la reflexión personal del estudiante sobre su propio proceso.

## 2026-08-20

Hoy entendí la diferencia entre declarar una variable con `let` y usarla sin declararla — el
`ReferenceError` dejó de sentirse aleatorio en cuanto vi que siempre es la misma causa: un nombre
que nunca definí.

## 2026-08-22

Me costó organizar las referencias visuales por tema en vez de por sitio de origen. Al principio
quería agruparlas por dónde las encontré, pero agruparlas por lo que inspiran (color, tipografía,
layout) tiene más sentido para el proyecto.

## 2026-09-03

Primera clase de interacción con CSS/JS en el navegador. Trabajé sobre un grid básico
(`INPUT/codigo/Css1/Index.html`) agregando botones e ítems clicables con `addEventListener`.
Lo más difícil fue entender `addEventListener`: cómo un elemento del DOM "escucha" un evento
de clic y dispara una función en respuesta, en vez de que el código simplemente se ejecute de
arriba a abajo. También aprendí que cualquier elemento (no solo `<button>`) puede escuchar
clics, y que un `classList.toggle()` no hace nada visible si la clase CSS no está definida.

## 2026-09-10

Dificultad media, pero en general bien. Seguí trabajando sobre `Index.html` (más grids, dark
mode extendido a varios contenedores) y armé una landing page nueva (`3.html`) con secciones
que se muestran u ocultan según el tamaño de pantalla. También tocó resolver un conflicto de
merge en Git porque había trabajado el mismo archivo en dos sesiones distintas — combinar
ambas versiones sin perder ninguna.

## 2026-09-15

Sesión de repaso, sin contenido nuevo de clase: seguí trabajando sobre el ejercicio de cartas
de superhéroes (`INPUT/codigo/Css1/objetos-1/`) reforzando lo ya visto — variables CSS, cómo un
estilo inline le gana a una regla de la hoja de estilos, y cómo se arma el HTML de una carta
desde un objeto en JS.

## 2026-09-17

Trabajé sobre el ejercicio de arrays (`INPUT/codigo/Css1/Arrays/ar1/arr2.html`): agregué botones
para mostrar la lista y buscar un elemento, y corregí errores de código (un typo en un nombre de
método y un `pop()` que debía ser `shift()`). Aprendí que `indexOf()` es importante de cara al
examen que viene, y reforcé cómo se declaran y usan funciones en JS.

## 2026-09-18

Hoy se aprendió a crear un gestor de arrays para una página HTML. Fue algo enredado, pero nada
que pensar detenidamente no solucione.

Arranqué `INPUT/codigo/Proyecto-1/` separando los datos (`data.js`) de la lógica (`index.js`), y
terminé con un CRUD completo en `gestion.html`: crear, leer/buscar, actualizar y eliminar héroes.
También agregué al ejercicio de arrays de clase los botones de eliminar y cambiar elemento.

Lo que más costó entender fue por qué un héroe creado desde `gestion.html` no aparecía en
`index.html`: el `push()` estaba bien, pero los cambios vivían solo en memoria. Un archivo `.js`
no se puede reescribir desde el navegador, y cada página HTML arranca un contexto de JavaScript
nuevo. Se resolvió con `localStorage` (`storage.js`), guardando el array como texto con
`JSON.stringify` y reconstruyéndolo con `JSON.parse`.
