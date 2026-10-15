// Acceso a datos: solo habla con Supabase, no toca el DOM.
// Tabla esperada: tareas (id, titulo, creada_en)
const TABLA_TAREAS = "tareas";

async function obtenerTareas() {
  const { data, error } = await clienteSupabase
    .from(TABLA_TAREAS)
    .select("*")
    .order("creada_en", { ascending: false });

  if (error) throw error;
  return data;
}

async function insertarTarea(titulo) {
  const { data, error } = await clienteSupabase
    .from(TABLA_TAREAS)
    .insert({ titulo })
    .select()
    .single();

  if (error) throw error;
  return data;
}

async function eliminarTarea(id) {
  const { error } = await clienteSupabase
    .from(TABLA_TAREAS)
    .delete()
    .eq("id", id);

  if (error) throw error;
}
