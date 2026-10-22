// ============================================================
// ACCESO A DATOS: HEROES EN SUPABASE
// ============================================================
// reemplaza a storage.js. antes los heroes vivian en localStorage, o sea
// en el navegador de cada computador: si se creaba un heroe en la casa, no
// aparecia en el laboratorio. ahora viven en una tabla de Supabase, en un
// servidor, y cualquier computador que se conecte ve lo mismo.
//
// este archivo SOLO habla con Supabase, no toca el HTML. las paginas
// (index.js, gestion.js, memory.js) llaman a estas funciones.
//
// el cambio grande frente a localStorage: leer o escribir en localStorage
// era instantaneo. una consulta a Supabase viaja por internet y tarda, asi
// que todas las funciones de aca son "async" y se llaman con "await".
//
// se carga DESPUES del CDN de Supabase, supabaseClient.js (crea "db") y
// data.js (sus 10 heroes se usan para restablecer la tabla).

const TABLA_HEROES = "heroes";
const BUCKET_IMAGENES = "heroes";

// el array con el que trabajan las paginas. arranca vacio y lo llena
// cargarHeroes(). es "const" porque la variable siempre apunta al mismo
// array: lo que cambia es lo que tiene adentro
const listaHeroes = [];

// ============================================================
// READ: traer todos
// ============================================================
// .order("orden") los devuelve en el orden de la lista. una tabla no tiene
// orden propio (en el array era la posicion), por eso existe esa columna
async function cargarHeroes() {
    const { data, error } = await db
        .from(TABLA_HEROES)
        .select("*")
        .order("orden", { ascending: true })
        .order("id", { ascending: true });

    if (error) {
        throw error;
    }

    // splice(0, largo, ...data) vacia el array y lo llena con lo que llego,
    // sin crear un array nuevo: asi "listaHeroes" sigue siendo el mismo
    listaHeroes.splice(0, listaHeroes.length, ...data);
    return listaHeroes;
}

// la carga empieza apenas se lee este archivo. "heroesListos" es la PROMESA
// de esa carga: cada pagina hace "await heroesListos" antes de dibujar,
// para no pintar una lista que todavia esta vacia
const heroesListos = cargarHeroes();

// ============================================================
// CREATE
// ============================================================
// insert() siempre recibe un ARRAY de objetos, aunque sea uno solo.
// .select() pide que devuelva la fila creada: sin el, no llega el id que
// le puso la base de datos. el id ya no lo asignamos nosotros
async function insertarHeroe(heroe) {
    const { data, error } = await db
        .from(TABLA_HEROES)
        .insert([heroe])
        .select();

    if (error) {
        console.error("Error al agregar:", error);
        return null;
    }

    return data[0];
}

// ============================================================
// READ: buscar
// ============================================================
// .eq() = "igual a", el equivalente de find(heroe => heroe.id === id).
// .single() devuelve el objeto suelto en vez de un array de uno
async function buscarHeroePorId(id) {
    const { data, error } = await db
        .from(TABLA_HEROES)
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return null;
    }

    return data;
}

// busca el texto en nombre, universo o bando, sin distinguir mayusculas.
// es el mismo filter() + includes() de antes, pero ahora lo hace el
// servidor: ilike es "contiene, sin importar mayusculas" y los % significan
// "cualquier texto antes o despues". .or() pide que se cumpla al menos uno.
// las comas y los parentesis se sacan del texto porque .or() los usa para
// separar condiciones
async function buscarHeroes(texto) {
    const limpio = texto.trim().replace(/[,()]/g, "");

    let consulta = db
        .from(TABLA_HEROES)
        .select("*")
        .order("orden", { ascending: true });

    if (limpio !== "") {
        consulta = consulta.or(
            `nombre.ilike.%${limpio}%,universo.ilike.%${limpio}%,bando.ilike.%${limpio}%`
        );
    }

    const { data, error } = await consulta;

    if (error) {
        console.error("Error al buscar:", error);
        return [];
    }

    return data;
}

// ============================================================
// UPDATE
// ============================================================
// antes eran dos pasos (findIndex para encontrar la posicion y despues
// reemplazar). Supabase lo hace en una instruccion: "actualiza estos
// campos donde el id sea este". solo cambia lo que venga en "cambios"
async function actualizarHeroe(id, cambios) {
    const { data, error } = await db
        .from(TABLA_HEROES)
        .update(cambios)
        .eq("id", id)
        .select();

    if (error) {
        console.error("Error al actualizar:", error);
        return null;
    }

    return data[0];
}

// ============================================================
// DELETE
// ============================================================
// ya no hace falta splice() ni preocuparse por correr posiciones: la base
// borra la fila con ese id y las demas quedan igual
async function borrarHeroe(id) {
    const { error } = await db
        .from(TABLA_HEROES)
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error al eliminar:", error);
    }

    // true si NO hubo error
    return !error;
}

// ============================================================
// ORDEN DE LA LISTA
// ============================================================
// despues de mover, insertar en un puesto o borrar, la posicion de cada
// heroe en el array ya es la correcta. esto copia esa posicion a la
// columna "orden", pero solo en los que cambiaron: no tiene sentido
// mandarle a la base 10 actualizaciones si solo se movio uno
async function guardarOrden(lista) {
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].orden === i) {
            continue;
        }

        const { error } = await db
            .from(TABLA_HEROES)
            .update({ orden: i })
            .eq("id", lista[i].id);

        if (error) {
            console.error("Error al guardar el orden:", error);
            return false;
        }

        lista[i].orden = i;
    }

    return true;
}

// ============================================================
// IMAGENES EN STORAGE
// ============================================================
// antes la imagen se guardaba como TEXTO (base64) dentro de localStorage,
// que tiene un limite de 5 MB. ahora se sube como archivo al bucket
// "heroes" y en la tabla solo se guarda su URL publica.
// el nombre del archivo usa la fecha en milisegundos para que dos imagenes
// nunca se llamen igual
async function subirImagen(archivo) {
    const extension = archivo.type === "image/png" ? "png" : "webp";
    const ruta = `${Date.now()}.${extension}`;

    const { error } = await db.storage
        .from(BUCKET_IMAGENES)
        .upload(ruta, archivo, { contentType: archivo.type });

    if (error) {
        console.error("Error al subir la imagen:", error);
        return null;
    }

    // getPublicUrl no viaja a internet: solo arma la direccion, por eso no
    // lleva await
    const { data } = db.storage.from(BUCKET_IMAGENES).getPublicUrl(ruta);
    return data.publicUrl;
}

// ============================================================
// RESTABLECER
// ============================================================
// borra todas las filas y vuelve a cargar los 10 heroes de data.js.
// Supabase no deja hacer delete() sin ningun filtro (es una proteccion
// contra borrar una tabla entera por error), por eso el .gte("id", 0):
// "donde el id sea mayor o igual a 0", que son todas
async function restablecerHeroes() {
    const borrado = await db.from(TABLA_HEROES).delete().gte("id", 0);

    if (borrado.error) {
        console.error("Error al restablecer:", borrado.error);
        return false;
    }

    // map() arma una copia de cada heroe con su posicion como "orden"
    const iniciales = heroes.map((heroe, indice) => ({ ...heroe, orden: indice }));
    const insertado = await db.from(TABLA_HEROES).insert(iniciales);

    if (insertado.error) {
        console.error("Error al restablecer:", insertado.error);
        return false;
    }

    return true;
}
