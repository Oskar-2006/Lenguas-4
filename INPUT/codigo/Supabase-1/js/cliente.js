async function registrarCliente(nombre, correo, contrasena) {

  // db.auth.signUp() NO toca ninguna tabla tuya todavía — habla directo con
  // el sistema de autenticación interno de Supabase (algo así como una
  // tabla especial, auth.users, que tú no administras a mano). Le mandas
  // correo y contraseña, y Supabase por detrás: valida el formato del
  // correo, guarda la contraseña de forma segura (nunca en texto plano),
  // y crea un identificador único nuevo (un uuid) para esta persona.
  //
  // El resultado llega en dos partes, igual que en todas las llamadas a
  // Supabase que ya conoces (data / error):
  //   - data.user   → los datos del usuario recién creado. data.user.id
  //                   es el uuid real — EL MISMO que vamos a usar como id
  //                   en clientes, dos líneas más abajo.
  //   - data.session → si tu proyecto exige confirmar el correo antes de
  //                   dejar entrar (ver guía, sección 7), esto llega en
  //                   null: el usuario ya existe, pero todavía no hay
  //                   sesión iniciada hasta que confirme.
  const { data, error } = await db.auth.signUp({
    email: correo,
    password: contrasena,
  });

  // Mismo patrón de "revisar error antes de seguir" que ya usaste en el
  // CRUD de productos — si signUp() falló (correo repetido, contraseña
  // muy corta, etc.), ni siquiera intentamos el segundo paso.
  if (error) {
    console.log('Error al registrar:', error);
    return null;
  }

  // Ahora sí tocamos una tabla tuya: clientes. Este insert() es
  // igual al que ya usaste en agregarProducto() — la única diferencia es
  // que aquí SÍ mandamos el id a mano (data.user.id), en vez de dejar que
  // Supabase lo autogenere, porque este id tiene que coincidir exactamente
  // con el que Auth le acaba de asignar al usuario.
  const { data: cliente, error: errorCliente } = await db
    .from('clientes')
    .insert([{ id: data.user.id, nombre, correo, rol: 'cliente' }])
    .select();

  if (errorCliente) {
    console.log('Error al crear el perfil:', errorCliente);
    return null;
  }

  return cliente[0];
}

// 'submit' es el evento que dispara un <form> cuando alguien hace clic en
// su botón de tipo submit (o presiona Enter dentro de un campo). Por
// defecto, ese evento hace que el navegador RECARGUE la página entera —
// comportamiento heredado de cuando los formularios mandaban sus datos a
// otra página de servidor, décadas atrás. Como aquí todo lo manejamos con
// JavaScript (sin recargar nada), hay que apagar ese comportamiento a
// propósito.
document.getElementById('form-registro').addEventListener('submit', async (event) => {

  // event.preventDefault() le dice al navegador "no hagas lo que harías
  // normalmente con este evento" — en este caso, no recargues la página.
  // Sin esta línea, la página se refrescaría apenas se hiciera clic en
  // "Crear cuenta", y perderías cualquier mensaje que fueras a mostrar.
  event.preventDefault();

  // event.target es el elemento que disparó el evento — en un 'submit',
  // siempre es el propio <form>. Lo guardamos en una variable para poder
  // usarlo más abajo (form.reset()) sin tener que volver a buscarlo.
  const form = event.target;

  const cliente = await registrarCliente(
    document.getElementById('registro-nombre').value.trim(),
    document.getElementById('registro-correo').value.trim(),
    document.getElementById('registro-password').value
  );

  if (cliente) {
    document.getElementById('estado-sesion').textContent =
      'Cuenta creada. Ahora inicia sesión con ese correo y contraseña.';
    form.reset(); // vacía los 3 campos del formulario, para la próxima persona
  } else {
    document.getElementById('estado-sesion').textContent =
      'No se pudo crear la cuenta. Revisa la consola.';
  }
});

async function iniciarSesion(correo, contrasena) {

  // db.auth.signInWithPassword() es para alguien que YA se registró antes
  // (sección 4.1) — no crea ningún usuario nuevo, solo verifica que el
  // correo y la contraseña coincidan con uno que ya existe en Auth.
  //
  // Lo importante pasa "por detrás", sin que se vea en este código: si la
  // verificación sale bien, el cliente de Supabase (la variable db, la
  // misma de siempre) GUARDA la sesión internamente — normalmente en el
  // almacenamiento del navegador — y, desde este momento, la adjunta sola
  // a cada petición futura que hagas con db, sea a productos_practica, a
  // clientes o a cualquier otra tabla. No hay que "pasarle" el
  // usuario a mano a ninguna otra función.
  const { data, error } = await db.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });

  if (error) {
    console.log('Error al iniciar sesión:', error);
    return null;
  }

  // Aquí data.user también trae el id real del usuario — el mismo valor
  // que auth.uid() va a devolver dentro de cualquier política de RLS
  // mientras esta sesión siga activa.
  return data.user;
}

// Mismo patrón explicado en el formulario de registro: 'submit' es el
// evento del <form>, y hay que apagar la recarga automática de página.
document.getElementById('form-login').addEventListener('submit', async (event) => {
  event.preventDefault(); // evita que el navegador recargue la página
  const form = event.target; // el propio <form>, guardado para usar después

  const usuario = await iniciarSesion(
    document.getElementById('login-correo').value.trim(),
    document.getElementById('login-password').value
  );

  if (usuario) {
    form.reset();
    mostrarEstadoSesion(); // definida en la sección 5
  } else {
    document.getElementById('estado-sesion').textContent =
      'Correo o contraseña incorrectos.';
  }
});

async function mostrarEstadoSesion() {
  const { data } = await db.auth.getUser();
  const hayUsuario = Boolean(data.user);

  // Solo una de las dos vistas se ve a la vez
  document.getElementById('vista-acceso').hidden = hayUsuario;
  document.getElementById('vista-cliente').hidden = !hayUsuario;

  if (hayUsuario) {
    document.getElementById('saludo-cliente').textContent =
      `Sesión iniciada como ${data.user.email}`;
    mostrarSeccion('inicio');
  } else {
    document.getElementById('estado-sesion').textContent = 'No has iniciado sesión.';
    ocultarFormularioPerfil();
  }
}

// Muestra una sección del contenido principal y marca su botón en el aside.
function mostrarSeccion(nombre) {
  const esInicio = nombre === 'inicio';

  document.getElementById('seccion-inicio').hidden = !esInicio;
  document.getElementById('seccion-configuracion').hidden = esInicio;

  // toggle(clase, condicion) pone la clase si la condición es true y la quita si es false
  document.getElementById('btn-inicio').classList.toggle('activo', esInicio);
  document.getElementById('btn-configuracion').classList.toggle('activo', !esInicio);
}

async function leerCliente(id) {

  // Mismo patrón de buscarProductoPorId(): eq() filtra por el id y single()
  // devuelve la fila como objeto, no como array de un elemento. El id es
  // el mismo uuid de Auth que se guardó en clientes al registrarse.
  const { data, error } = await db
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.log('Error al leer el cliente:', error);
    return null;
  }

  return data;
}

async function actualizarCliente(id, cambios) {

  // Sin el eq(), update() intentaría cambiar TODAS las filas de la tabla.
  // select() pide que Supabase devuelva la fila ya actualizada.
  const { data, error } = await db
    .from('clientes')
    .update(cambios)
    .eq('id', id)
    .select();

  if (error) {
    console.log('Error al actualizar el cliente:', error);
    return null;
  }

  // Si RLS no deja actualizar la fila, Supabase NO devuelve error: responde
  // con un array vacío. Por eso hay que revisar este caso aparte.
  if (data.length === 0) {
    console.log('No se actualizó ninguna fila. Revisa la política de update en RLS.');
    return null;
  }

  return data[0];
}

async function mostrarFormularioPerfil(id) {
  const cliente = await leerCliente(id);

  if (!cliente) {
    document.getElementById('perfil-mensaje').textContent =
      'No se pudieron leer tus datos. Revisa la consola.';
    return;
  }

  // Primero se leen los datos y después se ponen en los campos. Por eso el
  // formulario se muestra al final: nunca se ve vacío.
  document.getElementById('perfil-nombre').value = cliente.nombre;
  // telefono y direccion pueden venir en null: || '' evita que se muestre "null"
  document.getElementById('perfil-telefono').value = cliente.telefono || '';
  document.getElementById('perfil-direccion').value = cliente.direccion || '';
  document.getElementById('perfil-correo').value = cliente.correo;
  document.getElementById('perfil-rol').value = cliente.rol;
  document.getElementById('perfil-mensaje').textContent = '';
  document.getElementById('form-perfil').hidden = false;
}

function ocultarFormularioPerfil() {
  const form = document.getElementById('form-perfil');
  form.hidden = true;
  form.reset(); // borra los datos del cliente anterior de los campos
}

document.getElementById('btn-inicio').addEventListener('click', () => {
  mostrarSeccion('inicio');
});

// Los datos se leen cada vez que se abre la configuración, no al iniciar
// sesión: así no se hace la consulta si el cliente nunca entra aquí.
document.getElementById('btn-configuracion').addEventListener('click', async () => {
  mostrarSeccion('configuracion');
  ocultarFormularioPerfil();
  document.getElementById('perfil-mensaje').textContent = '';

  const { data } = await db.auth.getUser();

  if (data.user) {
    mostrarFormularioPerfil(data.user.id);
  } else {
    mostrarEstadoSesion(); // la sesión ya terminó: vuelve a la vista de acceso
  }
});

document.getElementById('form-perfil').addEventListener('submit', async (event) => {
  event.preventDefault(); // evita que el navegador recargue la página
  const mensaje = document.getElementById('perfil-mensaje');

  // Volvemos a pedir el usuario para tomar el id de la sesión actual
  const { data } = await db.auth.getUser();

  if (!data.user) {
    mensaje.textContent = 'Tu sesión terminó. Inicia sesión de nuevo.';
    return;
  }

  // required no detecta un nombre hecho solo de espacios; el trim() sí
  const nombre = document.getElementById('perfil-nombre').value.trim();

  if (nombre === '') {
    mensaje.textContent = 'Escribe tu nombre.';
    return;
  }

  // Un campo vacío se guarda como null, igual que una fila que nunca lo tuvo
  const telefono = document.getElementById('perfil-telefono').value.trim() || null;
  const direccion = document.getElementById('perfil-direccion').value.trim() || null;

  // correo y rol no se mandan: no se tocan en este update
  const cliente = await actualizarCliente(data.user.id, { nombre, telefono, direccion });

  mensaje.textContent = cliente
    ? 'Datos actualizados.'
    : 'No se pudieron guardar los cambios. Revisa la consola.';
});

// Al cargar la página, revisa si ya había una sesión activa
mostrarEstadoSesion();

document.getElementById('btn-logout').addEventListener('click', async () => {
  await db.auth.signOut();
  mostrarEstadoSesion();
});