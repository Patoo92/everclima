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

  /* ---- Visor de fotos (lightbox) para fotos recortadas ---- */
  const fotos = Array.from(document.querySelectorAll('.galeria figure, .item-trabajo'));
  if (fotos.length) {
    const visor = document.createElement('div');
    visor.className = 'lightbox';
    visor.setAttribute('role', 'dialog');
    visor.setAttribute('aria-modal', 'true');
    visor.setAttribute('aria-label', 'Visor de imagen ampliada');
    visor.innerHTML =
      '<button class="lightbox-cierre" type="button" aria-label="Cerrar">&times;</button>' +
      '<button class="lightbox-flecha lightbox-anterior oculto" type="button" aria-label="Foto anterior">&lsaquo;</button>' +
      '<button class="lightbox-flecha lightbox-siguiente oculto" type="button" aria-label="Foto siguiente">&rsaquo;</button>' +
      '<figure><img src="" alt=""><figcaption></figcaption></figure>';
    document.body.appendChild(visor);

    const imagenVisor = visor.querySelector('img');
    const pieVisor = visor.querySelector('figcaption');
    const botonCierre = visor.querySelector('.lightbox-cierre');
    const botonAnterior = visor.querySelector('.lightbox-anterior');
    const botonSiguiente = visor.querySelector('.lightbox-siguiente');
    const lista = fotos
      .map(fig => fig.querySelector('img'))
      .filter(Boolean);
    let indice = 0;

    function mostrar() {
      const img = lista[indice];
      imagenVisor.src = img.currentSrc || img.src;
      imagenVisor.alt = img.alt || '';
      pieVisor.textContent = img.alt || '';
      botonAnterior.classList.toggle('oculto', lista.length < 2);
      botonSiguiente.classList.toggle('oculto', lista.length < 2);
      visor.classList.add('abierto');
      document.body.style.overflow = 'hidden';
      botonCierre.focus();
    }
    function cerrar() {
      visor.classList.remove('abierto');
      document.body.style.overflow = '';
    }
    function navegar(delta) {
      indice = (indice + delta + lista.length) % lista.length;
      mostrar();
    }

    fotos.forEach((fig, i) => {
      fig.addEventListener('click', () => {
        indice = i;
        mostrar();
      });
    });
    botonCierre.addEventListener('click', cerrar);
    botonAnterior.addEventListener('click', () => navegar(-1));
    botonSiguiente.addEventListener('click', () => navegar(1));
    visor.addEventListener('click', (e) => {
      if (e.target === visor) cerrar();
    });
    document.addEventListener('keydown', (e) => {
      if (!visor.classList.contains('abierto')) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowLeft') navegar(-1);
      if (e.key === 'ArrowRight') navegar(1);
    });
  }

  /* ---- Bienvenida en visitas recurrentes (solo en el home) ---- */
  if (rutaActual === 'index.html') {
    try {
      const CLAVE_VISITA = 'everclima_visita';
      const leerVisitas = () => {
        const m = document.cookie.match(new RegExp('(?:^|;\\s*)' + CLAVE_VISITA + '=([^;]+)'));
        if (m) return parseInt(m[1], 10) || 0;
        return parseInt(localStorage.getItem(CLAVE_VISITA), 10) || 0;
      };
      const guardarVisitas = (n) => {
        document.cookie = CLAVE_VISITA + '=' + n + '; max-age=31536000; path=/';
        localStorage.setItem(CLAVE_VISITA, String(n));
      };

      const veces = leerVisitas() + 1;
      guardarVisitas(veces);

      if (veces > 1) {
        setTimeout(() => {
          const aviso = document.createElement('div');
          aviso.className = 'aviso-bienvenida';
          aviso.setAttribute('role', 'status');
          aviso.innerHTML =
            '<span class="aviso-bienvenida-marca" aria-hidden="true"></span>' +
            '<div class="aviso-bienvenida-texto">' +
            '<strong>Que bueno verte nuevamente</strong>' +
            '</div>';
          document.body.appendChild(aviso);
          const cabecera = document.querySelector('.encabezado');
          if (cabecera) {
            aviso.style.top = (cabecera.getBoundingClientRect().bottom + 16) + 'px';
          }
          setTimeout(() => aviso.classList.add('visible'), 20);
          setTimeout(() => {
            aviso.classList.remove('visible');
            setTimeout(() => aviso.remove(), 400);
          }, 5000);
        }, 1200);
      }
    } catch (e) { /* almacenamiento no disponible, se ignora */ }
  }

});
