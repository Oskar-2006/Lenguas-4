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

// medida maxima (en px) del lado mas largo de una imagen subida. las cartas
// la muestran entre 28 y 96 px, asi que 256 alcanza incluso en pantallas de
// alta densidad. achicarla importa porque las imagenes subidas se guardan
// como TEXTO en localStorage, que tiene un limite de ~5 MB: una foto de 3 MB
// ocuparia casi todo el espacio, y la misma foto a 256 px pesa unos pocos KB
const LADO_MAXIMO_IMAGEN = 256;

// el id que se le va a dar al proximo heroe creado. es "let" y no "const"
// porque sube en uno con cada heroe nuevo. arranca en lo que haya
// guardado storage.js (o en 11 la primera vez, despues de los 10 de data.js)
let siguienteId = cargarSiguienteId(listaHeroes);

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
    const error = validarHeroe(heroeEditado);

    if (error !== null) {
        mostrarAviso(error, "error");
        return;
    }

    // asignacion directa a una posicion del array: REEMPLAZA el objeto que
    // estaba ahi por el nuevo. a diferencia de crear, el array no cambia de
    // largo — sigue teniendo la misma cantidad de heroes, solo que uno de
    // ellos paso a ser otro objeto
    const heroeAnterior = listaHeroes[indice];

    // leerFormulario() arma un objeto NUEVO que no trae id (el formulario
    // no tiene campo de id, y no deberia: el id no se edita). se copia el
    // del heroe anterior para que siga siendo el mismo heroe
    heroeEditado.id = heroeAnterior.id;
    listaHeroes[indice] = heroeEditado;

    // si no se pudo guardar, se vuelve al objeto de antes
    if (!guardarOAvisar(() => { listaHeroes[indice] = heroeAnterior; })) {
        return;
    }

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
// color hex -> input color, opciones fijas -> select (bando y universo
// suman "Ninguna" y "Otra", que abre un campo de texto para escribirlo).
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

    // de donde viene la imagen del heroe que se edita (al crear siempre
    // arranca en "carpeta"). una imagen subida se guarda como un texto que
    // empieza con "data:"; una ruta que esta en la lista de img/ es de la
    // carpeta; cualquier otra cosa se trata como una URL
    const esDeCarpeta = imagenesDisponibles.some(archivo => `img/${archivo}` === valores.imagen);
    let fuenteImagen = "carpeta";
    if (valores.imagen.startsWith("data:")) {
        fuenteImagen = "archivo";
    } else if (valores.imagen !== "" && !esDeCarpeta) {
        fuenteImagen = "url";
    }

    // bando y universo son un select con opciones fijas + "Ninguna" + "Otra".
    // si el heroe que se edita tiene un valor escrito a mano, cae en "Otra"
    const bando = armarOpcionesConOtra(["Heroe", "Villano"], valores.bando);
    const universo = armarOpcionesConOtra(["DC Comics", "Marvel Comics"], valores.universo);

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
                <label for="crear-imagen-fuente">Imagen</label>
                <div class="imagen-editor">
                    <!-- vista previa: arranca oculta y el JS la muestra cuando
                         el navegador confirma que pudo cargar la imagen -->
                    <div class="imagen-previa">
                        <img id="crear-imagen-previa" alt="Vista previa de la imagen" hidden>
                    </div>
                    <!-- el primer select elige DE DONDE sale la imagen, y de los
                         tres controles siguientes solo se ve el que corresponde
                         (lo decide actualizarCamposCondicionales) -->
                    <div class="imagen-controles">
                        <select id="crear-imagen-fuente">
                            <option value="carpeta" ${fuenteImagen === "carpeta" ? "selected" : ""}>De la carpeta img/</option>
                            <option value="archivo" ${fuenteImagen === "archivo" ? "selected" : ""}>Subir un archivo</option>
                            <option value="url" ${fuenteImagen === "url" ? "selected" : ""}>Desde una URL</option>
                        </select>
                        <select id="crear-imagen-carpeta" aria-label="Imagen de la carpeta img/">
                            ${imagenesDisponibles.map(archivo => {
                                const ruta = `img/${archivo}`;
                                // "selected" marca cual opcion aparece elegida al abrir
                                return `<option value="${ruta}" ${valores.imagen === ruta ? "selected" : ""}>${archivo}</option>`;
                            }).join("")}
                        </select>
                        <input type="file" id="crear-imagen-archivo" accept="image/*" aria-label="Archivo de imagen">
                        <input type="url" id="crear-imagen-url" required placeholder="https://ejemplo.com/logo.png" aria-label="URL de la imagen">
                        <!-- aca queda la imagen subida YA reducida y convertida a
                             texto. el input file no sirve para guardarla: el JS
                             no puede escribirle un valor propio, solo vaciarlo -->
                        <input type="hidden" id="crear-imagen-subida">
                        <p id="crear-imagen-estado" class="imagen-estado"></p>
                    </div>
                </div>
            </div>
            <div class="campo">
                <label for="crear-edad">Edad</label>
                <input type="number" id="crear-edad" min="0" max="10000" required placeholder="Ej: 32" value="${valores.edad}">
            </div>
        </div>

        <div class="campo-doble">
            <div class="campo">
                <label for="crear-bando">Bando</label>
                <select id="crear-bando">${bando.opciones}</select>
                <!-- solo se ve cuando el select esta en "Otra" -->
                <input type="text" id="crear-bando-otro" required placeholder="¿Qué bando es?" aria-label="Bando (otra)">
            </div>
            <div class="campo">
                <label for="crear-universo">Universo</label>
                <select id="crear-universo">${universo.opciones}</select>
                <input type="text" id="crear-universo-otro" required placeholder="¿De qué universo es?" aria-label="Universo (otra)">
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
            <select id="crear-posicion">
                <option value="primero">Primero</option>
                <option value="ultimo" selected>Último</option>
                <option value="otro">Otro</option>
            </select>
            <!-- el numero de puesto: min y max los pone actualizarLimitePosicion() -->
            <input type="number" id="crear-posicion-otro" min="1" required aria-label="Número de puesto">
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

    // los textos libres se cargan con .value y NO dentro del template: si el
    // texto tuviera comillas, cortaria el atributo value="..." del HTML
    document.getElementById("crear-bando-otro").value = bando.textoOtro;
    document.getElementById("crear-universo-otro").value = universo.textoOtro;
    document.getElementById("crear-imagen-url").value = fuenteImagen === "url" ? valores.imagen : "";
    document.getElementById("crear-imagen-subida").value = fuenteImagen === "archivo" ? valores.imagen : "";

    // un solo listener para TODO el formulario: el evento "change" sube
    // (burbujea) desde cada select hasta el <form>, asi no hace falta
    // conectar uno por cada campo condicional
    formulario.addEventListener("change", actualizarCamposCondicionales);

    // la vista previa solo depende de los controles de imagen
    ["crear-imagen-fuente", "crear-imagen-carpeta", "crear-imagen-url"].forEach(id => {
        document.getElementById(id).addEventListener("change", actualizarVistaPrevia);
    });
    document.getElementById("crear-imagen-archivo").addEventListener("change", procesarArchivoImagen);

    // "load" y "error" son los dos resultados posibles de pedirle una imagen
    // al navegador: la vista previa se muestra o se oculta segun cual llegue
    const vistaPrevia = document.getElementById("crear-imagen-previa");
    vistaPrevia.addEventListener("load", () => {
        vistaPrevia.hidden = false;
    });
    vistaPrevia.addEventListener("error", () => {
        vistaPrevia.hidden = true;
        mostrarEstadoImagen("No se pudo cargar esa imagen.", true);
    });

    if (!editando) {
        actualizarLimitePosicion();
    }
    actualizarCamposCondicionales();
    actualizarVistaPrevia();

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

// ============================================================
// CAMPOS CONDICIONALES: "Otra", "Otro" y la fuente de la imagen
// ============================================================
// varios campos solo tienen sentido segun lo que se eligio en otro: el
// texto de "Otra" solo se ve si el select esta en "Otra", y de los tres
// controles de imagen solo se ve el de la fuente elegida

// arma las <option> de un select con las opciones fijas + "Ninguna" +
// "Otra". devuelve el HTML de las opciones y el texto que hay que cargar en
// el campo de "Otra" (vacio si el valor actual es una de las fijas)
function armarOpcionesConOtra(opcionesFijas, valorActual) {
    // "Ninguna" cuenta como fija porque se guarda tal cual. lo que no esta en
    // esta lista es un texto escrito a mano, o sea que le corresponde "Otra".
    // "Otra" en si NO esta en la lista: si alguien escribiera justo "Otra"
    // como valor, tiene que volver a cargarse como texto y no perderse
    const fijas = [...opcionesFijas, "Ninguna"];
    const esFija = fijas.includes(valorActual);
    const eleccion = esFija ? valorActual : "Otra";

    const opciones = [...fijas, "Otra"].map(opcion => {
        return `<option value="${opcion}" ${opcion === eleccion ? "selected" : ""}>${opcion}</option>`;
    }).join("");

    return { opciones: opciones, textoOtro: esFija ? "" : valorActual };
}

// muestra u oculta un campo condicional. ademas de esconderlo lo DESHABILITA:
// un campo escondido pero habilitado se sigue validando al enviar, y si
// estuviera vacio (tiene "required") el navegador frenaria el envio sin
// poder mostrar el error, porque el campo no se ve. un campo deshabilitado
// queda fuera de la validacion
function mostrarCampo(campo, visible) {
    campo.hidden = !visible;
    campo.disabled = !visible;
}

// deja visibles solo los campos que corresponden a lo elegido en los
// selects. lee todo por id, asi se puede llamar tanto desde el listener del
// formulario como despues de un reset()
function actualizarCamposCondicionales() {
    const fuente = document.getElementById("crear-imagen-fuente").value;
    mostrarCampo(document.getElementById("crear-imagen-carpeta"), fuente === "carpeta");
    mostrarCampo(document.getElementById("crear-imagen-archivo"), fuente === "archivo");
    mostrarCampo(document.getElementById("crear-imagen-url"), fuente === "url");

    mostrarCampo(document.getElementById("crear-bando-otro"), document.getElementById("crear-bando").value === "Otra");
    mostrarCampo(document.getElementById("crear-universo-otro"), document.getElementById("crear-universo").value === "Otra");

    // la posicion solo existe al crear: al editar el heroe ya tiene su lugar
    const posicion = document.getElementById("crear-posicion");
    if (posicion !== null) {
        mostrarCampo(document.getElementById("crear-posicion-otro"), posicion.value === "otro");
    }
}

// el numero de puesto va de 1 hasta "ultimo", que es un puesto mas que la
// cantidad de heroes que hay ahora. como la lista crece con cada heroe
// creado, el tope se recalcula cada vez
function actualizarLimitePosicion() {
    const tope = listaHeroes.length + 1;
    const campo = document.getElementById("crear-posicion-otro");
    campo.max = tope;
    campo.placeholder = `Número de puesto (1 a ${tope})`;
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
// IMAGEN DEL HEROE: CARPETA, ARCHIVO SUBIDO O URL
// ============================================================
// la propiedad "imagen" siempre termina siendo UN texto que va en el
// src="..." de un <img>, venga de donde venga:
//   carpeta -> una ruta relativa, ej. "img/thor.svg"
//   url     -> la direccion completa, ej. "https://sitio.com/logo.png"
//   archivo -> un "data URL": el contenido de la imagen escrito como texto
//              ("data:image/webp;base64,....")
// por eso index.html, las tablas y el modal no necesitan saber de cual de
// las tres viene: todas se dibujan igual

// devuelve el texto de imagen que corresponde a lo elegido en el
// formulario, o "" si todavia no hay una imagen valida
function leerImagen() {
    const fuente = document.getElementById("crear-imagen-fuente").value;

    if (fuente === "carpeta") {
        return document.getElementById("crear-imagen-carpeta").value;
    }

    if (fuente === "archivo") {
        return document.getElementById("crear-imagen-subida").value;
    }

    // new URL() lanza un error si el texto no es una direccion valida, de
    // ahi el try/catch. solo se aceptan http y https: el type="url" del
    // navegador tambien deja pasar otros esquemas (ftp:, javascript:...).
    // .href devuelve la direccion ya normalizada (comillas y espacios
    // codificados), que es lo que la hace segura para meter en un src="..."
    try {
        const direccion = new URL(document.getElementById("crear-imagen-url").value.trim());
        const esWeb = direccion.protocol === "http:" || direccion.protocol === "https:";
        return esWeb ? direccion.href : "";
    } catch (error) {
        return "";
    }
}

// muestra en la vista previa la imagen elegida. no decide si se ve: eso lo
// hacen los eventos "load" y "error" del <img> (ver dibujarFormulario)
function actualizarVistaPrevia() {
    const vistaPrevia = document.getElementById("crear-imagen-previa");
    const ruta = leerImagen();

    mostrarEstadoImagen("", false);

    if (ruta === "") {
        vistaPrevia.hidden = true;
        // removeAttribute y no src = "": un src vacio dispara "error"
        vistaPrevia.removeAttribute("src");
        return;
    }

    vistaPrevia.src = ruta;
}

// el texto chico debajo de los controles de imagen: avisos de la carga
function mostrarEstadoImagen(mensaje, esError) {
    const estado = document.getElementById("crear-imagen-estado");
    estado.textContent = mensaje;
    estado.className = esError ? "imagen-estado imagen-estado--error" : "imagen-estado";
}

// se ejecuta cuando el estudiante elige un archivo. el resultado (la imagen
// ya reducida, como texto) queda en el input oculto, que es del que lee
// leerImagen() al enviar el formulario
function procesarArchivoImagen(evento) {
    const campoArchivo = evento.target;
    const archivo = campoArchivo.files[0];

    // si se cancela el selector de archivos, files queda vacio
    if (archivo === undefined) {
        return;
    }

    // accept="image/*" es solo una sugerencia: el selector deja elegir
    // "todos los archivos", asi que se revisa aca tambien
    if (!archivo.type.startsWith("image/")) {
        campoArchivo.value = "";
        mostrarEstadoImagen("Ese archivo no es una imagen.", true);
        return;
    }

    // reducirImagen() no devuelve el resultado: devuelve una Promise, una
    // promesa de que el resultado va a llegar mas tarde. leer y dibujar una
    // imagen lleva tiempo y el JS no se queda esperando: sigue con lo demas
    // y avisa por .then() cuando termina, o por .catch() si algo fallo
    reducirImagen(archivo)
        .then(datos => {
            // si mientras tanto se cambio de seccion, el formulario ya no existe
            if (!campoArchivo.isConnected) {
                return;
            }

            document.getElementById("crear-imagen-subida").value = datos;
            actualizarVistaPrevia();

            const enKB = bytes => Math.max(1, Math.round(bytes / 1024));
            mostrarEstadoImagen(`Lista: de ${enKB(archivo.size)} KB a ${enKB(datos.length)} KB.`, false);
        })
        .catch(() => {
            if (!campoArchivo.isConnected) {
                return;
            }

            campoArchivo.value = "";
            mostrarEstadoImagen("No se pudo leer esa imagen.", true);
        });
}

// reduce la imagen a LADO_MAXIMO_IMAGEN y la devuelve como un data URL. el
// truco es dibujarla en un <canvas> mas chico (que nunca se agrega a la
// pagina) y pedirle al canvas que se exporte como texto
function reducirImagen(archivo) {
    return new Promise((resolver, rechazar) => {
        // createObjectURL da una direccion temporal (blob:...) que apunta al
        // archivo elegido, sin tener que leerlo entero como texto primero
        const direccionTemporal = URL.createObjectURL(archivo);
        const imagen = new Image();

        imagen.onload = () => {
            URL.revokeObjectURL(direccionTemporal);

            // un svg sin width/height propios puede informar medida 0: en ese
            // caso se usa el lado maximo como medida de respaldo
            const ancho = imagen.naturalWidth || LADO_MAXIMO_IMAGEN;
            const alto = imagen.naturalHeight || LADO_MAXIMO_IMAGEN;

            // por cuanto hay que multiplicar para que el lado mas largo mida
            // LADO_MAXIMO_IMAGEN. Math.min(1, ...) impide AGRANDAR una imagen
            // chica (se veria borrosa), salvo el svg: es vectorial y no pierde
            // calidad al agrandarse
            let escala = LADO_MAXIMO_IMAGEN / Math.max(ancho, alto);
            if (archivo.type !== "image/svg+xml") {
                escala = Math.min(1, escala);
            }

            const lienzo = document.createElement("canvas");
            lienzo.width = Math.max(1, Math.round(ancho * escala));
            lienzo.height = Math.max(1, Math.round(alto * escala));
            lienzo.getContext("2d").drawImage(imagen, 0, 0, lienzo.width, lienzo.height);

            // webp pesa poco y conserva la transparencia. un navegador que no
            // sepa exportar webp devuelve png, que tambien sirve
            resolver(lienzo.toDataURL("image/webp", 0.85));
        };

        imagen.onerror = () => {
            URL.revokeObjectURL(direccionTemporal);
            rechazar(new Error("El navegador no pudo leer la imagen"));
        };

        imagen.src = direccionTemporal;
    });
}

// ============================================================
// SECCION CREAR: GUARDAR EL HEROE
// ============================================================

// lee todos los campos y arma un objeto con la MISMA forma que los de
// data.js. es importante que las propiedades se llamen igual, porque
// index.js las busca por ese nombre exacto (heroe.niveldefuerza, etc.)
function leerFormulario() {
    return {
        nombre: document.getElementById("crear-nombre").value.trim(),
        imagen: leerImagen(),
        imagenFondoBlanco: document.getElementById("crear-fondo-blanco").checked,
        // los value de un input SIEMPRE son texto, aunque el input sea
        // type="number". Number() lo convierte para que edad y los niveles
        // queden como numeros igual que en data.js, y no como "32"
        edad: Number(document.getElementById("crear-edad").value),
        poderes: leerPoderes(),
        descripcion: document.getElementById("crear-descripcion").value.trim(),
        bando: leerSelectConOtra("crear-bando", "crear-bando-otro"),
        universo: leerSelectConOtra("crear-universo", "crear-universo-otro"),
        niveldefuerza: Number(document.getElementById("crear-fuerza").value),
        activo: document.getElementById("crear-activo").checked,
        colorPrincipal: document.getElementById("crear-color-principal").value,
        colorSecundario: document.getElementById("crear-color-secundario").value,
    };
}

// devuelve lo elegido en un select o, si eligio "Otra", el texto que
// escribio en su campo. "Ninguna" no necesita nada especial: se guarda
// tal cual como el texto "Ninguna"
function leerSelectConOtra(idSelect, idTexto) {
    const eleccion = document.getElementById(idSelect).value;

    if (eleccion !== "Otra") {
        return eleccion;
    }

    return document.getElementById(idTexto).value.trim();
}

// validaciones que el navegador no puede hacer solo. devuelve el mensaje
// del primer problema que encuentre, o null si esta todo bien. el orden
// sigue el del formulario, de arriba hacia abajo
function validarHeroe(heroe) {
    // imagen vacia significa: no se subio archivo, o la URL no es http(s).
    // el resto de las fuentes siempre trae valor
    if (heroe.imagen === "") {
        const fuente = document.getElementById("crear-imagen-fuente").value;
        return fuente === "archivo"
            ? "Elegí un archivo de imagen."
            : "La URL de la imagen tiene que empezar con http:// o https://";
    }

    // "required" deja pasar un campo con solo espacios, pero despues de
    // trim() queda vacio: se revisa aca
    if (heroe.bando === "") {
        return "Escribí cuál es el bando, o elegí otra opción.";
    }

    if (heroe.universo === "") {
        return "Escribí de qué universo es, o elegí otra opción.";
    }

    // los campos de poder no son "required" porque las filas se crean con
    // JS, asi que se revisa aca que haya quedado al menos uno con nombre
    if (heroe.poderes.length === 0) {
        return "Falta cargar al menos un poder con nombre.";
    }

    return null;
}

// guarda la lista. si no entra en localStorage, DESHACE el cambio que se
// acababa de hacer en memoria (para que lo que se ve y lo que esta guardado
// no queden distintos) y avisa. devuelve true si se guardo
function guardarOAvisar(deshacer) {
    if (guardarHeroes(listaHeroes)) {
        return true;
    }

    deshacer();
    mostrarAviso("No se pudo guardar: el almacenamiento del navegador está lleno. Probá con una imagen más liviana o eliminá algún héroe.", "error");
    return false;
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
    const error = validarHeroe(heroeNuevo);

    if (error !== null) {
        mostrarAviso(error, "error");
        return;
    }

    // el id se asigna aca y no en leerFormulario(), porque esa funcion
    // tambien la usa editar, y al editar el heroe ya tiene su id
    heroeNuevo.id = siguienteId;

    // la posicion NO es una propiedad del heroe (no existe en data.js): es
    // una instruccion sobre donde meterlo. por eso se lee aparte y no
    // dentro de leerFormulario(), que solo arma el objeto heroe.
    // "primero" y "ultimo" son los dos extremos. con "otro" el estudiante
    // escribio un numero de puesto, que cuenta desde 1, mientras que los
    // indices del array cuentan desde 0: de ahi el "- 1". el navegador ya
    // comprobo que sea un entero entre 1 y el ultimo puesto (min y max)
    const eleccionPosicion = document.getElementById("crear-posicion").value;
    let posicion;

    if (eleccionPosicion === "primero") {
        posicion = 0;
    } else if (eleccionPosicion === "ultimo") {
        posicion = listaHeroes.length;
    } else {
        posicion = Number(document.getElementById("crear-posicion-otro").value) - 1;
    }

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
    // cambiar de pagina, que es justo el problema que teniamos antes.
    // si no entra en el almacen, se saca el heroe que se acababa de insertar
    if (!guardarOAvisar(() => listaHeroes.splice(posicion, 1))) {
        return;
    }

    // el contador sube recien DESPUES de guardar bien: si el guardado
    // fallaba, el heroe se descartaba y su id se puede volver a usar
    siguienteId++;
    guardarSiguienteId(siguienteId);

    mostrarAviso(
        `"${heroeNuevo.nombre}" agregado en el puesto ${posicion + 1} y guardado. Ahora hay ${listaHeroes.length} héroes.`,
        "exito"
    );

    // reset() devuelve todos los campos a su valor inicial, pero no sabe
    // nada de las filas de poderes que creamos con JS: esas se limpian a
    // mano y se vuelve a dejar una sola
    formulario.reset();
    document.getElementById("crear-fuerza-valor").textContent = "50";

    // tampoco sabe de lo que vive fuera de los campos habituales: el input
    // oculto con la imagen subida no se limpia con reset(), y los campos
    // condicionales (Otra, Otro, fuente de imagen) tienen que volver a
    // esconderse segun los selects, que ahora estan en su valor inicial
    document.getElementById("crear-imagen-subida").value = "";
    actualizarCamposCondicionales();
    actualizarVistaPrevia();

    // el tope del numero de puesto depende del largo de la lista, y la
    // lista acaba de crecer en uno
    actualizarLimitePosicion();

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
