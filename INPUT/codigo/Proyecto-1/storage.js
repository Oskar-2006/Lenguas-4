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
//
// OJO: este archivo se carga ANTES del login (ver login.js), asi que
// guardarHeroes() y listaHeroes ya estan disponibles en la consola del
// navegador aunque el login todavia no se haya hecho. eso NO es un bug
// puntual de este archivo: es una limitacion de fondo de tener los datos
// en el navegador. ver LIMITACIONES.md.

// la clave con la que se guarda. lleva el nombre del proyecto adelante
// porque el cajon de localStorage es uno solo para todo el sitio: si otra
// pagina del mismo servidor usara la clave "heroes" a secas, se pisarian
const CLAVE_ALMACEN = "proyecto1-heroes";

// el contador de ids va en su propia clave. no alcanza con calcularlo a
// partir de la lista: si se borra el heroe con el id mas alto, el calculo
// volveria a dar ese mismo id, y un id tiene que ser unico PARA SIEMPRE,
// aunque el heroe que lo tenia ya no exista
const CLAVE_SIGUIENTE_ID = "proyecto1-siguiente-id";

// el id mas alto que hay en la lista, o 0 si la lista esta vacia.
// el 0 inicial de Math.max evita que con una lista vacia devuelva -Infinity
function idMasAlto(lista) {
    return Math.max(0, ...lista.map(heroe => heroe.id || 0));
}

// los heroes guardados ANTES de que existiera la propiedad "id" no la
// tienen. se les asigna una siguiendo la cuenta desde el id mas alto.
// devuelve true si tuvo que completar alguno
function asignarIdsFaltantes(lista) {
    let proximo = idMasAlto(lista) + 1;
    let completados = false;

    lista.forEach(heroe => {
        // "id" in heroe pregunta si la propiedad EXISTE, este en 0 o no
        if (!("id" in heroe)) {
            heroe.id = proximo;
            proximo++;
            completados = true;
        }
    });

    return completados;
}

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
        const lista = JSON.parse(guardados);

        // si hubo que completar ids se guarda enseguida, para que el
        // mismo heroe no reciba un id distinto en la proxima recarga
        if (asignarIdsFaltantes(lista)) {
            guardarHeroes(lista);
        }

        return lista;
    } catch (error) {
        console.warn("Los datos guardados estaban dañados, se usan los de data.js.", error);
        return [...heroes];
    }
}

// guarda el array completo. se llama despues de CADA cambio (crear, editar
// o eliminar un heroe), porque localStorage no se entera solo de que el
// array cambio: hay que avisarle.
//
// devuelve true si se guardo y false si no entro. localStorage tiene un
// limite de espacio (alrededor de 5 MB por sitio) y cuando se llena
// setItem lanza un error. las imagenes subidas se guardan como texto en este
// mismo almacen, asi que es el limite que mas cerca queda
function guardarHeroes(lista) {
    try {
        localStorage.setItem(CLAVE_ALMACEN, JSON.stringify(lista));
        return true;
    } catch (error) {
        console.warn("No se pudo guardar en localStorage (¿está lleno?).", error);
        return false;
    }
}

// borra lo guardado para volver a los 10 heroes de data.js. hace falta
// porque, una vez que hay algo en localStorage, editar data.js a mano ya
// no se ve reflejado: cargarHeroes() encuentra la clave y usa esa
function restablecerHeroes() {
    localStorage.removeItem(CLAVE_ALMACEN);
    localStorage.removeItem(CLAVE_SIGUIENTE_ID);
}

// devuelve el id que le toca al proximo heroe creado. localStorage guarda
// texto, por eso Number() para volver a tenerlo como numero.
// Math.max con idMasAlto + 1 es un seguro: si el contador guardado se
// perdio o quedo atrasado, nunca se entrega un id que ya este en uso
function cargarSiguienteId(lista) {
    const guardado = Number(localStorage.getItem(CLAVE_SIGUIENTE_ID)) || 0;
    return Math.max(guardado, idMasAlto(lista) + 1);
}

function guardarSiguienteId(valor) {
    try {
        localStorage.setItem(CLAVE_SIGUIENTE_ID, String(valor));
    } catch (error) {
        console.warn("No se pudo guardar el siguiente id.", error);
    }
}

// el array con el que trabajan las dos paginas. se carga una sola vez, al
// abrir la pagina, y a partir de ahi se modifica en memoria y se vuelve a
// guardar con guardarHeroes()
const listaHeroes = cargarHeroes();
