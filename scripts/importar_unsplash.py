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
        return "luna"
    if "dji" in make or "dji" in model or "mavic" in model or "hasselblad" in make or "hasselblad" in model \
       or re.search(r"\b(drone|dron|aerial|aérea|aerea|from above|top view|bird'?s[- ]eye|cenital|overhead)\b", text):
        return "drone"
    if re.search(r"\b(night|noche|nocturn\w*|milky way|vía láctea|via lactea|stars?|estrellas?|star trails?|circumpolar|astro\w*|long exposure|larga exposición|aurora|galaxy|galaxia)\b", text):
        return "nocturnas"
    return "paisaje"

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
        "lens": clean(ex.get("name")) if clean(ex.get("name")) and clean(ex.get("name")) != camera else "",
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
print("Fotos listadas: %d (límite restante de la API: %s)" % (len(photos), remaining[0]))
if not photos:
    sys.exit("El usuario no tiene fotos o no se han podido listar.")

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
used = set()
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
        "exif": ex, "featured": i < 8, "forSale": True, "unsplash": p.get("links", {}).get("html", ""),
    })
    print("%02d %-10s %s" % (i + 1, entries[-1]["category"], title))

if not entries:
    sys.exit("No se ha descargado ninguna foto.")

# 4. Borrar imágenes que ya no se usan (las de muestra)
keep = {os.path.basename(e["src"]) for e in entries}
for f in os.listdir(IMG_DIR):
    if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and f not in keep:
        os.remove(os.path.join(IMG_DIR, f))

# 5. Regenerar el bloque PHOTOS de js/photos.js
def entry_js(e):
    loc = e["location"]
    lat = "null" if loc["lat"] is None else repr(float(loc["lat"]))
    lng = "null" if loc["lng"] is None else repr(float(loc["lng"]))
    ex = e["exif"]
    return (
        "  {\n"
        "    id: %s,\n    title: %s,\n    category: %s,\n    src: %s,\n    w: %d, h: %d,\n"
        "    description: %s,\n    date: %s,\n"
        "    location: { name: %s, lat: %s, lng: %s },\n"
        "    exif: { camera: %s, lens: %s, focal: %s, aperture: %s, shutter: %s, iso: %s },\n"
        "    featured: %s,\n    forSale: true,\n    unsplash: %s\n  }"
    ) % (js_str(e["id"]), js_str(e["title"]), js_str(e["category"]), js_str(e["src"]), e["w"], e["h"],
         js_str(e["description"]), js_str(e["date"]), js_str(loc["name"]), lat, lng,
         js_str(ex["camera"]), js_str(ex["lens"]), js_str(ex["focal"]), js_str(ex["aperture"]), js_str(ex["shutter"]), js_str(ex["iso"]),
         "true" if e["featured"] else "false", js_str(e["unsplash"]))

block = ("/* PHOTOS:START — el workflow «Importar fotos de Unsplash» reemplaza este bloque */\n"
         "window.PHOTOS = [\n" + ",\n".join(entry_js(e) for e in entries) + "\n];\n/* PHOTOS:END */\n")
src = open(PHOTOS_JS, encoding="utf-8").read()
m = re.search(r"/\* PHOTOS:START.*?/\* PHOTOS:END \*/\n?", src, re.S)
if not m:
    sys.exit("No se encuentran los marcadores PHOTOS:START / PHOTOS:END en js/photos.js")
open(PHOTOS_JS, "w", encoding="utf-8").write(src[:m.start()] + block + src[m.end():])
print("Importadas %d fotos. Series: %s" % (len(entries), {c: sum(1 for e in entries if e["category"] == c) for c in ("paisaje", "luna", "drone", "nocturnas")}))
