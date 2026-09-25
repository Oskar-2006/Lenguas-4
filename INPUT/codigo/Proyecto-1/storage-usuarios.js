// ============================================================
// PERSISTENCIA DE LOS USUARIOS DEL JUEGO (usuarios.json + localStorage)
// ============================================================
// lo usan game.html (login y memory) y gestion.html (pestaña "Usuarios del
// juego"). esta en su propio archivo para que las dos paginas compartan el
// MISMO codigo en vez de tener dos copias que se van desincronizando.
//
// el problema de fondo: el navegador puede LEER usuarios.json con fetch(),
// pero NO puede escribir en el (una pagina no tiene permiso para modificar
// archivos del disco). la solucion es el mismo patron de data.js + storage.js:
//   - usuarios.json    los datos iniciales (solo lectura)
//   - localStorage     la lista COMPLETA, con los registros y partidas nuevos,
//                      guardada con exactamente la misma forma que el .json
// y para que los cambios lleguen al archivo: descargarUsuariosJson() baja la
// lista como usuarios.json, y se reemplaza el archivo a mano.
//
// forma de cada usuario:
//   { id, nombre, alias, email, contrasena,
//     partidas: [ { id, fecha, intentos, tiempo, pares } ] }
//   - fecha: texto ISO ("2026-09-25T14:32:10.000Z"), el formato estandar
//     para guardar fechas en JSON (JSON no tiene un tipo "fecha")
//   - tiempo: en segundos (mas facil de comparar que "01:15")
//
// OJO: las contraseñas quedan visibles en F12. ver LIMITACIONES.md

// la lista completa. clave nueva: la anterior ("proyecto1-usuarios") solo
// guardaba los registrados y sin id; migrarVersionAnterior() la convierte
const CLAVE_USUARIOS_JUEGO = "proyecto1-usuarios-juego";
const CLAVE_USUARIOS_VIEJA = "proyecto1-usuarios";
const CLAVE_RECORDS_VIEJA = "proyecto1-records";

// contadores de ids, cada uno en su propia clave (igual que
// "proyecto1-siguiente-id" de los heroes): un id tiene que ser unico PARA
// SIEMPRE, aunque se borre el usuario o la partida que lo tenia
const CLAVE_SIGUIENTE_ID_USUARIO = "proyecto1-siguiente-id-usuario";
const CLAVE_SIGUIENTE_ID_PARTIDA = "proyecto1-siguiente-id-partida";

// ============================================================
// IDS AUTOGENERADOS
// ============================================================

// el id mas alto de un array de objetos, o 0 si esta vacio. se llama
// distinto de idMasAlto() de storage.js porque game.html carga los dos
// archivos, y dos funciones con el mismo nombre se pisarian
function idMayorDe(items) {
    return Math.max(0, ...items.map(item => item.id || 0));
}

// todas las partidas de todos los usuarios en UN solo array (flatMap)
function todasLasPartidas(usuarios) {
    return usuarios.flatMap(usuario => usuario.partidas);
}

// entrega el proximo id y deja anotado el siguiente. Math.max con el id
// mas alto + 1 es un seguro: si el contador se perdio (se borro el
// localStorage), nunca entrega un id que ya este en uso
function tomarSiguienteId(clave, idMasAltoEnUso) {
    const guardado = Number(localStorage.getItem(clave)) || 0;
    const id = Math.max(guardado, idMasAltoEnUso + 1);
    try {
        localStorage.setItem(clave, String(id + 1));
    } catch (error) {
        console.warn("No se pudo guardar el contador de ids.", error);
    }
    return id;
}

function nuevoIdUsuario(usuarios) {
    return tomarSiguienteId(CLAVE_SIGUIENTE_ID_USUARIO, idMayorDe(usuarios));
}

function nuevoIdPartida(usuarios) {
    return tomarSiguienteId(CLAVE_SIGUIENTE_ID_PARTIDA, idMayorDe(todasLasPartidas(usuarios)));
}

// ============================================================
// LEER Y GUARDAR
// ============================================================

function guardarUsuarios(usuarios) {
    try {
        localStorage.setItem(CLAVE_USUARIOS_JUEGO, JSON.stringify(usuarios));
        return true;
    } catch (error) {
        console.warn("No se pudieron guardar los usuarios en localStorage.", error);
        return false;
    }
}

function leerLocalStorage(clave) {
    try {
        return JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
        console.warn(`Lo guardado en "${clave}" estaba dañado, se ignora.`, error);
        return [];
    }
}

// agrega un usuario a la lista SOLO si su email no esta ya. le completa lo
// que le falte: "partidas" si no la tiene, e "id" si no tiene o si ese id
// ya lo usa otro. devuelve true si lo agrego
function agregarSiFalta(usuarios, usuario) {
    const email = usuario.email.toLowerCase();
    if (usuarios.some(u => u.email.toLowerCase() === email)) {
        return false;
    }

    // se copia con {...usuario} para no modificar el objeto original
    const copia = { ...usuario, email };
    if (!Array.isArray(copia.partidas)) {
        copia.partidas = [];
    }
    if (!copia.id || usuarios.some(u => u.id === copia.id)) {
        copia.id = nuevoIdUsuario(usuarios);
    }

    usuarios.push(copia);
    return true;
}

// la version anterior guardaba en "proyecto1-usuarios" solo los
// registrados, sin id ni partidas. se pasan a la lista nueva y se borra la
// clave vieja. los records de "proyecto1-records" no se pueden convertir
// en partidas (no tenian fecha ni id), asi que solo se borran
function migrarVersionAnterior(usuarios) {
    if (localStorage.getItem(CLAVE_USUARIOS_VIEJA) === null) {
        return false;
    }
    leerLocalStorage(CLAVE_USUARIOS_VIEJA).forEach(u => agregarSiFalta(usuarios, u));
    localStorage.removeItem(CLAVE_USUARIOS_VIEJA);
    localStorage.removeItem(CLAVE_RECORDS_VIEJA);
    return true;
}

// arma la lista de usuarios. es "async" porque espera a fetch().
// devuelve { usuarios, errorJson }: errorJson es true si no se pudo leer
// usuarios.json (casi siempre: la pagina se abrio con doble clic en vez de
// con Live Server, y el navegador bloquea fetch() en ese modo)
//
// pasos:
//   1. lo que ya hay en localStorage (vacio la primera vez)
//   2. los usuarios de usuarios.json que TODAVIA no esten (se compara por
//      email). asi, si se agrega un usuario nuevo al .json a mano, aparece,
//      pero los que ya estaban no se pisan: sus partidas viven en localStorage
//   3. lo de la version anterior, si quedo algo. va DESPUES del json para
//      que los usuarios del archivo conserven sus ids (1, 2...) y los
//      migrados reciban los siguientes
async function cargarUsuarios() {
    const usuarios = leerLocalStorage(CLAVE_USUARIOS_JUEGO);
    let huboCambios = false;
    let errorJson = false;

    try {
        const respuesta = await fetch("usuarios.json");
        // fetch() no lanza error con un 404: hay que revisar .ok a mano
        if (!respuesta.ok) {
            throw new Error(`HTTP ${respuesta.status}`);
        }
        const usuariosJson = await respuesta.json();
        usuariosJson.forEach(u => {
            if (agregarSiFalta(usuarios, u)) {
                huboCambios = true;
            }
        });
    } catch (error) {
        console.warn("No se pudo leer usuarios.json.", error);
        errorJson = true;
    }

    if (migrarVersionAnterior(usuarios)) {
        huboCambios = true;
    }

    if (huboCambios) {
        guardarUsuarios(usuarios);
    }

    return { usuarios, errorJson };
}

// ============================================================
// REGISTRAR USUARIOS Y PARTIDAS
// ============================================================

// crea el usuario con su id, lo agrega y guarda. devuelve el usuario nuevo
// y si se pudo guardar (false = localStorage lleno o bloqueado)
function registrarUsuario(usuarios, datos) {
    const usuario = {
        id: nuevoIdUsuario(usuarios),
        nombre: datos.nombre,
        alias: datos.alias,
        email: datos.email.toLowerCase(),
        contrasena: datos.contrasena,
        partidas: [],
    };
    usuarios.push(usuario);
    return { usuario, guardado: guardarUsuarios(usuarios) };
}

// agrega una partida terminada al usuario y guarda. new Date() es "ahora";
// toISOString() lo convierte al texto estandar, en hora UTC (por eso puede
// verse 5 horas adelantado respecto de Colombia: se corrige al mostrarlo)
function registrarPartida(usuarios, usuario, datos) {
    const partida = {
        id: nuevoIdPartida(usuarios),
        fecha: new Date().toISOString(),
        intentos: datos.intentos,
        tiempo: datos.tiempo,
        pares: datos.pares,
    };
    usuario.partidas.push(partida);
    return { partida, guardado: guardarUsuarios(usuarios) };
}

// ============================================================
// RECORDS (se calculan a partir de las partidas)
// ============================================================

// mejor = menos intentos. si empatan, gana el menor tiempo
function esMejorPartida(nueva, anterior) {
    if (!anterior) return true;
    if (nueva.intentos !== anterior.intentos) return nueva.intentos < anterior.intentos;
    return nueva.tiempo < anterior.tiempo;
}

// la mejor partida del usuario con esa cantidad de pares, o undefined si
// no jugo ninguna. solo se comparan partidas con la misma cantidad de
// pares: 6 pares no se comparan con 3. reduce() recorre el array y se
// queda con "la mejor hasta ahora"
function mejorPartida(usuario, pares) {
    return usuario.partidas
        .filter(partida => partida.pares === pares)
        .reduce((mejor, partida) => (esMejorPartida(partida, mejor) ? partida : mejor), undefined);
}

// ============================================================
// FORMATOS PARA MOSTRAR
// ============================================================

// 75 -> "01:15". padStart(2, "0") completa con un 0 adelante si hace falta
function formatearTiempo(segundos) {
    const mm = String(Math.floor(segundos / 60)).padStart(2, "0");
    const ss = String(segundos % 60).padStart(2, "0");
    return `${mm}:${ss}`;
}

// "2026-09-25T14:32:10.000Z" -> "25/09/26, 9:32 a. m." (en hora local)
function formatearFecha(fechaIso) {
    return new Date(fechaIso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

// ============================================================
// EXPORTAR A usuarios.json
// ============================================================
// arma el archivo en memoria y lo descarga. despues hay que reemplazar el
// usuarios.json del proyecto a mano: la pagina no puede hacerlo sola.
//
// JSON.stringify(dato, null, 4): el 4 son los espacios de sangria, para
// que el archivo quede legible como el original y no en una sola linea.
// un Blob es un "archivo en memoria"; URL.createObjectURL le da una
// direccion temporal, y un <a download> invisible lo descarga
function descargarUsuariosJson(usuarios) {
    const texto = JSON.stringify(usuarios, null, 4) + "\n";
    const archivo = new Blob([texto], { type: "application/json" });
    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "usuarios.json";
    enlace.click();

    // la direccion temporal ocupa memoria hasta que se libera. se espera un
    // segundo: si se liberara en el acto, algunos navegadores cancelan la
    // descarga antes de que empiece
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
