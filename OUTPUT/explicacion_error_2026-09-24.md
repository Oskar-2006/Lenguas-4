# Explicación de error — 2026-09-24

## Código pegado en la consola (gestion.html)

```js
for (let i = 0; i < heroes.length; i++) {
    listaHeroes.push({
        herores.pop()
    });
}

guardarHeroes(listaHeroes);
guardarSiguienteId(110);
mostrar lista
```

Hay **tres errores distintos** mezclados en el mismo bloque. Van en el orden en que el navegador los encontraría.

---

## 1. `mostrar lista` → SyntaxError

**Tipo de error:** de sintaxis — el navegador ni siquiera llega a ejecutar el código, porque no puede terminar de "leerlo" como JavaScript válido.

`mostrar lista` son dos palabras sueltas, una al lado de la otra, sin nada que las conecte. En JavaScript eso no es una instrucción: no es una llamada a función (`mostrar(lista)`, con paréntesis), no es una asignación (`mostrar = lista`), no es nada que el lenguaje reconozca. Por eso rompe el archivo entero, incluso las líneas de arriba que sí estaban bien.

**Corrección, si la intención era mostrar la tabla actualizada:**
```js
mostrarSeccion("mostrar");
```
(usando el nombre real de la función que ya existe en `gestion.js`, con paréntesis para llamarla).

---

## 2. `herores.pop()` → ReferenceError

**Tipo de error:** de referencia — se usa un nombre que el motor de JavaScript nunca vio declarado en ningún lado.

`heroes` (el array de `data.js`) está bien escrito en la condición del `for` (`i < heroes.length`), pero adentro del `push` está escrito `herores`, con las letras cambiadas. Para JavaScript esos son dos nombres completamente distintos — no le importa que "se parezcan" a simple vista, solo compara letra por letra. Como `herores` nunca se declaró, tira `ReferenceError: herores is not defined`.

Esto es el mismo patrón que ya venías teniendo con `mouseXPos` y `circleSize` en p5.js (ver `WORK-MEMORY/notas.md`): una variable usada con un nombre que no coincide exacto con el declarado.

**Corrección:** escribir `heroes`, tal cual está declarado en `data.js`.

---

## 3. `{ herores.pop() }` → mal uso de objeto literal + `.pop()` innecesario

**Tipo de error:** de sintaxis/lógica, aunque quedaría tapado por el ReferenceError de arriba.

`listaHeroes.push({ ... })` espera que adentro de las llaves `{ }` haya **pares `clave: valor`** — así se arma un objeto, como hiciste antes con `{ id: 100, nombre: "Flash Clon", ... }`. Poner una instrucción suelta ahí adentro (`herores.pop()`) no arma ningún objeto: es una llave vacía de contenido válido.

Además, aunque el nombre estuviera bien escrito, `.pop()` **saca y borra** el último elemento del array original (`heroes`), y lo devuelve. Usarlo dentro de un `for` que compara contra `heroes.length` es doblemente riesgoso: cada vuelta el array se achica, así que la condición del ciclo cambia mientras el ciclo corre.

**Si la idea era copiar los héroes originales a `listaHeroes`** (sin romper `heroes`), la forma simple es:

```js
listaHeroes.push(...heroes);
guardarHeroes(listaHeroes);
```

El `...` (spread) copia cada elemento de `heroes` como un argumento separado de `push`, sin sacar nada del array original. Es la misma técnica que ya usa `storage.js` en `return [...heroes];`.

---

## Conclusión para el estudiante

El error que aparece primero en la consola (`SyntaxError`) tapa a los otros dos — hay que resolver de arriba hacia abajo. El patrón a repasar es el de siempre: **el nombre de una variable tiene que copiarse exacto**, letra por letra, no "a ojo".

---

## Adenda: segundo intento (borrar héroes de la lista)

```js
for (let i = 0; i < heroes.length; i++) {
    listaHeroes.push
        herores.pop()};
```

- `listaHeroes.push` sin `()` solo nombra la función, no la ejecuta.
- `herores` — otra vez el mismo typo (`heroes` mal escrito). Van 4 veces con este patrón en el registro.
- `.pop()` saca un elemento a la vez, no sirve para vaciar toda la lista.

**Para vaciar toda la lista de un saque:**
```js
listaHeroes.length = 0;
guardarHeroes(listaHeroes);
```
