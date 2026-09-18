# piensaenpixel — web de fotografía

Portfolio fotográfico estático (HTML, CSS y JavaScript sin dependencias ni build) pensado para publicarse en GitHub Pages.

**Web:** https://piensaenpixel.github.io/Website-photos/

## Qué tiene

- Estilo inspirado en la plantilla Gordian de Framer: blanco y negro, títulos en Geist negrita y mayúsculas, todo lo demás en Geist Mono en mayúsculas, tablas de datos etiqueta/valor, secciones numeradas (S01, S02…), fotos a todo el ancho con filetes finos y barra fija inferior con «MENU».
- Tema claro por defecto; el oscuro se activa desde el menú («Tema») y se recuerda la elección.
- Portada: foto a pantalla completa con texto en negrita, fila «Social / Localización» con reloj en directo, Sobre mí (S01), Series (S02), Selección de fotos grandes (S03) y Contacto (S04).
- Cuatro series: **Paisaje**, **Luna**, **Drone** y **Nocturnas**, con galería filtrable en vista grande (una debajo de otra) o rejilla.
- Página por fotografía con título grande, ficha etiqueta/valor (serie, lugar, fecha, cámara, objetivo, focal, apertura, velocidad, ISO), enlace «Copia: quiero esta foto» al formulario, imagen a todo el ancho, descripción, mapa y navegación anterior/siguiente.
- Animaciones: pantalla de carga (una vez por visita), cortina negra entre páginas con el título del destino, títulos que entran palabra a palabra, fotos que se descubren al hacer scroll, parallax en las listas y cursor personalizado con «Ver». Todo se desactiva con «reducir movimiento».
- Toda la interfaz está en inglés. Navegación por hash (`#/gallery/moon`, `#/photo/id`...), así que funciona en GitHub Pages sin configuración extra.

## Importar fotos desde Unsplash

El workflow **Importar fotos de Unsplash** (pestaña Actions → Run workflow) descarga con la API las fotos más populares del usuario, sus datos EXIF y su localización, las guarda en `img/fotos/` y las añade a `js/photos.js`. Cómo se comporta:

- Las fotos que ya están en `js/photos.js` (por su `unsplashId`) no se tocan, así que puedes editar títulos, series y descripciones sin miedo a perderlos.
- Las fotos listadas en `EXCLUDED_UNSPLASH` al final de `js/photos.js` se ignoran. Para descartar una foto, borra su entrada y añade su `unsplashId` a esa lista.
- Las fotos nuevas llegan con título y descripción automáticos en inglés y serie estimada por palabras clave: revísalas.
- La clave se pasa como entrada del workflow o, mejor, como secret del repositorio llamado `UNSPLASH_ACCESS_KEY` (Settings → Secrets and variables → Actions). Las apps de Unsplash en modo demo permiten 50 peticiones por hora, unas 45 fotos por ejecución.

## Cómo añadir tus fotos a mano

1. Copia las imágenes a `img/fotos/` (JPG, entre 1600 y 2400 px en el lado largo es un buen equilibrio entre calidad y peso).
2. Abre `js/photos.js` y añade una entrada al array `PHOTOS` por cada foto. El archivo explica cada campo; lo esencial:

```js
{
  id: "moon-over-teide",                 // único, sin espacios ni acentos (forma la URL)
  title: "Moon over Teide",
  category: "moon",                      // landscape | moon | drone | night
  src: "img/fotos/luna-teide.jpg",
  w: 2000, h: 1333,                      // ancho y alto en píxeles
  description: "Free text, in English.\n\nYou can use several paragraphs.",
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
