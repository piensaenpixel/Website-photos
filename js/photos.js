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
  tagline: "Fotografía de paisaje, luna, dron y noche",
  author: "Piensa en Pixel",
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
    "Trabajo con cámara en mano, con dron y con teleobjetivo, casi siempre en España, buscando lugares que conozco bien y volviendo a ellos hasta que la luz acompaña.",
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

window.PHOTOS = [
  /* ---------------------------------------------------------------- PAISAJE */
  {
    id: "ultima-luz-en-los-picos",
    title: "Última luz en los Picos",
    category: "paisaje",
    src: "img/fotos/paisaje_1.jpg",
    w: 1600, h: 1067,
    description: "Las crestas del macizo central se van apagando una a una mientras el valle ya está en sombra. Esperé casi una hora a que el sol bajara lo justo para que el cielo se encendiera sin quemar las nubes.\n\nUna de esas tardes en las que no hace falta ir muy lejos: la luz hace todo el trabajo.",
    date: "2025-10-12",
    location: { name: "Picos de Europa, Cantabria", lat: 43.1930, lng: -4.8520 },
    exif: { camera: "Sony α7 IV", lens: "FE 24-70 mm f/2.8 GM II", focal: "52 mm", aperture: "f/8", shutter: "1/60 s", iso: "100" },
    featured: true,
    forSale: true
  },
  {
    id: "niebla-en-el-hayedo",
    title: "Niebla en el hayedo",
    category: "paisaje",
    src: "img/fotos/paisaje_2.jpg",
    w: 1067, h: 1600,
    description: "Capas y más capas de bosque desapareciendo en la niebla. La foto está hecha con un teleobjetivo para comprimir la escena y que las lomas parezcan cortinas.",
    date: "2025-11-02",
    location: { name: "Selva de Irati, Navarra", lat: 42.9730, lng: -1.1030 },
    exif: { camera: "Sony α7 IV", lens: "FE 70-200 mm f/4 G", focal: "135 mm", aperture: "f/5.6", shutter: "1/125 s", iso: "400" },
    featured: true,
    forSale: true
  },
  {
    id: "espejo-de-oro",
    title: "Espejo de oro",
    category: "paisaje",
    src: "img/fotos/paisaje_3.jpg",
    w: 1600, h: 900,
    description: "Un amanecer sin una gota de viento. El embalse se convirtió en un espejo perfecto y el cielo hizo el resto.",
    date: "2025-09-21",
    location: { name: "Embalse de Riaño, León", lat: 42.9800, lng: -5.0100 },
    exif: { camera: "Sony α7 IV", lens: "FE 16-35 mm f/2.8 GM", focal: "24 mm", aperture: "f/11", shutter: "1/15 s", iso: "100" },
    featured: false,
    forSale: true
  },
  {
    id: "acantilado-y-bruma",
    title: "Acantilado y bruma",
    category: "paisaje",
    src: "img/fotos/paisaje_4.jpg",
    w: 1280, h: 1600,
    description: "Una exposición larga de medio minuto para convertir el mar en niebla y dejar que el acantilado sea el protagonista.",
    date: "2026-02-15",
    location: { name: "Cabo de Gata, Almería", lat: 36.7220, lng: -2.1920 },
    exif: { camera: "Sony α7 IV", lens: "FE 16-35 mm f/2.8 GM", focal: "20 mm", aperture: "f/11", shutter: "30 s", iso: "50" },
    featured: false,
    forSale: true
  },

  /* ------------------------------------------------------------------- LUNA */
  {
    id: "luna-de-cosecha",
    title: "Luna de cosecha",
    category: "luna",
    src: "img/fotos/luna_1.jpg",
    w: 1400, h: 1400,
    description: "La luna llena de septiembre a 600 mm. Apilé varias tomas para reducir el ruido y recuperar detalle en los mares lunares.",
    date: "2025-09-07",
    location: { name: "Sierra de Guadarrama, Madrid", lat: 40.7900, lng: -3.9800 },
    exif: { camera: "Sony α7 IV", lens: "FE 200-600 mm f/5.6-6.3 G", focal: "600 mm", aperture: "f/8", shutter: "1/250 s", iso: "200" },
    featured: true,
    forSale: true
  },
  {
    id: "salida-de-luna-sobre-la-cresta",
    title: "Salida de luna sobre la cresta",
    category: "luna",
    src: "img/fotos/luna_2.jpg",
    w: 1600, h: 1067,
    description: "Planificada con semanas de antelación: la luna asomando justo detrás del collado mientras el cielo todavía conservaba algo de azul.",
    date: "2025-08-09",
    location: { name: "Sierra de Gredos, Ávila", lat: 40.2600, lng: -5.3000 },
    exif: { camera: "Sony α7 IV", lens: "FE 200-600 mm f/5.6-6.3 G", focal: "400 mm", aperture: "f/6.3", shutter: "1/30 s", iso: "800" },
    featured: true,
    forSale: true
  },
  {
    id: "creciente",
    title: "Creciente",
    category: "luna",
    src: "img/fotos/luna_3.jpg",
    w: 1067, h: 1600,
    description: "Una luna en cuarto creciente. Es cuando mejor se ven los cráteres: la luz rasante en el terminador lo dibuja todo.",
    date: "2026-01-27",
    location: { name: "Bardenas Reales, Navarra", lat: 42.2100, lng: -1.4700 },
    exif: { camera: "Sony α7 IV", lens: "FE 200-600 mm f/5.6-6.3 G", focal: "600 mm", aperture: "f/8", shutter: "1/125 s", iso: "400" },
    featured: false,
    forSale: true
  },

  /* ------------------------------------------------------------------ DRONE */
  {
    id: "orilla-turquesa",
    title: "Orilla turquesa",
    category: "drone",
    src: "img/fotos/drone_1.jpg",
    w: 1600, h: 1067,
    description: "Bandas de agua cada vez más clara hasta llegar a la arena. Desde arriba la playa se convierte en una pintura abstracta.",
    date: "2025-07-19",
    location: { name: "Playa de Ses Illetes, Formentera", lat: 38.7530, lng: 1.4320 },
    exif: { camera: "DJI Mavic 3 Pro", lens: "Hasselblad 24 mm eq.", focal: "24 mm", aperture: "f/4", shutter: "1/800 s", iso: "100" },
    featured: true,
    forSale: true
  },
  {
    id: "la-carretera-que-serpentea",
    title: "La carretera que serpentea",
    category: "drone",
    src: "img/fotos/drone_2.jpg",
    w: 1280, h: 1600,
    description: "Una carretera de montaña vista en vertical, abriéndose paso entre el pinar como una línea dibujada a mano.",
    date: "2025-06-14",
    location: { name: "Sierra de Cazorla, Jaén", lat: 37.9100, lng: -2.9600 },
    exif: { camera: "DJI Mavic 3 Pro", lens: "Hasselblad 24 mm eq.", focal: "24 mm", aperture: "f/2.8", shutter: "1/500 s", iso: "100" },
    featured: false,
    forSale: true
  },
  {
    id: "parcelas",
    title: "Parcelas",
    category: "drone",
    src: "img/fotos/drone_3.jpg",
    w: 1600, h: 900,
    description: "Campos de cereal en distintos momentos de la siega, cortados por un camino. Geometría pura.",
    date: "2025-06-28",
    location: { name: "Tierra de Campos, Palencia", lat: 42.1000, lng: -4.7500 },
    exif: { camera: "DJI Mavic 3 Pro", lens: "Hasselblad 24 mm eq.", focal: "24 mm", aperture: "f/5.6", shutter: "1/640 s", iso: "100" },
    featured: true,
    forSale: true
  },

  /* -------------------------------------------------------------- NOCTURNAS */
  {
    id: "via-lactea-sobre-el-valle",
    title: "Vía Láctea sobre el valle",
    category: "nocturnas",
    src: "img/fotos/nocturna_1.jpg",
    w: 1600, h: 1067,
    description: "El centro galáctico saliendo por encima de las montañas en una noche sin luna. Cielo y tierra son dos exposiciones distintas para conservar detalle en ambas.",
    date: "2025-07-26",
    location: { name: "Valle de Ordesa, Huesca", lat: 42.6500, lng: -0.0500 },
    exif: { camera: "Sony α7 IV", lens: "FE 14 mm f/1.8 GM", focal: "14 mm", aperture: "f/1.8", shutter: "15 s", iso: "3200" },
    featured: true,
    forSale: true
  },
  {
    id: "circumpolar-en-el-faro",
    title: "Circumpolar en el faro",
    category: "nocturnas",
    src: "img/fotos/nocturna_2.jpg",
    w: 1067, h: 1600,
    description: "Dos horas de exposiciones encadenadas alrededor de la estrella polar. El faro dio vueltas todo ese tiempo y sólo dejó su luz.",
    date: "2025-10-25",
    location: { name: "Faro de Cabo Vilán, A Coruña", lat: 43.1620, lng: -9.2110 },
    exif: { camera: "Sony α7 IV", lens: "FE 16-35 mm f/2.8 GM", focal: "16 mm", aperture: "f/4", shutter: "240 × 30 s", iso: "800" },
    featured: false,
    forSale: true
  },
  {
    id: "luces-al-otro-lado-de-la-bahia",
    title: "Luces al otro lado de la bahía",
    category: "nocturnas",
    src: "img/fotos/nocturna_3.jpg",
    w: 1600, h: 900,
    description: "La ciudad reflejada en el agua quieta de la bahía a las tres de la madrugada, con el último azul del cielo todavía aguantando.",
    date: "2026-03-08",
    location: { name: "Bahía de Santander, Cantabria", lat: 43.4600, lng: -3.8000 },
    exif: { camera: "Sony α7 IV", lens: "FE 24-70 mm f/2.8 GM II", focal: "35 mm", aperture: "f/8", shutter: "20 s", iso: "200" },
    featured: false,
    forSale: true
  }
];
