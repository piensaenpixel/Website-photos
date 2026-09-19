#!/usr/bin/env python3
"""
Monta la web lista para publicar en una carpeta:
  - copia los archivos del sitio (sin .git, .github, scripts, content, README)
  - genera js/data.js a partir de content/
  - reduce las imágenes grandes a 2000 px (si Pillow está instalado)
  - pone la versión en los enlaces a CSS y JS
  - en staging añade una marca en la barra y evita que los buscadores la indexen

Uso:  python3 scripts/build_site.py <origen> <destino> [--env production|staging] [--version sha]
"""
import argparse, os, shutil, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("dest")
ap.add_argument("--env", default="production", choices=["production", "staging"])
ap.add_argument("--version", default="dev")
ap.add_argument("--max-size", type=int, default=2000)
a = ap.parse_args()

SRC = os.path.abspath(a.src); DEST = os.path.abspath(a.dest)
SKIP = {".git", ".github", "scripts", "content", "README.md", "_site", "node_modules", ".gitignore"}

os.makedirs(DEST, exist_ok=True)
for name in os.listdir(SRC):
    if name in SKIP:
        continue
    s = os.path.join(SRC, name); d = os.path.join(DEST, name)
    if os.path.isdir(s):
        if os.path.exists(d): shutil.rmtree(d)
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

subprocess.check_call([sys.executable, os.path.join(SRC, "scripts", "build_data.py"), SRC, os.path.join(DEST, "js", "data.js")])

# Imágenes: reducir las que superen el tamaño máximo
try:
    from PIL import Image, ImageOps
    fotos = os.path.join(DEST, "img", "fotos")
    n = 0
    for fn in os.listdir(fotos) if os.path.isdir(fotos) else []:
        path = os.path.join(fotos, fn)
        if not fn.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            continue
        with Image.open(path) as im:
            if max(im.size) <= a.max_size:
                continue
            im = ImageOps.exif_transpose(im)
            im.thumbnail((a.max_size, a.max_size), Image.LANCZOS)
            if fn.lower().endswith((".jpg", ".jpeg")):
                im = im.convert("RGB"); im.save(path, "JPEG", quality=85, optimize=True, progressive=True)
            else:
                im.save(path)
            n += 1
    print("Imágenes reducidas a %d px: %d" % (a.max_size, n))
    # Los tamaños de data.js deben reflejar las imágenes reducidas
    if n:
        subprocess.check_call([sys.executable, os.path.join(SRC, "scripts", "build_data.py"), SRC, os.path.join(DEST, "js", "data.js"), DEST])
except ImportError:
    print("Pillow no está instalado: las imágenes se publican tal cual.")

# index.html: versión y entorno
index = os.path.join(DEST, "index.html")
with open(index, encoding="utf-8") as f:
    html = f.read()
html = html.replace("?v=dev", "?v=" + a.version)
if a.env == "staging":
    html = html.replace('<html lang="en">', '<html lang="en" data-env="staging">')
    html = html.replace("</head>", '  <meta name="robots" content="noindex, nofollow">\n</head>')
with open(index, "w", encoding="utf-8") as f:
    f.write(html)
print("Sitio montado en %s (%s, versión %s)" % (DEST, a.env, a.version))
