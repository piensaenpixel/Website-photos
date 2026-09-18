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

/* PHOTOS:START — el workflow «Importar fotos de Unsplash» reemplaza este bloque */
window.PHOTOS = [
  {
    id: "man-playing-soccer-game-on-field",
    title: "Man playing soccer game on field",
    category: "paisaje",
    src: "img/fotos/man-playing-soccer-game-on-field.jpg",
    w: 1800, h: 1052,
    description: "Man playing soccer game on field.",
    date: "2019-11-24",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "200 mm", aperture: "f/3.5", shutter: "1/1600 s", iso: "3200" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/man-playing-soccer-game-on-field-AWdCgDDedH0"
  },
  {
    id: "new-york",
    title: "New York",
    category: "paisaje",
    src: "img/fotos/new-york.jpg",
    w: 1800, h: 1209,
    description: "Man wearing earphones laughing in front of monitor.",
    date: "2018-04-08",
    location: { name: "New York, United States", lat: 40.7127753, lng: -74.0059728 },
    exif: { camera: "", lens: "", focal: "0 mm", aperture: "", shutter: "", iso: "" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/man-wearing-earphones-laughing-in-front-of-monitor-lb9hi0NDjT0"
  },
  {
    id: "aerial-view-of-green-grass-field-near-body-of-water-during-d",
    title: "Aerial view of green grass field near body of water during daytime",
    category: "drone",
    src: "img/fotos/aerial-view-of-green-grass-field-near-body-of-water-during-d.jpg",
    w: 1800, h: 1011,
    description: "Aerial view of green grass field near body of water during daytime.",
    date: "2021-08-08",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/350 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/aerial-view-of-green-grass-field-near-body-of-water-during-daytime-lzlVmgxrcaM"
  },
  {
    id: "tarifa",
    title: "Tarifa",
    category: "drone",
    src: "img/fotos/tarifa.jpg",
    w: 1800, h: 2499,
    description: "Bird's eye photography of person standing on coastline.",
    date: "2018-07-19",
    location: { name: "Tarifa, Spain", lat: 36.0142861, lng: -5.60444430000007 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "105" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/birds-eye-photography-of-person-standing-on-coastline-Yx_khCZyX8g"
  },
  {
    id: "person-about-to-dive-on-swimming-pool",
    title: "Person about to dive on swimming pool",
    category: "drone",
    src: "img/fotos/person-about-to-dive-on-swimming-pool.jpg",
    w: 1800, h: 3604,
    description: "Person about to dive on swimming pool.",
    date: "2019-08-19",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/person-about-to-dive-on-swimming-pool-eQfMpQ3WcVY"
  },
  {
    id: "red-lace-brassiere-on-white-textile",
    title: "Red lace brassiere on white textile",
    category: "nocturnas",
    src: "img/fotos/red-lace-brassiere-on-white-textile.jpg",
    w: 1800, h: 2700,
    description: "Red lace brassiere on white textile.",
    date: "2021-06-27",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "50 mm", aperture: "f/4.0", shutter: "1/60 s", iso: "400" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/red-lace-brassiere-on-white-textile-ecm-8nNQ82s"
  },
  {
    id: "madrid",
    title: "Madrid",
    category: "drone",
    src: "img/fotos/madrid.jpg",
    w: 1800, h: 1003,
    description: "Woman on pink buoy surrounded by body of water during daytime.",
    date: "2018-07-01",
    location: { name: "Madrid, Spain", lat: 40.39171667, lng: -3.72602167 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/470 s", iso: "100" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/woman-on-pink-buoy-surrounded-by-body-of-water-during-daytime-Gd4NnmT__IA"
  },
  {
    id: "man-wearing-black-shirt-sitting-on-chair-using-laptop",
    title: "Man wearing black shirt sitting on chair using laptop",
    category: "drone",
    src: "img/fotos/man-wearing-black-shirt-sitting-on-chair-using-laptop.jpg",
    w: 1800, h: 1056,
    description: "Man wearing black shirt sitting on chair using laptop.",
    date: "2018-07-02",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/100 s", iso: "114" },
    featured: true,
    forSale: true,
    unsplash: "https://unsplash.com/photos/man-wearing-black-shirt-sitting-on-chair-using-laptop-WaX1Cdm3DXQ"
  },
  {
    id: "default",
    title: "default",
    category: "drone",
    src: "img/fotos/default.jpg",
    w: 1800, h: 1200,
    description: "A bridge spans over crystal clear water.",
    date: "2025-06-25",
    location: { name: "", lat: 0.0, lng: 0.0 },
    exif: { camera: "Hasselblad L1D-20c", lens: "Hasselblad, L1D-20c", focal: "10.3 mm", aperture: "f/5.6", shutter: "1/500 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/a-bridge-spans-over-crystal-clear-water-W51Rp00XOdM"
  },
  {
    id: "left-human-eye",
    title: "Left human eye",
    category: "paisaje",
    src: "img/fotos/left-human-eye.jpg",
    w: 1800, h: 1261,
    description: "Left human eye.",
    date: "2019-06-09",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "105 mm", aperture: "f/5.0", shutter: "1/400 s", iso: "640" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/left-human-eye-BKyJBKBloBQ"
  },
  {
    id: "brown-trees-under-blue-sky-during-night-time",
    title: "Brown trees under blue sky during night time",
    category: "nocturnas",
    src: "img/fotos/brown-trees-under-blue-sky-during-night-time.jpg",
    w: 1800, h: 1200,
    description: "Brown trees under blue sky during night time.",
    date: "2020-08-24",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "11.5 mm", aperture: "f/2.8", shutter: "30 s", iso: "1000" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/brown-trees-under-blue-sky-during-night-time-UGNXT7QryGA"
  },
  {
    id: "birds-flying-over-the-mountain-during-daytime",
    title: "Birds flying over the mountain during daytime",
    category: "drone",
    src: "img/fotos/birds-flying-over-the-mountain-during-daytime.jpg",
    w: 1800, h: 3205,
    description: "Birds flying over the mountain during daytime.",
    date: "2021-08-08",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/550 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/birds-flying-over-the-mountain-during-daytime-AmYBsuRoEsA"
  },
  {
    id: "a-tree-in-a-field-with-a-circle-in-the-sky",
    title: "A tree in a field with a circle in the sky",
    category: "drone",
    src: "img/fotos/a-tree-in-a-field-with-a-circle-in-the-sky.jpg",
    w: 1800, h: 1200,
    description: "A tree in a field with a circle in the sky.",
    date: "2024-12-10",
    location: { name: "", lat: 0.0, lng: 0.0 },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/a-tree-in-a-field-with-a-circle-in-the-sky-VfeXGzHqA2I"
  },
  {
    id: "milky-way-raising-behind-ermita-of-the-nieves-tenerife",
    title: "Milky way raising behind Ermita of the Nieves, Tenerife",
    category: "nocturnas",
    src: "img/fotos/milky-way-raising-behind-ermita-of-the-nieves-tenerife.jpg",
    w: 1800, h: 2700,
    description: "A church stands under a starry, milky way sky.",
    date: "2025-05-06",
    location: { name: "Tenerife, España", lat: 28.291564, lng: -16.62913 },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/a-church-stands-under-a-starry-milky-way-sky-hk00YEJ6j64"
  },
  {
    id: "a-tree-in-a-field",
    title: "A tree in a field",
    category: "nocturnas",
    src: "img/fotos/a-tree-in-a-field.jpg",
    w: 1800, h: 1140,
    description: "A tree in a field.",
    date: "2022-09-26",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/a-tree-in-a-field-PRrkpoDu_Jo"
  },
  {
    id: "the-sun-is-setting-over-the-ocean-with-rocks-in-the-foregrou",
    title: "The sun is setting over the ocean with rocks in the foreground",
    category: "nocturnas",
    src: "img/fotos/the-sun-is-setting-over-the-ocean-with-rocks-in-the-foregrou.jpg",
    w: 1800, h: 2705,
    description: "The sun is setting over the ocean with rocks in the foreground.",
    date: "2023-04-21",
    location: { name: "", lat: 0.0, lng: 0.0 },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "NIKON CORPORATION, NIKON Z 6", focal: "35 mm", aperture: "f/9.0", shutter: "1/13 s", iso: "125" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/the-sun-is-setting-over-the-ocean-with-rocks-in-the-foreground-89OJpvgo8Dg"
  },
  {
    id: "light-bulb-turned-on-in-tilt-shift-lens",
    title: "Light bulb turned on in tilt shift lens",
    category: "paisaje",
    src: "img/fotos/light-bulb-turned-on-in-tilt-shift-lens.jpg",
    w: 1800, h: 1164,
    description: "Light bulb turned on in tilt shift lens.",
    date: "2020-07-27",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "105 mm", aperture: "f/4.0", shutter: "1/250 s", iso: "400" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/light-bulb-turned-on-in-tilt-shift-lens-ovmNuE1ix4A"
  },
  {
    id: "an-aerial-view-of-a-body-of-water",
    title: "An aerial view of a body of water",
    category: "drone",
    src: "img/fotos/an-aerial-view-of-a-body-of-water.jpg",
    w: 1800, h: 2702,
    description: "An aerial view of a body of water.",
    date: "2024-05-13",
    location: { name: "", lat: 0.0, lng: 0.0 },
    exif: { camera: "Hasselblad L1D-20c", lens: "Hasselblad, L1D-20c", focal: "10.3 mm", aperture: "f/4.0", shutter: "1/80 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/an-aerial-view-of-a-body-of-water-qEfcXtAoMt8"
  },
  {
    id: "tarifa-kbsoja",
    title: "Tarifa",
    category: "drone",
    src: "img/fotos/tarifa-kbsoja.jpg",
    w: 1800, h: 2736,
    description: "People paragliding near the shore.",
    date: "2018-05-06",
    location: { name: "Tarifa, Spain", lat: 36.06474972, lng: -5.68189211 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/3200 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/people-paragliding-near-the-shore-KBSOJaWNTlU"
  },
  {
    id: "tarifa-f7lfg7",
    title: "Tarifa",
    category: "drone",
    src: "img/fotos/tarifa-f7lfg7.jpg",
    w: 1800, h: 3200,
    description: "Aerial photography of coastline.",
    date: "2018-07-19",
    location: { name: "Tarifa, Spain", lat: 36.0142861, lng: -5.60444430000007 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "131" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/aerial-photography-of-coastline-F7LfG7yw-Ls"
  },
  {
    id: "madrid-1hck5x",
    title: "Madrid",
    category: "paisaje",
    src: "img/fotos/madrid-1hck5x.jpg",
    w: 1800, h: 2716,
    description: "Black laptop computer on brown wooden table.",
    date: "2021-05-16",
    location: { name: "Madrid, España", lat: 40.416775, lng: -3.70379 },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "50 mm", aperture: "f/5.6", shutter: "1/125 s", iso: "400" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/black-laptop-computer-on-brown-wooden-table-1HcK5xQoUKQ"
  },
  {
    id: "metropolitan-city-of-florence",
    title: "Metropolitan City of Florence",
    category: "paisaje",
    src: "img/fotos/metropolitan-city-of-florence.jpg",
    w: 1800, h: 2689,
    description: "",
    date: "2018-05-06",
    location: { name: "Metropolitan City of Florence, Italy", lat: 43.7679178, lng: 11.2523792 },
    exif: { camera: "NIKON CORPORATION NIKON D60", lens: "NIKON CORPORATION, NIKON D60", focal: "105 mm", aperture: "f/2.8", shutter: "1/20 s", iso: "400" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/oUmfi_3lqsM"
  },
  {
    id: "calle-pl-numero-21",
    title: "Calle Pl Numero 21",
    category: "drone",
    src: "img/fotos/calle-pl-numero-21.jpg",
    w: 1800, h: 3205,
    description: "Ocean photography.",
    date: "2019-05-02",
    location: { name: "Calle Pl Numero 21, 9002R, 12100, Castelló, Spain", lat: 40.01154372, lng: 0.03663694 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/400 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/ocean-photography-NYQ1XBrwgcE"
  },
  {
    id: "port-of-tarifa",
    title: "Port of Tarifa",
    category: "paisaje",
    src: "img/fotos/port-of-tarifa.jpg",
    w: 1800, h: 1167,
    description: "Deserted beach with volleyball net.",
    date: "2018-08-06",
    location: { name: "Port of Tarifa, Spain", lat: 36.0104997, lng: -5.60274619999996 },
    exif: { camera: "Apple iPhone 8 Plus", lens: "Apple, iPhone 8 Plus", focal: "6.6 mm", aperture: "f/2.8", shutter: "1/607 s", iso: "20" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/deserted-beach-with-volleyball-net-ocOesQ7hTK8"
  },
  {
    id: "a-full-moon-is-seen-through-the-clouds",
    title: "A full moon is seen through the clouds",
    category: "luna",
    src: "img/fotos/a-full-moon-is-seen-through-the-clouds.jpg",
    w: 1800, h: 1200,
    description: "A full moon is seen through the clouds.",
    date: "2024-06-23",
    location: { name: "", lat: 0.0, lng: 0.0 },
    exif: { camera: "NIKON CORPORATION NIKON Z 7", lens: "NIKON CORPORATION, NIKON Z 7", focal: "600 mm", aperture: "f/11.0", shutter: "1/250 s", iso: "400" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/a-full-moon-is-seen-through-the-clouds-088Q30AH28w"
  },
  {
    id: "a-plane-flying-in-the-sky-with-a-half-moon-in-the-background",
    title: "A plane flying in the sky with a half moon in the background",
    category: "luna",
    src: "img/fotos/a-plane-flying-in-the-sky-with-a-half-moon-in-the-background.jpg",
    w: 1800, h: 2400,
    description: "A plane flying in the sky with a half moon in the background.",
    date: "2021-10-12",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "NIKON CORPORATION, NIKON Z 6", focal: "600 mm", aperture: "f/6.3", shutter: "1/2000 s", iso: "800" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/a-plane-flying-in-the-sky-with-a-half-moon-in-the-background--fhu-cZTzhs"
  },
  {
    id: "carretera-a-punta-nati",
    title: "Carretera a Punta Nati",
    category: "drone",
    src: "img/fotos/carretera-a-punta-nati.jpg",
    w: 1800, h: 1011,
    description: "Aerial photography of rock formations in ocean.",
    date: "2018-08-19",
    location: { name: "Carretera a Punta Nati, 07769 Ciutadella de Menorca, Illes Balears, Spain, Ciutadella de Menorca", lat: 40.05072794, lng: 3.82274119 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "2 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/aerial-photography-of-rock-formations-in-ocean-Y7H8aS2Wn4c"
  },
  {
    id: "white-concrete-building-under-white-sky-during-daytime",
    title: "White concrete building under white sky during daytime",
    category: "paisaje",
    src: "img/fotos/white-concrete-building-under-white-sky-during-daytime.jpg",
    w: 1800, h: 2700,
    description: "White concrete building under white sky during daytime.",
    date: "2021-01-10",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "50 mm", aperture: "f/7.1", shutter: "1/200 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/white-concrete-building-under-white-sky-during-daytime-xjBeT3iHNWQ"
  },
  {
    id: "gray-concrete-tower-under-starry-night",
    title: "Gray concrete tower under starry night",
    category: "nocturnas",
    src: "img/fotos/gray-concrete-tower-under-starry-night.jpg",
    w: 1800, h: 2700,
    description: "Gray concrete tower under starry night.",
    date: "2021-08-10",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON Z 6", lens: "NIKON CORPORATION, NIKON Z 6", focal: "16 mm", aperture: "f/2.8", shutter: "20 s", iso: "3200" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/gray-concrete-tower-under-starry-night-Ueyk0dAg1t0"
  },
  {
    id: "port-of-tarifa-si2ion",
    title: "Port of Tarifa",
    category: "drone",
    src: "img/fotos/port-of-tarifa-si2ion.jpg",
    w: 1800, h: 3200,
    description: "Aerial photography of beach shore.",
    date: "2018-07-19",
    location: { name: "Port of Tarifa, Spain", lat: 36.0104997, lng: -5.60274619999996 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/100 s", iso: "154" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/aerial-photography-of-beach-shore-si2iONw0Pw4"
  },
  {
    id: "madrid-vq-v1h",
    title: "Madrid",
    category: "nocturnas",
    src: "img/fotos/madrid-vq-v1h.jpg",
    w: 1800, h: 1196,
    description: "Person taking photo of concert.",
    date: "2018-08-06",
    location: { name: "Madrid, Spain", lat: 40.4167754, lng: -3.70379019999996 },
    exif: { camera: "Apple iPhone 8 Plus", lens: "Apple, iPhone 8 Plus", focal: "6.6 mm", aperture: "f/2.8", shutter: "1/51 s", iso: "1000" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/person-taking-photo-of-concert-Vq-V1HGgiYs"
  },
  {
    id: "lugar-urbanizacion-los-arroyos",
    title: "Lugar Urbanizacion los Arroyos",
    category: "drone",
    src: "img/fotos/lugar-urbanizacion-los-arroyos.jpg",
    w: 1800, h: 1150,
    description: "Bird's-eye photography of island.",
    date: "2019-04-21",
    location: { name: "Lugar Urbanizacion los Arroyos, 585, 28292, Madrid, Spain", lat: 40.59125336, lng: -4.04983783 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/50 s", iso: "101" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/birds-eye-photography-of-island-DrpCTbaUmfs"
  },
  {
    id: "new-york-7snmhj",
    title: "New York",
    category: "paisaje",
    src: "img/fotos/new-york-7snmhj.jpg",
    w: 1800, h: 2679,
    description: "Woman in black heeled sandals walking on gray concrete pavement.",
    date: "2018-04-02",
    location: { name: "New York, United States", lat: 40.7127753, lng: -74.0059728 },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/woman-in-black-heeled-sandals-walking-on-gray-concrete-pavement-7sNMhj2V0H0"
  },
  {
    id: "silhouette-of-castle-during-night-time",
    title: "Silhouette of castle during night time",
    category: "nocturnas",
    src: "img/fotos/silhouette-of-castle-during-night-time.jpg",
    w: 1800, h: 1200,
    description: "Silhouette of castle during night time.",
    date: "2021-07-11",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "16 mm", aperture: "f/2.8", shutter: "20 s", iso: "1600" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/silhouette-of-castle-during-night-time-crYpM4H2lmI"
  },
  {
    id: "tarifa-y3oza3",
    title: "Tarifa",
    category: "drone",
    src: "img/fotos/tarifa-y3oza3.jpg",
    w: 1800, h: 1011,
    description: "Aerial photograph of man lying on sand.",
    date: "2018-05-06",
    location: { name: "Tarifa, Spain", lat: 36.06639564, lng: -5.70098569 },
    exif: { camera: "DJI FC220", lens: "DJI, FC220", focal: "4.7 mm", aperture: "f/2.2", shutter: "1/3400 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/aerial-photograph-of-man-lying-on-sand-y3Oza3nLaSs"
  },
  {
    id: "an-aerial-view-of-a-sandy-beach-and-ocean",
    title: "An aerial view of a sandy beach and ocean",
    category: "drone",
    src: "img/fotos/an-aerial-view-of-a-sandy-beach-and-ocean.jpg",
    w: 1800, h: 1199,
    description: "An aerial view of a sandy beach and ocean.",
    date: "2024-05-13",
    location: { name: "", lat: 0.0, lng: 0.0 },
    exif: { camera: "Hasselblad L1D-20c", lens: "Hasselblad, L1D-20c", focal: "10.3 mm", aperture: "f/4.5", shutter: "1/200 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/an-aerial-view-of-a-sandy-beach-and-ocean-Jk733Hfu_To"
  },
  {
    id: "people-walking-on-snow-covered-field-during-daytime",
    title: "People walking on snow covered field during daytime",
    category: "paisaje",
    src: "img/fotos/people-walking-on-snow-covered-field-during-daytime.jpg",
    w: 1800, h: 2700,
    description: "People walking on snow covered field during daytime.",
    date: "2021-01-10",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "105 mm", aperture: "f/3.5", shutter: "1/200 s", iso: "100" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/people-walking-on-snow-covered-field-during-daytime-ELr2CebgUAI"
  },
  {
    id: "new-york-idmjhg",
    title: "New York",
    category: "paisaje",
    src: "img/fotos/new-york-idmjhg.jpg",
    w: 1800, h: 3079,
    description: "Water droplets on glass.",
    date: "2018-04-02",
    location: { name: "New York, United States", lat: 40.7127753, lng: -74.0059728 },
    exif: { camera: "", lens: "", focal: "", aperture: "", shutter: "", iso: "" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/water-droplets-on-glass-idMJhg2oRaY"
  },
  {
    id: "black-and-white-floral-gift-box-on-brown-wooden-table",
    title: "Black and white floral gift box on brown wooden table",
    category: "paisaje",
    src: "img/fotos/black-and-white-floral-gift-box-on-brown-wooden-table.jpg",
    w: 1800, h: 2700,
    description: "Black and white floral gift box on brown wooden table.",
    date: "2020-04-04",
    location: { name: "", lat: null, lng: null },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "50 mm", aperture: "f/2.8", shutter: "1/30 s", iso: "500" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/black-and-white-floral-gift-box-on-brown-wooden-table-tMdzycSJml0"
  },
  {
    id: "madrid-_bzflk",
    title: "Madrid",
    category: "paisaje",
    src: "img/fotos/madrid-_bzflk.jpg",
    w: 1800, h: 2700,
    description: "Orange and black floor lamp.",
    date: "2021-05-16",
    location: { name: "Madrid, España", lat: 40.416775, lng: -3.70379 },
    exif: { camera: "NIKON CORPORATION NIKON D5600", lens: "NIKON CORPORATION, NIKON D5600", focal: "50 mm", aperture: "f/9", shutter: "1/320 s", iso: "800" },
    featured: false,
    forSale: true,
    unsplash: "https://unsplash.com/photos/orange-and-black-floor-lamp-_bzFLkJyY6o"
  }
];
/* PHOTOS:END */
