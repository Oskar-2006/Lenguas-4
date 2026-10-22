# Explicación de error — 2026-10-22

**Error:** `Uncaught (in promise) ReferenceError: db is not defined` — `Prueba2.js:20`

## Tipo de error
`ReferenceError`: usaste un nombre (variable/constante) que JavaScript no encuentra en ningún lugar visible desde esa línea.

## Causa
- `Prueba2.js` línea 20 usa `db.from(...)`.
- `supabaseClient.js` declara el cliente como `clienteSupabase`, no como `db`.
- JS compara nombres letra por letra: `db` nunca fue declarado, aunque represente lo mismo.
- Dice "in promise" porque el error ocurre dentro de la función `async` del clic.

## Corrección
```js
const { data, error } = await clienteSupabase.from('productos_practica').select('*');
```
(Alternativa: en `supabaseClient.js` crear `const db = clienteSupabase;`, pero es mejor un solo nombre.)

## Concepto
Los scripts cargados con `<script src>` comparten el ámbito global: lo que declara uno (`clienteSupabase`) lo ve el siguiente, pero solo con el nombre exacto. El orden del HTML ya es correcto (supabaseClient.js antes que prueba2.js).

## Aparte
El archivo es `Prueba2.js` pero el HTML carga `js/prueba2.js`. En Windows funciona; en un servidor Linux daría 404. Conviene unificar a minúscula.
