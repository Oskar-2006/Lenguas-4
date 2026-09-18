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

listaHeroes.forEach(heroe => {
    const carta = crearCarta(heroe);
    contenedorCartas.appendChild(carta);
});
