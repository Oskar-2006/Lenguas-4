# Explicación de error — 2026-09-18

## Síntoma

El héroe creado desde el formulario de `gestion.html` no aparece en las cartas de `index.html`.
Tampoco sobrevive a una recarga de la propia `gestion.html`.

## Tipo de error

**Error de lógica / de modelo mental** — no hay mensaje en consola, el código hace exactamente lo
que se le pidió. Lo que falla es la expectativa: se esperaba que un cambio en memoria quedara
guardado en el archivo.

## Qué significa este tipo de error en general

Un error de lógica es el que no rompe nada: el programa corre sin quejarse, pero el resultado no
es el que el programador esperaba. Son los más difíciles de detectar porque no hay una línea roja
que señalar — hay que revisar el razonamiento, no la sintaxis.

## La causa exacta

Tres hechos que juntos explican todo:

1. **`data.js` es un archivo estático en el disco.** El navegador puede *leerlo*, pero no puede
   escribirlo. Ninguna página web puede modificar archivos de tu computadora: sería un agujero de
   seguridad enorme.

2. **`heroes.push()` modifica el array en memoria RAM, no el archivo.** La línea
   `heroes.push(heroeNuevo)` de `gestion.js` funciona correctamente — el array pasa de 10 a 11
   elementos. Pero esa memoria vive solo mientras la pestaña esté abierta con esa página cargada.

3. **Cada página HTML arranca un contexto de JavaScript nuevo y vacío.** Al navegar de
   `gestion.html` a `index.html`, el navegador tira toda la memoria de la primera y vuelve a
   ejecutar `data.js` desde cero, leyéndolo del disco. Y en el disco siguen estando los 10 héroes
   originales.

Dicho corto: `gestion.html` e `index.html` no comparten memoria. Comparten el *archivo* `data.js`,
que es el estado inicial de las dos — pero cada una trabaja sobre su propia copia.

```
disco:        data.js (10 héroes)  ← nunca cambia
                 │
                 ├──> gestion.html  →  heroes = [10] → push() → [11]  ✗ se pierde al salir
                 └──> index.html    →  heroes = [10]                  ← lee el disco de nuevo
```

## El concepto detrás

Se llama **persistencia**: la diferencia entre un dato que vive en memoria (volátil, muere al
cerrar) y uno guardado en un medio que sobrevive (disco, base de datos, servidor).

Todo programa que "recuerda" cosas entre sesiones tiene alguna forma de persistencia. En el
navegador las opciones son `localStorage`, `sessionStorage`, IndexedDB o mandar el dato a un
servidor. Sin ninguna de esas, todo lo que hace el JS se evapora al recargar.

## Formas de resolverlo

| Opción | Qué hace | Cuándo conviene |
|---|---|---|
| Copiar el objeto a mano a `data.js` | Se lee el héroe nuevo desde la consola y se pega en el archivo | Si el taller pedía solo el formulario y el `push()` |
| `localStorage` | El navegador guarda el array como texto; `data.js` pasa a ser solo el estado inicial | Si se quiere que funcione de verdad entre páginas y recargas |
| Servidor con backend | El dato se guarda fuera del navegador | Fuera del alcance de este taller |

## Corrección sugerida

No hay una línea que corregir: el código es correcto. Lo que falta es **agregar una capa de
persistencia**. Con `localStorage` el esquema sería:

```js
// al arrancar: si hay algo guardado se usa eso, si no, los datos iniciales de data.js
const guardados = localStorage.getItem("heroes");
const listaHeroes = guardados ? JSON.parse(guardados) : heroes;

// despues de cada cambio: se vuelve a guardar
localStorage.setItem("heroes", JSON.stringify(listaHeroes));
```

El detalle clave es `JSON.stringify` / `JSON.parse`: `localStorage` solo guarda **texto**, así que
el array hay que convertirlo a texto para guardarlo y volver a convertirlo en objeto para leerlo.
