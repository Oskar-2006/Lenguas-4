// Catálogo público: solo lee productos, no necesita sesión.
async function loadCatalog() {
  const list = document.getElementById('lista-productos');
  const message = document.getElementById('mensaje-productos');

  const { data, error } = await db.from('productos_practica').select('*');

  if (error) {
    console.log('Error al cargar productos:', error);
    message.textContent = 'No se pudieron cargar los productos.';
    return;
  }

  if (data.length === 0) {
    message.textContent = 'No hay productos disponibles.';
    return;
  }

  data.forEach((producto) => {
    const card = document.createElement('div');
    card.className = 'producto-card';

    if (producto.image_url) {
      const img = document.createElement('img');
      img.className = 'producto-imagen';
      img.src = producto.image_url;
      img.alt = producto.nombre || 'Producto';
      card.appendChild(img);
    }

    const content = document.createElement('div');
    content.className = 'producto-contenido';

    const title = document.createElement('h4');
    title.textContent = producto.nombre || 'Sin nombre';

    const description = document.createElement('p');
    description.textContent = producto.descripcion || 'Sin descripción';

    const price = document.createElement('div');
    price.className = 'producto-precio';
    price.textContent = `$${producto.precio || '0.00'}`;

    content.append(title, description, price);
    card.appendChild(content);
    list.appendChild(card);
  });
}

document.getElementById('btn-acceso').addEventListener('click', () => {
  window.location.href = 'cliente.html';
});

loadCatalog();
