// ============================================================
// MEMORY DE HEROES
// ============================================================
// adaptado de "cardGame" (Ejemplo juego/cardgame/src/script.js):
//
//   The MIT License (MIT)
//   Copyright (c) 2026 Julian Bejarano (https://codepen.io/julianbejarano/pen/myrzjBG)
//
//   Permission is hereby granted, free of charge, to any person obtaining a
//   copy of this software and associated documentation files (the
//   "Software"), to deal in the Software without restriction, including
//   without limitation the rights to use, copy, modify, merge, publish,
//   distribute, sublicense, and/or sell copies of the Software, and to
//   permit persons to whom the Software is furnished to do so, subject to
//   the following conditions:
//
//   The above copyright notice and this permission notice shall be included
//   in all copies or substantial portions of the Software.
//
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//   OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
//   MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
//   NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//   DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
//   OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
//   USE OR OTHER DEALINGS IN THE SOFTWARE.
//
// cambios respecto del original:
//   - las cartas salen de "listaHeroes" (storage.js) en vez de productos fijos
//   - 6 heroes al azar por partida; el total de pares se calcula solo
//   - las cartas son <button> (se pueden usar con teclado) y se arman con
//     createElement + textContent en vez de innerHTML
//   - el cronometro arranca con la primera carta, no al cargar la pagina
//   - en vez de un codigo de descuento, cada partida ganada se guarda en el
//     usuario (con id y fecha) y el record sale de esas partidas
//   - var -> const/let, y todo el estado junto en un solo objeto
//
// usa funciones de storage-usuarios.js: registrarPartida(), mejorPartida(),
// formatearTiempo(). game.html lo carga antes que este archivo

// cuantas parejas se reparten por partida (12 cartas)
const TOTAL_PAREJAS = 6;

// milisegundos que quedan visibles dos cartas que NO son pareja
const ESPERA_SIN_PAREJA = 900;

const tablero = document.getElementById("juego-tablero");
const hudTiempo = document.getElementById("hud-tiempo");
const hudIntentos = document.getElementById("hud-intentos");
const hudPares = document.getElementById("hud-pares");
const hudRecord = document.getElementById("hud-record");
const ventanaVictoria = document.getElementById("juego-victoria");
const botonDeNuevo = document.getElementById("juego-de-nuevo");

// ============================================================
// ESTADO DE LA PARTIDA
// ============================================================
// el original tenia 10 variables sueltas (carta1, id1, intentos...). aca
// van todas dentro de UN objeto: se ve de un vistazo que es "el estado",
// y no chocan con variables de otros archivos (game.html carga 4 scripts
// que comparten el mismo espacio de nombres)
const estado = {
    primera: null,        // { carta, heroe } de la primera carta del turno
    segunda: null,        // { carta, heroe } de la segunda
    bloqueado: false,     // true mientras se muestran dos cartas que no son pareja
    paresEncontrados: 0,
    totalPares: 0,
    intentos: 0,
    segundos: 0,
    intervalo: null,      // el id de setInterval, para poder frenarlo
    jugador: null,        // el usuario del login (sus partidas se guardan aca)
    usuarios: [],         // la lista completa, para poder guardarla entera
};

// ============================================================
// UTILIDADES
// ============================================================

// mezcla de Fisher-Yates (igual que el original): recorre el array desde
// el final y cambia cada elemento con otro elegido al azar entre los que
// quedan. trabaja sobre una COPIA ([...array]) para no desordenar
// "listaHeroes", que tambien usan las otras paginas
function mezclar(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // "destructuring": intercambia los dos valores en una sola linea,
        // sin la variable "tmp" del original
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

// ============================================================
// CRONOMETRO
// ============================================================

// setInterval ejecuta la funcion cada 1000 ms (1 segundo) hasta que se
// frene con clearInterval. devuelve un numero (id) que hay que guardar:
// sin el, despues no hay forma de frenarlo
function iniciarCronometro() {
    detenerCronometro();
    estado.intervalo = setInterval(() => {
        estado.segundos++;
        hudTiempo.textContent = formatearTiempo(estado.segundos);
        // a partir de 2 minutos el tiempo se pinta en rojo
        hudTiempo.classList.toggle("juego-hud-valor--peligro", estado.segundos >= 120);
    }, 1000);
}

function detenerCronometro() {
    clearInterval(estado.intervalo);
    estado.intervalo = null;
}

// ============================================================
// RECORD DEL JUGADOR
// ============================================================
// ya no se guarda aparte: es la mejor de sus partidas con la misma
// cantidad de pares (ver mejorPartida() en storage-usuarios.js)

function textoRecord(partida) {
    return `${partida.intentos} int. · ${formatearTiempo(partida.tiempo)}`;
}

function mostrarRecordEnHud() {
    const record = mejorPartida(estado.jugador, estado.totalPares);
    hudRecord.textContent = record ? textoRecord(record) : "—";
}

// ============================================================
// CREAR UNA CARTA
// ============================================================
// cada carta es un <button> con dos caras apiladas una sobre la otra:
//   .memory-carta-reverso  el "?" que se ve al principio
//   .memory-carta-frente   el heroe, girado 180° de fabrica
// al voltearla, el CSS gira el interior 180° y queda a la vista el frente.
//
// se arma con createElement + textContent y no con innerHTML: el nombre
// puede venir de un heroe creado en gestion.html, y si alguien escribiera
// ahi codigo HTML, innerHTML lo ejecutaria. textContent lo muestra como texto

function crearCarta(heroe) {
    const carta = document.createElement("button");
    carta.type = "button";
    carta.className = "memory-carta";
    carta.setAttribute("aria-label", "Carta boca abajo");

    // variable CSS propia de esta carta: el CSS la usa para el borde y el
    // fondo del frente, asi cada heroe se ve con su color
    carta.style.setProperty("--color-heroe", heroe.colorPrincipal || "#e8b64d");

    const interior = document.createElement("div");
    interior.className = "memory-carta-interior";

    const reverso = document.createElement("div");
    reverso.className = "memory-carta-reverso";
    const signo = document.createElement("span");
    signo.textContent = "?";
    reverso.appendChild(signo);

    const frente = document.createElement("div");
    frente.className = "memory-carta-frente";

    const marcoImagen = document.createElement("div");
    marcoImagen.className = "memory-carta-imagen";
    const imagen = document.createElement("img");
    imagen.src = heroe.imagen;
    // alt vacio: el nombre ya se lee en el aria-label del boton
    imagen.alt = "";
    // misma clase que usa cards.js para las imagenes con fondo blanco
    if (heroe.imagenFondoBlanco) {
        imagen.classList.add("imagen--fondo-blanco");
    }
    marcoImagen.appendChild(imagen);

    const nombre = document.createElement("p");
    nombre.className = "memory-carta-nombre";
    nombre.textContent = heroe.nombre;

    const fuerza = document.createElement("p");
    fuerza.className = "memory-carta-fuerza";
    fuerza.textContent = `Fuerza ${heroe.niveldefuerza}`;

    frente.append(marcoImagen, nombre, fuerza);
    interior.append(reverso, frente);
    carta.appendChild(interior);

    // el heroe viaja en la "clausura" de la funcion flecha: cada carta
    // recuerda su propio heroe, sin guardarlo en un data-atributo
    carta.addEventListener("click", () => manejarClic(carta, heroe));

    return carta;
}

// ============================================================
// REPARTIR
// ============================================================

function repartir() {
    detenerCronometro();

    // se vuelve a cero todo el estado de la partida (menos el jugador)
    estado.primera = null;
    estado.segunda = null;
    estado.bloqueado = false;
    estado.paresEncontrados = 0;
    estado.intentos = 0;
    estado.segundos = 0;

    // 6 heroes al azar: se mezcla la lista entera y se toman los primeros 6.
    // si hay menos de 6 (se borraron en gestion), slice() devuelve los que haya
    const elegidos = mezclar(listaHeroes).slice(0, TOTAL_PAREJAS);
    estado.totalPares = elegidos.length;

    ventanaVictoria.hidden = true;
    tablero.innerHTML = "";
    hudTiempo.textContent = "00:00";
    hudTiempo.classList.remove("juego-hud-valor--peligro");
    hudIntentos.textContent = "0";
    hudPares.textContent = `0/${estado.totalPares}`;
    mostrarRecordEnHud();

    // con menos de 2 heroes no hay juego posible
    if (elegidos.length < 2) {
        const aviso = document.createElement("p");
        aviso.className = "aviso aviso--error";
        aviso.textContent = "Se necesitan al menos 2 héroes para jugar. Crea más desde la página de gestión.";
        tablero.appendChild(aviso);
        return;
    }

    // cada heroe va DOS veces ([...elegidos, ...elegidos] junta el array
    // consigo mismo) y despues se mezcla todo: esas son las parejas
    const mazo = mezclar([...elegidos, ...elegidos]);
    mazo.forEach(heroe => tablero.appendChild(crearCarta(heroe)));
}

// ============================================================
// LOGICA DEL TURNO
// ============================================================

function manejarClic(carta, heroe) {
    // se ignora el clic si: se estan mostrando dos cartas que no son
    // pareja, o esta carta ya esta dada vuelta o ya fue encontrada
    if (estado.bloqueado) return;
    if (carta.classList.contains("volteada")) return;
    if (carta.classList.contains("encontrada")) return;

    // el cronometro arranca con la PRIMERA carta de la partida
    if (estado.intervalo === null) {
        iniciarCronometro();
    }

    carta.classList.add("volteada");
    carta.setAttribute("aria-label", heroe.nombre);

    // caso A: primera carta del turno. se guarda y se espera la segunda
    if (!estado.primera) {
        estado.primera = { carta, heroe };
        return;
    }

    // caso B: segunda carta del turno
    estado.segunda = { carta, heroe };
    estado.intentos++;
    hudIntentos.textContent = estado.intentos;

    // se compara el id y no el nombre: el id es unico y no cambia nunca
    if (estado.primera.heroe.id === heroe.id) {
        parejaEncontrada();
    } else {
        estado.bloqueado = true;
        setTimeout(voltearDeNuevo, ESPERA_SIN_PAREJA);
    }
}

function parejaEncontrada() {
    [estado.primera, estado.segunda].forEach(({ carta }) => {
        carta.classList.remove("volteada");
        carta.classList.add("encontrada");
        // disabled: ya no se puede volver a clickear ni se llega con Tab
        carta.disabled = true;
    });

    estado.paresEncontrados++;
    hudPares.textContent = `${estado.paresEncontrados}/${estado.totalPares}`;
    limpiarTurno();

    if (estado.paresEncontrados === estado.totalPares) {
        detenerCronometro();
        // medio segundo de pausa para que se vea girar la ultima pareja
        setTimeout(mostrarVictoria, 500);
    }
}

function voltearDeNuevo() {
    [estado.primera, estado.segunda].forEach(({ carta }) => {
        carta.classList.remove("volteada");
        carta.setAttribute("aria-label", "Carta boca abajo");
    });
    limpiarTurno();
}

function limpiarTurno() {
    estado.primera = null;
    estado.segunda = null;
    estado.bloqueado = false;
}

// ============================================================
// VICTORIA
// ============================================================

function mostrarVictoria() {
    // el record se busca ANTES de guardar esta partida: si no, la partida
    // nueva se compararia consigo misma
    const anterior = mejorPartida(estado.jugador, estado.totalPares);

    // registrarPartida() le pone id y fecha, la agrega a jugador.partidas
    // y guarda la lista completa en localStorage
    const { partida, guardado } = registrarPartida(estado.usuarios, estado.jugador, {
        intentos: estado.intentos,
        tiempo: estado.segundos,
        pares: estado.totalPares,
    });

    let texto;
    if (!anterior) {
        texto = "¡Primer récord!";
    } else if (esMejorPartida(partida, anterior)) {
        texto = `¡Nuevo récord! Antes: ${textoRecord(anterior)}`;
    } else {
        texto = `Tu récord sigue siendo ${textoRecord(anterior)}`;
    }

    texto += guardado
        ? ` Partida #${partida.id} guardada.`
        : " No se pudo guardar la partida (localStorage lleno o bloqueado).";

    document.getElementById("victoria-record").textContent = texto;

    document.getElementById("victoria-tiempo").textContent = formatearTiempo(estado.segundos);
    document.getElementById("victoria-intentos").textContent = estado.intentos;
    document.getElementById("victoria-pares").textContent = `${estado.paresEncontrados}/${estado.totalPares}`;

    mostrarRecordEnHud();
    ventanaVictoria.hidden = false;
    // el foco pasa al boton de la ventana: con teclado se puede volver a
    // jugar apretando Enter, sin tener que buscarlo
    botonDeNuevo.focus();
}

// ============================================================
// ARRANQUE
// ============================================================

document.getElementById("juego-reiniciar").addEventListener("click", repartir);
botonDeNuevo.addEventListener("click", repartir);

// la llama game.js despues del login. a diferencia del original, el juego
// NO arranca solo al cargar la pagina: detras del login no hay nadie jugando.
// "jugador" tiene que ser un objeto DE ADENTRO de "usuarios" (el mismo, no
// una copia): asi, al agregarle una partida, la lista ya la tiene
function iniciarMemory(jugador, usuarios) {
    estado.jugador = jugador;
    estado.usuarios = usuarios;
    repartir();
}
