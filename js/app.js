/* =====================================================================
   PIENSA EN PIXEL — aplicación
   Router por hash (#/galeria/luna, #/foto/id, ...) sin dependencias.
   Los datos viven en js/photos.js.
   ===================================================================== */
(function () {
  "use strict";

  const SITE = window.SITE || {};
  const PHOTOS = window.PHOTOS || [];
  const CATEGORIES = window.CATEGORIES || [];

  const app = document.getElementById("app");
  const header = document.getElementById("site-header");
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("menu-btn");
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------ helpers */
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const pad = (n) => String(n).padStart(2, "0");

  const catById = (id) => CATEGORIES.find((c) => c.id === id);
  const catName = (id) => (catById(id) || {}).name || id;
  const photosIn = (cat) => (cat ? PHOTOS.filter((p) => p.category === cat) : PHOTOS.slice());
  const photoById = (id) => PHOTOS.find((p) => p.id === id);

  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  }

  function fmtCoord(lat, lng) {
    const f = (v, pos, neg) => Math.abs(v).toFixed(4) + "° " + (v >= 0 ? pos : neg);
    return f(lat, "N", "S") + "  " + f(lng, "E", "O");
  }

  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).map((p) => "<p>" + esc(p.trim()) + "</p>").join("");
  }

  function imgTag(p, cls, attrs) {
    return '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || p.title) + '" width="' + (p.w || "") + '" height="' + (p.h || "") + '" data-fade class="' + (cls || "") + '" ' + (attrs || "") + ">";
  }

  function card(p, i) {
    const loc = p.location && p.location.name ? p.location.name : catName(p.category);
    return (
      '<a class="card sr sr-img' + (p.h > p.w ? " card--portrait" : "") + '" style="--i:' + (i || 0) + '" href="#/foto/' + esc(p.id) + '" data-cursor="Ver">' +
        '<div class="card__frame">' + imgTag(p, "", 'loading="lazy"') + "</div>" +
        '<div class="card__meta"><span class="card__title">' + esc(p.title) + '</span><span class="card__loc">' + esc(loc) + "</span></div>" +
      "</a>"
    );
  }

  /* ------------------------------------------------------------- páginas */
  function renderHome() {
    const featured = PHOTOS.filter((p) => p.featured);
    const hero = featured.find((p) => p.w >= p.h) || PHOTOS[0];
    if (!hero) return '<section class="page empty">Todavía no hay fotografías. Añádelas en js/photos.js.</section>';

    const series = CATEGORIES.map((c, i) => {
      const n = photosIn(c.id).length;
      return (
        '<a class="serie sr" href="#/galeria/' + c.id + '" data-serie="' + c.id + '">' +
          '<span class="serie__num">' + pad(i + 1) + "</span>" +
          '<span class="serie__name">' + esc(c.name) + "</span>" +
          '<span class="serie__count">' + n + (n === 1 ? " foto" : " fotos") + "</span>" +
          '<span class="serie__intro">' + esc(c.intro) + "</span>" +
        "</a>"
      );
    }).join("");

    const previews = CATEGORIES.map((c, i) => {
      const p = photosIn(c.id).find((x) => x.h >= x.w) || photosIn(c.id)[0];
      if (!p) return "";
      return '<img src="' + esc(p.src) + '" alt="" data-preview="' + c.id + '" class="' + (i === 0 ? "is-active" : "") + '">';
    }).join("");

    const feed = featured.slice(0, 8).map((p, i) => feedItem(p, i)).join("");
    const marquee = CATEGORIES.map((c) => "<span>" + esc(c.name) + "</span>").join("") + "<span>Copias de edición limitada</span><span>Madrid</span>";

    return (
      '<section class="hero">' +
        '<img class="hero__img" src="' + esc(hero.src) + '" alt="' + esc(hero.alt || hero.title) + '">' +
        '<p class="eyebrow eyebrow--accent hero__eyebrow sr">Paisaje · Luna · Drone · Nocturnas</p>' +
        '<h1 class="hero__title split" style="--i:1"><span class="w"><span class="w__i" style="--d:0">Piensa</span></span> <span class="w"><span class="w__i" style="--d:90"><em>en</em></span></span> <span class="w"><span class="w__i" style="--d:180">Pixel</span></span></h1>' +
        '<div class="hero__bottom sr" style="--i:2">' +
          '<p class="hero__tagline">' + esc(SITE.tagline || "") + "</p>" +
          '<p class="hero__caption"><a href="#/foto/' + esc(hero.id) + '">' + esc(hero.title) + "</a>" + (hero.location && hero.location.name ? " · " + esc(hero.location.name) : "") + "</p>" +
        "</div>" +
        '<span class="hero__scroll" aria-hidden="true">Desliza</span>' +
      "</section>" +

      '<section class="feed">' +
        '<div class="feed__head sr"><h2 class="feed__title split" data-split>Selección</h2><a class="link-u" href="#/galeria">Toda la galería</a></div>' +
        feed +
      "</section>" +

      '<div class="marquee" aria-hidden="true"><div class="marquee__track">' + marquee + marquee + "</div></div>" +

      '<section class="series" id="series">' +
        '<div class="series__head sr"><span class="eyebrow">Series</span><span class="eyebrow">' + PHOTOS.length + " fotografías</span></div>" +
        '<div class="series__list">' + series + "</div>" +
        '<div class="series__preview sr" aria-hidden="true">' + previews + '<span class="series__preview-label" id="preview-label">' + esc(CATEGORIES[0] ? CATEGORIES[0].name : "") + "</span></div>" +
      "</section>" +

      '<section class="statement">' +
        '<span class="eyebrow sr">Copias</span>' +
        '<div><p class="sr">Copias de <em>edición limitada</em> sobre papel fine art, numeradas y firmadas.</p>' +
        '<a class="btn statement__cta sr" href="#/contacto">Cómo comprar <span class="btn__arrow">→</span></a></div>' +
      "</section>"
    );
  }

  function feedItem(p, i) {
    const portrait = p.h > p.w;
    return (
      '<a class="feed__item sr sr-img' + (portrait ? " feed__item--portrait" : "") + '" href="#/foto/' + esc(p.id) + '" data-cursor="Ver">' +
        '<div class="feed__media">' + imgTag(p, "", i === 0 ? "" : 'loading="lazy"') + "</div>" +
        '<div class="feed__caption">' +
          '<span class="feed__num">' + pad(i + 1) + "</span>" +
          '<span class="feed__name">' + esc(p.title) + "</span>" +
          '<span class="feed__meta">' + esc(catName(p.category)) + (p.location && p.location.name ? " · " + esc(p.location.name) : "") + "</span>" +
        "</div>" +
      "</a>"
    );
  }

  const VIEW_KEY = "gallery-view";
  function getView() { try { return localStorage.getItem(VIEW_KEY) === "large" ? "large" : "grid"; } catch (e) { return "grid"; } }
  function setView(v) { try { localStorage.setItem(VIEW_KEY, v); } catch (e) {} }

  function renderGallery(cat) {
    const c = cat ? catById(cat) : null;
    if (cat && !c) return renderNotFound();
    const list = photosIn(cat);
    const view = getView();
    const filters = ['<a href="#/galeria" class="' + (!cat ? "is-active" : "") + '">Todas</a>']
      .concat(CATEGORIES.map((x) => '<a href="#/galeria/' + x.id + '" class="' + (x.id === cat ? "is-active" : "") + '">' + esc(x.name) + "</a>"))
      .join("");
    const toggle =
      '<div class="view-toggle" role="group" aria-label="Vista">' +
        '<button type="button" data-view="grid" class="' + (view === "grid" ? "is-active" : "") + '" aria-label="Vista en rejilla" title="Rejilla"><svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6"/><rect x="9" y="1" width="6" height="6"/><rect x="1" y="9" width="6" height="6"/><rect x="9" y="9" width="6" height="6"/></svg></button>' +
        '<button type="button" data-view="large" class="' + (view === "large" ? "is-active" : "") + '" aria-label="Vista grande" title="Grande"><svg viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="6"/><rect x="1" y="9" width="14" height="6"/></svg></button>' +
      "</div>";

    return (
      '<section class="page">' +
        '<div class="page-head">' +
          '<p class="eyebrow sr">' + (c ? "Serie " + pad(CATEGORIES.indexOf(c) + 1) : "Archivo") + " · " + list.length + (list.length === 1 ? " fotografía" : " fotografías") + "</p>" +
          '<h1 class="page-head__title split" data-split style="--i:1">' + esc(c ? c.name : "Galería") + "</h1>" +
          (c ? '<p class="page-head__intro sr" style="--i:2">' + esc(c.intro) + "</p>" : "") +
          '<div class="page-head__meta sr" style="--i:3"><nav class="filters" aria-label="Series">' + filters + "</nav>" + toggle + "</div>" +
        "</div>" +
        (list.length
          ? '<div class="grid' + (view === "large" ? " grid--large" : "") + '" id="gallery-grid">' + list.map((p, i) => card(p, i % 3)).join("") + "</div>"
          : '<p class="empty">Aún no hay fotografías en esta serie.</p>') +
      "</section>"
    );
  }

  function initViewToggle() {
    const grid = document.getElementById("gallery-grid");
    app.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.view;
        setView(v);
        app.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("is-active", b === btn));
        if (grid) {
          grid.classList.toggle("grid--large", v === "large");
          grid.querySelectorAll(".sr").forEach((el) => el.classList.add("is-in"));
        }
      });
    });
  }

  function renderPhoto(id) {
    const p = photoById(id);
    if (!p) return renderNotFound();
    const siblings = photosIn(p.category);
    const idx = siblings.indexOf(p);
    const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
    const next = siblings[(idx + 1) % siblings.length];
    const ex = p.exif || {};
    const rows = [
      ["Cámara", ex.camera], ["Objetivo", ex.lens], ["Focal", ex.focal],
      ["Apertura", ex.aperture], ["Velocidad", ex.shutter], ["ISO", ex.iso],
      ["Fecha", fmtDate(p.date)], ["Tamaño", p.w && p.h ? p.w + " × " + p.h + " px" : ""]
    ].filter((r) => r[1]);
    const hasMap = p.location && typeof p.location.lat === "number" && typeof p.location.lng === "number";
    const related = siblings.filter((x) => x !== p).slice(0, 4);

    const arrow = (dir) => dir === "prev"
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M15 4l-8 8 8 8"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M9 4l8 8-8 8"/></svg>';

    return (
      '<article class="photo">' +
        '<div class="photo__stage">' +
          (siblings.length > 1 ? '<a class="photo__nav photo__nav--prev" href="#/foto/' + esc(prev.id) + '" aria-label="Anterior: ' + esc(prev.title) + '">' + arrow("prev") + "</a>" : "") +
          imgTag(p, "", 'fetchpriority="high"') +
          (siblings.length > 1 ? '<a class="photo__nav photo__nav--next" href="#/foto/' + esc(next.id) + '" aria-label="Siguiente: ' + esc(next.title) + '">' + arrow("next") + "</a>" : "") +
        "</div>" +
        '<div class="photo__strip">' +
          '<a href="#/galeria/' + esc(p.category) + '">← ' + esc(catName(p.category)) + "</a>" +
          "<span>" + pad(idx + 1) + " / " + pad(siblings.length) + "</span>" +
          "<span>" + esc(p.location && p.location.name ? p.location.name : "") + "</span>" +
        "</div>" +
        '<div class="photo__body">' +
          "<div>" +
            '<p class="eyebrow eyebrow--accent sr">' + esc(catName(p.category)) + (p.date ? " · " + esc(fmtDate(p.date)) : "") + "</p>" +
            '<h1 class="photo__title split" data-split style="--i:1">' + esc(p.title) + "</h1>" +
            '<div class="photo__desc sr" style="--i:2">' + paragraphs(p.description) + "</div>" +
            '<div class="photo__actions sr" style="--i:3">' +
              (p.forSale !== false ? '<a class="btn btn--solid" href="#/contacto?foto=' + encodeURIComponent(p.id) + '">Quiero esta foto <span class="btn__arrow">→</span></a>' : "") +
              (hasMap ? '<a class="btn" href="#mapa" data-scroll="mapa">Ver en el mapa</a>' : "") +
              (p.forSale !== false ? '<p class="photo__actions-note">Copias de edición limitada sobre papel fine art. Escríbeme y te cuento tamaños, acabados y precios.</p>' : "") +
            "</div>" +
          "</div>" +
          "<aside>" +
            '<div class="spec">' +
              '<div class="spec__head"><h2 class="spec__title">Ficha técnica</h2><span class="eyebrow">EXIF</span></div>' +
              (rows.length ? "<dl>" + rows.map((r, i) => '<dt class="sr" style="--i:' + (i + 2) + '">' + esc(r[0]) + '</dt><dd class="sr" style="--i:' + (i + 2) + '">' + esc(r[1]) + "</dd>").join("") + "</dl>" : '<p class="eyebrow">Sin datos</p>') +
            "</div>" +
            (hasMap
              ? '<div class="map sr" id="mapa" style="--i:3">' +
                  '<div class="map__head"><h2 class="map__title">' + esc(p.location.name || "Localización") + '</h2><span class="map__coords">' + fmtCoord(p.location.lat, p.location.lng) + "</span></div>" +
                  '<div class="map__canvas" id="map-canvas" data-lat="' + p.location.lat + '" data-lng="' + p.location.lng + '" data-name="' + esc(p.location.name || "") + '">' +
                    '<div class="map__fallback">Cargando mapa…</div>' +
                  "</div>" +
                "</div>"
              : "") +
          "</aside>" +
        "</div>" +
        (related.length
          ? '<section class="related"><div class="related__head"><h2 class="related__title">Más de ' + esc(catName(p.category)) + '</h2><a class="link-u" href="#/galeria/' + esc(p.category) + '">Ver la serie</a></div>' +
            '<div class="related__grid">' + related.map((x, i) => card(x, i)).join("") + "</div></section>"
          : "") +
      "</article>"
    );
  }

  function renderAbout() {
    const portrait = SITE.portrait ? { src: SITE.portrait, title: SITE.author || SITE.name, w: 1200, h: 1500 } : (PHOTOS.find((p) => p.h > p.w) || PHOTOS[0]);
    const paras = (SITE.about || []).map((t) => "<p>" + esc(t) + "</p>").join("");
    return (
      '<section class="page">' +
        '<div class="page-head">' +
          '<p class="eyebrow sr">Sobre mí</p>' +
          '<h1 class="page-head__title split" data-split style="--i:1">' + esc(SITE.author || SITE.name) + "</h1>" +
        "</div>" +
        '<div class="about">' +
          '<div class="about__portrait sr" style="--i:1">' + (portrait ? imgTag(portrait, "") : "") + "</div>" +
          '<div class="about__text sr" style="--i:2">' + paras +
            '<div class="about__links">' +
              (SITE.instagram ? '<a class="btn" href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">Instagram</a>' : "") +
              (SITE.unsplash ? '<a class="btn" href="' + esc(SITE.unsplash) + '" target="_blank" rel="noopener">Unsplash</a>' : "") +
              '<a class="btn btn--solid" href="#/contacto">Escríbeme <span class="btn__arrow">→</span></a>' +
            "</div>" +
            '<div class="about__facts">' +
              '<div class="about__fact"><strong>' + PHOTOS.length + "</strong><span>Fotografías</span></div>" +
              '<div class="about__fact"><strong>' + CATEGORIES.length + "</strong><span>Series</span></div>" +
              '<div class="about__fact"><strong>Ltd.</strong><span>Copias numeradas</span></div>' +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function renderContact(params) {
    const p = params.get("foto") ? photoById(params.get("foto")) : null;
    const subject = p ? "Me interesa la fotografía «" + p.title + "»" : "";
    const options = ['<option value="Compra de una copia"' + (p ? " selected" : "") + ">Compra de una copia</option>",
      '<option value="Licencia de uso">Licencia de uso / editorial</option>',
      '<option value="Encargo">Encargo o colaboración</option>',
      '<option value="Otra cosa">Otra cosa</option>'].join("");

    return (
      '<section class="page">' +
        '<div class="page-head">' +
          '<p class="eyebrow sr">Contacto</p>' +
          '<h1 class="page-head__title split" data-split style="--i:1">Hablemos</h1>' +
          '<p class="page-head__intro sr" style="--i:2">Si quieres una copia, una licencia o simplemente comentar algo de una foto, este es el sitio. Suelo responder en un par de días.</p>' +
        "</div>" +
        '<div class="contact">' +
          '<aside class="contact__aside sr" style="--i:2">' +
            "<p>Las copias se imprimen bajo pedido en papel fine art de algodón, en ediciones limitadas y numeradas. Dime qué foto te interesa y el tamaño aproximado y te paso opciones y precio.</p>" +
            (p
              ? '<a class="contact__photo" href="#/foto/' + esc(p.id) + '">' + '<img src="' + esc(p.src) + '" alt="">' + "<div><strong>" + esc(p.title) + "</strong><span>" + esc(catName(p.category)) + (p.location && p.location.name ? " · " + esc(p.location.name) : "") + "</span></div></a>"
              : "") +
            '<div class="contact__list">' +
              (SITE.email ? '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "<span>Email</span></a>" : "") +
              (SITE.instagram ? '<a href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">@piensaenpixel<span>Instagram</span></a>' : "") +
              (SITE.unsplash ? '<a href="' + esc(SITE.unsplash) + '" target="_blank" rel="noopener">piensaenpixel<span>Unsplash</span></a>' : "") +
            "</div>" +
          "</aside>" +
          '<form class="form sr" id="contact-form" style="--i:3" novalidate>' +
            '<div class="form__row">' +
              '<div class="field"><label for="f-name">Nombre</label><input id="f-name" name="name" type="text" placeholder="Tu nombre" required autocomplete="name"></div>' +
              '<div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" placeholder="tu@correo.com" required autocomplete="email"></div>' +
            "</div>" +
            '<div class="form__row">' +
              '<div class="field"><label for="f-topic">Motivo</label><select id="f-topic" name="motivo">' + options + "</select></div>" +
              '<div class="field"><label for="f-photo">Fotografía</label><input id="f-photo" name="fotografia" type="text" placeholder="Título de la foto" value="' + esc(p ? p.title : "") + '"></div>' +
            "</div>" +
            '<div class="field"><label for="f-msg">Mensaje</label><textarea id="f-msg" name="message" placeholder="Cuéntame qué tienes en mente" required>' + esc(subject ? subject + ".\n\n" : "") + "</textarea></div>" +
            '<input type="hidden" name="_subject" value="' + esc(subject || "Mensaje desde la web") + '">' +
            '<label class="hp" aria-hidden="true">No rellenar<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>' +
            '<div class="form__foot">' +
              '<button class="btn btn--solid" type="submit">Enviar mensaje <span class="btn__arrow">→</span></button>' +
              '<p class="form__note">' + (SITE.formspreeId ? "El mensaje llega directamente a mi correo." : "Al pulsar se abrirá tu aplicación de correo con el mensaje preparado.") + "</p>" +
            "</div>" +
            '<p class="form__status" id="form-status" aria-live="polite"></p>' +
          "</form>" +
        "</div>" +
      "</section>"
    );
  }

  function renderNotFound() {
    return (
      '<section class="page"><div class="page-head">' +
        '<p class="eyebrow sr">404</p>' +
        '<h1 class="page-head__title split" data-split style="--i:1">Nada por aquí</h1>' +
        '<p class="page-head__intro sr" style="--i:2">Esa página no existe. <a class="link-u" href="#/galeria">Vuelve a la galería</a>.</p>' +
      "</div></section>"
    );
  }

  /* --------------------------------------------------------------- router */
  function parseHash() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const [pathPart, query] = raw.split("?");
    const parts = pathPart.split("/").filter(Boolean);
    return { parts, params: new URLSearchParams(query || "") };
  }

  let currentKey = null;

  function render() {
    const { parts, params } = parseHash();
    const [seg, arg] = parts;
    let html, title = SITE.name || "", nav = null, key = parts.join("/");

    if (!seg) { html = renderHome(); }
    else if (seg === "galeria") { html = renderGallery(arg); title = (arg ? catName(arg) : "Galería") + " — " + SITE.name; nav = arg || null; }
    else if (seg === "foto") { const p = photoById(arg); html = renderPhoto(arg); if (p) { title = p.title + " — " + SITE.name; nav = p.category; } }
    else if (seg === "sobre-mi") { html = renderAbout(); title = "Sobre mí — " + SITE.name; nav = "sobre-mi"; }
    else if (seg === "contacto") { html = renderContact(params); title = "Contacto — " + SITE.name; nav = "contacto"; key += "?" + params.toString(); }
    else { html = renderNotFound(); }

    if (key === currentKey) return;
    const first = currentKey === null;
    currentKey = key;

    document.title = title;
    document.querySelectorAll(".nav a").forEach((a) => a.classList.toggle("is-active", a.dataset.nav === nav));
    closeMenu();

    const swap = () => {
      app.innerHTML = html;
      window.scrollTo({ top: 0, behavior: "instant" });
      afterRender(seg);
    };

    if (first) {
      swap();
      runLoader(() => startReveals());
    } else {
      const label = curtainLabelFor(seg, arg);
      curtainLabel.textContent = label;
      curtain.classList.remove("is-out");
      curtain.classList.add("is-in");
      setTimeout(() => {
        swap();
        curtain.classList.remove("is-in");
        curtain.classList.add("is-out");
        setTimeout(startReveals, 250);
        setTimeout(() => curtain.classList.remove("is-out"), 700);
      }, 520);
    }
  }

  function curtainLabelFor(seg, arg) {
    if (!seg) return SITE.name || "";
    if (seg === "galeria") return arg ? catName(arg) : "Galería";
    if (seg === "foto") { const p = photoById(arg); return p ? p.title : ""; }
    if (seg === "sobre-mi") return "Sobre mí";
    if (seg === "contacto") return "Hablemos";
    return "";
  }

  /* ------------------------------------------------------ pantalla de carga */
  const loader = document.getElementById("loader");
  const curtain = document.getElementById("curtain");
  const curtainLabel = document.getElementById("curtain-label");

  function runLoader(done) {
    let seen = false;
    try { seen = sessionStorage.getItem("loaded") === "1"; sessionStorage.setItem("loaded", "1"); } catch (e) {}
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) { loader.hidden = true; done(); return; }
    requestAnimationFrame(() => loader.classList.add("is-loading"));
    const heroImg = app.querySelector(".hero__img");
    const minTime = new Promise((r) => setTimeout(r, 1500));
    const imgReady = new Promise((r) => {
      if (!heroImg || heroImg.complete) return r();
      heroImg.addEventListener("load", r, { once: true });
      heroImg.addEventListener("error", r, { once: true });
      setTimeout(r, 4000);
    });
    Promise.all([minTime, imgReady]).then(() => {
      loader.classList.add("is-done");
      setTimeout(done, 350);
      setTimeout(() => { loader.hidden = true; }, 1000);
    });
  }

  function afterRender(seg) {
    // Imágenes: fundido al cargar
    app.querySelectorAll("img[data-fade]").forEach((img) => {
      const done = () => img.classList.add("is-loaded");
      if (img.complete && img.naturalWidth) done();
      else { img.addEventListener("load", done, { once: true }); img.addEventListener("error", done, { once: true }); }
    });

    app.querySelectorAll("[data-split]").forEach(splitWords);
    initParallax();
    if (!seg) initSeriesPreview();
    if (seg === "galeria") initViewToggle();
    if (seg === "foto") { initMap(); initScrollLinks(); }
    if (seg === "contacto") initForm();
  }

  /* ------------------------------------------- aparición al hacer scroll */
  let observer = null;
  function startReveals() {
    if (observer) observer.disconnect();
    const els = app.querySelectorAll(".sr, .split");
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); observer.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    els.forEach((el) => observer.observe(el));
  }

  function splitWords(el) {
    if (el.dataset.splitDone) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => '<span class="w"><span class="w__i" style="--d:' + (i * 70) + '">' + esc(w) + "</span></span>").join(" ");
    el.dataset.splitDone = "1";
  }

  /* --------------------------------------------------------- parallax */
  let parallaxEls = [];
  let ticking = false;
  function initParallax() {
    parallaxEls = Array.from(app.querySelectorAll(".feed__media img"));
    updateParallax();
  }
  function updateParallax() {
    if (!parallaxEls.length) return;
    const vh = window.innerHeight;
    parallaxEls.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const centre = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1
      img.style.setProperty("--py", (centre * -0.06 * r.height).toFixed(1) + "px");
    });
  }
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateParallax(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", updateParallax);

  /* ------------------------------------------------------------ cursor */
  const cursor = document.getElementById("cursor");
  const cursorLabel = document.getElementById("cursor-label");
  (function initCursor() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2, cx = x, cy = y, raf = null;
    const move = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      cursor.style.left = cx + "px"; cursor.style.top = cy + "px";
      if (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2) raf = requestAnimationFrame(move); else raf = null;
    };
    document.addEventListener("mousemove", (e) => {
      x = e.clientX; y = e.clientY;
      cursor.classList.remove("is-hidden");
      if (!raf) raf = requestAnimationFrame(move);
      const t = e.target.closest ? e.target.closest("[data-cursor], a, button, .filters a, input, textarea, select") : null;
      if (t && t.dataset && t.dataset.cursor) {
        cursorLabel.textContent = t.dataset.cursor;
        cursor.classList.add("is-view"); cursor.classList.remove("is-link");
      } else if (t) {
        cursor.classList.add("is-link"); cursor.classList.remove("is-view");
      } else {
        cursor.classList.remove("is-link", "is-view");
      }
    }, { passive: true });
    document.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    document.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));
  })();

  /* -------------------------------------------------- portada: previews */
  function initSeriesPreview() {
    const imgs = app.querySelectorAll("[data-preview]");
    const label = document.getElementById("preview-label");
    app.querySelectorAll("[data-serie]").forEach((a) => {
      const show = () => {
        imgs.forEach((i) => i.classList.toggle("is-active", i.dataset.preview === a.dataset.serie));
        if (label) label.textContent = catName(a.dataset.serie);
      };
      a.addEventListener("mouseenter", show);
      a.addEventListener("focus", show);
    });
  }

  function initScrollLinks() {
    app.querySelectorAll("[data-scroll]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const el = document.getElementById(a.dataset.scroll);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ------------------------------------------------------------- mapa */
  const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
  let leafletPromise = null;

  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise((resolve, reject) => {
      const css = document.createElement("link");
      css.rel = "stylesheet"; css.href = LEAFLET_CSS;
      document.head.appendChild(css);
      const s = document.createElement("script");
      s.src = LEAFLET_JS; s.async = true;
      s.onload = () => resolve(window.L);
      s.onerror = () => { leafletPromise = null; reject(new Error("No se pudo cargar Leaflet")); };
      document.head.appendChild(s);
    });
    return leafletPromise;
  }

  function initMap() {
    const el = document.getElementById("map-canvas");
    if (!el) return;
    const lat = parseFloat(el.dataset.lat), lng = parseFloat(el.dataset.lng), name = el.dataset.name;
    const osmLink = "https://www.openstreetmap.org/?mlat=" + lat + "&mlon=" + lng + "#map=11/" + lat + "/" + lng;

    const fallback = () => {
      el.innerHTML = '<div class="map__fallback"><span>' + esc(name) + "<br>" + fmtCoord(lat, lng) + '<br><br><a class="link-u" href="' + osmLink + '" target="_blank" rel="noopener">Abrir en OpenStreetMap</a></span></div>';
    };

    loadLeaflet().then((L) => {
      if (!document.body.contains(el)) return;
      el.innerHTML = "";
      const map = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([lat, lng], 9);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
      const icon = L.divIcon({ className: "", html: '<div class="map__pin"></div>', iconSize: [14, 14], iconAnchor: [7, 7] });
      L.marker([lat, lng], { icon, title: name }).addTo(map);
      setTimeout(() => map.invalidateSize(), 300);
    }).catch(fallback);
  }

  /* --------------------------------------------------------- formulario */
  function initForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      status.classList.remove("is-error");
      if (!form.checkValidity()) {
        status.textContent = "Revisa el nombre, el email y el mensaje antes de enviar.";
        status.classList.add("is-error");
        return;
      }
      const data = new FormData(form);
      if (data.get("_gotcha")) return;

      if (SITE.formspreeId) {
        const btn = form.querySelector("button[type=submit]");
        btn.disabled = true;
        status.textContent = "Enviando…";
        try {
          const res = await fetch("https://formspree.io/f/" + SITE.formspreeId, {
            method: "POST", body: data, headers: { Accept: "application/json" }
          });
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          status.textContent = "Gracias. Tu mensaje ha llegado, te respondo en cuanto pueda.";
        } catch (err) {
          status.textContent = "No se ha podido enviar. Escríbeme directamente a " + (SITE.email || "mi correo") + ".";
          status.classList.add("is-error");
        } finally {
          btn.disabled = false;
        }
        return;
      }

      // Sin Formspree: abrimos el cliente de correo con todo preparado.
      const subject = data.get("_subject") || "Mensaje desde la web";
      const body = [
        "Nombre: " + data.get("name"),
        "Email: " + data.get("email"),
        "Motivo: " + data.get("motivo"),
        data.get("fotografia") ? "Fotografía: " + data.get("fotografia") : "",
        "",
        data.get("message")
      ].filter((l) => l !== "").join("\n");
      window.location.href = "mailto:" + encodeURIComponent(SITE.email || "") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "Se está abriendo tu aplicación de correo. Si no ocurre nada, escríbeme a " + (SITE.email || "mi correo") + ".";
    });
  }

  /* ---------------------------------------------------------------- tema */
  const themeBtn = document.getElementById("theme-btn");
  const root = document.documentElement;
  const systemDark = () => window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  function currentTheme() {
    const t = root.getAttribute("data-theme");
    return t === "dark" || t === "light" ? t : (systemDark() ? "dark" : "light");
  }
  function applyTheme(t, animate) {
    if (animate) { root.classList.add("theme-switching"); setTimeout(() => root.classList.remove("theme-switching"), 600); }
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    themeBtn.setAttribute("aria-label", t === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  }
  themeBtn.setAttribute("aria-label", currentTheme() === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", currentTheme());
  themeBtn.addEventListener("click", () => applyTheme(currentTheme() === "dark" ? "light" : "dark", true));

  /* ------------------------------------------------------ menú y cabecera */
  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Cerrar menú");
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open");
  }
  menuBtn.addEventListener("click", () => (menu.hidden ? openMenu() : closeMenu()));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });

  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("is-hidden", y > lastY && y > 160 && menu.hidden);
    lastY = y;
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
    const { parts } = parseHash();
    if (parts[0] !== "foto") return;
    if (e.key === "ArrowLeft") { const a = app.querySelector(".photo__nav--prev"); if (a) location.hash = a.getAttribute("href"); }
    if (e.key === "ArrowRight") { const a = app.querySelector(".photo__nav--next"); if (a) location.hash = a.getAttribute("href"); }
  });

  window.addEventListener("hashchange", render);
  render();
})();
