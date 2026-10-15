// Prueba mínima: al hacer clic, trae los productos y los muestra en pantalla
const botonTraer = document.getElementById("btn-traer");
const resultado = document.getElementById("resultado");

botonTraer.addEventListener("click", async () => {
  const { data, error } = await clienteSupabase.from("productos").select("*");

  if (error) {
    resultado.textContent = "Error: " + error.message;
    return;
  }

  resultado.textContent = JSON.stringify(data, null, 2);
  console.log(data);
});
