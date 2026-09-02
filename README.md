# Landing · automatas

Página única de lanzamiento para el proyecto de consultoría y automatización de
procesos, con base en Paysandú.

**Sin dependencias y sin paso de compilación.** Es HTML, CSS y un archivo de
JavaScript. Se abre haciendo doble clic en `index.html` y se publica subiendo
esta carpeta tal cual.

> El plan original preveía Astro + Tailwind. Se armó sin build porque en ese
> momento `registry.npmjs.org` no respondía desde esta máquina. Después se
> destrabó cambiando de red, pero para un one-pager el framework no aporta:
> sigue sin dependencias a propósito. Si más adelante hace falta (varias
> páginas, un blog, componentes repetidos), el HTML se parte en componentes
> Astro en una tarde y el CSS pasa tal cual.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | Toda la página: las once bandas del plan. |
| `estilos.css` | Identidad y maquetación. Los colores están arriba de todo. |
| `app.js` | La ventana de «Agendar entrevista» y las transiciones de entrada por sección. |
| `flor.svg`, `flor-marca.svg` | La marca del mburucuyá, en versión grande y chica. |
| `puente.svg` | El puente Paysandú–Colón, de fondo entre la portada y la franja de territorio. |
| `favicon.svg` | Ícono de pestaña. |
| `fuentes/` | Schibsted Grotesk y Geist Mono autohospedadas (139 KB). El sitio no le pide nada a Google. |
| `demo/panel.html` | El prototipo 1 funcionando: panel de monitoreo con datos simulados. |
| `demo/aprobaciones.html` | El prototipo 2 funcionando: bandeja de aprobaciones administrativas. |
| `marca/` | Variantes de logo descartadas, conservadas por si sirven más adelante. |
| `robots.txt` | Permite indexar todo. |

## Ver el sitio

Doble clic en `index.html` alcanza. Para verlo como lo va a servir el hosting:

```sh
python3 -m http.server 4321
# después, abrir http://localhost:4321
```

## Identidad

La paleta sale de la **bandera de Paysandú** (Silvio Giordano, izada el 2 de
junio de 1992): campo blanco dominante, azul `#003399` en las franjas superior e
inferior, rojo `#b43232` en la del medio, y la flor del mburucuyá al centro, de
donde viene el lila `#7a5aa6`.

El tratamiento es contemporáneo y austero: casi no hay bordes ni cajas, la
jerarquía la hacen el espacio en blanco y el tamaño de la tipografía, y el color
aparece en dos lugares —la franja de territorio y el pie— y en nada más.

La marca es esa flor en línea y sin relleno: **cinco pétalos con un nodo en cada
punta**. La flor leída como red — cinco procesos que salen de un centro y
terminan en un punto de conexión. Ahí está la asociación con automatizar, sin
pegarle un engranaje encima.

En la portada **gira sobre su eje, inclinada 30° en perspectiva**: una vuelta
cada 54 segundos. Lento a propósito, para que lea como mecanismo en marcha y no
como indicador de carga. Con «reducir movimiento» activado conserva la
inclinación y pierde el giro. En la barra superior no gira: al pasar el mouse
avanza un pétalo (72°, un quinto de vuelta) y queda idéntica.

- Los **19 puntos** de los diecinueve departamentos siguen en el pie, como
  separador.
- La **franja tricolor de 3 px** sobre la barra superior repite el orden azul ·
  rojo · azul de la bandera. Es el único gesto heráldico del sitio.

Entre la portada y la franja azul cruza el **puente Paysandú–Colón** (General
Artigas) dibujado en línea gris clara, con sus proporciones reales: la
aproximación larga del lado argentino (34 vanos contra 10), la loma del vano
principal de 140 m y la viga que engrosa sobre las dos pilas grandes, como
corresponde a los volados sucesivos. El agua del dibujo desemboca en la franja
azul de territorio. En pantallas chicas se muestra solo el tramo central. La
fuente es `puente.svg` (generado por cálculo, como la flor) y va en línea en el
HTML.

El SVG va **en línea dentro de `index.html`**, no como máscara CSS: las
máscaras con archivo externo no cargan al abrir la página con doble clic
(`file://`) y el logo desaparecía. Los trazos usan `currentColor`, así que el
color sigue saliendo de la hoja de estilos —azul en la barra y la portada, lila
en el pie— y la misma flor sirve para todos.

Hay **dos tallas ópticas**, que son la misma marca y no dos logos:
`flor.svg` (trazo fino, nodos abiertos, para tamaño grande) y `flor-marca.svg`
(trazo grueso y nodos llenos, para 32 px o menos, donde un anillo de tres
unidades se empasta igual). Esos dos archivos son la **fuente**: se editan ahí
y se pegan de nuevo en el HTML si la marca cambia.

En `marca/` quedaron las alternativas que se probaron. Para cambiar la del
sitio hay que copiar el archivo **y** pegar su contenido en los tres `<svg
class="flor…">` de `index.html` (barra, portada y pie):

```sh
cp marca/J2-corona-doble.svg flor.svg   # talla grande
cp marca/J2-chica.svg flor-marca.svg    # talla chica
```

El sitio se compromete con un solo mundo visual, claro, como el campo blanco de
la bandera: no hay tema oscuro y es a propósito.

Tipografías: **Schibsted Grotesk** para todo el texto y **Geist Mono** para
etiquetas, numeración y datos. Licencia SIL Open Font License 1.1.

## Antes de publicar

Los datos de contacto son los **únicos datos inventados** del proyecto. Están
marcados con `PENDIENTE` y hay que reemplazarlos:

1. **Número de WhatsApp** — `5989XXXXXXX` aparece en `index.html`
   (atributo `data-whatsapp` del `<body>`, enlace de la sección diagnóstico y
   enlace del pie). Buscar y reemplazar las tres.
2. **Teléfono fijo, correo y zona** — en `index.html`: bloque `<script
   type="application/ld+json">`, sección diagnóstico y pie.

El link de Cal.com ya está cargado (`bruno-rodriguez-wtalvm/30min`). Antes de
publicar, conviene entrar a la cuenta de Cal.com y confirmar que la
disponibilidad semanal y la duración del evento («30min») son las que se
quieren mostrar públicamente.

## Agendar entrevista

Los botones «Agendar entrevista» (barra y hero) abren un `<dialog>` nativo
que va **directo al calendario** — no hay un formulario de preguntas antes.
Es intencional: la primera versión pedía rubro, proceso a mejorar, etc. antes
de mostrar el calendario, y eso disparaba WhatsApp automáticamente en cada
envío (para que a Bruno le llegara el detalle, ya que no había webhook). Sacaba
a la visita del sitio con una pestaña nueva que no esperaba, así que se
simplificó: agendar es agendar, un solo paso.

Adentro, un calendario de [Cal.com](https://cal.com) embebido (widget oficial
"inline", plan gratuito — conexiones de calendario ilimitadas, incluso con dos
cuentas de Google Calendar a la vez) apunta al evento real de Bruno
(`bruno-rodriguez-wtalvm/30min`). Cal.com manda correo al instante cuando
alguien reserva.

**Si más adelante se quiere volver a capturar contexto antes de la llamada**
(qué proceso quiere mejorar, de qué rubro es, etc.), la forma correcta es
agregar esas preguntas como **campos personalizados del propio tipo de evento
en Cal.com** (se configuran en cal.com → Event Types → el evento → Advanced →
Booking questions), no un formulario aparte: así siguen llegando en la misma
notificación de la reserva, sin gatillar nada del lado del navegador ni sacar
a nadie del flujo. Debajo del calendario quedan WhatsApp y correo como
alternativa para quien prefiera escribir antes de agendar.

## Prototipo 1: panel de monitoreo (`demo/panel.html`)

La primera tarjeta de «Demostraciones» no es una captura de pantalla: enlaza
a un panel que **corre de verdad**, con datos simulados de una cámara de frío.

- Temperatura, humedad, estado de la puerta y consumo, actualizados cada
  1,5 s. La temperatura ronda los 4 °C con ruido; cada tanto la puerta se
  «abre» y el valor sube.
- Un gráfico en `<canvas>` con la última hora y el límite de alerta marcado.
- Cuando la temperatura cruza el límite (6 °C), la tarjeta y el punto de
  estado pasan a rojo, queda un evento en el registro y —cuando vuelve a
  rango— otro evento avisa la recuperación. El ciclo completo (apertura →
  alerta → recuperación) tarda cerca de un minuto: si lo mirás y no pasa nada
  todavía, esperá un poco.
- Es exactamente lo que describe la tarjeta: «sensores registran, un panel
  los muestra en vivo con su historial y el sistema avisa cuando se supera un
  límite». No hay nada que demostrar aparte, salvo cambiar los datos por los
  reales de un cliente.

Es una página independiente (`demo/panel.html`), con `<meta name="robots"
content="noindex">` para que no compita en buscadores con la portada, y una
franja violeta arriba que aclara que los datos son simulados. Reutiliza
`estilos.css` para los tokens y agrega los suyos propios al final del
`<head>`. Sin dependencias: el gráfico se dibuja a mano en `<canvas>`.

## Prototipo 2: bandeja de aprobaciones (`demo/aprobaciones.html`)

La segunda tarjeta, orientada al trabajo administrativo de oficina: compras,
reintegros de gastos y licencias que hoy se aprueban por cadena de mails.

- Solicitudes simuladas que van entrando solas, rotando entre los tres tipos,
  con solicitante, monto o detalle y una **prioridad calculada
  automáticamente** (montos altos, poca anticipación en licencias, o la
  palabra «urgente» en el detalle, marcan la solicitud como urgente).
- Botones **Aprobar** / **Rechazar** reales: al decidir, la solicitud sale de
  la bandeja y queda un renglón en el historial con hora, quién decidió y el
  resultado. Los números de arriba (pendientes, aprobadas, rechazadas, tiempo
  promedio, **monto aprobado y monto rechazado**) se actualizan en el
  momento. Los montos solo suman compras y reintegros de gastos — las
  licencias no tienen importe, así que no entran en esa cuenta.
- Misma estructura que `demo/panel.html` (`noindex`, franja de aviso,
  `estilos.css` reutilizado, sin dependencias) — es su par administrativo, no
  industrial.

La grilla de «Demostraciones» se acomoda sola según cuántas tarjetas haya
(`grid-template-columns: repeat(auto-fit, minmax(19rem, 1fr))` en
`estilos.css`): no hace falta una clase `--dos` / `--tres` separada si en
algún momento se agrega o se saca una demo.

Los enlaces de WhatsApp que quedan (info de contacto del modal y pie de
página) arrancan con `wa.me` sobre un número de WhatsApp Business común.
La Cloud API de Meta (número dedicado, verificación de empresa, plantillas
aprobadas) es un proyecto aparte y no bloquea el lanzamiento.

## Publicar

En Cloudflare Pages: proyecto sin framework, sin comando de build, directorio de
salida `landing/`. También sirve cualquier hosting estático o Netlify.

Falta agregar antes del lanzamiento: analítica sin cookies (Umami o Plausible) y
la ficha de empresa en Google con domicilio en Paysandú.
