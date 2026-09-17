# Explicación de error — 2026-09-17

**Error:** `Uncaught TypeError: input.value.trim(...).tolowerCase is not a function`
**Archivo:** `INPUT/codigo/Css1/Arrays/ar1/arr2.html`, líneas 21 y 24.

## Tipo de error
`TypeError`: se intentó llamar algo como función, pero no existe con ese nombre exacto en el objeto.

## Causa puntual
El código llamaba `.tolowerCase()`, pero el método real de los strings en JS es `.toLowerCase()`
(con "L" mayúscula). JS distingue mayúsculas de minúsculas en los nombres de métodos —
`tolowerCase` y `toLowerCase` son dos identificadores distintos para el motor, aunque a simple
vista se vean casi iguales.

## Corrección
```js
input.value.trim().toLowerCase()
```

## Concepto para repasar
Antes de asumir que "el método no existe", revisar letra por letra el nombre contra la
documentación (MDN) — sobre todo mayúsculas en medio de la palabra (`camelCase`), que son fáciles
de perder al escribir rápido.
