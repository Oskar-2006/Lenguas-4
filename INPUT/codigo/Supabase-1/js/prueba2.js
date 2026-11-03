document.getElementById('btn-traer').addEventListener('click', async () => {

  // "async" convierte esta función (el listener del clic) en una función
  // ASÍNCRONA: una función que PUEDE usar "await" adentro para esperar
  // algo que tarda, sin congelar el resto de la página mientras espera.
  //
  // Diferencia clave con localStorage (semana 7): localStorage.getItem()
  // y localStorage.setItem() son operaciones SINCRÓNICAS — ocurren al
  // instante, en tu propio computador, sin viajar a ningún lado. Por eso
  // nunca necesitaste "async"/"await" para leer o escribir en
  // localStorage. Una consulta a Supabase, en cambio, viaja por internet
  // hasta el servidor de Supabase y la respuesta tiene que volver — eso
  // toma un tiempo real (aunque sea poco), y JavaScript necesita una
  // forma explícita de decir "espera aquí a que llegue la respuesta".

  // "await" pausa la ejecución DE ESTA FUNCIÓN (no de toda la página)
  // hasta que la consulta a Supabase responda. Mientras tanto, el resto
  // de tu página sigue funcionando con normalidad — solo esta función
  // en particular se detiene en esta línea hasta tener respuesta real.
  const { data, error } = await db.from('productos_practica').select('*');

  // Sin "await" en la línea de arriba, "data" y "error" NO tendrían el
  // resultado todavía — tendrías una "Promise" (promesa) sin resolver,
  // no los datos reales. Eso es justo lo que "await" evita: te obliga
  // a esperar antes de seguir usando el resultado.
  console.log(data, error);



    if (error) {
    // Revisamos "error" ANTES de tocar "data": si la consulta falló,
    // "data" llega como null, y usar null más adelante (ej. null.map())
    // rompería el script. Mismo patrón de "validar antes de operar"
    // que ya usaste en el CRUD de la semana 7.
    document.getElementById('resultado').innerText = 'Error al traer productos: ' + error.message; return;
  }
  else {
    document.getElementById('resultado').textContent = JSON.stringify(data, null, 2);
  }


  const nombres = data.map(producto => producto.nombre);
  // nombres es ahora un array de solo strings:
  // ["Audífonos Bluetooth X200", "Camiseta Básica Algodón", "Silla Gamer ProMax"]
  // — ya no objetos completos

  document.getElementById('resultado2').innerHTML =
    '<ul>' + nombres.map(n => `<li>${n}</li>`).join('') + '</ul>';

  const precios = data.map(producto => producto.precio);
  document.getElementById('precio').innerHTML = '<p>Precios: ' + precios.join(', ') + '</p>';

  const categorias = data.map(producto => producto.categorias);
  document.getElementById('categoria').innerHTML = '<p>Categorías: ' + categorias.join(', ') + '</p>';

  const descripciones = data.map(producto => producto.descripcion);
  document.getElementById('descripcion').innerHTML = '<p>Descripciones: ' + descripciones.join('<br>') + '</p>';

    });

 //crud 

  const  productoPrueba = {
    nombre: 'Camiseta Básica sin algodon pero todo lo demas igual',
    descripcion: 'Camiseta unisex 100% sin algodón, varios colores',
    precio: 45000,
    unidades: 120,
    descuento: 0,
    disponible: true,
    categorias:  ["ropa", "básicos"],
    image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80',
    };

    // AHORA (Supabase):
    async function agregarProducto(datos) {

    const { data, error } = await db
        .from('productos_practica')  // la tabla
        .insert([datos])             // insert() siempre recibe un ARRAY de objetos,
                                    // aunque insertes uno solo
        .select();                    // .select() le pide a Supabase que te
                                    // devuelva la fila ya creada (con su id
                                    // nuevo) — sin esto, insert() no te
                                    // devuelve nada útil

    if (error) {
        console.log("Error al agregar:", error);
        return null;
    }

    return data[0];   // data siempre es un array — tomamos el primer
                        // elemento, que es la fila recién creada
    }

    // ---- FORMULARIO: reemplaza al objeto fijo productoPrueba ----
    // productoPrueba arriba queda como REFERENCIA de la forma que debe tener
    // el objeto. Ahora ese objeto se arma con lo que el usuario escribe.

    const formProducto = document.getElementById('form-producto');

    // Escuchamos "submit" (no "click") porque el botón "Agregar producto"
    // es type="submit": al presionarlo, el navegador primero valida los
    // campos "required" y, si todo está bien, dispara este evento.
    formProducto.addEventListener('submit', async (evento) => {

        // Por defecto, un formulario recarga la página al enviarse; eso
        // borraría la notificación y no daría tiempo al await. Lo evitamos.
        evento.preventDefault();

        // Armamos el objeto con la MISMA forma que productoPrueba:
        // mismas claves = mismas columnas de la tabla en Supabase.
        const nuevoProducto = {
            nombre: document.getElementById('nombre').value.trim(),
            descripcion: document.getElementById('descripcion-input').value.trim(),

            // .value de un input siempre es TEXTO ("45000"), pero la columna
            // es numérica: lo convertimos con Number() antes de enviarlo.
            precio: Number(document.getElementById('precio-input').value),
            unidades: Number(document.getElementById('unidades').value),
            descuento: Number(document.getElementById('descuento').value),

            // Un checkbox no usa .value sino .checked (true / false).
            disponible: document.getElementById('disponible').checked,

            // La columna "categorias" es un ARRAY. El usuario escribe
            // "ropa, básicos": split(',') lo parte en ["ropa", " básicos"],
            // trim() quita espacios sobrantes y filter() descarta vacíos.
            categorias: document.getElementById('categorias').value
                .split(',')
                .map(c => c.trim())
                .filter(c => c !== ''),

            image_url: document.getElementById('image_url').value.trim()
        };

        // Reutilizamos agregarProducto() de arriba: hace el insert en
        // Supabase y devuelve la fila creada (o null si hubo error).
        const notificacion = await agregarProducto(nuevoProducto);

        if (notificacion) {
            document.getElementById('notificacion').innerText = 'Producto agregado: ' + JSON.stringify(notificacion, null, 2);
            // Solo limpiamos el formulario si el guardado salió bien,
            // para no perder lo escrito cuando hay un error.
            formProducto.reset();
        } else {
            document.getElementById('notificacion').innerText = 'Error al agregar producto.';
        }
    });

// ---- BUSCADOR ----
// Nota: el cliente se llama "db" (lo crea supabaseClient.js).

async function buscarProductoPorId(id) {
  const { data, error } = await db
    .from('productos_practica')
    .select('*')
    .eq('id', id)    // eq = "equal" (igual a) — equivalente a find(p => p.id === id)
    .single();         // single() = "espero exactamente una fila, dámela
                        // como objeto, no como array de un elemento"

  if (error) return null;
  return data;
}

async function buscarProductosPorNombre(texto) {
  const { data, error } = await db
    .from('productos_practica')
    .select('*')
    .ilike('nombre', `%${texto}%`);
    // ilike = "like" insensible a mayúsculas/minúsculas.
    // los símbolos % significan "cualquier texto antes/después" —
    // equivalente a .toLowerCase().includes(texto)

  if (error) return [];
  return data;
}

// ---- CONECTAR EL BUSCADOR CON LA PAGINA ----

const resultadoBusqueda = document.getElementById('resultado-busqueda');

// Dibuja una lista de productos en #resultado-busqueda.
// Usamos textContent (no innerHTML) para que lo que venga de la base de
// datos se muestre como texto y nunca se interprete como HTML.
function mostrarProductos(lista) {
  resultadoBusqueda.textContent = '';

  if (lista.length === 0) {
    resultadoBusqueda.textContent = 'No se encontraron productos.';
    return;
  }

  lista.forEach(producto => {
    const tarjeta = document.createElement('div');
    tarjeta.textContent =
      `#${producto.id} - ${producto.nombre} | $${producto.precio} | ` +
      `Unidades: ${producto.unidades} | Categorías: ${(producto.categorias || []).join(', ')} | ` +
      producto.descripcion;
    resultadoBusqueda.appendChild(tarjeta);
  });
}

// Buscar por ID: devuelve UN producto (o null si no existe).
document.getElementById('form-buscar-id').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  // .value es texto: lo pasamos a numero y verificamos que sea entero.
  const id = Number(document.getElementById('buscar-id').value);
  if (!Number.isInteger(id) || id < 1) {
    resultadoBusqueda.textContent = 'Escribe un ID válido (número entero).';
    return;
  }

  const producto = await buscarProductoPorId(id);

  // buscarProductoPorId devuelve un objeto o null; mostrarProductos
  // espera un array, asi que lo envolvemos en una lista.
  if (producto) {
    mostrarProductos([producto]);
  } else {
    resultadoBusqueda.textContent = 'No se encontró un producto con el ID ' + id + '.';
  }
});

// Buscar por nombre: devuelve un ARRAY (puede traer varios o ninguno).
document.getElementById('form-buscar-nombre').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const texto = document.getElementById('buscar-nombre').value.trim();
  if (texto === '') {
    resultadoBusqueda.textContent = 'Escribe parte del nombre.';
    return;
  }

  mostrarProductos(await buscarProductosPorNombre(texto));
});