/*
  El formulario de diagnóstico es el prototipo 1 funcionando en vivo:
  recibe, clasifica con IA, notifica y registra.

  Con ENDPOINT configurado, manda un JSON por POST al webhook de n8n.
  Sin ENDPOINT, arma el mensaje completo y abre WhatsApp con todo escrito,
  así el sitio sirve desde el día uno sin ninguna infraestructura detrás.
*/

// PENDIENTE: pegar acá la URL del webhook de n8n cuando esté pronto.
const ENDPOINT = '';

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
    '.columna',
    '.secundaria',
    '.etapa',
    '.demo',
    '.rubros',
    '.foto',
    '.apunte',
    '.pregunta',
    '.datos',
    '.campos',
    '.envio',
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

(function () {
  const form = document.getElementById('form-diagnostico');
  if (!form) return;

  const estado = form.querySelector('.estado');
  const boton = form.querySelector('button[type="submit"]');
  const whatsapp = document.body.dataset.whatsapp;

  function mostrar(texto, tono) {
    estado.textContent = texto;
    estado.dataset.tono = tono;
  }

  function armarMensaje(datos) {
    return [
      'Hola, quiero solicitar un diagnóstico.',
      '',
      'Organización: ' + datos.organizacion,
      'Persona: ' + datos.persona,
      'Rubro: ' + datos.rubro,
      'Localidad: ' + datos.localidad,
      'Proceso a mejorar: ' + datos.proceso,
      datos.como ? 'Cómo se hace hoy: ' + datos.como : '',
      datos.frecuencia ? 'Frecuencia: ' + datos.frecuencia : '',
      'Contacto: ' + datos.contacto,
    ]
      .filter(Boolean)
      .join('\n');
  }

  form.addEventListener('submit', async function (evento) {
    evento.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      mostrar('Faltan campos obligatorios.', 'error');
      return;
    }

    const fd = new FormData(form);
    if (fd.get('apellido2')) return; // robot

    const datos = {
      organizacion: fd.get('organizacion'),
      persona: fd.get('persona'),
      rubro: fd.get('rubro'),
      localidad: fd.get('localidad'),
      proceso: fd.get('proceso'),
      como: fd.getAll('como').join(', '),
      frecuencia: fd.get('frecuencia'),
      contacto: fd.get('contacto'),
      origen: 'landing',
      enviadoEn: new Date().toISOString(),
    };

    if (!ENDPOINT) {
      const url =
        'https://wa.me/' +
        whatsapp +
        '?text=' +
        encodeURIComponent(armarMensaje(datos));
      window.open(url, '_blank', 'noopener');
      mostrar('Te abrimos WhatsApp con el mensaje listo para enviar.', 'ok');
      return;
    }

    boton.disabled = true;
    mostrar('Enviando…', 'neutro');

    try {
      const respuesta = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      if (!respuesta.ok) throw new Error(String(respuesta.status));

      form.reset();
      mostrar('Recibido. Te respondemos el mismo día hábil.', 'ok');
    } catch (error) {
      mostrar(
        'No pudimos enviarlo. Probá de nuevo o escribinos por WhatsApp.',
        'error'
      );
    } finally {
      boton.disabled = false;
    }
  });
})();
