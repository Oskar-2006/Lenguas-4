// ============================================================
// LOGIN DEL JUEGO
// ============================================================
// pide nombre, alias, email y contraseña. el email y la contraseña se
// revisan con expresiones regulares, y el boton "Continuar" no deja pasar
// hasta que todo este bien.

const formularioLogin = document.getElementById("formulario-login");
const campoNombre = document.getElementById("login-nombre");
const campoAlias = document.getElementById("login-alias");
const campoEmail = document.getElementById("login-email");
const reglaEmail = document.querySelector('[data-regla-email="formato"]');
const campoContrasena = document.getElementById("login-contrasena");
const botonContinuar = document.getElementById("boton-continuar");
const avisoLogin = document.getElementById("aviso-login");
const avisoDatos = document.getElementById("aviso-datos");
const seccionLogin = document.getElementById("seccion-login");
const seccionJuego = document.getElementById("seccion-juego");
const saludoJuego = document.getElementById("saludo-juego");

// ============================================================
// EXPRESION REGULAR DEL EMAIL
// ============================================================
// un email valido tiene tres partes: usuario @ dominio . terminacion
// (nombre@correo.com). pieza por pieza:
//
//   ^           principio del texto
//   [^\s@]+     uno o mas (+) caracteres que NO sean (^) espacios (\s)
//               ni @. esto es el usuario: "nombre"
//   @           una @ obligatoria
//   [^\s@]+     otra vez: el dominio, "correo"
//   \.          un punto. va con \ adelante porque . solo, en una regex,
//               significa "cualquier caracter"
//   [^\s@]{2,}  la terminacion, de 2 o mas caracteres: "com", "co", "edu"
//   $           final del texto
//
// no revisa TODOS los casos raros que permite el estandar de emails (esa
// regex ocupa varias lineas), pero frena los errores comunes: sin @, sin
// punto, con espacios o con dos @
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ============================================================
// EXPRESION REGULAR DE LA CONTRASEÑA
// ============================================================
// una expresion regular (regex) describe un "patron" de texto. se escribe
// entre dos barras /.../ y se prueba con .test(texto), que da true o false.
//
// el problema: las reglas no tienen un orden ("A1$2B3456" y "123456AB$"
// valen los dos). por eso se usan LOOKAHEADS: (?=...) significa "desde
// aca, mirando hacia adelante, tiene que existir esto", pero SIN avanzar.
// asi se pueden poner varias condiciones seguidas y todas se revisan desde
// el principio del texto. pieza por pieza:
//
//   ^                       principio del texto
//   (?=(?:\D*\d){6})        6 veces: "cualquier cosa que NO sea numero (\D*)
//                           y despues un numero (\d)" = hay al menos 6 numeros
//   (?=(?:[^A-Z]*[A-Z]){2}) igual, pero 2 veces con mayusculas [A-Z]
//   (?=.*\$)                en algun lugar (.*) hay un $. va con \ adelante
//                           porque $ solo, en una regex, significa "final"
//   .{6,}                   cualquier caracter, 6 o mas veces
//   $                       final del texto
//
// (?:...) es un grupo que solo sirve para agrupar (para poder repetirlo
// con {6}), sin guardar lo que encontro
const regexContrasena = /^(?=(?:\D*\d){6})(?=(?:[^A-Z]*[A-Z]){2})(?=.*\$).{6,}$/;

// las mismas cuatro reglas, pero por separado: sirven para marcar en la
// lista cual se cumple y cual no mientras se escribe. la regex de arriba
// es la que decide al final si se puede continuar
const reglasContrasena = {
    largo: /^.{6,}$/,
    numeros: /(?:\D*\d){6}/,
    mayusculas: /(?:[^A-Z]*[A-Z]){2}/,
    dolar: /\$/,
};

// ============================================================
// USUARIOS
// ============================================================
// la carga y el guardado viven en storage-usuarios.js (lo comparte con
// gestion.html). aca solo se guarda la lista ya cargada.
//
// OJO: las contraseñas quedan visibles para cualquiera que abra las
// DevTools (F12). ver LIMITACIONES.md

// todos los usuarios (los de usuarios.json + los registrados, con sus
// partidas). es donde se busca al hacer login
let listaUsuarios = [];

// cargarUsuarios() usa fetch(), que NO devuelve el resultado al instante:
// devuelve una PROMESA ("te lo doy cuando llegue"). "await" espera a que
// llegue antes de seguir a la siguiente linea, sin congelar la pagina
async function prepararUsuarios() {
    const { usuarios, errorJson } = await cargarUsuarios();
    listaUsuarios = usuarios;

    if (errorJson) {
        avisoDatos.textContent = "No se pudo leer usuarios.json. Abre esta página con Live Server. Por ahora solo funcionan los usuarios registrados en este navegador.";
        avisoDatos.className = "aviso aviso--error";
    }
}

// se arranca la carga apenas abre la pagina y se guarda la PROMESA (no el
// resultado). el submit hace "await cargaDeUsuarios": si la persona envia el
// formulario antes de que termine de cargar, espera en vez de buscar en
// una lista todavia vacia
const cargaDeUsuarios = prepararUsuarios();

// ============================================================
// VALIDACION MIENTRAS SE ESCRIBE
// ============================================================

// revisa las reglas, marca cada <li> con ✓ o ✗ y activa o desactiva el
// boton. devuelve true si todo el formulario esta listo
function validarFormulario() {
    const contrasena = campoContrasena.value;

    // Object.entries() convierte el objeto en pares [nombre, regex] para
    // poder recorrerlo con forEach
    Object.entries(reglasContrasena).forEach(([nombre, regex]) => {
        const item = document.querySelector(`[data-regla="${nombre}"]`);
        item.classList.toggle("regla--ok", regex.test(contrasena));
    });

    // trim() quita los espacios de los bordes: sin eso, un nombre de puros
    // espacios contaria como "completo"
    const nombreOk = campoNombre.value.trim() !== "";
    const aliasOk = campoAlias.value.trim() !== "";
    const emailOk = regexEmail.test(campoEmail.value.trim());
    const contrasenaOk = regexContrasena.test(contrasena);

    reglaEmail.classList.toggle("regla--ok", emailOk);

    const todoOk = nombreOk && aliasOk && emailOk && contrasenaOk;
    botonContinuar.disabled = !todoOk;
    return todoOk;
}

// "input" = cada tecla que se escribe o se borra, en cualquiera de los
// cuatro campos. el aviso de error se borra apenas se vuelve a escribir
[campoNombre, campoAlias, campoEmail, campoContrasena].forEach(campo => {
    campo.addEventListener("input", () => {
        avisoLogin.textContent = "";
        avisoLogin.className = "";
        validarFormulario();
    });
});

// ============================================================
// ENTRAR AL JUEGO
// ============================================================

// el jugador que inicio sesion. queda disponible para usarlo en el juego
let jugador = null;

function entrarAlJuego(usuario, mensaje) {
    jugador = usuario;

    // alert() abre una ventanita del navegador y DETIENE el codigo hasta que
    // se aprieta "Aceptar". por eso va antes de cambiar de pantalla: primero
    // se avisa que el ingreso funciono, y al aceptar recien aparece el juego
    alert(mensaje);

    seccionLogin.hidden = true;
    seccionJuego.hidden = false;
    saludoJuego.textContent = `Bienvenido, ${jugador.alias}`;

    // iniciarMemory() esta en memory.js, que se carga DESPUES de este
    // archivo. igual funciona: esta linea recien se ejecuta al enviar el
    // formulario, y para ese momento memory.js ya termino de cargarse.
    // recibe tambien la lista completa: al ganar, la partida se guarda en
    // el jugador y hay que volver a guardar TODA la lista
    iniciarMemory(jugador, listaUsuarios);
}

function mostrarError(texto) {
    avisoLogin.textContent = texto;
    avisoLogin.className = "aviso aviso--error";
}

// ============================================================
// ENVIAR EL FORMULARIO
// ============================================================
// el boton desactivado ya impide continuar, pero un "disabled" se puede
// sacar desde la consola (F12). por eso al enviar se valida OTRA VEZ: el
// boton es la ayuda visual, esta revision es la que de verdad frena.
//
// la funcion es "async" porque adentro usa "await" para esperar la carga
// de usuarios
formularioLogin.addEventListener("submit", async evento => {
    // un <form> por defecto recarga la pagina al enviarse. preventDefault()
    // lo evita: el login se maneja aca, sin recargar
    evento.preventDefault();

    if (!validarFormulario()) {
        mostrarError("Revisa los datos: todos los campos son obligatorios, el email tiene que ser válido y la contraseña tiene que cumplir las cuatro reglas.");
        return;
    }

    // si usuarios.json todavia no termino de llegar, se espera aca
    await cargaDeUsuarios;

    // los emails no distinguen mayusculas: "Demo@Juego.com" y
    // "demo@juego.com" son la misma cuenta. por eso se comparan los dos
    // en minuscula. la contraseña NO: ahi "A" y "a" son distintas
    const email = campoEmail.value.trim().toLowerCase();
    const contrasena = campoContrasena.value;

    // find() devuelve el PRIMER usuario que cumple la condicion, o
    // undefined si ninguno la cumple
    const usuario = listaUsuarios.find(u => u.email.toLowerCase() === email);

    // --- caso 1 y 2: el email ya esta registrado ---
    if (usuario) {
        if (usuario.contrasena !== contrasena) {
            mostrarError("La contraseña no es correcta para este email.");
            return;
        }
        entrarAlJuego(usuario, `¡Ingresaste correctamente, ${usuario.alias}!`);
        return;
    }

    // --- caso 3: el email NO esta registrado ---
    // confirm() es como alert() pero con dos botones: devuelve true si se
    // aprieta "Aceptar" y false si se aprieta "Cancelar". \n = salto de linea
    const quiereRegistrarse = confirm(
        `No existe ninguna cuenta con el email ${email}.\n¿Deseas registrarte con estos datos?`
    );

    if (!quiereRegistrarse) {
        mostrarError("No se creó la cuenta. Revisa el email si ya tenías una.");
        return;
    }

    // registrarUsuario() (storage-usuarios.js) le da un id autogenerado,
    // le agrega "partidas: []", lo suma a la lista y guarda
    const { usuario: nuevoUsuario, guardado } = registrarUsuario(listaUsuarios, {
        nombre: campoNombre.value.trim(),
        alias: campoAlias.value.trim(),
        email: email,
        contrasena: contrasena,
    });

    // si no se pudo guardar, igual se entra (el usuario esta en memoria),
    // pero se avisa que al recargar la pagina la cuenta ya no va a existir
    const mensaje = guardado
        ? `¡Te registraste correctamente, ${nuevoUsuario.alias}!`
        : `Entraste, ${nuevoUsuario.alias}, pero la cuenta no se pudo guardar: al recargar la página se va a perder.`;

    entrarAlJuego(nuevoUsuario, mensaje);
});
