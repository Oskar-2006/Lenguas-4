// ============================================================
// LOGICA DE LA INTERFAZ
// ============================================================
// este archivo quedo corto a proposito: es solo el "armado" de la pagina.
// el index.html carga, en este orden y ANTES que este archivo:
//   data.js     los 10 heroes iniciales
//   storage.js  recupera lo guardado en localStorage y arma "listaHeroes"
//   cards.js    crearCarta(), el modal de detalle y el efecto de mouse
// gracias a eso aca solo hace falta recorrer la lista y pedir las cartas.

// ============================================================
// GENERAR UNA CARTA POR CADA HEROE DEL ARRAY
// ============================================================
// se recorre "listaHeroes" (no "heroes") y, por cada heroe, se crea su
// carta con crearCarta() y se agrega al contenedor que existe en el html.
//
// la diferencia entre los dos arrays: "heroes" son los datos iniciales que
// escribimos en data.js, y "listaHeroes" es lo que storage.js recupero de
// localStorage. si nunca se creo ningun heroe son identicos, pero apenas
// se agrega uno desde gestion.html solo "listaHeroes" lo tiene

const contenedorCartas = document.getElementById("contenedor-cartas");

// pinta en el grid una carta por cada objeto del array que recibe. no usa
// "listaHeroes" directo sino el parametro: asi sirve para cualquier lista
// (por ejemplo, el resultado de un filter() de busqueda) sin cambiar nada
function renderizarObjetos(listaObjetos) {
    // se vacia antes de pintar: si no, llamarla dos veces dejaria las
    // cartas viejas y sumaria las nuevas debajo, todas duplicadas
    contenedorCartas.innerHTML = "";

    listaObjetos.forEach(objeto => {
        contenedorCartas.appendChild(crearCarta(objeto));
    });
}

// ============================================================
// FILTRO POR BANDO
// ============================================================
// el filtro no toca el grid: arma una lista nueva con filter() y se la
// pasa a renderizarObjetos(). por eso esa funcion recibe la lista como
// parametro en vez de usar "listaHeroes" directo

const botonesFiltro = document.querySelectorAll(".filtro-boton");
const estadoFiltro = document.getElementById("filtro-estado");

// el texto que se muestra para cada valor de data-bando. los valores
// guardados van sin tilde ("Heroe"), pero en pantalla se ven con tilde
const nombresBando = {
    Todos: "Todos",
    Heroe: "Héroes",
    Villano: "Villanos",
};

function filtrarPorBando(bando) {
    // filter() devuelve un array NUEVO, sin tocar "listaHeroes". con
    // "Todos" no hace falta filtrar: se pinta la lista entera
    const filtrados = bando === "Todos"
        ? listaHeroes
        : listaHeroes.filter(heroe => heroe.bando === bando);

    renderizarObjetos(filtrados);

    estadoFiltro.textContent = `Mostrando: ${nombresBando[bando]} (${filtrados.length})`;

    // renderizarObjetos() ya vacio el grid, asi que si no hay ninguno se
    // ve en blanco. un aviso deja claro que el filtro funciono y no hay datos
    if (filtrados.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "seccion-aviso";
        aviso.textContent = `No hay ${nombresBando[bando].toLowerCase()} en la lista.`;
        contenedorCartas.appendChild(aviso);
    }

    // se marca el boton elegido y se desmarcan los otros. toggle() con un
    // segundo argumento true/false pone o saca la clase segun esa condicion
    botonesFiltro.forEach(boton => {
        const elegido = boton.dataset.bando === bando;
        boton.classList.toggle("filtro-boton--elegido", elegido);
        boton.setAttribute("aria-pressed", String(elegido));
    });
}

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        filtrarPorBando(boton.dataset.bando);
    });
});

// al abrir la pagina se muestran todos, igual que antes, pero ahora
// tambien se escribe el texto de "Mostrando: ..."
filtrarPorBando("Todos");
