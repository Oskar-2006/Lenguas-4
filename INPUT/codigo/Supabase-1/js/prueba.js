// Prueba mínima (sección 4.4 de la guía): al hacer clic, trae los productos
// de la tabla de práctica y muestra solo sus nombres en una lista
const botonTraer = document.getElementById("btn-traer");
const resultado = document.getElementById("resultado");

botonTraer.addEventListener("click", async () => {
  // la tabla compartida de la clase se llama "productos_practica", no
  // "productos": con el nombre equivocado Supabase responde que no existe
  // .order("id") los trae en el orden en que se insertaron (1, 2, 3):
  // sin él, la base los devuelve en el orden que le quede más cómodo
  const { data, error } = await clienteSupabase
    .from("productos_practica")
    .select("*")
    .order("id", { ascending: true });

  // primero se revisa el error: si la consulta falló, data llega en null y
  // data.map() rompería el script
  if (error) {
    resultado.textContent = "Error: " + error.message;
    return;
  }

  // Paso 5: map() se queda solo con el nombre de cada producto. no lleva
  // await porque ya no viaja a internet, solo transforma el array que llegó.
  // trim() quita espacios o tabulaciones que se colaron al copiar los nombres
  const nombres = data.map(producto => producto.nombre.trim());

  resultado.innerHTML = "<ul>" + nombres.map(nombre => `<li>${nombre}</li>`).join("") + "</ul>";
});
