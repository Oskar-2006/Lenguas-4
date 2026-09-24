// ============================================================
// LOG IN DE LA PAGINA DE GESTION
// ============================================================
// este archivo decide si se muestra la gestion o no. la gestion (sidebar,
// secciones CRUD) esta guardada en un <template> de gestion.html, y solo
// se copia a la pagina cuando lo escrito coincide con "usuario" y
// "contrasena", que declara credenciales.js (cargado justo antes).
//
// OJO, limite importante (documentado en detalle en LIMITACIONES.md): esto
// es un log in de practica, NO seguridad real. todo lo que llega al
// navegador se puede leer y ejecutar desde la consola: credenciales.js se
// ve completo en DevTools -> Sources, mostrarGestion() se puede llamar
// directo para saltar el login, y storage.js (cargado ANTES que este
// archivo) deja crear o borrar heroes con guardarHeroes() sin pasar por
// ningun formulario. este archivo controla que se VE al navegar la pagina
// normalmente, no que se puede EJECUTAR desde las herramientas de
// desarrollador. para proteger datos de verdad la validacion y el
// guardado tienen que vivir en un servidor, donde el visitante no ve el
// codigo ni las contraseñas.

// sessionStorage es como localStorage, pero se borra al cerrar la pestaña.
// asi, recargar la pagina no vuelve a pedir el log in, pero cerrar la
// pestaña si: es lo que se espera de una sesion
const CLAVE_SESION = "proyecto1-sesion";

const pantallaLogin = document.getElementById("login");
const formularioLogin = document.getElementById("login-formulario");

// cambia la pantalla de log in por la gestion
function mostrarGestion() {
    pantallaLogin.remove();

    // .content es el contenido del <template> (un DocumentFragment, una
    // especie de "mini documento" que no esta en la pagina). cloneNode(true)
    // lo copia entero, con todos sus hijos, y replaceWith pone esa copia
    // en el lugar donde estaba el <template>
    const plantilla = document.getElementById("plantilla-gestion");
    plantilla.replaceWith(plantilla.content.cloneNode(true));

    document.getElementById("cerrar-sesion").addEventListener("click", cerrarSesion);

    // recien ahora existen #gestion-contenido, los botones del sidebar y
    // #restablecer, que gestion.js busca apenas se ejecuta. por eso se carga
    // aca y no con un <script> fijo en el HTML: se habria ejecutado antes
    // del log in y getElementById habria devuelto null
    const script = document.createElement("script");
    script.src = "gestion.js";
    document.body.appendChild(script);
}

function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_SESION);

    // se recarga en vez de "volver a esconder" la gestion: gestion.js ya se
    // ejecuto y dejo listeners y variables en memoria. recargar arranca un
    // contexto de JavaScript nuevo, y sin la sesion vuelve a pedir el log in
    location.reload();
}

// compara lo escrito contra "usuario" y "contrasena" (declaradas en
// credenciales.js) y devuelve true o false. separarla en su propia funcion
// deja el listener del submit mas corto, y permite probar la verificacion
// sola, sin tener que pasar por el formulario (ver LIMITACIONES.md: esto
// NO la vuelve mas segura, solo mas ordenada)
//
// === compara valor Y tipo, y las dos condiciones tienen que cumplirse
// (&&): usuario correcto con contraseña incorrecta no pasa la verificacion
function verificarCredenciales(usuarioEscrito, contrasenaEscrita) {
    return usuarioEscrito === usuario && contrasenaEscrita === contrasena;
}

formularioLogin.addEventListener("submit", (evento) => {
    // igual que en el formulario de crear: sin esto la pagina se recarga
    evento.preventDefault();

    // el usuario se recorta (un espacio de mas al final es un error comun
    // al tipear), la contraseña NO: un espacio puede ser parte de ella
    const usuarioEscrito = document.getElementById("login-usuario").value.trim();
    const campoContrasena = document.getElementById("login-contrasena");

    if (verificarCredenciales(usuarioEscrito, campoContrasena.value)) {
        sessionStorage.setItem(CLAVE_SESION, "activa");
        mostrarGestion();
        return;
    }

    // el mensaje no dice CUAL de los dos esta mal a proposito: si dijera
    // "la contraseña es incorrecta", confirmaria que el usuario existe
    const aviso = document.getElementById("login-aviso");
    aviso.className = "aviso aviso--error";
    aviso.textContent = "Usuario o contraseña incorrectos.";

    // se vacia solo la contraseña, para no obligar a reescribir el usuario
    campoContrasena.value = "";
    campoContrasena.focus();
});

// si en esta pestaña ya se habia entrado, se salta el log in
if (sessionStorage.getItem(CLAVE_SESION) === "activa") {
    mostrarGestion();
}
