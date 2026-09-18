// ============================================================
// CARTAS Y MODAL DE DETALLE (compartido por las dos paginas)
// ============================================================
// este codigo estaba dentro de index.js, pero la seccion "Leer / Buscar"
// de gestion.html necesita dibujar las mismas cartas y abrir el mismo
// modal. en vez de copiarlo y mantener dos versiones que se van
// desincronizando, se saco a su propio archivo y lo cargan las dos
// paginas. es el mismo criterio con el que separamos data.js y storage.js:
// cada cosa definida una sola vez, en el archivo que le corresponde.
//
// requisito: el HTML que lo cargue tiene que tener el bloque del #modal,
// porque este archivo lo busca apenas se ejecuta.

// ============================================================
// PLANTILLA REUTILIZABLE DE CARTA
// ============================================================
// antes usabamos document.getElementById() porque solo existia UNA carta
// en el html, con id unicos (#nombre, #edad, etc). ahora vamos a crear 10
// cartas iguales en estructura, y un id no puede repetirse en el mismo
// documento HTML. por eso la plantilla usa solo .clases, y para buscar
// los elementos DENTRO de cada carta usamos card.querySelector(), que
// busca solo adentro de esa carta puntual y no en todo el documento.

// convierte un color hex ("#rrggbb") a "r, g, b" para poder armar los
// rgba() que usan --acento-tenue y --brillo-color con la opacidad que ya
// tenian esas variables
function hexARgb(hex) {
    const numero = parseInt(hex.slice(1), 16);
    const r = (numero >> 16) & 255;
    const g = (numero >> 8) & 255;
    const b = numero & 255;
    return `${r}, ${g}, ${b}`;
}

// aplica los 2 colores del heroe (principal y secundario) como variables
// CSS propias de esa carta: el principal reemplaza el amarillo por defecto,
// el secundario reemplaza el rojo que aparecia al interactuar. el mecanismo
// de hover (la clase .interactuando y el mousemove) no se toca, solo cambia
// de donde sale el color
function aplicarColoresHeroe(card, heroe) {
    // se guardan en "-base" y "-hover" (no en --acento directo) porque un
    // estilo inline siempre le gana a las reglas de la hoja de estilos: si
    // pusieramos --acento aca, la regla ".card.interactuando" nunca podria
    // sobreescribirlo al pasar el mouse
    card.style.setProperty("--acento-base", heroe.colorPrincipal);
    card.style.setProperty("--acento-claro-base", heroe.colorPrincipal);
    card.style.setProperty("--acento-tenue-base", `rgba(${hexARgb(heroe.colorPrincipal)}, 0.25)`);
    card.style.setProperty("--acento-hover", heroe.colorSecundario);
    card.style.setProperty("--acento-claro-hover", heroe.colorSecundario);
    card.style.setProperty("--acento-tenue-hover", `rgba(${hexARgb(heroe.colorSecundario)}, 0.35)`);
    card.style.setProperty("--brillo-color", `rgba(${hexARgb(heroe.colorPrincipal)}, 0.35)`);
}

function crearCarta(heroe) {
    // se crea el div contenedor de la carta
    const card = document.createElement("div");
    card.className = "card";
    aplicarColoresHeroe(card, heroe);

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
// cualquiera de las 10 cartas, no solo en una carta fija

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

    // al sacar el mouse de la carta, se deshace el giro (vuelve a 0 grados)
    // y se esconde el brillo, para que la carta quede como al principio
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
    // el modal no es una .card, asi que no recibe --acento-base/-hover: se
    // le pone directo el color principal del heroe en el que se hizo click
    modal.style.setProperty("--acento", heroe.colorPrincipal);
    modal.style.setProperty("--acento-claro", heroe.colorPrincipal);
    modal.style.setProperty("--acento-tenue", `rgba(${hexARgb(heroe.colorPrincipal)}, 0.25)`);

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
