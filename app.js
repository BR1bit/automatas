/*
  Transiciones de entrada por sección.

  Las clases se agregan desde acá y no desde el HTML: así, si el JavaScript
  falla o está desactivado, no queda nada invisible. Cada bloque aparece una
  sola vez —después se deja de observar— y los hermanos de una misma grilla
  entran escalonados.
*/
(function () {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (quieto || !('IntersectionObserver' in window)) return;

  const BLOQUES = [
    '.antetitulo',
    '.titulo',
    '.entrada',
    '.portada h1',
    '.portada__bajada',
    '.portada__acciones',
    '.portada__micro',
    '.territorio__grilla > *',
    '.sintomas li',
    '.etapa',
    '.demo',
    '.apunte',
    '.pregunta',
    '.datos',
    '.dialogo__calendario',
  ].join(', ');

  const PASO = 70; // ms entre hermanos
  const TOPE = 5; // más de cinco escalones se nota lento

  const bloques = Array.from(document.querySelectorAll(BLOQUES));
  const vistos = new Map();

  bloques.forEach((el) => {
    const n = vistos.get(el.parentElement) ?? 0;
    vistos.set(el.parentElement, n + 1);
    el.style.setProperty('--retraso', Math.min(n, TOPE) * PASO + 'ms');
    el.classList.add('aparece');
  });

  function observar(elementos, opciones) {
    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      });
    }, opciones);
    elementos.forEach((el) => observador.observe(el));
  }

  observar(bloques, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

  // Las secciones son altas: el filete tiene que dibujarse apenas asoma el
  // borde superior, no cuando ya se vio el 15 % de la sección.
  const filetes = Array.from(document.querySelectorAll('.seccion--linea'));
  filetes.forEach((el) => el.classList.add('linea-animada'));
  observar(filetes, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
})();

/*
  Ventana flotante de «Agendar entrevista»: el calendario de Cal.com vive en
  un <dialog> nativo, que se abre con showModal() (foco atrapado, Escape
  cierra solo) y con un clic fuera de la tarjeta.

  Los botones que la abren son <button>, no enlaces con ancla: no hay forma
  de abrir un <dialog> sin JavaScript, así que un href de respaldo hubiera
  sido un scroll a una caja invisible, no una alternativa real. El resto
  del sitio ya depende del script para lo mismo (las animaciones), así que
  no es una dependencia nueva.

  demo/panel.html enlaza con href="../index.html#diagnostico": como esa
  página no carga este script, la apertura ocurre acá, al llegar con ese
  hash en la URL.
*/
(function () {
  const dialogo = document.getElementById('diagnostico');
  if (!dialogo || typeof dialogo.showModal !== 'function') return;

  function abrir() {
    if (dialogo.open) return;
    dialogo.showModal();
    document.body.style.overflow = 'hidden';
  }

  function restaurarScroll() {
    document.body.style.overflow = '';
  }

  function cerrar() {
    if (!dialogo.open) return;
    dialogo.close();
    // No depende únicamente del evento 'close' del <dialog>: por Escape
    // ese evento sí llega, pero acá lo garantizamos igual sin esperarlo.
    restaurarScroll();
  }

  document
    .querySelectorAll('[data-abrir-diagnostico]')
    .forEach((el) => el.addEventListener('click', abrir));

  dialogo
    .querySelectorAll('[data-cerrar-dialogo]')
    .forEach((el) => el.addEventListener('click', cerrar));

  // Clic en el fondo (fuera de la tarjeta) cierra, igual que el backdrop.
  dialogo.addEventListener('click', (evento) => {
    if (evento.target === dialogo) cerrar();
  });

  // Red de seguridad para el cierre con Escape, que no pasa por cerrar().
  dialogo.addEventListener('close', restaurarScroll);

  if (location.hash === '#diagnostico') {
    abrir();
    history.replaceState(null, '', location.pathname + location.search);
  }
})();
