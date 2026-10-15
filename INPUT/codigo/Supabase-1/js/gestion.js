// Lógica de la interfaz: conecta el formulario y la lista con datos.js
const formulario = document.getElementById("formulario-tarea");
const campoTitulo = document.getElementById("titulo-tarea");
const listaTareas = document.getElementById("lista-tareas");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
}

function pintarTareas(tareas) {
  listaTareas.innerHTML = "";

  tareas.forEach((tarea) => {
    const item = document.createElement("li");
    item.textContent = tarea.titulo;

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.addEventListener("click", () => manejarEliminar(tarea.id));

    item.appendChild(botonEliminar);
    listaTareas.appendChild(item);
  });
}

async function cargarTareas() {
  try {
    pintarTareas(await obtenerTareas());
    mostrarMensaje("");
  } catch (error) {
    mostrarMensaje("No se pudieron cargar las tareas: " + error.message);
  }
}

async function manejarEliminar(id) {
  try {
    await eliminarTarea(id);
    await cargarTareas();
  } catch (error) {
    mostrarMensaje("No se pudo eliminar: " + error.message);
  }
}

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  try {
    await insertarTarea(campoTitulo.value.trim());
    formulario.reset();
    await cargarTareas();
  } catch (error) {
    mostrarMensaje("No se pudo guardar: " + error.message);
  }
});

cargarTareas();
