/* =====================================================================
   DATOS DEL SITIO Y DE LAS FOTOGRAFÍAS
   ---------------------------------------------------------------------
   Este es el único archivo que necesitas tocar para añadir o editar
   fotos. Cada foto es un objeto del array PHOTOS. Campos:

   id          Identificador único para la URL (sin espacios ni acentos).
   title       Título de la foto.
   category    "landscape" | "moon" | "drone" | "night"
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
  name: "piensaenpixel",
  tagline: "Landscape, moon, drone and night photography, from Madrid",
  location: "Spain, Madrid",
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
    "I photograph what happens when the light goes: the last hour in the mountains, the moon rising behind a ridge, the Milky Way over a quiet sea.",
    "I am Emilio García, a photographer based in Madrid. I work handheld, with a drone and with long telephoto lenses, almost always in Spain, looking for places I know well and going back until the light plays along.",
    "Every photograph on this site is available as a limited-edition print on fine art paper. If you are interested in one, write to me and I will tell you about sizes, finishes and prices."
  ]
};

window.CATEGORIES = [
  { id: "landscape", name: "Landscape", intro: "Mountains, valleys and coastlines in the hour when the light turns soft and the land breathes." },
  { id: "moon", name: "Moon", intro: "Full, waxing and waning moons, usually through a long telephoto and with a bit of luck with the clouds." },
  { id: "drone", name: "Drone", intro: "The land seen from above: shapes, textures and colours you can only see a hundred metres up." },
  { id: "night", name: "Night", intro: "Long exposures under dark skies: Milky Way, star trails and distant lights." }
]

/* PHOTOS:START — the «Import photos from Unsplash» workflow adds new photos here and keeps edited ones */
window.PHOTOS = [
  {
    id: "paraglider-against-the-full-moon",
    title: "Paraglider Against the Full Moon",
    category: "moon",
    src: "img/fotos/paraglider-against-the-full-moon.jpg",
    w: 1800, h: 1200,
    description: "A paraglider crosses in front of the full moon between high clouds. Shot with a 600 mm telephoto.",
    date: "2024-06-23",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 7", lens: "", focal: "600 mm", aperture: "f/11.0", shutter: "1/250 s", iso: "400" },
    featured: true,
    forSale: true,
    unsplashId: "088Q30AH28w"
  },
  {
    id: "milky-way-over-the-ermita-de-las-nieves",
    title: "Milky Way over the Ermita de las Nieves",
    category: "night",
    src: "img/fotos/milky-way-over-the-ermita-de-las-nieves.jpg",
    w: 1800, h: 2700,
    description: "The galactic core rising right behind the Ermita de las Nieves, in Tenerife.",
    date: "2025-05-06",
    location: { name: "Ermita de las Nieves, Tenerife, Spain", lat: 28.291564, lng: -16.62913 },
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
    description: "The rocks of Punta Nati cut against the dark sea, in Ciutadella de Menorca.",
    date: "2018-08-19",
    location: { name: "Punta Nati, Ciutadella de Menorca, Spain", lat: 40.05072794, lng: 3.82274119 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "2 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplashId: "Y7H8aS2Wn4c"
  },
  {
    id: "umbrellas",
    title: "Umbrellas",
    category: "drone",
    src: "img/fotos/umbrellas.jpg",
    w: 1800, h: 2736,
    description: "Umbrellas and towels dot the sand, seen from directly above.",
    date: "2018-05-06",
    location: { name: "Tarifa, Cádiz, Spain", lat: 36.06474972, lng: -5.68189211 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/3200 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplashId: "KBSOJaWNTlU"
  },
  {
    id: "beach-from-above",
    title: "Beach from Above",
    category: "drone",
    src: "img/fotos/beach-from-above.jpg",
    w: 1800, h: 1199,
    description: "Sand, foam and water in three bands, seen from directly overhead.",
    date: "2024-05-13",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "Hasselblad L1D-20c", lens: "", focal: "10.3 mm", aperture: "f/4.5", shutter: "1/200 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplashId: "Jk733Hfu_To"
  },
  {
    id: "the-tree-and-the-circle-of-light",
    title: "The Tree and the Circle of Light",
    category: "night",
    src: "img/fotos/the-tree-and-the-circle-of-light.jpg",
    w: 1800, h: 1200,
    description: "Long exposure at dusk: a drone carrying a light draws a perfect circle above a lone tree.",
    date: "2024-12-10",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: true,
    forSale: true,
    unsplashId: "VfeXGzHqA2I"
  },
  {
    id: "castle-under-the-night-sky",
    title: "Castle Under the Night Sky",
    category: "night",
    src: "img/fotos/castle-under-the-night-sky.jpg",
    w: 1800, h: 1200,
    description: "The silhouette of a ruined castle against the night sky.",
    date: "2021-07-11",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "", focal: "16 mm", aperture: "f/2.8", shutter: "20 s", iso: "1600" },
    featured: true,
    forSale: true,
    unsplashId: "crYpM4H2lmI"
  },
  {
    id: "sunset-over-the-sea",
    title: "Sunset over the Sea",
    category: "landscape",
    src: "img/fotos/sunset-over-the-sea.jpg",
    w: 1800, h: 2705,
    description: "The sun sinks below the horizon with the shoreline rocks in the foreground.",
    date: "2023-04-21",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "", focal: "35 mm", aperture: "f/9.0", shutter: "1/13 s", iso: "125" },
    featured: true,
    forSale: true,
    unsplashId: "89OJpvgo8Dg"
  },
  {
    id: "shadows-on-the-shore",
    title: "Shadows on the Shore",
    category: "drone",
    src: "img/fotos/shadows-on-the-shore.jpg",
    w: 1800, h: 1011,
    description: "The beach from above: the foam draws the shoreline and the shadows stretch the bathers.",
    date: "2021-08-08",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/350 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "lzlVmgxrcaM"
  },
  {
    id: "tarifa-from-the-air",
    title: "Tarifa from the Air",
    category: "drone",
    src: "img/fotos/tarifa-from-the-air.jpg",
    w: 1800, h: 2499,
    description: "The Tarifa shoreline in portrait: foam, sand and turquoise water.",
    date: "2018-07-19",
    location: { name: "Tarifa, Cádiz, Spain", lat: 36.0142861, lng: -5.60444430000007 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "105" },
    featured: false,
    forSale: true,
    unsplashId: "Yx_khCZyX8g"
  },
  {
    id: "into-the-pool",
    title: "Into the Pool",
    category: "drone",
    src: "img/fotos/into-the-pool.jpg",
    w: 1800, h: 3604,
    description: "Just before the dive: the pool in portrait from the drone.",
    date: "2019-08-19",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplashId: "eQfMpQ3WcVY"
  },
  {
    id: "floating",
    title: "Floating",
    category: "drone",
    src: "img/fotos/floating.jpg",
    w: 1800, h: 1003,
    description: "A swimmer on a pink float in the middle of the water, seen from the drone.",
    date: "2018-07-01",
    location: { name: "Madrid, Spain", lat: 40.39171667, lng: -3.72602167 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/470 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "Gd4NnmT__IA"
  },
  {
    id: "bridge-over-crystal-clear-water",
    title: "Bridge over Crystal-Clear Water",
    category: "drone",
    src: "img/fotos/bridge-over-crystal-clear-water.jpg",
    w: 1800, h: 1200,
    description: "A bridge crosses water so clear that the bottom shows from the air.",
    date: "2025-06-25",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "Hasselblad L1D-20c", lens: "", focal: "10.3 mm", aperture: "f/5.6", shutter: "1/500 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "W51Rp00XOdM"
  },
  {
    id: "milky-way-through-the-trees",
    title: "Milky Way Through the Trees",
    category: "night",
    src: "img/fotos/milky-way-through-the-trees.jpg",
    w: 1800, h: 1200,
    description: "The Milky Way finds its way between the treetops on a moonless night.",
    date: "2020-08-24",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "", focal: "11.5 mm", aperture: "f/2.8", shutter: "30 s", iso: "1000" },
    featured: false,
    forSale: true,
    unsplashId: "UGNXT7QryGA"
  },
  {
    id: "sea-and-sand",
    title: "Sea and Sand",
    category: "drone",
    src: "img/fotos/sea-and-sand.jpg",
    w: 1800, h: 3205,
    description: "The shoreline in portrait: green water melting into pale sand.",
    date: "2021-08-08",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/550 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "AmYBsuRoEsA"
  },
  {
    id: "milky-way-behind-the-tree",
    title: "Milky Way Behind the Tree",
    category: "night",
    src: "img/fotos/milky-way-behind-the-tree.jpg",
    w: 1800, h: 1140,
    description: "The galactic core rises behind a lone tree in the middle of the fields.",
    date: "2022-09-26",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplashId: "PRrkpoDu_Jo"
  },
  {
    id: "breakers",
    title: "Breakers",
    category: "drone",
    src: "img/fotos/breakers.jpg",
    w: 1800, h: 2702,
    description: "Waves breaking against the coast, seen straight down from the drone.",
    date: "2024-05-13",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "Hasselblad L1D-20c", lens: "", focal: "10.3 mm", aperture: "f/4.0", shutter: "1/80 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "qEfcXtAoMt8"
  },
  {
    id: "tarifa-coast",
    title: "Tarifa Coast",
    category: "drone",
    src: "img/fotos/tarifa-coast.jpg",
    w: 1800, h: 3200,
    description: "Dark rocks and green water on the Tarifa coast, seen from the air.",
    date: "2018-07-19",
    location: { name: "Tarifa, Cádiz, Spain", lat: 36.0142861, lng: -5.60444430000007 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "131" },
    featured: false,
    forSale: true,
    unsplashId: "Ls"
  },
  {
    id: "breakwater-castello",
    title: "Breakwater, Castelló",
    category: "drone",
    src: "img/fotos/breakwater-castello.jpg",
    w: 1800, h: 3205,
    description: "A breakwater reaches into the sea, seen from the drone on the Castelló coast.",
    date: "2019-05-02",
    location: { name: "Castelló, Spain", lat: 40.01154372, lng: 0.03663694 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/400 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "NYQ1XBrwgcE"
  },
  {
    id: "sunset-in-tarifa",
    title: "Sunset in Tarifa",
    category: "landscape",
    src: "img/fotos/sunset-in-tarifa.jpg",
    w: 1800, h: 1167,
    description: "The sun sets over the sea on an empty beach in Tarifa, the volleyball net the only witness.",
    date: "2018-08-06",
    location: { name: "Tarifa, Cádiz, Spain", lat: 36.0104997, lng: -5.60274619999996 },
    exif: { camera: "Apple iPhone 8 Plus", lens: "", focal: "6.6 mm", aperture: "f/2.8", shutter: "1/607 s", iso: "20" },
    featured: false,
    forSale: true,
    unsplashId: "ocOesQ7hTK8"
  },
  {
    id: "plane-and-waning-moon",
    title: "Plane and Waning Moon",
    category: "moon",
    src: "img/fotos/plane-and-waning-moon.jpg",
    w: 1800, h: 2400,
    description: "A plane's contrail passes beside the waning half moon in broad daylight.",
    date: "2021-10-12",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "", focal: "600 mm", aperture: "f/6.3", shutter: "1/2000 s", iso: "800" },
    featured: false,
    forSale: true,
    unsplashId: "cZTzhs"
  },
  {
    id: "tower-under-the-stars",
    title: "Tower Under the Stars",
    category: "night",
    src: "img/fotos/tower-under-the-stars.jpg",
    w: 1800, h: 2700,
    description: "A lone lit tower under a sky full of stars.",
    date: "2021-08-10",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "", focal: "16 mm", aperture: "f/2.8", shutter: "20 s", iso: "3200" },
    featured: false,
    forSale: true,
    unsplashId: "Ueyk0dAg1t0"
  },
  {
    id: "tarifa-shoreline",
    title: "Tarifa Shoreline",
    category: "drone",
    src: "img/fotos/tarifa-shoreline.jpg",
    w: 1800, h: 3200,
    description: "The shoreline of Tarifa beach in portrait, green water running into the sand.",
    date: "2018-07-19",
    location: { name: "Tarifa, Cádiz, Spain", lat: 36.0104997, lng: -5.60274619999996 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/100 s", iso: "154" },
    featured: false,
    forSale: true,
    unsplashId: "si2iONw0Pw4"
  },
  {
    id: "island-in-the-reservoir",
    title: "Island in the Reservoir",
    category: "drone",
    src: "img/fotos/island-in-the-reservoir.jpg",
    w: 1800, h: 1150,
    description: "A small island surrounded by deep blue water, seen from overhead.",
    date: "2019-04-21",
    location: { name: "Valmayor Reservoir, Madrid, Spain", lat: 40.59125336, lng: -4.04983783 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "101" },
    featured: false,
    forSale: true,
    unsplashId: "DrpCTbaUmfs"
  },
  {
    id: "alone-on-the-sand",
    title: "Alone on the Sand",
    category: "drone",
    src: "img/fotos/alone-on-the-sand.jpg",
    w: 1800, h: 1011,
    description: "A single person lying on an immense beach, seen from the drone.",
    date: "2018-05-06",
    location: { name: "Tarifa, Cádiz, Spain", lat: 36.06639564, lng: -5.70098569 },
    exif: { camera: "DJI FC220", lens: "", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/3400 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplashId: "y3Oza3nLaSs"
  }
];
/* PHOTOS:END */

/* Unsplash photos NOT wanted on the site (the import workflow skips them). */
window.EXCLUDED_UNSPLASH = ["AWdCgDDedH0", "lb9hi0NDjT0", "8nNQ82s", "WaX1Cdm3DXQ", "BKyJBKBloBQ", "ovmNuE1ix4A", "1HcK5xQoUKQ", "https://unsplash.com/photos/oUmfi_3lqsM", "xjBeT3iHNWQ", "V1HGgiYs", "7sNMhj2V0H0", "ELr2CebgUAI", "idMJhg2oRaY", "tMdzycSJml0", "_bzFLkJyY6o"];
