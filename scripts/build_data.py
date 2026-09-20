#!/usr/bin/env python3
"""
Convierte el contenido de content/ (archivos JSON que edita el CMS) en
js/data.js, el archivo que lee la web. Calcula el ancho y alto de cada
imagen para que la maquetación no salte al cargar.

Uso:  python3 scripts/build_data.py [raíz del proyecto] [archivo de salida] [carpeta de imágenes]
      (la carpeta de imágenes es la raíz donde buscar img/…; por defecto la del proyecto)
"""
import json, os, struct, sys

ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else os.path.join(ROOT, "js", "data.js")
IMG_ROOT = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else ROOT
CONTENT = os.path.join(ROOT, "content")


def read_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return default
    except json.JSONDecodeError as e:
        sys.exit("JSON no válido en %s: %s" % (path, e))


def folder(name):
    d = os.path.join(CONTENT, name)
    items = []
    if not os.path.isdir(d):
        return items
    for fn in sorted(os.listdir(d)):
        if fn.endswith(".json"):
            item = read_json(os.path.join(d, fn), {})
            item["id"] = fn[:-5]
            items.append(item)
    return items


def image_size(path):
    """Ancho y alto de un JPEG, PNG o WebP sin dependencias."""
    try:
        with open(path, "rb") as f:
            head = f.read(32)
            if head[:8] == b"\x89PNG\r\n\x1a\n":
                w, h = struct.unpack(">II", head[16:24])
                return w, h
            if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
                f.seek(12)
                chunk = f.read(4)
                if chunk == b"VP8X":
                    f.seek(24)
                    b = f.read(6)
                    return 1 + (b[0] | b[1] << 8 | b[2] << 16), 1 + (b[3] | b[4] << 8 | b[5] << 16)
                if chunk == b"VP8 ":
                    f.seek(26)
                    b = f.read(4)
                    return (b[0] | b[1] << 8) & 0x3FFF, (b[2] | b[3] << 8) & 0x3FFF
                if chunk == b"VP8L":
                    f.seek(21)
                    b = f.read(4)
                    bits = b[0] | b[1] << 8 | b[2] << 16 | b[3] << 24
                    return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
            if head[:2] == b"\xff\xd8":
                f.seek(2)
                while True:
                    marker = f.read(2)
                    if len(marker) < 2 or marker[0] != 0xFF:
                        break
                    if marker[1] in (0xD8, 0x01) or 0xD0 <= marker[1] <= 0xD7:
                        continue
                    (length,) = struct.unpack(">H", f.read(2))
                    if marker[1] in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                        f.read(1)
                        h, w = struct.unpack(">HH", f.read(4))
                        return w, h
                    f.seek(length - 2, 1)
    except OSError:
        pass
    return None


def sort_key(item):
    o = item.get("order")
    return (0 if isinstance(o, (int, float)) else 1, o if isinstance(o, (int, float)) else 0, item.get("date", "") and -int(item["date"].replace("-", "")[:8] or 0))


site = read_json(os.path.join(CONTENT, "site.json"), {})
series = sorted(folder("series"), key=sort_key)
courses = sorted(folder("courses"), key=sort_key)
photos = sorted(folder("photos"), key=sort_key)
excluded = read_json(os.path.join(CONTENT, "excluded-unsplash.json"), [])

warnings = []
for p in photos:
    src = p.get("src") or ""
    path = os.path.join(IMG_ROOT, src)
    size = image_size(path) if src else None
    if size:
        p["w"], p["h"] = size
    else:
        p.setdefault("w", 3); p.setdefault("h", 2)
        warnings.append("Sin imagen o tamaño desconocido: %s (%s)" % (p["id"], src))
    if p.get("mockup"):
        msize = image_size(os.path.join(IMG_ROOT, p["mockup"]))
        if msize:
            p["mockupW"], p["mockupH"] = msize
        else:
            warnings.append("Montaje no encontrado: %s (%s)" % (p["id"], p["mockup"]))
            p["mockup"] = ""
    if p.get("category") not in {s["id"] for s in series}:
        warnings.append("La foto %s tiene una serie desconocida: %s" % (p["id"], p.get("category")))

categories = [{"id": s["id"], "name": s.get("name", s["id"]), "intro": s.get("intro", "")} for s in series]

out = "/* Generado por scripts/build_data.py a partir de content/. No editar a mano. */\n"
out += "window.SITE = %s;\n" % json.dumps(site, ensure_ascii=False)
out += "window.CATEGORIES = %s;\n" % json.dumps(categories, ensure_ascii=False)
out += "window.COURSES = %s;\n" % json.dumps(courses, ensure_ascii=False)
out += "window.PHOTOS = %s;\n" % json.dumps(photos, ensure_ascii=False)
out += "window.EXCLUDED_UNSPLASH = %s;\n" % json.dumps(excluded)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    f.write(out)
for w in warnings:
    print("Aviso:", w)
print("Generado %s: %d fotos, %d series, %d cursos" % (os.path.relpath(OUT, ROOT), len(photos), len(series), len(courses)))
