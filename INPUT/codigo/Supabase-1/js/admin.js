// ============================================================
// PANEL DE ADMINISTRADOR - Solo Juega
// ============================================================
// CRUD de la tabla "productos" (Create, Read, Update, Delete) más la
// lista de clientes. El código está en dos grupos:
//   1. Funciones de DATOS: solo hablan con Supabase, no tocan la página.
//   2. Funciones de PANTALLA: solo tocan el DOM, no hablan con Supabase.
// Así, si algo falla, sabemos si el problema está en la consulta o en
// cómo se dibuja. El cliente de Supabase se llama "db" (lo crea
// supabaseClient.js, que se carga antes que este archivo).

// Aquí guardamos el id del producto que se está editando. Si vale null,
// el formulario está en modo "agregar"; si tiene un número, en modo "editar".
let idEditando = null;


// ============================================================
// 1. FUNCIONES DE DATOS (solo Supabase)
// ============================================================

async function obtenerProductos() {
  // order('id') los trae ordenados por id, para que la lista no cambie de
  // orden después de editar un producto.
  const { data, error } = await db
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  // Revisamos "error" antes de usar "data": si la consulta falló, data
  // llega como null y usarlo rompería el script.
  if (error) {
    console.log('Error al obtener productos:', error);
    return null;
  }

  return data;
}

async function buscarProductoPorId(id) {
  const { data, error } = await db
    .from('productos')
    .select('*')
    .eq('id', id)
    .single(); // espero exactamente una fila, la quiero como objeto

  if (error) {
    console.log('Error al buscar por id:', error);
    return null;
  }

  return data;
}

async function buscarProductosPorNombre(texto) {
  // ilike no distingue mayúsculas de minúsculas, y los % significan
  // "cualquier texto antes y después".
  const { data, error } = await db
    .from('productos')
    .select('*')
    .ilike('nombre', `%${texto}%`)
    .order('id', { ascending: true });

  if (error) {
    console.log('Error al buscar por nombre:', error);
    return null;
  }

  return data;
}

async function agregarProducto(datos) {
  // insert() siempre recibe un ARRAY, aunque insertemos un solo producto.
  // select() pide que Supabase devuelva la fila ya creada con su id nuevo.
  const { data, error } = await db
    .from('productos')
    .insert([datos])
    .select();

  if (error) {
    console.log('Error al agregar:', error);
    return null;
  }

  return data[0];
}

async function modificarProducto(id, cambios) {
  // IMPORTANTE: eq('id', id) le dice a Supabase CUÁL fila cambiar. Sin el
  // eq(), update() se aplicaría a TODAS las filas de la tabla.
  const { data, error } = await db
    .from('productos')
    .update(cambios)
    .eq('id', id)
    .select();

  if (error) {
    console.log('Error al modificar:', error);
    return null;
  }

  // Si data llega vacío (array de 0 elementos), no hubo error pero tampoco
  // se actualizó nada: por ejemplo, si el id ya no existe. Lo tratamos
  // aparte para no decir "listo" cuando no cambió nada.
  if (data.length === 0) {
    console.log('No se actualizó ninguna fila con el id', id);
    return null;
  }

  return data[0];
}

async function eliminarProducto(id) {
  // Igual que en update: sin eq() se borrarían TODAS las filas.
  // select() devuelve la fila borrada, así podemos comprobar que existía.
  const { data, error } = await db
    .from('productos')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    console.log('Error al eliminar:', error);
    return false;
  }

  return data.length > 0;
}

async function obtenerClientes() {
  const { data, error } = await db.from('clientes').select('*');

  if (error) {
    console.log('Error al obtener clientes:', error);
    return null;
  }

  return data;
}


// ============================================================
// 2. FUNCIONES DE PANTALLA (solo DOM)
// ============================================================

const mensajeEstado = document.getElementById('mensaje-estado');
const listaProductos = document.getElementById('lista-productos');
const formProducto = document.getElementById('form-producto');

// Muestra un mensaje arriba de la página. Si esError es true se pinta
// en rojo (la clase "error" está en admin.css).
function mostrarMensaje(texto, esError = false) {
  mensajeEstado.textContent = texto;
  mensajeEstado.classList.toggle('error', esError);
}

// Dibuja una lista de productos. Usamos textContent y createElement (no
// innerHTML) para que lo que viene de la base se muestre como texto y
// nunca se interprete como HTML.
function mostrarProductos(lista) {
  listaProductos.replaceChildren();

  if (lista.length === 0) {
    listaProductos.textContent = 'No hay productos para mostrar.';
    return;
  }

  lista.forEach((producto) => {
    const fila = document.createElement('article');
    fila.className = 'producto';

    // La imagen solo se crea si el producto tiene image_url
    if (producto.image_url) {
      const imagen = document.createElement('img');
      imagen.className = 'producto-imagen';
      imagen.src = producto.image_url;
      imagen.alt = producto.nombre;
      fila.appendChild(imagen);
    }

    const info = document.createElement('div');
    info.className = 'producto-info';

    const nombre = document.createElement('h4');
    nombre.className = 'producto-nombre';
    nombre.textContent = `#${producto.id} - ${producto.nombre}`;

    const precio = document.createElement('span');
    precio.className = 'etiqueta-precio';
    // toLocaleString('es-CO') pone los puntos de miles: 680000 -> 680.000
    precio.textContent = `$${producto.precio.toLocaleString('es-CO')}`;

    // categorias puede venir null, por eso el "|| []"
    const categorias = (producto.categorias || []).join(', ');
    const datos = document.createElement('p');
    datos.className = 'producto-datos';
    datos.textContent =
      `Unidades: ${producto.unidades} | Descuento: ${producto.descuento}% | ` +
      `Plataforma: ${producto.plataforma || 'sin definir'} | ` +
      `${producto.disponible ? 'Disponible' : 'No disponible'} | ` +
      `Categorías: ${categorias || 'ninguna'}`;

    const botones = document.createElement('div');
    botones.className = 'producto-botones';

    const botonEditar = document.createElement('button');
    botonEditar.type = 'button';
    botonEditar.textContent = 'Editar';
    botonEditar.addEventListener('click', () => llenarFormulario(producto));

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'peligro';
    botonEliminar.textContent = 'Eliminar';
    botonEliminar.addEventListener('click', () => borrarDesdePantalla(producto));

    botones.append(botonEditar, botonEliminar);
    info.append(nombre, precio, datos, botones);
    fila.appendChild(info);
    listaProductos.appendChild(fila);
  });
}

// Pide los productos a Supabase y los dibuja. La llamamos al cargar la
// página y después de cada cambio.
async function recargarLista() {
  const productos = await obtenerProductos();

  if (!productos) {
    listaProductos.textContent = 'No se pudo cargar la lista de productos.';
    mostrarMensaje('Error al cargar los productos. Revisa la consola.', true);
    return;
  }

  mostrarProductos(productos);
}

// Pasa el formulario a modo "editar" con los datos del producto elegido.
function llenarFormulario(producto) {
  idEditando = producto.id;

  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('descripcion').value = producto.descripcion || '';
  document.getElementById('precio').value = producto.precio;
  document.getElementById('unidades').value = producto.unidades;
  document.getElementById('descuento').value = producto.descuento;
  document.getElementById('plataforma').value = producto.plataforma || '';
  // categorias es un array: join lo vuelve el texto "sillas, pc"
  document.getElementById('categorias').value = (producto.categorias || []).join(', ');
  document.getElementById('image_url').value = producto.image_url || '';
  document.getElementById('disponible').checked = producto.disponible;

  document.getElementById('titulo-formulario').textContent = 'Editar producto #' + producto.id;
  document.getElementById('btn-guardar').textContent = 'Guardar cambios';
  document.getElementById('btn-cancelar').hidden = false;

  // Sube la página al formulario para que se vea que se está editando
  formProducto.scrollIntoView({ behavior: 'smooth' });
}

// Vuelve el formulario a modo "agregar" y lo vacía.
function salirDeEdicion() {
  idEditando = null;
  formProducto.reset();
  document.getElementById('titulo-formulario').textContent = 'Agregar producto';
  document.getElementById('btn-guardar').textContent = 'Agregar producto';
  document.getElementById('btn-cancelar').hidden = true;
}

// Lee los campos del formulario y arma el objeto con la misma forma que
// las columnas de la tabla productos.
function leerFormulario() {
  const plataforma = document.getElementById('plataforma').value;
  const imagen = document.getElementById('image_url').value.trim();

  return {
    nombre: document.getElementById('nombre').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim(),

    // .value siempre es texto; las columnas son numéricas, por eso Number()
    precio: Number(document.getElementById('precio').value),
    unidades: Number(document.getElementById('unidades').value),
    descuento: Number(document.getElementById('descuento').value),

    // el checkbox usa .checked (true / false), no .value
    disponible: document.getElementById('disponible').checked,

    // "sillas, pc" -> ["sillas", "pc"]: split parte por comas, trim quita
    // espacios y filter descarta los textos vacíos
    categorias: document.getElementById('categorias').value
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c !== ''),

    // La columna plataforma solo acepta PC, Consola, Ambas o null.
    // Si el select está en "Sin definir" mandamos null, no un texto vacío.
    plataforma: plataforma === '' ? null : plataforma,

    image_url: imagen === '' ? null : imagen
  };
}

// Pide confirmación, elimina y actualiza la pantalla.
async function borrarDesdePantalla(producto) {
  // confirm() abre un cuadro con Aceptar / Cancelar y devuelve true o false
  const seguro = confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`);
  if (!seguro) return;

  const seElimino = await eliminarProducto(producto.id);

  if (seElimino) {
    mostrarMensaje(`Producto "${producto.nombre}" eliminado.`);
    // Si justo se estaba editando ese producto, salimos de la edición
    if (idEditando === producto.id) salirDeEdicion();
    recargarLista();
  } else {
    mostrarMensaje('No se pudo eliminar el producto. Revisa la consola.', true);
  }
}


// ============================================================
// 3. EVENTOS (conectan la pantalla con los datos)
// ============================================================

// Un solo formulario sirve para agregar y para editar: según idEditando
// decidimos cuál función de datos llamar.
formProducto.addEventListener('submit', async (evento) => {
  // Sin esto el navegador recargaría la página al enviar el formulario
  evento.preventDefault();

  const datos = leerFormulario();

  if (idEditando === null) {
    const creado = await agregarProducto(datos);

    if (creado) {
      mostrarMensaje(`Producto "${creado.nombre}" agregado con el id ${creado.id}.`);
      formProducto.reset(); // solo limpiamos si salió bien, para no perder lo escrito
      recargarLista();
    } else {
      mostrarMensaje('No se pudo agregar el producto. Revisa la consola.', true);
    }
  } else {
    const modificado = await modificarProducto(idEditando, datos);

    if (modificado) {
      mostrarMensaje(`Producto "${modificado.nombre}" actualizado.`);
      salirDeEdicion();
      recargarLista();
    } else {
      mostrarMensaje('No se actualizó ningún producto. Revisa la consola.', true);
    }
  }
});

document.getElementById('btn-cancelar').addEventListener('click', () => {
  salirDeEdicion();
  mostrarMensaje('Edición cancelada.');
});

// Buscar por id: devuelve UN producto o null
document.getElementById('form-buscar-id').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const id = Number(document.getElementById('buscar-id').value);
  if (!Number.isInteger(id) || id < 1) {
    mostrarMensaje('Escribe un id válido (número entero).', true);
    return;
  }

  const producto = await buscarProductoPorId(id);

  // mostrarProductos espera un array, por eso envolvemos el objeto en [ ]
  if (producto) {
    mostrarProductos([producto]);
    mostrarMensaje(`Resultado de la búsqueda del id ${id}.`);
  } else {
    mostrarMensaje(`No se encontró un producto con el id ${id}.`, true);
  }
});

// Buscar por nombre: devuelve un ARRAY (puede ser vacío)
document.getElementById('form-buscar-nombre').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const texto = document.getElementById('buscar-nombre').value.trim();
  if (texto === '') {
    mostrarMensaje('Escribe parte del nombre.', true);
    return;
  }

  const productos = await buscarProductosPorNombre(texto);

  if (productos) {
    mostrarProductos(productos);
    mostrarMensaje(`${productos.length} producto(s) encontrado(s) con "${texto}".`);
  } else {
    mostrarMensaje('Error al buscar. Revisa la consola.', true);
  }
});

// Vuelve a mostrar todos los productos después de una búsqueda
document.getElementById('btn-ver-todos').addEventListener('click', () => {
  recargarLista();
  mostrarMensaje('Mostrando todos los productos.');
});

// ---- Mis clientes ----
document.getElementById('btn-ver-clientes').addEventListener('click', async () => {
  const clientes = await obtenerClientes();
  const lista = document.getElementById('lista-clientes');

  if (!clientes) {
    lista.textContent = 'No se pudo cargar la lista.';
    return;
  }

  // map() crea un <li> por cada cliente y replaceChildren() reemplaza todo
  // lo que había en la lista por esos <li>. textContent evita interpretar
  // como HTML lo que venga de la base.
  lista.replaceChildren(...clientes.map((cliente) => {
    const item = document.createElement('li');
    item.textContent = `${cliente.nombre} — ${cliente.correo} (${cliente.rol})`;
    return item;
  }));
});

// ---- Aside: cambiar entre Productos y Mis clientes ----
function mostrarSeccion(nombre) {
  const esProductos = nombre === 'productos';

  document.getElementById('seccion-productos').hidden = !esProductos;
  document.getElementById('seccion-clientes').hidden = esProductos;

  // toggle(clase, condicion) pone la clase si es true y la quita si es false
  document.getElementById('btn-productos').classList.toggle('activo', esProductos);
  document.getElementById('btn-clientes').classList.toggle('activo', !esProductos);
}

document.getElementById('btn-productos').addEventListener('click', () => mostrarSeccion('productos'));
document.getElementById('btn-clientes').addEventListener('click', () => mostrarSeccion('clientes'));

// Al cargar la página, mostramos la lista de productos
recargarLista();
