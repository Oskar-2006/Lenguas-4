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
  const { data, error } = await clienteSupabase.from('productos_practica').select('*');

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

    const { data, error } = await clienteSupabase
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

    document.getElementById('btn-agregar-obj').addEventListener('click', async () => {
    const notificacion = await agregarProducto(productoPrueba);
    if (notificacion) {
        document.getElementById('notificacion').innerText = 'Producto agregado: ' + JSON.stringify(notificacion, null, 2);
    } else {
        document.getElementById('notificacion').innerText = 'Error al agregar producto.';
    }

});

