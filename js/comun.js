// ============================================================
// EVERCLIMA — comportamiento compartido en todas las páginas
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Menú móvil ---- */
  const botonMenu = document.querySelector('.boton-menu-movil');
  const menu = document.querySelector('.menu');

  if (botonMenu && menu) {
    botonMenu.addEventListener('click', () => {
      const abierto = menu.classList.toggle('abierto');
      botonMenu.setAttribute('aria-expanded', String(abierto));
      document.body.style.overflow = abierto ? 'hidden' : '';
    });

    // Submenús desplegables en móvil (tap para abrir, no hover)
    document.querySelectorAll('.menu > li').forEach(item => {
      const enlace = item.querySelector(':scope > a');
      const submenu = item.querySelector('.submenu');
      if (!submenu) return;

      enlace.addEventListener('click', (e) => {
        if (window.innerWidth <= 860) {
          e.preventDefault();
          const yaAbierto = item.classList.contains('submenu-abierto');
          document.querySelectorAll('.menu > li.submenu-abierto').forEach(otro => {
            if (otro !== item) otro.classList.remove('submenu-abierto');
          });
          item.classList.toggle('submenu-abierto', !yaAbierto);
        }
      });
    });

    // Cerrar menú al cambiar a escritorio
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        menu.classList.remove('abierto');
        document.body.style.overflow = '';
        botonMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Aviso de cookies (propio, simple) ---- */
  const CLAVE_COOKIES = 'everclima_cookies_ok';
  const aviso = document.querySelector('.aviso-cookies');

  if (aviso) {
    let yaAceptado = false;
    try { yaAceptado = localStorage.getItem(CLAVE_COOKIES) === '1'; } catch (e) { /* almacenamiento no disponible */ }

    if (!yaAceptado) {
      setTimeout(() => aviso.classList.add('visible'), 600);
    }

    const botonAceptar = aviso.querySelector('[data-accion="aceptar-cookies"]');
    if (botonAceptar) {
      botonAceptar.addEventListener('click', () => {
        try { localStorage.setItem(CLAVE_COOKIES, '1'); } catch (e) { /* no disponible, se volverá a mostrar */ }
        aviso.classList.remove('visible');
      });
    }
  }

  /* ---- Resaltar el ítem de menú activo según la URL ---- */
  const rutaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(enlace => {
    const href = enlace.getAttribute('href');
    if (href === rutaActual) {
      enlace.closest('li').classList.add('activo');
    }
  });

});
