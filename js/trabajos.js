// ============================================================
// EVERCLIMA — filtro de la página de Trabajos Realizados
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.querySelector('.filtro-selector');
  const disparador = document.querySelector('.filtro-boton');
  const rotulo = document.querySelector('.filtro-rotulo');
  const opciones = document.querySelectorAll('.filtro-opcion');
  const items = document.querySelectorAll('.item-trabajo');
  const avisoVacio = document.querySelector('.aviso-vacio');

  if (!selector || !disparador || !opciones.length || !items.length) return;

  function cerrar() {
    selector.classList.remove('abierto');
    disparador.setAttribute('aria-expanded', 'false');
  }

  function aplicarFiltro(categoria) {
    let visibles = 0;
    items.forEach(item => {
      const coincide = categoria === 'todos' || item.dataset.categoria === categoria;
      item.classList.toggle('oculto', !coincide);
      if (coincide) visibles++;
    });

    opciones.forEach(op => op.classList.toggle('activo', op.dataset.categoria === categoria));

    const opActiva = Array.from(opciones).find(op => op.dataset.categoria === categoria);
    if (opActiva && rotulo) {
      const nombre = opActiva.querySelector('.filtro-opcion-nombre');
      rotulo.textContent = nombre ? nombre.textContent : opActiva.textContent.replace(/\(\d+\)/g, '').trim();
    }

    if (avisoVacio) {
      avisoVacio.style.display = visibles === 0 ? 'block' : 'none';
    }

    // Refleja el filtro en la URL sin recargar, para poder compartir el enlace directo
    const url = new URL(window.location);
    if (categoria === 'todos') {
      url.searchParams.delete('cat');
    } else {
      url.searchParams.set('cat', categoria);
    }
    window.history.replaceState({}, '', url);

    cerrar();
  }

  disparador.addEventListener('click', (e) => {
    e.stopPropagation();
    const abierto = selector.classList.toggle('abierto');
    disparador.setAttribute('aria-expanded', String(abierto));
  });

  opciones.forEach(op => {
    op.addEventListener('click', () => aplicarFiltro(op.dataset.categoria));
  });

  // Cierra al hacer clic fuera o con Escape
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) cerrar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrar();
  });

  // Al cargar la página, respeta ?cat=... si viene en la URL (ej: desde el submenú)
  const params = new URLSearchParams(window.location.search);
  const catInicial = params.get('cat');
  const categoriasValidas = Array.from(opciones).map(op => op.dataset.categoria);

  if (catInicial && categoriasValidas.includes(catInicial)) {
    aplicarFiltro(catInicial);
  } else {
    aplicarFiltro('todos');
  }
});
