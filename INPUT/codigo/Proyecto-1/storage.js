// ============================================================
// PERSISTENCIA DE LOS HEROES (localStorage)
// ============================================================
// el problema que resuelve este archivo: los cambios que hace el JS viven
// en la memoria de la pagina y se pierden al recargar o al cambiar de
// index.html a gestion.html, porque cada HTML arranca un contexto de
// JavaScript nuevo. y data.js no se puede reescribir: el navegador no
// tiene permiso para escribir archivos del disco.
//
// localStorage es un cajoncito que el navegador le da a cada sitio y que
// SI sobrevive a recargas y a cambios de pagina. las dos paginas comparten
// el mismo cajon porque son del mismo origen (mismo dominio y puerto).
//
// ojo: localStorage solo guarda TEXTO. un array de objetos no entra tal
// cual, hay que convertirlo con JSON.stringify para guardarlo y con
// JSON.parse para volver a armarlo al leerlo.
//
// este archivo se carga DESPUES de data.js (necesita la constante "heroes"
// como valor inicial) y ANTES de index.js y gestion.js, que son los que
// usan "listaHeroes".

// la clave con la que se guarda. lleva el nombre del proyecto adelante
// porque el cajon de localStorage es uno solo para todo el sitio: si otra
// pagina del mismo servidor usara la clave "heroes" a secas, se pisarian
const CLAVE_ALMACEN = "proyecto1-heroes";

// devuelve el array con el que hay que trabajar: lo guardado si ya existe,
// o los datos iniciales de data.js si es la primera vez
function cargarHeroes() {
    const guardados = localStorage.getItem(CLAVE_ALMACEN);

    // getItem devuelve null cuando la clave nunca se escribio: es el caso
    // de la primera visita, todavia no hay nada que recuperar
    if (guardados === null) {
        // [...heroes] hace una copia del array de data.js en vez de
        // devolver el mismo. asi, al hacer push sobre la copia, el array
        // original queda intacto y siempre se puede volver a el
        return [...heroes];
    }

    // el try/catch es por si el texto guardado quedo corrupto (por ejemplo
    // si alguien lo edito a mano desde las DevTools): JSON.parse lanza un
    // error y la pagina entera dejaria de funcionar. mejor volver a los
    // datos iniciales que quedar con la pantalla en blanco
    try {
        return JSON.parse(guardados);
    } catch (error) {
        console.warn("Los datos guardados estaban dañados, se usan los de data.js.", error);
        return [...heroes];
    }
}

// guarda el array completo. se llama despues de CADA cambio (crear, editar
// o eliminar un heroe), porque localStorage no se entera solo de que el
// array cambio: hay que avisarle
function guardarHeroes(lista) {
    localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lista));
}

// borra lo guardado para volver a los 10 heroes de data.js. hace falta
// porque, una vez que hay algo en localStorage, editar data.js a mano ya
// no se ve reflejado: cargarHeroes() encuentra la clave y usa esa
function restablecerHeroes() {
    localStorage.removeItem(CLAVE_ALMACEN);
}

// el array con el que trabajan las dos paginas. se carga una sola vez, al
// abrir la pagina, y a partir de ahi se modifica en memoria y se vuelve a
// guardar con guardarHeroes()
const listaHeroes = cargarHeroes();
