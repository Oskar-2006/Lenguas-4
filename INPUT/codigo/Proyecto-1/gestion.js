// ============================================================
// LOGICA DE LA PAGINA DE GESTION
// ============================================================
// igual que index.js, este archivo NO declara los datos: trabaja sobre
// "listaHeroes", que arma storage.js a partir de lo guardado en
// localStorage (o de los datos iniciales de data.js la primera vez).
// gestion.html carga los dos ANTES que este archivo.
//
// index.js y gestion.js son dos archivos separados porque cada pagina
// carga solo el suyo: la pagina de cartas no necesita la logica de
// gestion, ni al reves.

// referencia al contenedor vacio que dejamos en el HTML: aca dentro se
// dibuja la seccion que corresponda al boton apretado
const contenedorGestion = document.getElementById("gestion-contenido");

// todos los botones del sidebar de una sola vez. querySelectorAll devuelve
// una lista (NodeList) que se puede recorrer con forEach, igual que un array
const botonesSidebar = document.querySelectorAll(".sidebar-item");

// ============================================================
// TITULOS DE CADA SECCION
// ============================================================
// un objeto que asocia cada data-seccion con su titulo. se usa un objeto
// en vez de un if/else largo: para agregar una seccion nueva alcanza con
// sumar una linea aca y un <button> en el HTML, sin tocar la logica

const secciones = {
    mostrar: "Mostrar todos los héroes",
    crear: "Crear un héroe",
    leer: "Leer / Buscar un héroe",
    actualizar: "Actualizar un héroe",
    eliminar: "Eliminar un héroe",
};

// archivos que existen dentro de la carpeta img/. se listan a mano porque
// el navegador no puede leer el contenido de una carpeta por su cuenta:
// solo puede pedir archivos puntuales por su ruta
const imagenesDisponibles = [
    "aquaman.svg",
    "batman.jpg",
    "blackpanther.svg",
    "bolt.svg",
    "capamerica.svg",
    "greenlantern.svg",
    "ironman.svg",
    "spiderman.svg",
    "superman.svg",
    "thor.svg",
    "wolverine.svg",
    "wonderwoman.png",
];

// ============================================================
// NAVEGACION DEL SIDEBAR
// ============================================================

// dibuja la seccion pedida dentro del contenedor: primero el titulo, y
// despues el contenido que corresponda. por ahora solo "crear" esta
// construida, el resto muestra un aviso provisional
function mostrarSeccion(nombreSeccion) {
    contenedorGestion.innerHTML = `<h2 class="seccion-titulo">${secciones[nombreSeccion]}</h2>`;

    if (nombreSeccion === "mostrar") {
        dibujarListaHeroes();
        return;
    }

    if (nombreSeccion === "crear") {
        // null = no hay heroe que editar, o sea que el formulario es de crear
        dibujarFormulario(null);
        return;
    }

    if (nombreSeccion === "actualizar") {
        dibujarListaActualizar();
        return;
    }

    if (nombreSeccion === "leer") {
        dibujarBuscador();
        return;
    }

    if (nombreSeccion === "eliminar") {
        dibujarListaEliminar();
        return;
    }

    // ojo: aca se usa createElement + appendChild y NO "innerHTML +=".
    // hacer innerHTML += vuelve a escribir TODO el contenido desde cero, y
    // eso borraria los addEventListener de lo que ya estaba dibujado
    const aviso = document.createElement("p");
    aviso.className = "seccion-aviso";
    aviso.textContent = "Sección por construir.";
    contenedorGestion.appendChild(aviso);
}

// marca visualmente cual es el boton seleccionado: primero le saca la
// clase .activa a TODOS y despues se la pone solo al apretado. si no se
// limpiara antes, se irian acumulando varios botones marcados a la vez
function marcarBotonActivo(botonApretado) {
    botonesSidebar.forEach(boton => boton.classList.remove("activa"));
    botonApretado.classList.add("activa");
}

// se le pone el mismo listener a cada boton. el dato de que seccion abrir
// no esta en el codigo sino en el atributo data-seccion del HTML, y se lee
// con boton.dataset.seccion
botonesSidebar.forEach(boton => {
    boton.addEventListener("click", () => {
        marcarBotonActivo(boton);
        mostrarSeccion(boton.dataset.seccion);
    });
});

// ============================================================
// SECCION MOSTRAR TODOS: TABLA DE HEROES
// ============================================================
// dibuja una fila por cada objeto de "listaHeroes". la columna "#" es el
// indice del array, asi se ve enseguida el efecto de haber creado un heroe
// con unshift() (queda en el 0) o con push() (queda en el ultimo)

function dibujarListaHeroes() {
    // caso borde: si la lista quedara vacia, la tabla no tendria sentido.
    // conviene resolverlo primero y salir, en vez de dibujar una tabla con
    // el encabezado solo y ninguna fila
    if (listaHeroes.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "seccion-aviso";
        aviso.textContent = "No hay héroes en la lista.";
        contenedorGestion.appendChild(aviso);
        return;
    }

    const conteo = document.createElement("p");
    conteo.className = "tabla-conteo";
    conteo.textContent = `${listaHeroes.length} héroes en la lista.`;
    contenedorGestion.appendChild(conteo);

    // la tabla se envuelve en un div con scroll horizontal: en celular no
    // entra a lo ancho, y sin el envoltorio empujaria toda la pagina
    const envoltorio = document.createElement("div");
    envoltorio.className = "tabla-scroll";

    // .map() transforma cada heroe en un texto de <tr>, y .join("") pega
    // todos esos textos en uno solo. es el patron habitual para armar HTML
    // a partir de un array: map para transformar, join para unir
    const filas = listaHeroes.map((heroe, indice) => `
        <tr>
            <td class="tabla-indice">${indice}</td>
            <td><img class="tabla-imagen" src="${heroe.imagen}" alt="Logo de ${heroe.nombre}"></td>
            <td class="tabla-nombre">${heroe.nombre}</td>
            <td>${heroe.edad}</td>
            <td>${heroe.bando}</td>
            <td>${heroe.universo}</td>
            <td>${heroe.niveldefuerza}</td>
            <td>${heroe.poderes.length}</td>
            <td>${heroe.activo ? "Sí" : "No"}</td>
            <td>
                <span class="tabla-color" style="background-color: ${heroe.colorPrincipal}"></span>
                <span class="tabla-color" style="background-color: ${heroe.colorSecundario}"></span>
            </td>
            <td class="tabla-acciones">
                <!-- el boton se deshabilita en vez de esconderse: si se
                     ocultara, las filas de arriba y abajo quedarian con
                     distinta cantidad de botones y se verian desalineadas.
                     data-indice guarda en que fila esta cada boton -->
                <button type="button" class="tabla-boton" data-indice="${indice}" data-mover="inicio"
                        title="Mover al principio" aria-label="Mover al principio"
                        ${indice === 0 ? "disabled" : ""}>↑</button>
                <button type="button" class="tabla-boton" data-indice="${indice}" data-mover="final"
                        title="Mover al final" aria-label="Mover al final"
                        ${indice === listaHeroes.length - 1 ? "disabled" : ""}>↓</button>
            </td>
        </tr>
    `).join("");

    envoltorio.innerHTML = `
        <table class="tabla-heroes">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Bando</th>
                    <th>Universo</th>
                    <th>Fuerza</th>
                    <th>Poderes</th>
                    <th>Activo</th>
                    <th>Colores</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    `;

    contenedorGestion.appendChild(envoltorio);

    // los listeners se conectan DESPUES de escribir el innerHTML: antes los
    // botones todavia no existian como elementos y querySelectorAll no
    // habria encontrado ninguno.
    // dataset.indice llega como texto (todo atributo HTML es texto), por
    // eso Number() antes de usarlo como indice del array
    envoltorio.querySelectorAll(".tabla-boton").forEach(boton => {
        boton.addEventListener("click", () => {
            moverHeroe(Number(boton.dataset.indice), boton.dataset.mover);
        });
    });
}

// mueve un heroe que YA existe a un extremo de la lista. es distinto de
// crear: aca no se agrega nada, se reubica lo que ya esta
function moverHeroe(indice, destino) {
    // splice(indice, 1) borra 1 elemento desde esa posicion y DEVUELVE un
    // array con lo que saco. [0] toma el objeto de adentro de ese array.
    // primero hay que sacarlo, si no quedaria duplicado en la lista
    const heroe = listaHeroes.splice(indice, 1)[0];

    if (destino === "inicio") {
        listaHeroes.unshift(heroe);
    } else {
        listaHeroes.push(heroe);
    }

    guardarHeroes(listaHeroes);

    // se redibuja la seccion entera: al moverse un heroe cambian los
    // indices de todos los demas, y tambien que botones van deshabilitados.
    // es mas simple y mas seguro que intentar corregir fila por fila
    mostrarSeccion("mostrar");
}

// ============================================================
// SECCION LEER / BUSCAR: CARTAS FILTRABLES
// ============================================================
// dibuja las mismas cartas de index.html, pero con un buscador arriba.
// las cartas las arma crearCarta(), que vive en cards.js y usan las dos
// paginas: al hacerles click abren el mismo modal de detalle

function dibujarBuscador() {
    const buscador = document.createElement("div");
    buscador.className = "buscador";
    buscador.innerHTML = `
        <input type="search" id="buscador-texto" class="buscador-campo"
               placeholder="Buscar por nombre, universo o bando...">
        <p id="buscador-conteo" class="tabla-conteo"></p>
    `;
    contenedorGestion.appendChild(buscador);

    const contenedorCartas = document.createElement("div");
    // se reusa el grid de las cartas de index.html y se le suma un
    // modificador, porque aca la columna es mas angosta (esta el sidebar al lado)
    contenedorCartas.className = "contenedor-cartas contenedor-cartas--gestion";
    contenedorGestion.appendChild(contenedorCartas);

    const campoBusqueda = document.getElementById("buscador-texto");

    // "input" se dispara con cada tecla, asi la lista se filtra mientras se
    // escribe. con "change" habria que salir del campo para ver el resultado
    campoBusqueda.addEventListener("input", () => {
        pintarResultados(campoBusqueda.value, contenedorCartas);
    });

    // al abrir la seccion se muestran todos: una busqueda vacia no filtra nada
    pintarResultados("", contenedorCartas);
}

// filtra la lista y dibuja una carta por cada heroe que coincida
function pintarResultados(textoBuscado, contenedorCartas) {
    // se pasa todo a minusculas de los dos lados para que la busqueda no
    // distinga mayusculas: "thor", "Thor" y "THOR" tienen que encontrar lo mismo
    const busqueda = textoBuscado.trim().toLowerCase();

    // filter() devuelve un array NUEVO con los elementos que cumplen la
    // condicion, sin tocar el original. por eso "listaHeroes" queda intacta
    // por mas que se busque: solo cambia lo que se dibuja
    const encontrados = listaHeroes.filter(heroe => {
        // includes() responde true/false segun si el texto esta adentro.
        // se revisan tres campos y alcanza con que uno coincida (||)
        return heroe.nombre.toLowerCase().includes(busqueda)
            || heroe.universo.toLowerCase().includes(busqueda)
            || heroe.bando.toLowerCase().includes(busqueda);
    });

    const conteo = document.getElementById("buscador-conteo");
    conteo.textContent = busqueda === ""
        ? `${encontrados.length} héroes.`
        : `${encontrados.length} de ${listaHeroes.length} coinciden con "${textoBuscado.trim()}".`;

    // se vacia antes de volver a dibujar: si no, cada tecla iria sumando
    // cartas nuevas debajo de las anteriores
    contenedorCartas.innerHTML = "";

    if (encontrados.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "seccion-aviso";
        aviso.textContent = "Ningún héroe coincide con la búsqueda.";
        contenedorCartas.appendChild(aviso);
        return;
    }

    encontrados.forEach(heroe => {
        contenedorCartas.appendChild(crearCarta(heroe));
    });
}

// ============================================================
// SECCION ACTUALIZAR: LISTA CON BOTON DE EDITAR
// ============================================================
// la tabla es la misma idea que la de eliminar, pero el boton en vez de
// borrar abre el formulario cargado con los datos de ese heroe

function dibujarListaActualizar() {
    if (listaHeroes.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "seccion-aviso";
        aviso.textContent = "No hay héroes para editar.";
        contenedorGestion.appendChild(aviso);
        return;
    }

    const conteo = document.createElement("p");
    conteo.className = "tabla-conteo";
    conteo.textContent = "Elegí qué héroe querés modificar.";
    contenedorGestion.appendChild(conteo);

    const envoltorio = document.createElement("div");
    envoltorio.className = "tabla-scroll";

    const filas = listaHeroes.map((heroe, indice) => `
        <tr>
            <td class="tabla-indice">${indice}</td>
            <td><img class="tabla-imagen" src="${heroe.imagen}" alt="Logo de ${heroe.nombre}"></td>
            <td class="tabla-nombre">${heroe.nombre}</td>
            <td>${heroe.universo}</td>
            <td>${heroe.poderes.length}</td>
            <td class="tabla-acciones">
                <button type="button" class="boton-secundario boton-secundario--fila" data-indice="${indice}">Editar</button>
            </td>
        </tr>
    `).join("");

    envoltorio.innerHTML = `
        <table class="tabla-heroes">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Universo</th>
                    <th>Poderes</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    `;

    contenedorGestion.appendChild(envoltorio);

    envoltorio.querySelectorAll(".boton-secundario--fila").forEach(boton => {
        boton.addEventListener("click", () => {
            abrirEdicion(Number(boton.dataset.indice));
        });
    });
}

// reemplaza la tabla por el formulario cargado con los datos de ese heroe.
// se pasan las DOS cosas: el objeto (para llenar los campos) y el indice
// (para saber despues cual posicion del array hay que reemplazar)
function abrirEdicion(indice) {
    const heroe = listaHeroes[indice];

    contenedorGestion.innerHTML = `<h2 class="seccion-titulo">Editando a ${heroe.nombre}</h2>`;
    dibujarFormulario(heroe, indice);
}

function procesarEdicion(formulario, indice) {
    const heroeEditado = leerFormulario();

    if (heroeEditado === null) {
        mostrarAviso("Falta cargar al menos un poder con nombre.", "error");
        return;
    }

    // asignacion directa a una posicion del array: REEMPLAZA el objeto que
    // estaba ahi por el nuevo. a diferencia de crear, el array no cambia de
    // largo — sigue teniendo la misma cantidad de heroes, solo que uno de
    // ellos paso a ser otro objeto
    listaHeroes[indice] = heroeEditado;

    guardarHeroes(listaHeroes);

    mostrarAviso(`Cambios de "${heroeEditado.nombre}" guardados.`, "exito");
}

// ============================================================
// SECCION ELIMINAR: LISTA CON BOTON DE BORRAR
// ============================================================

function dibujarListaEliminar() {
    if (listaHeroes.length === 0) {
        const aviso = document.createElement("p");
        aviso.className = "seccion-aviso";
        aviso.textContent = "No hay héroes para eliminar.";
        contenedorGestion.appendChild(aviso);
        return;
    }

    const conteo = document.createElement("p");
    conteo.className = "tabla-conteo";
    conteo.textContent = `${listaHeroes.length} héroes en la lista.`;
    contenedorGestion.appendChild(conteo);

    const envoltorio = document.createElement("div");
    envoltorio.className = "tabla-scroll";

    const filas = listaHeroes.map((heroe, indice) => `
        <tr>
            <td class="tabla-indice">${indice}</td>
            <td><img class="tabla-imagen" src="${heroe.imagen}" alt="Logo de ${heroe.nombre}"></td>
            <td class="tabla-nombre">${heroe.nombre}</td>
            <td>${heroe.universo}</td>
            <td>${heroe.niveldefuerza}</td>
            <td class="tabla-acciones">
                <button type="button" class="boton-peligro boton-peligro--fila" data-indice="${indice}">Eliminar</button>
            </td>
        </tr>
    `).join("");

    envoltorio.innerHTML = `
        <table class="tabla-heroes">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Universo</th>
                    <th>Fuerza</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>${filas}</tbody>
        </table>
    `;

    contenedorGestion.appendChild(envoltorio);

    envoltorio.querySelectorAll(".boton-peligro--fila").forEach(boton => {
        boton.addEventListener("click", () => {
            eliminarHeroe(Number(boton.dataset.indice));
        });
    });
}

function eliminarHeroe(indice) {
    const heroe = listaHeroes[indice];

    // borrar no se puede deshacer, asi que se pregunta antes. confirm()
    // devuelve true si el usuario aprieta Aceptar y false si cancela
    const seguro = confirm(`¿Eliminar a "${heroe.nombre}" de la lista?`);

    if (!seguro) {
        return;
    }

    // splice(indice, 1) saca 1 elemento desde esa posicion. es el mismo
    // metodo que usamos para mover e insertar, con otros argumentos.
    // no se usa delete listaHeroes[indice]: eso dejaria un hueco vacio en
    // el array sin achicar su largo, y la tabla mostraria una fila rota
    listaHeroes.splice(indice, 1);

    guardarHeroes(listaHeroes);

    // se redibuja entera porque al borrar uno se corren los indices de
    // todos los que estaban despues
    mostrarSeccion("eliminar");
}

// ============================================================
// SECCION CREAR: FORMULARIO
// ============================================================
// hay un campo por cada propiedad de los objetos de data.js, y cada tipo
// de input se eligio segun el tipo de dato que guarda esa propiedad:
// texto -> input text, numero -> input number, true/false -> checkbox,
// color hex -> input color, opciones fijas -> select.
//
// "poderes" es el caso distinto: no es un valor suelto sino un array de
// objetos { nombre, nivel }, y cada heroe tiene una cantidad diferente
// (Flash tiene 6, los demas 5). por eso se resuelve con filas que se
// agregan y se quitan con JS, en vez de una cantidad fija de campos

// este formulario sirve para los DOS casos:
//   dibujarFormulario(null)            -> crear un heroe nuevo
//   dibujarFormulario(heroe, indice)   -> editar uno que ya existe
// los campos son exactamente los mismos, porque las propiedades a llenar
// son las mismas. lo unico que cambia es si arrancan vacios o cargados, el
// texto del boton, y que al editar no se elige posicion (el heroe ya tiene
// su lugar en la lista).
//
// tener un solo formulario en vez de dos parecidos significa que si manana
// agregamos una propiedad al heroe, se agrega una vez y funciona en los
// dos lados. con formularios separados habria que acordarse de tocar los dos
function dibujarFormulario(heroe, indice) {
    const editando = heroe !== null;

    // valores con los que arranca cada campo: los del heroe si se esta
    // editando, o estos por defecto si se esta creando. juntarlos en un
    // solo objeto evita repetir el mismo ternario en cada campo del HTML
    const valores = editando ? heroe : {
        nombre: "",
        descripcion: "",
        imagen: "",
        edad: "",
        bando: "Heroe",
        universo: "DC Comics",
        niveldefuerza: 50,
        activo: true,
        imagenFondoBlanco: false,
        colorPrincipal: "#e8b64d",
        colorSecundario: "#b23a3a",
        poderes: [],
    };

    const formulario = document.createElement("form");
    formulario.className = "formulario-crear";
    // novalidate no: se deja la validacion del navegador (required, min, max)
    // porque es gratis y avisa antes de que el codigo tenga que revisar nada

    formulario.innerHTML = `
        <div class="campo">
            <label for="crear-nombre">Nombre</label>
            <input type="text" id="crear-nombre" required placeholder="Ej: Spider-Man" value="${valores.nombre}">
        </div>

        <div class="campo">
            <label for="crear-descripcion">Descripción</label>
            <!-- el textarea no usa value: su contenido va ENTRE las etiquetas -->
            <textarea id="crear-descripcion" rows="3" required placeholder="Una o dos frases sobre el héroe">${valores.descripcion}</textarea>
        </div>

        <div class="campo-doble">
            <div class="campo">
                <label for="crear-imagen">Imagen</label>
                <select id="crear-imagen" required>
                    ${imagenesDisponibles.map(archivo => {
                        const ruta = `img/${archivo}`;
                        // "selected" marca cual opcion aparece elegida al abrir
                        return `<option value="${ruta}" ${valores.imagen === ruta ? "selected" : ""}>${archivo}</option>`;
                    }).join("")}
                </select>
            </div>
            <div class="campo">
                <label for="crear-edad">Edad</label>
                <input type="number" id="crear-edad" min="0" max="10000" required placeholder="Ej: 32" value="${valores.edad}">
            </div>
        </div>

        <div class="campo-doble">
            <div class="campo">
                <label for="crear-bando">Bando</label>
                <select id="crear-bando">
                    <option value="Heroe" ${valores.bando === "Heroe" ? "selected" : ""}>Heroe</option>
                    <option value="Villano" ${valores.bando === "Villano" ? "selected" : ""}>Villano</option>
                </select>
            </div>
            <div class="campo">
                <label for="crear-universo">Universo</label>
                <select id="crear-universo">
                    <option value="DC Comics" ${valores.universo === "DC Comics" ? "selected" : ""}>DC Comics</option>
                    <option value="Marvel Comics" ${valores.universo === "Marvel Comics" ? "selected" : ""}>Marvel Comics</option>
                </select>
            </div>
        </div>

        <div class="campo">
            <label for="crear-fuerza">Nivel de fuerza: <output id="crear-fuerza-valor">${valores.niveldefuerza}</output></label>
            <input type="range" id="crear-fuerza" min="0" max="100" value="${valores.niveldefuerza}">
        </div>

        <div class="campo-doble">
            <div class="campo">
                <label for="crear-color-principal">Color principal</label>
                <input type="color" id="crear-color-principal" value="${valores.colorPrincipal}">
            </div>
            <div class="campo">
                <label for="crear-color-secundario">Color secundario</label>
                <input type="color" id="crear-color-secundario" value="${valores.colorSecundario}">
            </div>
        </div>

        <div class="campo">
            <label class="campo-casilla">
                <!-- "checked" es un atributo que esta o no esta: por eso se
                     escribe la palabra entera o cadena vacia, no true/false -->
                <input type="checkbox" id="crear-activo" ${valores.activo ? "checked" : ""}>
                <span>Activo</span>
            </label>
            <label class="campo-casilla">
                <input type="checkbox" id="crear-fondo-blanco" ${valores.imagenFondoBlanco ? "checked" : ""}>
                <span>La imagen tiene fondo blanco (no es transparente)</span>
            </label>
        </div>

        <div class="campo">
            <label>Poderes</label>
            <div id="crear-poderes" class="poderes-editor"></div>
            <button type="button" id="crear-agregar-poder" class="boton-secundario">+ Agregar poder</button>
        </div>

        ${editando ? "" : `
        <div class="campo">
            <label for="crear-posicion">Posición en la lista</label>
            <select id="crear-posicion">${armarOpcionesPosicion()}</select>
        </div>
        `}

        <div class="formulario-pie">
            <button type="submit" class="boton">${editando ? "Guardar cambios" : "Aceptar y agregar héroe"}</button>
            ${editando ? `<button type="button" id="crear-volver" class="boton-secundario">← Volver a la lista</button>` : ""}
        </div>

        <div id="crear-aviso"></div>
    `;

    contenedorGestion.appendChild(formulario);

    // ------------------------------------------------------------
    // una vez que el formulario esta en el documento, se conectan los
    // listeners. antes de este appendChild los elementos de adentro
    // todavia no se podian buscar con getElementById
    // ------------------------------------------------------------

    const contenedorPoderes = document.getElementById("crear-poderes");
    const botonAgregarPoder = document.getElementById("crear-agregar-poder");
    const campoFuerza = document.getElementById("crear-fuerza");
    const valorFuerza = document.getElementById("crear-fuerza-valor");

    // el <input type="range"> no muestra su numero, hay que escribirlo al
    // lado. el evento "input" se dispara mientras se arrastra la perilla
    // (a diferencia de "change", que espera a que se suelte)
    campoFuerza.addEventListener("input", () => {
        valorFuerza.textContent = campoFuerza.value;
    });

    botonAgregarPoder.addEventListener("click", () => {
        contenedorPoderes.appendChild(crearFilaPoder());
    });

    // al crear se pone una fila vacia, para que se entienda que hay que
    // llenar al menos uno. al editar se pone una fila POR CADA poder que
    // ya tenia el heroe, con sus datos cargados
    if (valores.poderes.length === 0) {
        contenedorPoderes.appendChild(crearFilaPoder());
    } else {
        valores.poderes.forEach(poder => {
            contenedorPoderes.appendChild(crearFilaPoder(poder));
        });
    }

    if (editando) {
        document.getElementById("crear-volver").addEventListener("click", () => {
            mostrarSeccion("actualizar");
        });
    }

    formulario.addEventListener("submit", (evento) => {
        // sin esto el navegador recargaria la pagina al enviar el
        // formulario (su comportamiento por defecto desde siempre), y se
        // perderia todo lo que el JS tiene en memoria
        evento.preventDefault();

        if (editando) {
            procesarEdicion(formulario, indice);
        } else {
            procesarCreacion(formulario);
        }
    });
}

// arma las <option> del desplegable de posicion. hay una opcion por cada
// hueco donde se puede insertar: antes de cada heroe que ya existe, mas
// una al final. el "value" es el INDICE donde va a entrar el heroe nuevo,
// y el texto muestra el numero de puesto (indice + 1) porque contar desde
// 1 es mas natural de leer que desde 0
function armarOpcionesPosicion() {
    const opciones = listaHeroes.map((heroe, indice) => {
        const etiqueta = indice === 0
            ? `1 — primero (antes de ${heroe.nombre})`
            : `${indice + 1} — antes de ${heroe.nombre}`;
        return `<option value="${indice}">${etiqueta}</option>`;
    });

    // la ultima opcion no va "antes de" nadie: es el final de la lista.
    // su indice es listaHeroes.length, o sea una posicion mas alla del
    // ultimo elemento existente
    opciones.push(`<option value="${listaHeroes.length}" selected>${listaHeroes.length + 1} — último</option>`);

    return opciones.join("");
}

// arma una fila del editor de poderes: nombre + nivel + boton de quitar.
// devuelve el elemento ya listo para que quien la llame decida donde ponerla.
//
// "poder" es opcional: si no se pasa ninguno la fila arranca vacia (caso
// crear), y si se pasa uno la fila arranca con sus datos (caso editar)
function crearFilaPoder(poder) {
    const nombre = poder ? poder.nombre : "";
    const nivel = poder ? poder.nivel : 50;

    const fila = document.createElement("div");
    fila.className = "poder-fila";

    fila.innerHTML = `
        <input type="text" class="poder-fila-nombre" placeholder="Nombre del poder" value="${nombre}">
        <input type="number" class="poder-fila-nivel" min="0" max="100" value="${nivel}">
        <button type="button" class="poder-quitar" aria-label="Quitar poder">&times;</button>
    `;

    // el listener se le pone a ESTA fila puntual, no a un id global: cada
    // fila sabe como eliminarse a si misma
    fila.querySelector(".poder-quitar").addEventListener("click", () => {
        const contenedor = fila.parentElement;
        // siempre tiene que quedar al menos una fila, si no el formulario
        // se quedaria sin ninguna forma de cargar poderes
        if (contenedor.children.length > 1) {
            fila.remove();
        }
    });

    return fila;
}

// ============================================================
// SECCION CREAR: GUARDAR EL HEROE
// ============================================================

// lee todos los campos y arma un objeto con la MISMA forma que los de
// data.js. es importante que las propiedades se llamen igual, porque
// index.js las busca por ese nombre exacto (heroe.niveldefuerza, etc.)
function leerFormulario() {
    const poderes = leerPoderes();

    // validacion que el navegador no puede hacer solo: los campos de poder
    // no son "required" porque las filas se crean con JS, asi que se revisa
    // aca que haya quedado al menos uno con nombre
    if (poderes.length === 0) {
        return null;
    }

    return {
        nombre: document.getElementById("crear-nombre").value.trim(),
        imagen: document.getElementById("crear-imagen").value,
        imagenFondoBlanco: document.getElementById("crear-fondo-blanco").checked,
        // los value de un input SIEMPRE son texto, aunque el input sea
        // type="number". Number() lo convierte para que edad y los niveles
        // queden como numeros igual que en data.js, y no como "32"
        edad: Number(document.getElementById("crear-edad").value),
        poderes: poderes,
        descripcion: document.getElementById("crear-descripcion").value.trim(),
        bando: document.getElementById("crear-bando").value,
        universo: document.getElementById("crear-universo").value,
        niveldefuerza: Number(document.getElementById("crear-fuerza").value),
        activo: document.getElementById("crear-activo").checked,
        colorPrincipal: document.getElementById("crear-color-principal").value,
        colorSecundario: document.getElementById("crear-color-secundario").value,
    };
}

// recorre las filas del editor y devuelve el array de objetos
// { nombre, nivel }, salteando las filas que quedaron sin nombre
function leerPoderes() {
    const filas = document.querySelectorAll(".poder-fila");
    const poderes = [];

    filas.forEach(fila => {
        const nombre = fila.querySelector(".poder-fila-nombre").value.trim();
        const nivel = Number(fila.querySelector(".poder-fila-nivel").value);

        if (nombre !== "") {
            poderes.push({ nombre: nombre, nivel: nivel });
        }
    });

    return poderes;
}

function procesarCreacion(formulario) {
    const heroeNuevo = leerFormulario();

    if (heroeNuevo === null) {
        mostrarAviso("Falta cargar al menos un poder con nombre.", "error");
        return;
    }

    // la posicion NO es una propiedad del heroe (no existe en data.js): es
    // una instruccion sobre donde meterlo. por eso se lee aparte y no
    // dentro de leerFormulario(), que solo arma el objeto heroe
    const posicion = Number(document.getElementById("crear-posicion").value);

    // splice() sirve para insertar en CUALQUIER punto del array, no solo en
    // los extremos. sus 3 argumentos son:
    //   1) desde que indice actuar
    //   2) cuantos elementos borrar (0 = no borrar ninguno, solo insertar)
    //   3) que elemento agregar
    // con posicion 0 hace lo mismo que unshift(), y con posicion igual al
    // largo del array lo mismo que push(): los reemplaza a los dos.
    // modifica "listaHeroes" (la que armo storage.js), no "heroes": esa es
    // la copia de los datos iniciales y se deja intacta
    listaHeroes.splice(posicion, 0, heroeNuevo);

    // este es el paso que hace que el heroe sobreviva a la recarga. sin
    // esta linea el cambio solo existiria en memoria y se perderia al
    // cambiar de pagina, que es justo el problema que teniamos antes
    guardarHeroes(listaHeroes);

    mostrarAviso(
        `"${heroeNuevo.nombre}" agregado en el puesto ${posicion + 1} y guardado. Ahora hay ${listaHeroes.length} héroes.`,
        "exito"
    );

    // reset() devuelve todos los campos a su valor inicial, pero no sabe
    // nada de las filas de poderes que creamos con JS: esas se limpian a
    // mano y se vuelve a dejar una sola
    formulario.reset();
    document.getElementById("crear-fuerza-valor").textContent = "50";

    // el desplegable de posicion se arma a partir de la lista, asi que
    // despues de agregar un heroe quedo desactualizado: le falta el recien
    // creado y el "ultimo" apunta a un indice viejo. hay que rehacerlo
    document.getElementById("crear-posicion").innerHTML = armarOpcionesPosicion();

    const contenedorPoderes = document.getElementById("crear-poderes");
    contenedorPoderes.innerHTML = "";
    contenedorPoderes.appendChild(crearFilaPoder());
}

// escribe el mensaje de resultado debajo del formulario. el tipo ("exito"
// o "error") solo cambia la clase CSS, para que el color lo decida la
// hoja de estilos y no el JS
function mostrarAviso(mensaje, tipo) {
    const aviso = document.getElementById("crear-aviso");
    aviso.className = `aviso aviso--${tipo}`;
    aviso.textContent = mensaje;
}

// ============================================================
// RESTABLECER LOS DATOS ORIGINALES
// ============================================================
// borra el almacen y recarga la pagina. la recarga es necesaria porque
// "listaHeroes" ya esta en memoria con los datos viejos: volver a leerla
// solo pasa cuando storage.js se ejecuta de nuevo, o sea al cargar la pagina

document.getElementById("restablecer").addEventListener("click", () => {
    // confirm() muestra un cuadro de Aceptar/Cancelar y devuelve true o
    // false. se usa porque la accion no se puede deshacer: si el estudiante
    // creo heroes, los pierde
    const seguro = confirm("Esto borra los héroes creados y vuelve a los 10 de data.js. ¿Continuar?");

    if (seguro) {
        restablecerHeroes();
        location.reload();
    }
});

// al abrir la pagina se muestra la primera seccion, para que el contenido
// no arranque vacio (coincide con el boton que ya trae .activa en el HTML)
mostrarSeccion("mostrar");
