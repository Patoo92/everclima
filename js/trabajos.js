// ============================================================
// EVERCLIMA — filtro de la página de Trabajos Realizados
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const botones = document.querySelectorAll('.filtro-boton');
  const items = document.querySelectorAll('.item-trabajo');
  const avisoVacio = document.querySelector('.aviso-vacio');

  if (!botones.length || !items.length) return;

  function aplicarFiltro(categoria) {
    let visibles = 0;
    items.forEach(item => {
      const coincide = categoria === 'todos' || item.dataset.categoria === categoria;
      item.classList.toggle('oculto', !coincide);
      if (coincide) visibles++;
    });

    botones.forEach(b => b.classList.toggle('activo', b.dataset.categoria === categoria));

    if (avisoVacio) {
      avisoVacio.style.display = visibles === 0 ? 'block' : 'none';
    }
  }

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      aplicarFiltro(boton.dataset.categoria);
      // Refleja el filtro en la URL sin recargar, para poder compartir el enlace directo
      const url = new URL(window.location);
      if (boton.dataset.categoria === 'todos') {
        url.searchParams.delete('cat');
      } else {
        url.searchParams.set('cat', boton.dataset.categoria);
      }
      window.history.replaceState({}, '', url);
    });
  });

  // Al cargar la página, respeta ?cat=... si viene en la URL (ej: desde el submenú)
  const params = new URLSearchParams(window.location.search);
  const catInicial = params.get('cat');
  const categoriasValidas = Array.from(botones).map(b => b.dataset.categoria);

  if (catInicial && categoriasValidas.includes(catInicial)) {
    aplicarFiltro(catInicial);
  } else {
    aplicarFiltro('todos');
  }
});
