/* =====================================================================
   DATOS DEL SITIO Y DE LAS FOTOGRAFÍAS
   ---------------------------------------------------------------------
   Este es el único archivo que necesitas tocar para añadir o editar
   fotos. Cada foto es un objeto del array PHOTOS. Campos:

   id          Identificador único para la URL (sin espacios ni acentos).
   title       Título de la foto.
   category    "paisaje" | "luna" | "drone" | "nocturnas"
   src         Ruta a la imagen (p. ej. "img/fotos/mi-foto.jpg").
   w, h        Ancho y alto en píxeles (se usa para reservar el espacio
               y evitar saltos al cargar).
   description Texto libre. Puedes usar varios párrafos separándolos
               con "\n\n".
   date        Fecha en formato "AAAA-MM-DD".
   location    { name, lat, lng } — si no quieres mapa, pon lat y lng
               en null o borra el campo.
   exif        Datos técnicos (deja vacío lo que no quieras mostrar).
   featured    true para que aparezca en la portada.
   forSale     true para mostrar el botón de compra/contacto.
   ===================================================================== */

window.SITE = {
  name: "Piensa en Pixel",
  tagline: "Fotografía de paisaje, luna, dron y noche, desde Madrid",
  location: "España, Madrid",
  author: "Emilio García",
  // Correo al que llegan los mensajes de contacto (se usa como
  // alternativa si no configuras Formspree).
  email: "piensaenpixel@gmail.com",
  // Para recibir el formulario sin backend: crea un formulario gratuito en
  // https://formspree.io, copia su ID (algo como "xpzgkbqw") y pégalo aquí.
  formspreeId: "",
  instagram: "https://www.instagram.com/piensaenpixel/",
  unsplash: "https://unsplash.com/@piensaenpixel",
  about: [
    "Fotografío sobre todo lo que ocurre cuando la luz se va: la última hora en la montaña, la luna asomando tras una cresta, la Vía Láctea sobre un mar tranquilo.",
    "Soy Emilio García, fotógrafo afincado en Madrid. Trabajo con cámara en mano, con dron y con teleobjetivo, casi siempre en España, buscando lugares que conozco bien y volviendo a ellos hasta que la luz acompaña.",
    "Todas las fotografías de esta web están disponibles como copias de edición limitada sobre papel fine art. Si te interesa alguna, escríbeme y te cuento tamaños, acabados y precios."
  ]
};

window.CATEGORIES = [
  {
    id: "paisaje",
    name: "Paisaje",
    intro: "Montañas, valles y costas en la hora en la que la luz se vuelve blanda y el paisaje respira."
  },
  {
    id: "luna",
    name: "Luna",
    intro: "Lunas llenas, crecientes y menguantes, a menudo con un teleobjetivo largo y algo de suerte con las nubes."
  },
  {
    id: "drone",
    name: "Drone",
    intro: "El paisaje visto desde arriba: geometrías, texturas y colores que sólo se ven a cien metros del suelo."
  },
  {
    id: "nocturnas",
    name: "Nocturnas",
    intro: "Largas exposiciones bajo cielos oscuros: Vía Láctea, circumpolares y luces lejanas."
  }
];

/* PHOTOS:START — el workflow «Importar fotos de Unsplash» añade aquí las fotos nuevas y respeta las ya editadas */
window.PHOTOS = [
  {
    id: "parapente-ante-la-luna-llena",
    title: "Parapente ante la luna llena",
    category: "luna",
    src: "img/fotos/parapente-ante-la-luna-llena.jpg",
    w: 1800, h: 1200,
    description: "Un parapente cruza por delante de la luna llena entre nubes altas. Teleobjetivo de 600 mm.",
    date: "2024-06-23",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 7", lens: "NIKON CORPORATION, NIKON Z 7", focal: "600 mm", aperture: "f/11.0", shutter: "1/250 s", iso: "400" },
    featured: true,
    forSale: true,
    unsplashId: "088Q30AH28w"
  },
  {
    id: "via-lactea-sobre-la-ermita-de-las-nieves",
    title: "Vía Láctea sobre la Ermita de las Nieves",
    category: "nocturnas",
    src: "img/fotos/via-lactea-sobre-la-ermita-de-las-nieves.jpg",
    w: 1800, h: 2700,
    description: "El centro galáctico saliendo justo detrás de la Ermita de las Nieves, en Tenerife.",
    date: "2025-05-06",
    location: { name: "Ermita de las Nieves, Tenerife", lat: 28.291564, lng: -16.62913 },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: true,
    forSale: true,
    unsplashId: "hk00YEJ6j64"
  },
  {
    id: "punta-nati-menorca",
    title: "Punta Nati, Menorca",
    category: "drone",
    src: "img/fotos/punta-nati-menorca.jpg",
    w: 1800, h: 1011,
    description: "Las rocas de Punta Nati recortadas contra el mar oscuro, en Ciutadella de Menorca.",
    date: "2018-08-19",
    location: { name: "Punta Nati, Ciutadella de Menorca", lat: 40.05072794, lng: 3.82274119 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "2 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplashId: "Y7H8aS2Wn4c"
  },
  {
    id: "sombrillas",
    title: "Sombrillas",
    category: "drone",
    src: "img/fotos/sombrillas.jpg",
    w: 1800, h: 2736,
    description: "Sombrillas y toallas salpican la arena vistas en cenital.",
    date: "2018-05-06",
    location: { name: "Tarifa, Cádiz", lat: 36.06474972, lng: -5.68189211 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/3200 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplashId: "KBSOJaWNTlU"
  },
  {
    id: "playa-desde-arriba",
    title: "Playa desde arriba",
    category: "drone",
    src: "img/fotos/playa-desde-arriba.jpg",
    w: 1800, h: 1199,
    description: "Arena, espuma y agua en tres bandas, vistas en cenital.",
    date: "2024-05-13",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "Hasselblad L1D-20c", lens: "Hasselblad, L1D-20c", focal: "10.3 mm", aperture: "f/4.5", shutter: "1/200 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplashId: "Jk733Hfu_To"
  },
  {
    id: "el-arbol-y-el-circulo-de-luz",
    title: "El árbol y el círculo de luz",
    category: "nocturnas",
    src: "img/fotos/el-arbol-y-el-circulo-de-luz.jpg",
    w: 1800, h: 1200,
    description: "Larga exposición al anochecer: un dron con luz dibuja un círculo perfecto sobre un árbol solitario.",
    date: "2024-12-10",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: true,
    forSale: true,
    unsplashId: "VfeXGzHqA2I"
  },
  {
    id: "castillo-bajo-el-cielo-nocturno",
    title: "Castillo bajo el cielo nocturno",
    category: "nocturnas",
    src: "img/fotos/castillo-bajo-el-cielo-nocturno.jpg",
    w: 1800, h: 1200,
    description: "La silueta de un castillo en ruinas contra el cielo de la noche.",
    date: "2021-07-11",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "16 mm", aperture: "f/2.8", shutter: "20 s", iso: "1600" },
    featured: true,
    forSale: true,
    unsplashId: "crYpM4H2lmI"
  },
  {
    id: "atardecer-sobre-el-mar",
    title: "Atardecer sobre el mar",
    category: "paisaje",
    src: "img/fotos/atardecer-sobre-el-mar.jpg",
    w: 1800, h: 2705,
    description: "El sol se hunde en el horizonte con las rocas de la orilla en primer plano.",
    date: "2023-04-21",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "NIKON CORPORATION, NIKON Z 6", focal: "35 mm", aperture: "f/9.0", shutter: "1/13 s", iso: "125" },
    featured: true,
    forSale: true,
    unsplashId: "89OJpvgo8Dg"
  },
  {
    id: "sombras-en-la-orilla",
    title: "Sombras en la orilla",
    category: "drone",
    src: "img/fotos/sombras-en-la-orilla.jpg",
    w: 1800, h: 1011,
    description: "La playa desde arriba: la espuma dibuja la línea de la orilla y las sombras alargan a los bañistas.",
    date: "2021-08-08",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/350 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "lzlVmgxrcaM"
  },
  {
    id: "tarifa-desde-el-aire",
    title: "Tarifa desde el aire",
    category: "drone",
    src: "img/fotos/tarifa-desde-el-aire.jpg",
    w: 1800, h: 2499,
    description: "La orilla de Tarifa en vertical: espuma, arena y agua turquesa.",
    date: "2018-07-19",
    location: { name: "Tarifa, Cádiz", lat: 36.0142861, lng: -5.60444430000007 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "105" },
    featured: false,
    forSale: true,
    unsplashId: "Yx_khCZyX8g"
  },
  {
    id: "salto-a-la-piscina",
    title: "Salto a la piscina",
    category: "drone",
    src: "img/fotos/salto-a-la-piscina.jpg",
    w: 1800, h: 3604,
    description: "Justo antes del salto: la piscina en vertical desde el dron.",
    date: "2019-08-19",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplashId: "eQfMpQ3WcVY"
  },
  {
    id: "flotando",
    title: "Flotando",
    category: "drone",
    src: "img/fotos/flotando.jpg",
    w: 1800, h: 1003,
    description: "Una bañista sobre una colchoneta rosa en mitad del agua, vista desde el dron.",
    date: "2018-07-01",
    location: { name: "Madrid", lat: 40.39171667, lng: -3.72602167 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/470 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "Gd4NnmT__IA"
  },
  {
    id: "puente-sobre-agua-cristalina",
    title: "Puente sobre agua cristalina",
    category: "drone",
    src: "img/fotos/puente-sobre-agua-cristalina.jpg",
    w: 1800, h: 1200,
    description: "Un puente cruza un agua tan transparente que se ve el fondo desde el aire.",
    date: "2025-06-25",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "Hasselblad L1D-20c", lens: "Hasselblad, L1D-20c", focal: "10.3 mm", aperture: "f/5.6", shutter: "1/500 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "W51Rp00XOdM"
  },
  {
    id: "via-lactea-entre-los-arboles",
    title: "Vía Láctea entre los árboles",
    category: "nocturnas",
    src: "img/fotos/via-lactea-entre-los-arboles.jpg",
    w: 1800, h: 1200,
    description: "La Vía Láctea se abre paso entre las copas de los árboles en una noche sin luna.",
    date: "2020-08-24",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "11.5 mm", aperture: "f/2.8", shutter: "30 s", iso: "1000" },
    featured: false,
    forSale: true,
    unsplashId: "UGNXT7QryGA"
  },
  {
    id: "mar-y-arena",
    title: "Mar y arena",
    category: "drone",
    src: "img/fotos/mar-y-arena.jpg",
    w: 1800, h: 3205,
    description: "La orilla en vertical: el agua verde se funde con la arena clara.",
    date: "2021-08-08",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/550 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "AmYBsuRoEsA"
  },
  {
    id: "via-lactea-tras-el-arbol",
    title: "Vía Láctea tras el árbol",
    category: "nocturnas",
    src: "img/fotos/via-lactea-tras-el-arbol.jpg",
    w: 1800, h: 1140,
    description: "El centro galáctico asoma tras un árbol solitario en mitad del campo.",
    date: "2022-09-26",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplashId: "PRrkpoDu_Jo"
  },
  {
    id: "rompiente",
    title: "Rompiente",
    category: "drone",
    src: "img/fotos/rompiente.jpg",
    w: 1800, h: 2702,
    description: "Las olas rompen contra la costa vistas en vertical desde el dron.",
    date: "2024-05-13",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "Hasselblad L1D-20c", lens: "Hasselblad, L1D-20c", focal: "10.3 mm", aperture: "f/4.0", shutter: "1/80 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "qEfcXtAoMt8"
  },
  {
    id: "costa-de-tarifa",
    title: "Costa de Tarifa",
    category: "drone",
    src: "img/fotos/costa-de-tarifa.jpg",
    w: 1800, h: 3200,
    description: "Rocas oscuras y agua verde en la costa de Tarifa, vistas desde el aire.",
    date: "2018-07-19",
    location: { name: "Tarifa, Cádiz", lat: 36.0142861, lng: -5.60444430000007 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "131" },
    featured: false,
    forSale: true,
    unsplashId: "Ls"
  },
  {
    id: "espigon-castello",
    title: "Espigón, Castelló",
    category: "drone",
    src: "img/fotos/espigon-castello.jpg",
    w: 1800, h: 3205,
    description: "Un espigón se adentra en el mar visto desde el dron, en la costa de Castelló.",
    date: "2019-05-02",
    location: { name: "Castelló, Comunidad Valenciana", lat: 40.01154372, lng: 0.03663694 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/400 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "NYQ1XBrwgcE"
  },
  {
    id: "atardecer-en-tarifa",
    title: "Atardecer en Tarifa",
    category: "paisaje",
    src: "img/fotos/atardecer-en-tarifa.jpg",
    w: 1800, h: 1167,
    description: "El sol se pone sobre el mar en una playa vacía de Tarifa, con la red de voleibol como único testigo.",
    date: "2018-08-06",
    location: { name: "Tarifa, Cádiz", lat: 36.0104997, lng: -5.60274619999996 },
    exif: { camera: "Apple iPhone 8 Plus", lens: "Apple, iPhone 8 Plus", focal: "6.6 mm", aperture: "f/2.8", shutter: "1/607 s", iso: "20" },
    featured: false,
    forSale: true,
    unsplashId: "ocOesQ7hTK8"
  },
  {
    id: "avion-y-cuarto-menguante",
    title: "Avión y cuarto menguante",
    category: "luna",
    src: "img/fotos/avion-y-cuarto-menguante.jpg",
    w: 1800, h: 2400,
    description: "La estela de un avión pasa junto a la luna en cuarto menguante, a plena luz del día.",
    date: "2021-10-12",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "NIKON CORPORATION, NIKON Z 6", focal: "600 mm", aperture: "f/6.3", shutter: "1/2000 s", iso: "800" },
    featured: false,
    forSale: true,
    unsplashId: "cZTzhs"
  },
  {
    id: "torre-bajo-las-estrellas",
    title: "Torre bajo las estrellas",
    category: "nocturnas",
    src: "img/fotos/torre-bajo-las-estrellas.jpg",
    w: 1800, h: 2700,
    description: "Una torre solitaria iluminada bajo un cielo lleno de estrellas.",
    date: "2021-08-10",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "NIKON CORPORATION, NIKON Z 6", focal: "16 mm", aperture: "f/2.8", shutter: "20 s", iso: "3200" },
    featured: false,
    forSale: true,
    unsplashId: "Ueyk0dAg1t0"
  },
  {
    id: "orilla-de-tarifa",
    title: "Orilla de Tarifa",
    category: "drone",
    src: "img/fotos/orilla-de-tarifa.jpg",
    w: 1800, h: 3200,
    description: "La orilla de la playa de Tarifa en vertical, con el agua verde entrando en la arena.",
    date: "2018-07-19",
    location: { name: "Tarifa, Cádiz", lat: 36.0104997, lng: -5.60274619999996 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/100 s", iso: "154" },
    featured: false,
    forSale: true,
    unsplashId: "si2iONw0Pw4"
  },
  {
    id: "isla-en-el-embalse",
    title: "Isla en el embalse",
    category: "drone",
    src: "img/fotos/isla-en-el-embalse.jpg",
    w: 1800, h: 1150,
    description: "Una pequeña isla rodeada de agua azul profundo, vista en cenital.",
    date: "2019-04-21",
    location: { name: "Embalse de Valmayor, Madrid", lat: 40.59125336, lng: -4.04983783 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "101" },
    featured: false,
    forSale: true,
    unsplashId: "DrpCTbaUmfs"
  },
  {
    id: "solo-en-la-arena",
    title: "Solo en la arena",
    category: "drone",
    src: "img/fotos/solo-en-la-arena.jpg",
    w: 1800, h: 1011,
    description: "Una sola persona tumbada en una playa inmensa, vista desde el dron.",
    date: "2018-05-06",
    location: { name: "Tarifa, Cádiz", lat: 36.06639564, lng: -5.70098569 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/3400 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "y3Oza3nLaSs"
  }
];
/* PHOTOS:END */

/* Fotos de Unsplash que NO se quieren en la web (el workflow las ignora). */
window.EXCLUDED_UNSPLASH = ["AWdCgDDedH0", "lb9hi0NDjT0", "8nNQ82s", "WaX1Cdm3DXQ", "BKyJBKBloBQ", "ovmNuE1ix4A", "1HcK5xQoUKQ", "https://unsplash.com/photos/oUmfi_3lqsM", "xjBeT3iHNWQ", "V1HGgiYs", "7sNMhj2V0H0", "ELr2CebgUAI", "idMJhg2oRaY", "tMdzycSJml0", "_bzFLkJyY6o"];
