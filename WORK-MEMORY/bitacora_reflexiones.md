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
