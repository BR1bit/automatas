# Imagen mínima: el sitio es HTML/CSS/JS plano, sin paso de compilación,
# así que no hace falta build multi-etapa — solo copiar los archivos a un
# nginx y servirlos.
FROM nginx:1.27-alpine

# nginx:alpine trae un default.conf propio; se reemplaza por el nuestro.
# security-headers.conf va afuera de conf.d/ a propósito: ese directorio
# se incluye completo con un glob (*.conf) desde el nginx.conf principal,
# y si el snippet quedara ahí se cargaría dos veces — una por el glob y
# otra por el "include" explícito de automatas.conf.
RUN rm -f /etc/nginx/conf.d/default.conf && mkdir -p /etc/nginx/snippets
COPY nginx.conf /etc/nginx/conf.d/automatas.conf
COPY security-headers.conf /etc/nginx/snippets/security-headers.conf

# marca/ (variantes de logo descartadas) y README.md son documentación del
# proyecto, no algo que el visitante tenga que poder pedirle al servidor.
COPY index.html estilos.css app.js favicon.svg flor.svg flor-marca.svg \
     puente.svg robots.txt /usr/share/nginx/html/
COPY demo/ /usr/share/nginx/html/demo/
COPY fuentes/ /usr/share/nginx/html/fuentes/

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -q -O /dev/null http://127.0.0.1/healthz || exit 1

EXPOSE 80
