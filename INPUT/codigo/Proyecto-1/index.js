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
// FILTROS: BANDO + NIVEL DE FUERZA + PODER
// ============================================================
// los filtros no tocan el grid: arman una lista nueva con filter() y se la
// pasan a renderizarObjetos(). por eso esa funcion recibe la lista como
// parametro en vez de usar "listaHeroes" directo.
//
// hay tres filtros y tienen que funcionar JUNTOS: si se elige "Villanos" y
// despues se mueve el slider, no se puede perder el bando elegido. por eso
// el valor de cada filtro se guarda en una variable, y cada vez que cambia
// UNO se vuelve a filtrar con TODOS (ver aplicarFiltros())

const botonesFiltro = document.querySelectorAll(".filtro-boton");
const estadoFiltro = document.getElementById("filtro-estado");
const sliderFuerza = document.getElementById("slider-fuerza");
const valorFuerza = document.getElementById("valor-fuerza");
const filtroPoder = document.getElementById("filtro-poder");
const botonPoder = document.getElementById("boton-poder");
const textoPoder = document.getElementById("texto-poder");
const panelPoder = document.getElementById("panel-poder");
const buscarPoder = document.getElementById("buscar-poder");
const listaPoder = document.getElementById("lista-poder");
const botonReiniciar = document.getElementById("boton-reiniciar");

// estado actual de los filtros. "let" y no "const" porque cambian cada vez
// que se toca un boton, se mueve el slider o se elige un poder
let bandoElegido = "Todos";
let fuerzaMinima = 0;
let poderElegido = "Todos";

// ------------------------------------------------------------
// OPCIONES DEL MENU DE PODERES
// ------------------------------------------------------------
// no se escriben a mano en el html: se sacan de "listaHeroes", asi un
// poder nuevo creado desde gestion.html aparece solo en el menu.

// todos los nombres de poder, sin repetir y ordenados. lo llena
// cargarOpcionesPoder() una sola vez; el buscador filtra sobre este array
let nombresPoder = [];

// posicion (dentro de la lista visible) de la opcion "resaltada" con las
// flechas del teclado. -1 = ninguna
let indiceActivo = -1;

// flatMap() junta los arrays "poderes" de todos los heroes en UN solo array
// de nombres. un Set es una coleccion que no admite repetidos: "Vuelo" lo
// tienen 3 heroes pero queda una sola vez. [...set] lo vuelve a convertir
// en array para poder ordenarlo. localeCompare() ordena alfabeticamente
// respetando tildes ("Curación" va con la C, no al final)
function cargarOpcionesPoder() {
    const nombres = listaHeroes.flatMap(heroe => heroe.poderes.map(poder => poder.nombre));
    nombresPoder = [...new Set(nombres)].sort((a, b) => a.localeCompare(b, "es"));
}

// deja un texto listo para comparar: sin tildes y en minuscula, asi buscar
// "curacion" encuentra "Curación". normalize("NFD") separa cada letra de su
// tilde ("ó" pasa a ser "o" + "´") y el replace() borra esas tildes sueltas
function normalizar(texto) {
    return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// vuelve a dibujar la lista del panel segun lo que haya en el buscador.
// se llama al abrir el panel y en cada tecla que se escribe
function pintarListaPoder() {
    const busqueda = normalizar(buscarPoder.value.trim());

    // includes() = "¿el nombre CONTIENE lo que se escribio?", no solo al
    // principio: "fuerza" encuentra "Superfuerza" y "Fuerza de voluntad".
    // la opcion "Todos" solo se muestra si no se esta buscando nada
    const coincidencias = nombresPoder.filter(nombre => normalizar(nombre).includes(busqueda));
    const visibles = busqueda === "" ? ["Todos", ...coincidencias] : coincidencias;

    listaPoder.innerHTML = "";

    if (visibles.length === 0) {
        const vacio = document.createElement("li");
        vacio.className = "filtro-poder-vacio";
        vacio.textContent = "Sin resultados";
        listaPoder.appendChild(vacio);
    }

    visibles.forEach((valor, i) => {
        const opcion = document.createElement("li");
        opcion.id = `opcion-poder-${i}`;
        opcion.className = "filtro-poder-opcion";
        opcion.setAttribute("role", "option");
        opcion.setAttribute("aria-selected", String(valor === poderElegido));
        // el valor real va en data-valor; el texto puede ser distinto ("Todos"
        // se ve como "Todos los poderes")
        opcion.dataset.valor = valor;
        opcion.textContent = valor === "Todos" ? "Todos los poderes" : valor;
        opcion.addEventListener("click", () => elegirPoder(valor));
        listaPoder.appendChild(opcion);
    });

    // si se esta buscando se resalta la primera coincidencia (Enter la
    // elige directo). si no, se resalta el poder que ya estaba elegido
    indiceActivo = busqueda === "" ? visibles.indexOf(poderElegido) : 0;
    marcarOpcionActiva();
}

// pinta la opcion resaltada y la hace visible si quedo fuera del scroll
function marcarOpcionActiva() {
    const opciones = listaPoder.querySelectorAll('[role="option"]');

    opciones.forEach((opcion, i) => {
        opcion.classList.toggle("filtro-poder-opcion--activa", i === indiceActivo);
    });

    const activa = opciones[indiceActivo];
    if (activa) {
        // el foco sigue en el buscador (para poder seguir escribiendo), asi
        // que aria-activedescendant le avisa al lector de pantalla cual
        // opcion esta resaltada aunque no tenga el foco
        buscarPoder.setAttribute("aria-activedescendant", activa.id);
        // "nearest" = mover el scroll lo minimo para que se vea
        activa.scrollIntoView({ block: "nearest" });
    } else {
        buscarPoder.removeAttribute("aria-activedescendant");
    }
}

function abrirPanelPoder() {
    panelPoder.hidden = false;
    botonPoder.setAttribute("aria-expanded", "true");
    buscarPoder.value = "";
    pintarListaPoder();
    // el foco va directo al buscador: se puede escribir sin hacer otro clic
    buscarPoder.focus();
}

// devolverFoco: al cerrar con Escape o al elegir, el foco vuelve al boton
// (si no, quien usa teclado queda "perdido" en la pagina). al cerrar con un
// clic afuera no, porque el foco ya se fue a donde se hizo clic
function cerrarPanelPoder(devolverFoco) {
    panelPoder.hidden = true;
    botonPoder.setAttribute("aria-expanded", "false");
    if (devolverFoco) {
        botonPoder.focus();
    }
}

function elegirPoder(valor) {
    poderElegido = valor;
    textoPoder.textContent = valor === "Todos" ? "Todos los poderes" : valor;
    cerrarPanelPoder(true);
    aplicarFiltros();
}

// el texto que se muestra para cada valor de data-bando. los valores
// guardados van sin tilde ("Heroe"), pero en pantalla se ven con tilde
const nombresBando = {
    Todos: "Todos",
    Heroe: "Héroes",
    Villano: "Villanos",
};

// filtra "listaHeroes" con los TRES filtros a la vez y pinta el resultado
function aplicarFiltros() {
    // filter() devuelve un array NUEVO, sin tocar "listaHeroes". un heroe
    // pasa solo si cumple las tres condiciones (&&). con "Todos" la
    // condicion de bando o de poder siempre da true, asi que no descarta a nadie.
    // some() pregunta "¿ALGUNO de sus poderes se llama asi?" y devuelve
    // true apenas encuentra uno, sin seguir recorriendo el resto
    const filtrados = listaHeroes.filter(heroe =>
        (bandoElegido === "Todos" || heroe.bando === bandoElegido) &&
        heroe.niveldefuerza >= fuerzaMinima &&
        (poderElegido === "Todos" || heroe.poderes.some(poder => poder.nombre === poderElegido))
    );

    renderizarObjetos(filtrados);

    // el poder solo se nombra si hay uno elegido, para no alargar el texto
    const textoPoder = poderElegido === "Todos" ? "" : ` con el poder "${poderElegido}"`;

    estadoFiltro.textContent =
        `Mostrando: ${nombresBando[bandoElegido]} con fuerza ≥ ${fuerzaMinima}${textoPoder} (${filtrados.length})`;

    // renderizarObjetos() ya vacio el grid, asi que si no hay ninguno se
    // ve en blanco. un aviso deja claro que el filtro funciono y no hay datos
    if (filtrados.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "seccion-aviso";
        aviso.textContent =
            `No hay ${nombresBando[bandoElegido].toLowerCase()} con fuerza ${fuerzaMinima} o más${textoPoder}.`;
        contenedorCartas.appendChild(aviso);
    }

    // se marca el boton elegido y se desmarcan los otros. toggle() con un
    // segundo argumento true/false pone o saca la clase segun esa condicion
    botonesFiltro.forEach(boton => {
        const elegido = boton.dataset.bando === bandoElegido;
        boton.classList.toggle("filtro-boton--elegido", elegido);
        boton.setAttribute("aria-pressed", String(elegido));
    });

    // el boton de reiniciar solo se puede usar si hay AL MENOS un filtro
    // distinto del inicial (||). si los tres estan como al principio queda
    // desactivado. como aplicarFiltros() se llama con CADA cambio, el boton
    // siempre queda al dia sin tener que avisarle desde cada evento
    const hayFiltros = bandoElegido !== "Todos" || fuerzaMinima !== 0 || poderElegido !== "Todos";
    botonReiniciar.disabled = !hayFiltros;
}

// deja los tres filtros como al abrir la pagina. no alcanza con cambiar las
// variables: tambien hay que actualizar lo que se VE (la posicion del
// slider, su numero y el texto del boton de poder), porque esos elementos
// no se enteran solos de que las variables cambiaron
function reiniciarFiltros() {
    bandoElegido = "Todos";
    fuerzaMinima = 0;
    poderElegido = "Todos";

    sliderFuerza.value = 0;
    valorFuerza.textContent = 0;
    textoPoder.textContent = "Todos los poderes";

    if (!panelPoder.hidden) {
        cerrarPanelPoder(false);
    }

    // aplicarFiltros() pinta todas las cartas, marca el boton "Todos" y
    // desactiva el boton de reiniciar
    aplicarFiltros();

    // un boton desactivado no puede tener el foco: el navegador lo mandaria
    // al principio de la pagina y quien usa teclado perderia su lugar. por
    // eso se pasa al slider, que esta en la misma barra
    sliderFuerza.focus();
}

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        bandoElegido = boton.dataset.bando;
        aplicarFiltros();
    });
});

// "input" se dispara en CADA movimiento del boton del slider, mientras se
// arrastra. "change" en cambio solo se dispara al SOLTARLO, por eso aca
// se usa "input": las cartas se actualizan en vivo.
// sliderFuerza.value siempre llega como texto ("75"), aunque el input sea
// numerico: Number() lo convierte para poder compararlo con >=
sliderFuerza.addEventListener("input", () => {
    fuerzaMinima = Number(sliderFuerza.value);
    valorFuerza.textContent = fuerzaMinima;
    aplicarFiltros();
});

// ------------------------------------------------------------
// EVENTOS DEL MENU DE PODERES
// ------------------------------------------------------------

// un clic en el boton abre el panel si esta cerrado, y lo cierra si esta abierto
botonPoder.addEventListener("click", () => {
    if (panelPoder.hidden) {
        abrirPanelPoder();
    } else {
        cerrarPanelPoder(false);
    }
});

// "input" en el buscador = cada letra que se escribe o se borra
buscarPoder.addEventListener("input", pintarListaPoder);

// teclado dentro del buscador: flechas para moverse, Enter para elegir,
// Escape para cerrar, Tab para salir del menu
buscarPoder.addEventListener("keydown", evento => {
    const opciones = listaPoder.querySelectorAll('[role="option"]');

    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
        // preventDefault() evita lo que la tecla hace normalmente (mover el
        // cursor del texto al principio o al final)
        evento.preventDefault();
        if (opciones.length === 0) return;
        const paso = evento.key === "ArrowDown" ? 1 : -1;
        // Math.min/Math.max lo mantienen dentro de la lista: no pasa de la
        // primera ni de la ultima opcion
        indiceActivo = Math.max(0, Math.min(opciones.length - 1, indiceActivo + paso));
        marcarOpcionActiva();
    } else if (evento.key === "Enter") {
        evento.preventDefault();
        const activa = opciones[indiceActivo];
        if (activa) {
            elegirPoder(activa.dataset.valor);
        }
    } else if (evento.key === "Escape") {
        // en un input type="search", Escape normalmente borra el texto;
        // preventDefault() lo evita y en su lugar se cierra el panel
        evento.preventDefault();
        cerrarPanelPoder(true);
    } else if (evento.key === "Tab") {
        cerrarPanelPoder(false);
    }
});

// al hacer clic en una opcion, el navegador primero le quitaria el foco al
// buscador (en el "mousedown", antes del "click"). preventDefault() lo evita:
// el foco se queda en el buscador y el click llega igual a la opcion
listaPoder.addEventListener("mousedown", evento => evento.preventDefault());

// clic en cualquier parte de la pagina FUERA del menu = cerrar el panel.
// contains() dice si el elemento clickeado esta adentro de filtroPoder
document.addEventListener("click", evento => {
    if (!panelPoder.hidden && !filtroPoder.contains(evento.target)) {
        cerrarPanelPoder(false);
    }
});

botonReiniciar.addEventListener("click", reiniciarFiltros);

// al abrir la pagina se cargan los poderes y se muestran todos
// (bando "Todos", fuerza minima 0 y todos los poderes)
cargarOpcionesPoder();
aplicarFiltros();
