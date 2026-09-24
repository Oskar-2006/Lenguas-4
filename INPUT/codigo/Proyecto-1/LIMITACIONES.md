# Limitaciones conocidas de Proyecto-1

## El log in NO impide operaciones CRUD desde la consola

**Estado: conocido y aceptado, no se va a "arreglar" porque no tiene arreglo
posible dentro de esta arquitectura (página estática, sin servidor).**

### Qué se comprobó

Con la gestión bloqueada por el login (sin haber iniciado sesión), desde la
consola del navegador (F12 → Console) es posible:

- Leer `usuario` y `contrasena` de `credenciales.js` (están en un archivo
  que se descarga entero al navegador).
- Llamar a `mostrarGestion()` para saltar el login directamente.
- Escribir `sessionStorage.setItem("proyecto1-sesion", "activa")` para
  fingir una sesión válida.
- Llamar a `listaHeroes.push(...)`, `guardarHeroes(listaHeroes)`,
  `listaHeroes.length = 0`, etc. para crear o borrar héroes sin pasar por
  el formulario ni por el login.

### Por qué pasa

`data.js`, `storage.js`, `gestion.js`, `login.js` y `credenciales.js` se
descargan enteros al navegador de quien abre la página. La consola del
navegador ejecuta JavaScript en ese mismo contexto — tiene acceso a las
mismas variables y funciones que el resto del código (`listaHeroes`,
`guardarHeroes`, `usuario`, `contrasena`, etc.). No hay forma de que una
instrucción JavaScript se vuelva "invisible" o "no llamable" solo para la
consola: la consola no es un visitante distinto, es la misma página.

Por eso el login (`login.js`) solo controla qué se **muestra** al navegar
la página de la forma esperada. No controla qué se **puede ejecutar**,
porque todo el código ya está disponible ni bien la página termina de
cargar `storage.js` — antes de que el login pida usuario y contraseña.

### Qué SÍ resuelve, y qué NO

| Resuelve | No resuelve |
|---|---|
| Que alguien que abre `gestion.html` sin saber la contraseña no vea el CRUD navegando normalmente | Que alguien con las herramientas de desarrollador (F12) llame las funciones directamente |
| Practicar el flujo de login/sesión (formulario, `sessionStorage`, mostrar/ocultar contenido) | Proteger datos sensibles de verdad |

### La única forma real de arreglarlo

Mover los datos y la validación a un **servidor**: que `credenciales.js`
deje de existir en el navegador, que la contraseña se compruebe en el
servidor (que el visitante nunca ve), y que crear/editar/borrar un héroe
sea un pedido HTTP que el servidor acepta o rechaza según si hay una
sesión válida — ahí sí, fuera del alcance de la consola de quien visita
la página. Eso es un proyecto de backend aparte, más grande que esta
página estática.
