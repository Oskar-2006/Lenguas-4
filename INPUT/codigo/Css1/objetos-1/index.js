// ============================================================
// ARRAY DE HEROES
// ============================================================
// antes teniamos un solo objeto "heroe". ahora tenemos un ARRAY que
// contiene 12 objetos "heroe" (uno por cada elemento). todos los objetos
// tienen las mismas propiedades (nombre, imagen, edad, poderes, etc.)
// para que la misma plantilla de carta sirva para cualquiera de ellos.
//
// "poderes" es un array de objetos { nombre, nivel } donde "nivel" (0-100)
// se usa para dibujar la barrita de fuerza de cada poder.

const heroes = [
    {
        nombre: "Flash",
        imagen: "../IMG objetos-1/bolt.svg",
        edad: 24,
        poderes: [
            { nombre: "Super velocidad", nivel: 90 },
            { nombre: "Viajar en el tiempo", nivel: 45 },
            { nombre: "Super reflejos", nivel: 75 },
            { nombre: "Curación acelerada", nivel: 55 },
            { nombre: "Vibración molecular", nivel: 30 },
            { nombre: "Fuerza de velocidad", nivel: 65 },
        ],
        descripcion: "El Flash es un superhéroe con la capacidad de moverse a velocidades superiores a la luz.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 85,
        activo: true,
    },
    {
        nombre: "Superman",
        imagen: "../IMG objetos-1/superman.svg",
        edad: 35,
        poderes: [
            { nombre: "Vuelo", nivel: 95 },
            { nombre: "Superfuerza", nivel: 98 },
            { nombre: "Visión de calor", nivel: 80 },
            { nombre: "Invulnerabilidad", nivel: 90 },
            { nombre: "Superoído", nivel: 70 },
        ],
        descripcion: "Superman es el último hijo de Krypton, protector de la Tierra gracias a los poderes que le da nuestro sol amarillo.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 99,
        activo: true,
    },
    {
        nombre: "Batman",
        imagen: "../IMG objetos-1/batman.jpg",
        // esta imagen es un .jpg con fondo blanco solido (no transparente
        // como el resto), asi que necesita una clase extra en el CSS
        imagenFondoBlanco: true,
        edad: 40,
        poderes: [
            { nombre: "Estrategia", nivel: 95 },
            { nombre: "Artes marciales", nivel: 90 },
            { nombre: "Detective", nivel: 92 },
            { nombre: "Uso de gadgets", nivel: 85 },
            { nombre: "Riqueza infinita", nivel: 100 },
        ],
        descripcion: "Batman es un vigilante de Ciudad Gótica que combate el crimen sin poderes sobrehumanos, solo entrenamiento y tecnología.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 60,
        activo: true,
    },
    {
        nombre: "Wonder Woman",
        imagen: "../IMG objetos-1/wonderwoman.png",
        edad: 3000,
        poderes: [
            { nombre: "Superfuerza", nivel: 92 },
            { nombre: "Vuelo", nivel: 80 },
            { nombre: "Lazo de la verdad", nivel: 88 },
            { nombre: "Combate cuerpo a cuerpo", nivel: 90 },
            { nombre: "Reflejos amazónicos", nivel: 85 },
        ],
        descripcion: "Wonder Woman es una princesa amazona con fuerza y habilidades de combate sobrehumanas, embajadora de paz entre Themyscira y el mundo.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 93,
        activo: true,
    },
    {
        nombre: "Spider-Man",
        imagen: "../IMG objetos-1/spiderman.svg",
        edad: 18,
        poderes: [
            { nombre: "Sentido arácnido", nivel: 85 },
            { nombre: "Superfuerza", nivel: 70 },
            { nombre: "Agilidad", nivel: 90 },
            { nombre: "Lanzar telarañas", nivel: 80 },
            { nombre: "Adherencia a superficies", nivel: 88 },
        ],
        descripcion: "Spider-Man es Peter Parker, un joven que obtuvo habilidades arácnidas tras ser picado por una araña radiactiva.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 65,
        activo: true,
    },
    {
        nombre: "Iron Man",
        imagen: "../IMG objetos-1/ironman.svg",
        edad: 45,
        poderes: [
            { nombre: "Armadura tecnológica", nivel: 95 },
            { nombre: "Vuelo asistido", nivel: 85 },
            { nombre: "Inteligencia", nivel: 98 },
            { nombre: "Repulsores", nivel: 80 },
            { nombre: "Soporte de IA", nivel: 75 },
        ],
        descripcion: "Iron Man es Tony Stark, un genio inventor que usa una armadura tecnológica para proteger al mundo.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 78,
        activo: true,
    },
    {
        nombre: "Captain America",
        imagen: "../IMG objetos-1/capamerica.svg",
        edad: 105,
        poderes: [
            { nombre: "Superfuerza", nivel: 75 },
            { nombre: "Uso del escudo", nivel: 90 },
            { nombre: "Liderazgo", nivel: 95 },
            { nombre: "Resistencia", nivel: 85 },
            { nombre: "Estrategia militar", nivel: 88 },
        ],
        descripcion: "Captain America es Steve Rogers, un soldado potenciado por el suero del supersoldado que lucha por la justicia.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 72,
        activo: true,
    },
    {
        nombre: "Thor",
        imagen: "../IMG objetos-1/thor.svg",
        edad: 1500,
        poderes: [
            { nombre: "Control del rayo", nivel: 95 },
            { nombre: "Superfuerza", nivel: 96 },
            { nombre: "Vuelo", nivel: 85 },
            { nombre: "Invulnerabilidad", nivel: 80 },
            { nombre: "Manejo del Mjolnir", nivel: 92 },
        ],
        descripcion: "Thor es el dios asgardiano del trueno, capaz de invocar rayos con su martillo Mjolnir.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 97,
        activo: true,
    },
    {
        nombre: "Wolverine",
        imagen: "../IMG objetos-1/wolverine.svg",
        edad: 200,
        poderes: [
            { nombre: "Factor curativo", nivel: 95 },
            { nombre: "Garras de adamantium", nivel: 90 },
            { nombre: "Sentidos animales", nivel: 80 },
            { nombre: "Fuerza", nivel: 65 },
            { nombre: "Resistencia al dolor", nivel: 85 },
        ],
        descripcion: "Wolverine es Logan, un mutante con garras retráctiles y un factor de curación acelerado.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 75,
        activo: true,
    },
    {
        nombre: "Green Lantern",
        imagen: "../IMG objetos-1/greenlantern.svg",
        edad: 32,
        poderes: [
            { nombre: "Anillo de poder", nivel: 95 },
            { nombre: "Constructos de energía", nivel: 90 },
            { nombre: "Vuelo", nivel: 80 },
            { nombre: "Fuerza de voluntad", nivel: 92 },
            { nombre: "Escudo de energía", nivel: 78 },
        ],
        descripcion: "Green Lantern es Hal Jordan, miembro del Green Lantern Corps, capaz de crear cualquier cosa con su anillo de poder.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 80,
        activo: true,
    },
    {
        nombre: "Black Panther",
        imagen: "../IMG objetos-1/blackpanther.svg",
        edad: 32,
        poderes: [
            { nombre: "Traje de vibranio", nivel: 88 },
            { nombre: "Agilidad felina", nivel: 85 },
            { nombre: "Combate cuerpo a cuerpo", nivel: 90 },
            { nombre: "Sentidos mejorados", nivel: 80 },
            { nombre: "Liderazgo", nivel: 82 },
        ],
        descripcion: "Black Panther es T'Challa, rey de Wakanda, protegido por un traje de vibranio y habilidades felinas potenciadas.",
        bando: "Heroe",
        universo: "Marvel Comics",
        niveldefuerza: 76,
        activo: true,
    },
    {
        nombre: "Aquaman",
        imagen: "../IMG objetos-1/aquaman.svg",
        edad: 34,
        poderes: [
            { nombre: "Control de la vida marina", nivel: 90 },
            { nombre: "Superfuerza", nivel: 82 },
            { nombre: "Resistencia bajo el agua", nivel: 95 },
            { nombre: "Natación", nivel: 92 },
            { nombre: "Uso del tridente", nivel: 85 },
        ],
        descripcion: "Aquaman es Arthur Curry, rey de Atlantis, con fuerza sobrehumana y la capacidad de comunicarse con la vida marina.",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 84,
        activo: true,
    },
];

// acceder a propiedades del array: ya no es "heroe.nombre" sino "heroes[i].nombre"
console.log("Cantidad de héroes:", heroes.length);
console.log("Nombre del primer héroe:", heroes[0].nombre);
console.log("Universo del último héroe:", heroes[heroes.length - 1].universo);

// ============================================================
// PLANTILLA REUTILIZABLE DE CARTA
// ============================================================
// antes usabamos document.getElementById() porque solo existia UNA carta
// en el html, con id unicos (#nombre, #edad, etc). ahora vamos a crear 12
// cartas iguales en estructura, y un id no puede repetirse en el mismo
// documento HTML. por eso la plantilla usa solo .clases, y para buscar
// los elementos DENTRO de cada carta usamos card.querySelector(), que
// busca solo adentro de esa carta puntual y no en todo el documento.

function crearCarta(heroe) {
    // se crea el div contenedor de la carta
    const card = document.createElement("div");
    card.className = "card";

    // se arma todo el contenido de la carta a partir de las propiedades del heroe
    card.innerHTML = `
        <div class="seccion-imagen">
            <img class="imagen ${heroe.imagenFondoBlanco ? "imagen--fondo-blanco" : ""}" alt="Logo de ${heroe.nombre}" src="${heroe.imagen}">
            <p class="descripcion">${heroe.descripcion}</p>
        </div>
        <div class="seccion-datos">
            <h2 class="nombre">${heroe.nombre}</h2>
            <p class="edad"><span>Edad:</span> <span>${heroe.edad}</span></p>
            <p class="bando"><span>Bando:</span> <span>${heroe.bando}</span></p>
            <p class="universo"><span>Universo:</span> <span>${heroe.universo}</span></p>
            <p class="fuerza"><span>Fuerza:</span> <span>${heroe.niveldefuerza}</span></p>
            <p class="activo"><span>Activo:</span> <span>${heroe.activo ? "Sí" : "No"}</span></p>
            <ul class="poderes"></ul>
        </div>
        <div class="brillo"></div>
    `;

    // los poderes se agregan aparte porque son varios <li>, uno por cada poder.
    // se reemplaza el <ul> vacio de la plantilla por uno ya lleno (la funcion
    // crearListaPoderes tambien la usa el modal de detalle, asi no se repite
    // el mismo codigo dos veces)
    card.querySelector(".poderes").replaceWith(crearListaPoderes(heroe.poderes));

    // cada carta activa su propio efecto de mouse (giro 3D + brillo diagonal)
    activarEfectoMouse(card);

    // al hacer click en la carta se abre el modal con el detalle del heroe
    card.addEventListener("click", () => abrirModal(heroe));

    return card;
}

// arma la lista <ul class="poderes"> con una barra por cada poder del heroe.
// esta funcion la usan tanto crearCarta() como el modal, para no repetir codigo
function crearListaPoderes(poderes) {
    const lista = document.createElement("ul");
    lista.className = "poderes";

    poderes.forEach(poder => {
        const item = document.createElement("li");
        item.innerHTML = `
            <span class="poder-nombre">${poder.nombre}</span>
            <div class="poder-barra">
                <div class="poder-barra-relleno" style="width: ${poder.nivel}%"></div>
            </div>
        `;
        lista.appendChild(item);
    });

    return lista;
}

// ============================================================
// EFECTO DE CARTA TIPO POKEMON (giro 3D + brillo que sigue el mouse)
// ============================================================
// se recibe la carta como parametro para que el efecto funcione en
// cualquiera de las 12 cartas, no solo en una carta fija

function activarEfectoMouse(card) {
    const brillo = card.querySelector(".brillo");

    card.addEventListener("mousemove", (evento) => {
        card.classList.add("interactuando");

        const limites = card.getBoundingClientRect();
        const x = evento.clientX - limites.left;
        const y = evento.clientY - limites.top;

        const porcentajeX = x / limites.width;
        const porcentajeY = y / limites.height;

        // el giro maximo de la carta es de 10 grados hacia cada lado
        const rotacionMaxima = 10;
        const rotarY = (porcentajeX - 0.5) * rotacionMaxima * 2;
        const rotarX = (0.5 - porcentajeY) * rotacionMaxima * 2;

        card.style.transform = `perspective(900px) rotateX(${rotarX}deg) rotateY(${rotarY}deg) scale(1.02)`;

        // la linea de brillo se desplaza junto con el mouse, pero corrida
        // 25% para que quede al lado del cursor y no justo debajo
        const desplazamiento = 25;
        const posicionLinea = ((porcentajeX + porcentajeY) / 2) * 100 + desplazamiento;
        brillo.style.background = `linear-gradient(115deg, transparent ${posicionLinea - 5}%, rgba(178, 58, 58, 0.45) ${posicionLinea}%, transparent ${posicionLinea + 5}%)`;
        brillo.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
        card.classList.remove("interactuando");
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
        brillo.style.opacity = "0";
    });
}

// ============================================================
// MODAL DE DETALLE
// ============================================================
// hay un solo modal en el html (#modal), y se reutiliza para cualquier
// heroe: al abrirlo, se le reemplaza el contenido de #modal-cuerpo por
// los datos del heroe en el que se hizo click

const modal = document.getElementById("modal");
const modalCuerpo = document.getElementById("modal-cuerpo");

function abrirModal(heroe) {
    modalCuerpo.innerHTML = `
        <img class="modal-imagen ${heroe.imagenFondoBlanco ? "imagen--fondo-blanco" : ""}" src="${heroe.imagen}" alt="Logo de ${heroe.nombre}">
        <h2 class="modal-nombre">${heroe.nombre}</h2>
        <p class="modal-descripcion">${heroe.descripcion}</p>
        <div class="modal-datos">
            <p><span>Edad:</span> ${heroe.edad}</p>
            <p><span>Bando:</span> ${heroe.bando}</p>
            <p><span>Universo:</span> ${heroe.universo}</p>
            <p><span>Fuerza:</span> ${heroe.niveldefuerza}</p>
            <p><span>Activo:</span> ${heroe.activo ? "Sí" : "No"}</p>
        </div>
    `;

    // los poderes se agregan con la misma funcion que usan las cartas
    modalCuerpo.appendChild(crearListaPoderes(heroe.poderes));

    modal.classList.remove("oculto");
}

function cerrarModal() {
    modal.classList.add("oculto");
}

// se cierra al hacer click en el fondo oscuro, en la (X), o con la tecla Escape
document.querySelector(".modal-fondo").addEventListener("click", cerrarModal);
document.querySelector(".modal-cerrar").addEventListener("click", cerrarModal);
document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
        cerrarModal();
    }
});

// ============================================================
// GENERAR UNA CARTA POR CADA HEROE DEL ARRAY
// ============================================================
// se recorre el array "heroes" con forEach y, por cada heroe, se crea su
// carta con crearCarta() y se agrega al contenedor que existe en el html

const contenedorCartas = document.getElementById("contenedor-cartas");

heroes.forEach(heroe => {
    const carta = crearCarta(heroe);
    contenedorCartas.appendChild(carta);
});
