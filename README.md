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
| `app.js` | El formulario de diagnóstico. |
| `flor.svg`, `flor-marca.svg` | La marca del mburucuyá, en versión grande y chica. |
| `favicon.svg` | Ícono de pestaña. |
| `fuentes/` | Schibsted Grotesk y Geist Mono autohospedadas (139 KB). El sitio no le pide nada a Google. |
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
3. **Foto propia de Paysandú** — `index.html`, sección «Estamos acá». Nunca
   banco de imágenes: es la señal más rápida de proveedor genérico.
4. **Capturas de las dos demostraciones** — `index.html`, sección
   «Demostraciones».

## Formulario de diagnóstico

El formulario **es** el prototipo 1: recibe, clasifica con IA, notifica y
registra.

- Con `ENDPOINT` cargado en `app.js`, manda un JSON por POST al webhook de n8n.
- Sin `ENDPOINT`, arma el mensaje completo y abre WhatsApp con todo escrito. El
  sitio funciona desde el día uno sin infraestructura detrás.

WhatsApp arranca con enlace `wa.me` sobre un número de WhatsApp Business común.
La Cloud API de Meta (número dedicado, verificación de empresa, plantillas
aprobadas) es un proyecto aparte y no bloquea el lanzamiento.

## Publicar

En Cloudflare Pages: proyecto sin framework, sin comando de build, directorio de
salida `landing/`. También sirve cualquier hosting estático o Netlify.

Falta agregar antes del lanzamiento: analítica sin cookies (Umami o Plausible) y
la ficha de empresa en Google con domicilio en Paysandú.
