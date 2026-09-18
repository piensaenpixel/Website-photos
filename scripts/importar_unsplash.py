#!/usr/bin/env python3
"""
Importa las fotografías de un usuario de Unsplash al sitio:
descarga las imágenes a img/fotos/ y regenera el bloque PHOTOS de js/photos.js
(título, descripción, datos EXIF, localización y serie estimada).

Variables de entorno:
  UNSPLASH_ACCESS_KEY  clave de acceso de la aplicación de Unsplash (obligatoria)
  UNSPLASH_USER        usuario de Unsplash (por defecto piensaenpixel)
  MAX_PHOTOS           máximo de fotos a importar (por defecto 40)
  IMG_WIDTH            ancho de descarga en píxeles (por defecto 1800)
"""
import json, os, re, sys, time, unicodedata, urllib.request, urllib.error, urllib.parse

KEY = os.environ.get("UNSPLASH_ACCESS_KEY", "").strip()
USER = os.environ.get("UNSPLASH_USER", "piensaenpixel").strip()
MAX = int(os.environ.get("MAX_PHOTOS", "40") or 40)
WIDTH = int(os.environ.get("IMG_WIDTH", "1800") or 1800)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "img", "fotos")
PHOTOS_JS = os.path.join(ROOT, "js", "photos.js")
API = "https://api.unsplash.com"

if not KEY:
    sys.exit("Falta UNSPLASH_ACCESS_KEY")

remaining = [None]

def read_existing():
    """Devuelve (entradas actuales, ids de Unsplash excluidos) leyendo js/photos.js con node."""
    import subprocess
    code = ("const fs=require('fs');eval(fs.readFileSync(process.argv[1],'utf8').replace(/window\\./g,'globalThis.'));"
            "console.log(JSON.stringify({photos: globalThis.PHOTOS||[], excluded: globalThis.EXCLUDED_UNSPLASH||[]}))")
    try:
        out = subprocess.check_output(["node", "-e", code, PHOTOS_JS], timeout=30).decode("utf-8")
        d = json.loads(out)
        return d["photos"], set(d["excluded"])
    except Exception as e:
        print("Aviso: no se ha podido leer js/photos.js con node (%s); se parte de cero." % e)
        return [], set()

existing, excluded = read_existing()
known = {e.get("unsplashId") for e in existing if e.get("unsplashId")}
print("Fotos ya en la web: %d · excluidas: %d" % (len(existing), len(excluded)))

def api(path, params=None):
    url = API + path + ("?" + urllib.parse.urlencode(params) if params else "")
    req = urllib.request.Request(url, headers={"Authorization": "Client-ID " + KEY, "Accept-Version": "v1"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                remaining[0] = r.headers.get("X-Ratelimit-Remaining")
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")
            if e.code == 401:
                sys.exit("La clave de Unsplash no es válida (401): " + body)
            if e.code == 403:
                sys.exit("Límite de peticiones alcanzado o acceso denegado (403): " + body)
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))

def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").lower()
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:60] or "foto"

def clean(s):
    return re.sub(r"\s+", " ", (s or "")).strip()

def categorize(p):
    text = " ".join([
        clean(p.get("description")), clean(p.get("alt_description")),
        " ".join(clean((t or {}).get("title")) for t in p.get("tags") or []),
        clean(((p.get("location") or {}).get("name"))),
    ]).lower()
    ex = p.get("exif") or {}
    make = (ex.get("make") or "").lower(); model = (ex.get("model") or "").lower()
    if re.search(r"\b(moon|luna|lunar|supermoon|superluna|eclipse|crescent|creciente|menguante)\b", text):
        return "moon"
    if "dji" in make or "dji" in model or "mavic" in model or "hasselblad" in make or "hasselblad" in model \
       or re.search(r"\b(drone|dron|aerial|aérea|aerea|from above|top view|bird'?s[- ]eye|cenital|overhead)\b", text):
        return "drone"
    if re.search(r"\b(night|noche|nocturn\w*|milky way|vía láctea|via lactea|stars?|estrellas?|star trails?|circumpolar|astro\w*|long exposure|larga exposición|aurora|galaxy|galaxia)\b", text):
        return "night"
    return "landscape"

def title_for(p):
    d = clean(p.get("description"))
    if d and len(d) <= 70:
        return d
    loc = clean((p.get("location") or {}).get("name"))
    if loc:
        return loc.split(",")[0]
    alt = clean(p.get("alt_description"))
    if alt:
        return alt[0].upper() + alt[1:]
    return "Sin título"

def description_for(p):
    d = clean(p.get("description"))
    alt = clean(p.get("alt_description"))
    if d and len(d) > 70:
        return d
    if d and alt and alt.lower() != d.lower():
        return alt[0].upper() + alt[1:] + "."
    if d:
        return ""
    return (alt[0].upper() + alt[1:] + ".") if alt else ""

def js_str(s):
    return json.dumps(s or "", ensure_ascii=False)

def fmt_exif(ex):
    make = clean(ex.get("make")); model = clean(ex.get("model"))
    camera = model if make and model and model.lower().startswith(make.lower()) else clean(make + " " + model)
    focal = ex.get("focal_length"); aperture = ex.get("aperture"); exp = ex.get("exposure_time"); iso = ex.get("iso")
    return {
        "camera": camera,
        "lens": "",  # Unsplash no informa del objetivo (exif.name es el nombre de la cámara)
        "focal": (str(focal).rstrip("0").rstrip(".") + " mm") if focal else "",
        "aperture": ("f/" + str(aperture)) if aperture else "",
        "shutter": (str(exp) + " s") if exp else "",
        "iso": str(iso) if iso else "",
    }

# 1. Listado de fotos del usuario (las más populares primero)
photos = []
page = 1
while len(photos) < MAX:
    batch = api("/users/%s/photos" % USER, {"per_page": 30, "page": page, "order_by": "popular", "stats": "false"})
    if not batch:
        break
    photos.extend(batch)
    page += 1
    if len(batch) < 30:
        break
photos = photos[:MAX]
total_listed = len(photos)
photos = [p for p in photos if p["id"] not in excluded and p["id"] not in known]
print("Fotos listadas: %d · nuevas: %d (límite restante de la API: %s)" % (total_listed, len(photos), remaining[0]))
if not photos:
    print("No hay fotos nuevas que importar.")
    sys.exit(0)

# 2. Detalle de cada foto (EXIF, localización, etiquetas)
detailed = []
for i, p in enumerate(photos):
    if remaining[0] is not None and int(remaining[0]) < 2:
        print("Aviso: se ha alcanzado el límite de peticiones; el resto de fotos se importa sin EXIF ni localización.")
        detailed.extend(photos[i:])
        break
    try:
        detailed.append(api("/photos/%s" % p["id"]))
    except Exception as e:
        print("No se pudo obtener el detalle de %s: %s" % (p["id"], e))
        detailed.append(p)

# 3. Descarga de imágenes
os.makedirs(IMG_DIR, exist_ok=True)
entries = []
used = {e["id"] for e in existing}
for i, p in enumerate(detailed):
    title = title_for(p)
    slug = slugify(title)
    if slug in used:
        slug = slug + "-" + p["id"][:6].lower()
    used.add(slug)
    w0, h0 = p.get("width") or WIDTH, p.get("height") or WIDTH
    w = min(WIDTH, w0)
    h = round(h0 * w / w0)
    raw = p["urls"]["raw"]
    url = raw + ("&" if "?" in raw else "?") + "w=%d&q=82&fm=jpg&fit=max" % w
    fname = slug + ".jpg"
    dest = os.path.join(IMG_DIR, fname)
    try:
        urllib.request.urlretrieve(url, dest)
    except Exception as e:
        print("No se pudo descargar %s: %s" % (p["id"], e))
        continue
    ex = fmt_exif(p.get("exif") or {})
    loc = p.get("location") or {}
    pos = loc.get("position") or {}
    lat, lng = pos.get("latitude"), pos.get("longitude")
    loc_name = clean(loc.get("name")) or clean(", ".join(x for x in [loc.get("city"), loc.get("country")] if x))
    entries.append({
        "id": slug, "title": title, "category": categorize(p), "src": "img/fotos/" + fname,
        "w": w, "h": h, "description": description_for(p), "date": (p.get("created_at") or "")[:10],
        "location": {"name": loc_name, "lat": lat, "lng": lng},
        "exif": ex, "featured": False, "forSale": True, "unsplashId": p["id"],
    })
    print("%02d %-10s %s" % (i + 1, entries[-1]["category"], title))

if not entries:
    sys.exit("No se ha descargado ninguna foto.")

# 4. Borrar imágenes que no usa ninguna entrada
all_entries = existing + entries
keep = {os.path.basename(e["src"]) for e in all_entries}
for f in os.listdir(IMG_DIR):
    if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and f not in keep:
        os.remove(os.path.join(IMG_DIR, f))

# 5. Regenerar el bloque PHOTOS de js/photos.js
def entry_js(e):
    loc = e.get("location") or {"name": "", "lat": None, "lng": None}
    e = dict(e); e["exif"] = e.get("exif") or {}
    for k in ("camera", "lens", "focal", "aperture", "shutter", "iso"):
        e["exif"].setdefault(k, "")
    lat = "null" if loc.get("lat") is None else repr(float(loc["lat"]))
    lng = "null" if loc.get("lng") is None else repr(float(loc["lng"]))
    ex = e["exif"]
    return (
        "  {\n"
        "    id: %s,\n    title: %s,\n    category: %s,\n    src: %s,\n    w: %d, h: %d,\n"
        "    description: %s,\n    date: %s,\n"
        "    location: { name: %s, lat: %s, lng: %s },\n"
        "    exif: { camera: %s, lens: %s, focal: %s, aperture: %s, shutter: %s, iso: %s },\n"
        "    featured: %s,\n    forSale: %s,\n    unsplashId: %s\n  }"
    ) % (js_str(e["id"]), js_str(e["title"]), js_str(e["category"]), js_str(e["src"]), e["w"], e["h"],
         js_str(e.get("description", "")), js_str(e.get("date", "")), js_str(loc.get("name", "")), lat, lng,
         js_str(ex["camera"]), js_str(ex["lens"]), js_str(ex["focal"]), js_str(ex["aperture"]), js_str(ex["shutter"]), js_str(ex["iso"]),
         "true" if e.get("featured") else "false", "false" if e.get("forSale") is False else "true", js_str(e.get("unsplashId", "")))

block = ("/* PHOTOS:START — the «Import photos from Unsplash» workflow adds new photos here and keeps edited ones */\n"
         "window.PHOTOS = [\n" + ",\n".join(entry_js(e) for e in all_entries) + "\n];\n/* PHOTOS:END */\n")
src = open(PHOTOS_JS, encoding="utf-8").read()
m = re.search(r"/\* PHOTOS:START.*?/\* PHOTOS:END \*/\n?", src, re.S)
if not m:
    sys.exit("No se encuentran los marcadores PHOTOS:START / PHOTOS:END en js/photos.js")
open(PHOTOS_JS, "w", encoding="utf-8").write(src[:m.start()] + block + src[m.end():])
print("Añadidas %d fotos nuevas (total %d). Series de las nuevas: %s" % (len(entries), len(all_entries), {c: sum(1 for e in entries if e["category"] == c) for c in ("landscape", "moon", "drone", "night")}))
print("Revisa js/photos.js: las fotos nuevas llegan con título y descripción automáticos en inglés y serie estimada.")
