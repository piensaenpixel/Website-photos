# Piensa en Pixel — web de fotografía

Portfolio fotográfico estático (HTML, CSS y JavaScript sin dependencias ni build) pensado para publicarse en GitHub Pages.

**Web:** https://piensaenpixel.github.io/Website-photos/

## Qué tiene

- Tema claro y oscuro: sigue el ajuste del sistema y se puede cambiar con el botón redondo de la cabecera (se recuerda la elección).
- Portada con foto a pantalla completa, selección de fotos grandes una debajo de otra e índice de series.
- Cuatro series: **Paisaje**, **Luna**, **Drone** y **Nocturnas**, con galería filtrable en rejilla ordenada o en vista grande (botones a la derecha de los filtros).
- Transiciones suaves entre páginas y aparición de las fotos al hacer scroll.
- Página por fotografía con título, descripción, ficha técnica (cámara, objetivo, focal, apertura, velocidad, ISO, fecha), mapa de dónde está hecha y botón «Quiero esta foto» que lleva al formulario de contacto con la foto ya indicada.
- Página «Sobre mí» y formulario de contacto.
- Navegación por hash (`#/galeria/luna`, `#/foto/id`...), así que funciona en GitHub Pages sin configuración extra.

## Cómo añadir tus fotos

1. Copia las imágenes a `img/fotos/` (JPG, entre 1600 y 2400 px en el lado largo es un buen equilibrio entre calidad y peso).
2. Abre `js/photos.js` y añade una entrada al array `PHOTOS` por cada foto. El archivo explica cada campo; lo esencial:

```js
{
  id: "luna-sobre-el-teide",            // único, sin espacios ni acentos (forma la URL)
  title: "Luna sobre el Teide",
  category: "luna",                      // paisaje | luna | drone | nocturnas
  src: "img/fotos/luna-teide.jpg",
  w: 2000, h: 1333,                      // ancho y alto en píxeles
  description: "Texto libre.\n\nPuedes usar varios párrafos.",
  date: "2026-04-18",
  location: { name: "Parque Nacional del Teide", lat: 28.2724, lng: -16.6425 },
  exif: { camera: "Sony α7 IV", lens: "200-600 mm", focal: "600 mm", aperture: "f/8", shutter: "1/250 s", iso: "200" },
  featured: true,                        // aparece en la portada
  forSale: true                          // muestra el botón de compra
}
```

3. Las fotos que hay ahora en `img/fotos/` son **imágenes de muestra generadas** para que la web no esté vacía. Bórralas cuando subas las tuyas.

En el mismo archivo, en `SITE`, puedes cambiar el nombre, el texto de «Sobre mí», los enlaces a Instagram y Unsplash, el correo de contacto y la foto de retrato (`portrait: "img/retrato.jpg"`).

## Formulario de contacto

GitHub Pages no tiene servidor, así que el formulario funciona de dos maneras:

- **Sin configurar nada:** al enviar se abre la aplicación de correo del visitante con el mensaje preparado hacia el email de `SITE.email`.
- **Recomendado:** crea un formulario gratuito en [Formspree](https://formspree.io), copia su ID (algo como `xpzgkbqw`) y ponlo en `SITE.formspreeId`. A partir de ahí los mensajes te llegan al correo sin que el visitante salga de la web.

## Mapa

Usa [Leaflet](https://leafletjs.com) con teselas de CARTO/OpenStreetMap, sin clave de API. Si una foto no tiene `location.lat` y `location.lng`, simplemente no se muestra el mapa.

## Publicación

- La rama `main` es el código fuente.
- Cada push a `main` ejecuta el workflow `.github/workflows/deploy.yml`, que copia la web a la rama `gh-pages`.
- GitHub Pages sirve la rama `gh-pages`. Si alguna vez no aparece activado: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: gh-pages / (root)**.

## Probar en local

No hace falta instalar nada. Desde la carpeta del proyecto:

```sh
python3 -m http.server 8080
```

y abre http://localhost:8080 en el navegador.
