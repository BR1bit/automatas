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
  Ventana flotante de «Agendar entrevista»: el calendario de Google vive en
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

/*
  Partículas que atraviesan todo el fondo del hero y se ensamblan en la
  flor. Corre solo si hay canvas 2D, no hay "reducir movimiento" y la flor
  se muestra (>= 64rem, el punto en que .portada__marca deja el
  display:none). Si algo de eso falta —o getScreenCTM tira un error en
  algún navegador raro— no se toca ninguna clase y la flor se ve
  exactamente igual que si este bloque no existiera: quieta o girando
  desde el arranque.
*/
(function () {
  const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ancha = window.matchMedia('(min-width: 64rem)').matches;
  const canvas = document.getElementById('particulas-flor');
  const portada = document.querySelector('.portada');
  const marca = document.querySelector('.portada__marca');
  const svgFlor = marca ? marca.querySelector('svg.flor') : null;

  if (quieto || !ancha || !canvas || !portada || !svgFlor) return;
  const ctx = canvas.getContext('2d');
  if (!ctx || typeof svgFlor.getScreenCTM !== 'function') return;

  let vivo = true;
  window.addEventListener('pagehide', () => {
    vivo = false;
  });

  function medir() {
    const r = window.devicePixelRatio || 1;
    const rect = portada.getBoundingClientRect();
    canvas.width = rect.width * r;
    canvas.height = rect.height * r;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(r, 0, 0, r, 0, 0);
    return rect;
  }

  // Puntos sobre la silueta real de la flor: se recorren los 5 pétalos
  // (son <path>, se muestrean con getPointAtLength) y las circunferencias
  // de los 5 nodos y el centro. getScreenCTM lleva cada punto del espacio
  // del SVG a coordenadas de pantalla tal como está dibujado ahora mismo
  // —con su tamaño, rotación e inclinación reales—, sin tener que calcular
  // a mano dónde cae la caja de la flor dentro del hero.
  function objetivos(rectPortada) {
    const puntos = [];
    svgFlor.querySelectorAll('path').forEach((path) => {
      const total = path.getTotalLength();
      const pasos = 16;
      for (let i = 0; i < pasos; i++) {
        puntos.push(path.getPointAtLength((i / pasos) * total));
      }
    });
    svgFlor.querySelectorAll('circle').forEach((circulo) => {
      const cx = parseFloat(circulo.getAttribute('cx'));
      const cy = parseFloat(circulo.getAttribute('cy'));
      const radio = parseFloat(circulo.getAttribute('r'));
      const esNodo = circulo.classList.contains('nodo');
      const pasos = esNodo ? 8 : 12;
      for (let i = 0; i < pasos; i++) {
        const angulo = (i / pasos) * Math.PI * 2;
        puntos.push({
          x: cx + Math.cos(angulo) * radio,
          y: cy + Math.sin(angulo) * radio,
        });
      }
    });

    const ctm = svgFlor.getScreenCTM();
    return puntos.map((p) => {
      const enPantalla = new DOMPoint(p.x, p.y).matrixTransform(ctm);
      return {
        x: enPantalla.x - rectPortada.left,
        y: enPantalla.y - rectPortada.top,
      };
    });
  }

  function suavizado(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animar() {
    const rect = medir();
    let metas;
    try {
      metas = objetivos(rect);
    } catch (error) {
      return;
    }
    if (!metas.length) return;

    svgFlor.classList.add('flor--esperando');

    const estilo = getComputedStyle(document.documentElement);
    const azul = estilo.getPropertyValue('--azul').trim() || '#003399';
    const lila = estilo.getPropertyValue('--lila').trim() || '#7a5aa6';
    const DURACION = 2800;
    const RETRASO_MAX = 900;

    const particulas = metas.map((meta) => {
      const angulo = Math.random() * Math.PI * 2;
      const radio = Math.max(rect.width, rect.height) * (0.5 + Math.random() * 0.4);
      return {
        x0: rect.width / 2 + Math.cos(angulo) * radio,
        y0: rect.height / 2 + Math.sin(angulo) * radio,
        x1: meta.x,
        y1: meta.y,
        retraso: Math.random() * RETRASO_MAX,
        lila: Math.random() < 0.16,
        radio: 1.3 + Math.random() * 1.3,
      };
    });

    const inicio = performance.now();

    function paso(ahora) {
      if (!vivo) return;
      const t = ahora - inicio;
      ctx.clearRect(0, 0, rect.width, rect.height);

      let quedanVolando = false;
      particulas.forEach((p) => {
        const local = Math.min(1, Math.max(0, (t - p.retraso) / DURACION));
        if (local < 1) quedanVolando = true;
        const f = suavizado(local);
        const x = p.x0 + (p.x1 - p.x0) * f;
        const y = p.y0 + (p.y1 - p.y0) * f;
        ctx.globalAlpha = 0.25 + 0.75 * f;
        ctx.fillStyle = p.lila ? lila : azul;
        ctx.beginPath();
        ctx.arc(x, y, p.radio, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (quedanVolando || t < DURACION + RETRASO_MAX + 300) {
        requestAnimationFrame(paso);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
        svgFlor.classList.remove('flor--esperando');
      }
    }
    requestAnimationFrame(paso);
  }

  // Se espera a que carguen las tipografías: si el titular todavía va a
  // reacomodarse, medir antes dejaría a las partículas apuntando a un
  // lugar que la flor ya no ocupa.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(animar);
  } else {
    animar();
  }
})();
