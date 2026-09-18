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
  const menu = document.getElementById("menu");
  const menuBtn = document.getElementById("menu-btn");
  const loader = document.getElementById("loader");
  const curtain = document.getElementById("curtain");
  const curtainLabel = document.getElementById("curtain-label");
  const cursor = document.getElementById("cursor");
  const cursorLabel = document.getElementById("cursor-label");
  const themeBtn = document.getElementById("theme-btn");
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------ helpers */
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const pad = (n) => String(n).padStart(2, "0");
  const catById = (id) => CATEGORIES.find((c) => c.id === id);
  const catName = (id) => (catById(id) || {}).name || id;
  const catIndex = (id) => Math.max(0, CATEGORIES.findIndex((c) => c.id === id));
  const photosIn = (cat) => (cat ? PHOTOS.filter((p) => p.category === cat) : PHOTOS.slice());
  const photoById = (id) => PHOTOS.find((p) => p.id === id);
  const year = (iso) => (iso || "").slice(0, 4);
  const locName = (p) => (p.location && p.location.name) || "";

  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso + "T12:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  function fmtCoord(lat, lng) {
    const f = (v, pos, neg) => Math.abs(v).toFixed(4) + "° " + (v >= 0 ? pos : neg);
    return f(lat, "N", "S") + " " + f(lng, "E", "O");
  }
  function paragraphs(text) {
    return String(text || "").split(/\n\s*\n/).map((p) => "<p>" + esc(p.trim()) + "</p>").join("");
  }
  function img(p, attrs) {
    return '<img src="' + esc(p.src) + '" alt="' + esc(p.alt || p.title) + '" width="' + (p.w || "") + '" height="' + (p.h || "") + '" data-fade ' + (attrs || "") + ">";
  }
  function sectionHead(title, num) {
    return '<div class="section__head sr"><h2 class="t-section">' + esc(title) + '</h2><span class="t-section">S' + pad(num) + "</span></div>";
  }
  function metaList(rows, muted) {
    const r = rows.filter((x) => x[1]);
    if (!r.length) return "";
    return '<dl class="meta' + (muted ? " meta--muted" : "") + '">' + r.map((x) => "<dt>" + esc(x[0]) + ":</dt><dd>" + x[1] + "</dd>").join("") + "</dl>";
  }

  /* Un trabajo: fila (serie · año), imagen a todo el ancho, pie (título / lugar) */
  function work(p, i, lazy) {
    const portrait = p.h > p.w;
    return (
      '<a class="work sr sr-img' + (portrait ? " work--portrait" : "") + '" style="--i:' + (i || 0) + '" href="#/foto/' + esc(p.id) + '" data-cursor="Ver">' +
        '<div class="row"><span>' + esc(catName(p.category)) + "</span><span>" + esc(year(p.date)) + "</span></div>" +
        '<div class="media">' + img(p, lazy ? 'loading="lazy"' : "") + "</div>" +
        '<div class="work__caption"><strong>' + esc(p.title) + "</strong><span>" + esc(locName(p)) + "</span></div>" +
      "</a>"
    );
  }

  /* ------------------------------------------------------------- portada */
  function renderHome() {
    const featured = PHOTOS.filter((p) => p.featured);
    const hero = featured.find((p) => p.w >= p.h) || PHOTOS[0];
    if (!hero) return '<section class="page"><p class="empty">Todavía no hay fotografías. Añádelas en js/photos.js.</p></section>';
    const about = (SITE.about || [])[0] || "";

    return (
      '<section class="hero">' +
        '<img class="hero__img" src="' + esc(hero.src) + '" alt="' + esc(hero.alt || hero.title) + '">' +
        '<div class="hero__foot">' +
          '<p class="t-hero split" data-split>' + esc(SITE.author || SITE.name) + " — Copias de edición limitada</p>" +
          '<p class="hero__caption sr">' + esc(hero.title) + (locName(hero) ? "<br>" + esc(locName(hero)) : "") + "</p>" +
        "</div>" +
      "</section>" +

      '<section class="info">' +
        '<div class="info__block sr"><span>Social:</span><span>' +
          (SITE.instagram ? '<a href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">Instagram</a><br>' : "") +
          (SITE.unsplash ? '<a href="' + esc(SITE.unsplash) + '" target="_blank" rel="noopener">Unsplash</a>' : "") +
        "</span></div>" +
        '<div class="info__block info__block--right sr" style="--i:1"><span>Localización:</span><span>' + esc(SITE.location || "España, Madrid") + '<br><span id="clock">' + clockNow() + "</span></span></div>" +
      "</section>" +

      '<section class="section">' + sectionHead("Sobre mí", 1) +
        '<div class="section__body">' +
          '<p class="copy t-muted sr">' + esc(about) + "</p>" +
        "</div>" +
      "</section>" +

      '<section class="section">' + sectionHead("Series", 2) +
        '<div class="section__body"><div class="series">' +
          CATEGORIES.map((c, i) => {
            const n = photosIn(c.id).length;
            return '<a class="sr" style="--i:' + i + '" href="#/galeria/' + c.id + '"><span>' + pad(i + 1) + '</span><span class="t-section">' + esc(c.name) + "</span><span>" + n + (n === 1 ? " foto" : " fotos") + "</span></a>";
          }).join("") +
        "</div></div>" +
      "</section>" +

      '<section class="section">' + sectionHead("Selección", 3) +
        '<div class="section__body"><div class="works">' + featured.slice(0, 8).map((p, i) => work(p, 0, i > 0)).join("") + "</div>" +
        '<div class="row sr" style="padding-top: 18px"><span>Archivo:</span><a class="link" href="#/galeria">Ver toda la galería</a></div></div>' +
      "</section>" +

      '<section class="section" style="padding-bottom: 80px">' + sectionHead("Contacto", 4) +
        '<div class="section__body sr">' +
          metaList([
            ["Email", SITE.email ? '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a>" : ""],
            ["Instagram", SITE.instagram ? '<a href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">@piensaenpixel</a>' : ""],
            ["Copias", "Edición limitada, papel fine art"],
            ["Formulario", '<a href="#/contacto">Ver</a>']
          ]) +
        "</div>" +
      "</section>"
    );
  }

  /* ------------------------------------------------------------- galería */
  const VIEW_KEY = "gallery-view";
  function getView() { try { return localStorage.getItem(VIEW_KEY) === "grid" ? "grid" : "large"; } catch (e) { return "large"; } }
  function setView(v) { try { localStorage.setItem(VIEW_KEY, v); } catch (e) {} }

  function renderGallery(cat) {
    const c = cat ? catById(cat) : null;
    if (cat && !c) return renderNotFound();
    const list = photosIn(cat);
    const view = getView();
    const filters = ['<a href="#/galeria" class="' + (!cat ? "is-active" : "") + '">Todas</a>']
      .concat(CATEGORIES.map((x) => '<a href="#/galeria/' + x.id + '" class="' + (x.id === cat ? "is-active" : "") + '">' + esc(x.name) + "</a>"))
      .join("");

    return (
      '<section class="page">' +
        '<h1 class="t-display split" data-split>' + esc(c ? c.name : "Galería") + "</h1>" +
        '<div class="page__meta sr">' +
          metaList([
            ["Serie", c ? "S" + pad(catIndex(c.id) + 1) : "Archivo"],
            ["Fotografías", String(list.length)],
            ["Copias", "Edición limitada"]
          ]) +
        "</div>" +
        (c ? '<p class="copy t-muted sr" style="margin-bottom: 36px">' + esc(c.intro) + "</p>" : "") +
        '<div class="row sr" style="margin-bottom: 14px"><nav class="filters" aria-label="Series">' + filters + "</nav>" +
          '<div class="view" role="group" aria-label="Vista"><button type="button" data-view="large" class="' + (view === "large" ? "is-active" : "") + '">Grande</button><button type="button" data-view="grid" class="' + (view === "grid" ? "is-active" : "") + '">Rejilla</button></div>' +
        "</div>" +
        (list.length
          ? '<div class="' + (view === "grid" ? "grid" : "works") + '" id="gallery">' + list.map((p, i) => work(p, i % 3, i > 1)).join("") + "</div>"
          : '<p class="empty">Aún no hay fotografías en esta serie.</p>') +
        '<div style="height: 80px"></div>' +
      "</section>"
    );
  }

  function initViewToggle() {
    const g = document.getElementById("gallery");
    app.querySelectorAll("[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.dataset.view;
        setView(v);
        app.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("is-active", b === btn));
        if (g) {
          g.className = v === "grid" ? "grid" : "works";
          g.querySelectorAll(".sr").forEach((el) => el.classList.add("is-in"));
          updateParallax();
        }
      });
    });
  }

  /* ---------------------------------------------------------------- foto */
  function renderPhoto(id) {
    const p = photoById(id);
    if (!p) return renderNotFound();
    const siblings = photosIn(p.category);
    const idx = siblings.indexOf(p);
    const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
    const next = siblings[(idx + 1) % siblings.length];
    const ex = p.exif || {};
    const hasMap = p.location && typeof p.location.lat === "number" && typeof p.location.lng === "number";

    return (
      '<section class="page">' +
        '<h1 class="t-display split" data-split>' + esc(p.title) + "</h1>" +
        '<div class="page__meta sr">' +
          metaList([
            ["Serie", '<a href="#/galeria/' + esc(p.category) + '">' + esc(catName(p.category)) + "</a>"],
            ["Lugar", esc(locName(p))],
            ["Fecha", esc(fmtDate(p.date))],
            ["Cámara", esc(ex.camera)],
            ["Objetivo", esc(ex.lens)],
            ["Focal", esc(ex.focal)],
            ["Apertura", esc(ex.aperture)],
            ["Velocidad", esc(ex.shutter)],
            ["ISO", esc(ex.iso)]
          ]) +
          (p.forSale !== false ? metaList([["Copia", '<a href="#/contacto?foto=' + encodeURIComponent(p.id) + '">Quiero esta foto</a>']]) : "") +
        "</div>" +
        '<div class="sr-img sr"><div class="media photo__stage' + (p.h > p.w ? " photo__stage--portrait" : "") + '">' + img(p, 'fetchpriority="high"') + "</div></div>" +
        '<div class="copy photo__desc sr">' + paragraphs(p.description) + "</div>" +
        (hasMap
          ? '<div class="map sr" id="mapa">' +
              '<div class="row" style="margin-bottom: 14px"><span>Localización: ' + esc(locName(p)) + "</span><span>" + fmtCoord(p.location.lat, p.location.lng) + "</span></div>" +
              '<div class="map__canvas" id="map-canvas" data-lat="' + p.location.lat + '" data-lng="' + p.location.lng + '" data-name="' + esc(locName(p)) + '"><div class="map__fallback">Cargando mapa…</div></div>' +
            "</div>"
          : "") +
        (siblings.length > 1
          ? '<nav class="photo__nav sr"><a class="link" id="nav-prev" href="#/foto/' + esc(prev.id) + '">← ' + esc(prev.title) + '</a><a class="link" id="nav-next" href="#/foto/' + esc(next.id) + '">' + esc(next.title) + " →</a></nav>"
          : '<div class="photo__nav sr"></div>') +
        '<div class="row sr" style="padding: 18px 0 80px"><a class="link" href="#/galeria/' + esc(p.category) + '">Volver a ' + esc(catName(p.category)) + "</a><span>" + pad(idx + 1) + " / " + pad(siblings.length) + "</span></div>" +
      "</section>"
    );
  }

  /* ------------------------------------------------------------ sobre mí */
  function renderAbout() {
    const portrait = SITE.portrait ? { src: SITE.portrait, title: SITE.author || SITE.name, w: 1200, h: 1200 } : (PHOTOS.find((p) => p.h > p.w) || PHOTOS[0]);
    return (
      '<section class="page">' +
        '<h1 class="t-display split" data-split>Sobre mí</h1>' +
        '<div class="page__meta sr">' +
          metaList([
            ["Nombre", esc(SITE.author || SITE.name)],
            ["Base", esc(SITE.location || "España, Madrid")],
            ["Series", String(CATEGORIES.length)],
            ["Fotografías", String(PHOTOS.length)],
            ["Copias", "Edición limitada, numeradas"]
          ]) +
        "</div>" +
        (portrait ? '<div class="sr-img sr" style="margin: 24px 0 48px"><div class="media media--circle">' + img(portrait, "") + "</div></div>" : "") +
        '<div class="copy sr">' + (SITE.about || []).map((t) => "<p>" + esc(t) + "</p>").join("") + "</div>" +
        '<div class="sr" style="margin: 48px 0 80px">' +
          metaList([
            ["Instagram", SITE.instagram ? '<a href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">@piensaenpixel</a>' : ""],
            ["Unsplash", SITE.unsplash ? '<a href="' + esc(SITE.unsplash) + '" target="_blank" rel="noopener">piensaenpixel</a>' : ""],
            ["Contacto", '<a href="#/contacto">Escríbeme</a>']
          ]) +
        "</div>" +
      "</section>"
    );
  }

  /* ------------------------------------------------------------ contacto */
  function renderContact(params) {
    const p = params.get("foto") ? photoById(params.get("foto")) : null;
    const subject = p ? "Me interesa la fotografía «" + p.title + "»" : "";
    const options = ['<option value="Compra de una copia"' + (p ? " selected" : "") + ">Compra de una copia</option>",
      '<option value="Licencia de uso">Licencia de uso</option>',
      '<option value="Encargo">Encargo o colaboración</option>',
      '<option value="Otra cosa">Otra cosa</option>'].join("");

    return (
      '<section class="page">' +
        '<h1 class="t-display split" data-split>Hablemos</h1>' +
        '<div class="page__meta sr">' +
          metaList([
            ["Email", SITE.email ? '<a href="mailto:' + esc(SITE.email) + '">' + esc(SITE.email) + "</a>" : ""],
            ["Instagram", SITE.instagram ? '<a href="' + esc(SITE.instagram) + '" target="_blank" rel="noopener">@piensaenpixel</a>' : ""],
            ["Respuesta", "En un par de días"],
            ["Copias", "Papel fine art de algodón, edición limitada y numerada"]
          ]) +
        "</div>" +
        (p
          ? '<div class="row sr" style="margin-bottom: 24px"><span>Fotografía:</span><a class="link" href="#/foto/' + esc(p.id) + '">' + esc(p.title) + (locName(p) ? " — " + esc(locName(p)) : "") + "</a></div>"
          : "") +
        '<form class="form sr" id="contact-form" novalidate>' +
          '<div class="form__row">' +
            '<div class="field"><label for="f-name">Nombre:</label><input id="f-name" name="name" type="text" placeholder="Tu nombre" required autocomplete="name"></div>' +
            '<div class="field"><label for="f-email">Email:</label><input id="f-email" name="email" type="email" placeholder="tu@correo.com" required autocomplete="email"></div>' +
          "</div>" +
          '<div class="form__row">' +
            '<div class="field"><label for="f-topic">Motivo:</label><select id="f-topic" name="motivo">' + options + "</select></div>" +
            '<div class="field"><label for="f-photo">Fotografía:</label><input id="f-photo" name="fotografia" type="text" placeholder="Título de la foto" value="' + esc(p ? p.title : "") + '"></div>' +
          "</div>" +
          '<div class="field"><label for="f-msg">Mensaje:</label><textarea id="f-msg" name="message" placeholder="Cuéntame qué tienes en mente" required>' + esc(subject ? subject + ".\n\n" : "") + "</textarea></div>" +
          '<input type="hidden" name="_subject" value="' + esc(subject || "Mensaje desde la web") + '">' +
          '<label class="hp" aria-hidden="true">No rellenar<input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>' +
          '<div class="form__foot">' +
            '<button class="btn" type="submit">Enviar mensaje</button>' +
            '<p class="form__note">' + (SITE.formspreeId ? "El mensaje llega directamente a mi correo." : "Al pulsar se abrirá tu aplicación de correo con el mensaje preparado.") + "</p>" +
          "</div>" +
          '<p class="form__status" id="form-status" aria-live="polite"></p>' +
        "</form>" +
        '<div style="height: 80px"></div>' +
      "</section>"
    );
  }

  function renderNotFound() {
    return (
      '<section class="page">' +
        '<h1 class="t-display split" data-split>Nada por aquí</h1>' +
        '<div class="row sr" style="padding-bottom: 80px"><span>Error: 404</span><a class="link" href="#/galeria">Volver a la galería</a></div>' +
      "</section>"
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
    let html, title = SITE.name || "", key = parts.join("/");

    if (!seg) { html = renderHome(); }
    else if (seg === "galeria") { html = renderGallery(arg); title = (arg ? catName(arg) : "Galería") + " — " + SITE.name; }
    else if (seg === "foto") { const p = photoById(arg); html = renderPhoto(arg); if (p) title = p.title + " — " + SITE.name; }
    else if (seg === "sobre-mi") { html = renderAbout(); title = "Sobre mí — " + SITE.name; }
    else if (seg === "contacto") { html = renderContact(params); title = "Contacto — " + SITE.name; key += "?" + params.toString(); }
    else { html = renderNotFound(); }

    if (key === currentKey) return;
    const first = currentKey === null;
    currentKey = key;
    document.title = title;
    closeMenu();

    const swap = () => {
      app.innerHTML = html;
      window.scrollTo({ top: 0, behavior: "instant" });
      cursor.classList.remove("is-link", "is-view");
      afterRender(seg);
    };

    if (first) {
      swap();
      runLoader(startReveals);
    } else {
      curtainLabel.textContent = curtainLabelFor(seg, arg);
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
    return "404";
  }

  function afterRender(seg) {
    app.querySelectorAll("img[data-fade]").forEach((el) => {
      const done = () => el.classList.add("is-loaded");
      if (el.complete && el.naturalWidth) done();
      else { el.addEventListener("load", done, { once: true }); el.addEventListener("error", done, { once: true }); }
    });
    app.querySelectorAll("[data-split]").forEach(splitWords);
    initParallax();
    if (seg === "galeria") initViewToggle();
    if (seg === "foto") initMap();
    if (seg === "contacto") initForm();
  }

  /* ------------------------------------------------------ pantalla de carga */
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
    el.innerHTML = words.map((w, i) => '<span class="w"><span class="w__i" style="--d:' + (i * 60) + '">' + esc(w) + "</span></span>").join(" ");
    el.dataset.splitDone = "1";
  }

  /* --------------------------------------------------------- parallax */
  let parallaxEls = [];
  let ticking = false;
  function initParallax() {
    parallaxEls = Array.from(app.querySelectorAll(".works .work .media img"));
    updateParallax();
  }
  function updateParallax() {
    const vh = window.innerHeight;
    parallaxEls.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const centre = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.setProperty("--py", (centre * -0.05 * r.height).toFixed(1) + "px");
    });
  }
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateParallax(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", updateParallax);

  /* -------------------------------------------------------------- reloj */
  function clockNow() { return new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }); }
  setInterval(() => { const c = document.getElementById("clock"); if (c) c.textContent = clockNow(); }, 1000);

  /* ------------------------------------------------------------ cursor */
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
      const t = e.target.closest ? e.target.closest("[data-cursor], a, button, input, textarea, select") : null;
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

  /* -------------------------------------------------------------- mapa */
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
      el.innerHTML = '<div class="map__fallback"><span>' + esc(name) + "<br>" + fmtCoord(lat, lng) + '<br><br><a class="link" href="' + osmLink + '" target="_blank" rel="noopener">Abrir en OpenStreetMap</a></span></div>';
    };
    loadLeaflet().then((L) => {
      if (!document.body.contains(el)) return;
      el.innerHTML = "";
      const map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 9);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(map);
      const icon = L.divIcon({ className: "", html: '<div class="map__pin"></div>', iconSize: [12, 12], iconAnchor: [6, 6] });
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
          const res = await fetch("https://formspree.io/f/" + SITE.formspreeId, { method: "POST", body: data, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error("HTTP " + res.status);
          form.reset();
          status.textContent = "Gracias. Tu mensaje ha llegado, te respondo en cuanto pueda.";
        } catch (err) {
          status.textContent = "No se ha podido enviar. Escríbeme directamente a " + (SITE.email || "mi correo") + ".";
          status.classList.add("is-error");
        } finally { btn.disabled = false; }
        return;
      }
      const subject = data.get("_subject") || "Mensaje desde la web";
      const body = ["Nombre: " + data.get("name"), "Email: " + data.get("email"), "Motivo: " + data.get("motivo"),
        data.get("fotografia") ? "Fotografía: " + data.get("fotografia") : "", "", data.get("message")].filter((l) => l !== "").join("\n");
      window.location.href = "mailto:" + encodeURIComponent(SITE.email || "") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      status.textContent = "Se está abriendo tu aplicación de correo. Si no ocurre nada, escríbeme a " + (SITE.email || "mi correo") + ".";
    });
  }

  /* ---------------------------------------------------------------- tema */
  const root = document.documentElement;
  // Tema claro por defecto; el oscuro solo si se elige en el menú (se recuerda).
  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function paintThemeLabel() {
    const l = themeBtn.querySelector("[data-theme-label]");
    if (l) l.textContent = currentTheme() === "dark" ? "Oscuro" : "Claro";
    themeBtn.setAttribute("aria-label", currentTheme() === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro");
  }
  function applyTheme(t) {
    root.classList.add("theme-switching"); setTimeout(() => root.classList.remove("theme-switching"), 500);
    root.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    paintThemeLabel();
  }
  if (!root.getAttribute("data-theme")) root.setAttribute("data-theme", currentTheme());
  paintThemeLabel();
  themeBtn.addEventListener("click", () => applyTheme(currentTheme() === "dark" ? "light" : "dark"));

  /* ---------------------------------------------------------------- menú */
  function openMenu() {
    menu.hidden = false;
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.querySelector("[data-open]").hidden = true;
    menuBtn.querySelector("[data-close]").hidden = false;
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    if (menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.querySelector("[data-open]").hidden = false;
    menuBtn.querySelector("[data-close]").hidden = true;
    document.body.classList.remove("menu-open");
  }
  menuBtn.addEventListener("click", () => (menu.hidden ? openMenu() : closeMenu()));
  menu.addEventListener("click", (e) => { const a = e.target.closest("a"); if (a && a.getAttribute("href").startsWith("#/")) { if (a.getAttribute("href").replace(/^#/, "") === location.hash.replace(/^#/, "")) closeMenu(); } });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
    if (e.key === "ArrowLeft") { const a = document.getElementById("nav-prev"); if (a) location.hash = a.getAttribute("href"); }
    if (e.key === "ArrowRight") { const a = document.getElementById("nav-next"); if (a) location.hash = a.getAttribute("href"); }
  });

  window.addEventListener("hashchange", render);
  render();
})();
