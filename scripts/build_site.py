#!/usr/bin/env python3
"""
Monta la web lista para publicar en una carpeta:
  DEST/index.html   portada personal (piensaenpixel.es), generada de content/landing.json
  DEST/photos/      portfolio fotográfico (con js/data.js generado de content/)
  DEST/CNAME        solo en producción y si content/landing.json tiene «domain»

  - reduce las imágenes grandes a 2000 px (si Pillow está instalado)
  - pone la versión en los enlaces a CSS y JS
  - en staging añade una marca en la barra y evita que los buscadores indexen

Uso:  python3 scripts/build_site.py <origen> <destino> [--env production|staging] [--version sha]
"""
import argparse, html, json, os, shutil, subprocess, sys

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("dest")
ap.add_argument("--env", default="production", choices=["production", "staging"])
ap.add_argument("--version", default="dev")
ap.add_argument("--max-size", type=int, default=2000)
a = ap.parse_args()

SRC = os.path.abspath(a.src); DEST = os.path.abspath(a.dest); PHOTOS = os.path.join(DEST, "photos")
SKIP = {".git", ".github", "scripts", "content", "README.md", "_site", "node_modules", ".gitignore", "landing"}
STAGING = a.env == "staging"

# ---------------------------------------------------------------- portfolio
os.makedirs(PHOTOS, exist_ok=True)
for name in os.listdir(SRC):
    if name in SKIP:
        continue
    s = os.path.join(SRC, name); d = os.path.join(PHOTOS, name)
    if os.path.isdir(s):
        if os.path.exists(d): shutil.rmtree(d)
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)

subprocess.check_call([sys.executable, os.path.join(SRC, "scripts", "build_data.py"), SRC, os.path.join(PHOTOS, "js", "data.js")])

try:
    from PIL import Image, ImageOps
    fotos = os.path.join(PHOTOS, "img", "fotos")
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
    if n:
        subprocess.check_call([sys.executable, os.path.join(SRC, "scripts", "build_data.py"), SRC, os.path.join(PHOTOS, "js", "data.js"), PHOTOS])
except ImportError:
    print("Pillow no está instalado: las imágenes se publican tal cual.")

index = os.path.join(PHOTOS, "index.html")
with open(index, encoding="utf-8") as f:
    page = f.read()
page = page.replace("?v=dev", "?v=" + a.version)
if STAGING:
    page = page.replace('<html lang="en">', '<html lang="en" data-env="staging">')
    page = page.replace("</head>", '  <meta name="robots" content="noindex, nofollow">\n</head>')
with open(index, "w", encoding="utf-8") as f:
    f.write(page)

# ------------------------------------------------------------------ portada
def read_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return default

landing = read_json(os.path.join(SRC, "content", "landing.json"), {})
site = read_json(os.path.join(SRC, "content", "site.json"), {})
e = html.escape
name = landing.get("name") or site.get("author") or "piensaenpixel"
links = list(landing.get("links") or [])
if landing.get("email"):
    links.append({"label": "Email", "url": "mailto:" + landing["email"]})
if landing.get("cv"):
    cv = landing["cv"]
    links.append({"label": "CV", "url": ("photos/" + cv) if not cv.startswith(("http", "/")) else cv})

def link_attrs(url):
    ext = url.startswith("http")
    return 'href="%s"%s' % (e(url), ' target="_blank" rel="noopener"' if ext else "")

facts_html = "".join("<dt>%s:</dt><dd>%s</dd>" % (e(f.get("label", "")), e(f.get("value", ""))) for f in landing.get("facts") or [] if f.get("value"))
links_html = "".join('<a class="ln" %s><span>%s</span><span>→</span></a>' % (link_attrs(l["url"]), e(l["label"])) for l in links if l.get("url"))
nav_html = '<a href="photos/">Photos</a>'
words = " ".join('<span class="w"><span class="w__i" style="--d:%dms">%s</span></span>' % (i * 70, e(w)) for i, w in enumerate(name.split()))

landing_html = """<!DOCTYPE html>
<html lang="en"%(env)s>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%(name)s — piensaenpixel</title>
  <meta name="description" content="%(intro)s">
  <meta name="theme-color" content="#ffffff">%(robots)s
  <link rel="icon" href="photos/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;700;800&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #fff; --ink: #000; --muted: #8a8a8a; --line: #d4d4d4; --gutter: clamp(20px, 2.6vw, 40px); --bar-h: 56px; --ease: cubic-bezier(0.22, 1, 0.36, 1); }
    @media (prefers-color-scheme: dark) { :root { --bg: #000; --ink: #fff; --line: #2e2e2e; } }
    *, *::before, *::after { box-sizing: border-box; }
    html { background: var(--bg); color: var(--ink); }
    body { margin: 0; min-height: 100svh; font-family: "Geist Mono", "JetBrains Mono", Menlo, monospace; font-size: 14px; line-height: 1.5; text-transform: uppercase; background: var(--bg); color: var(--ink); padding: calc(var(--gutter) * 1.2) var(--gutter) calc(var(--bar-h) + 24px); display: flex; flex-direction: column; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    .top { display: flex; justify-content: space-between; gap: 24px; }
    .top nav { display: flex; gap: 24px; }
    .top a { position: relative; }
    .top a::after, .bar a::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.45s var(--ease); }
    .top a:hover::after, .bar a:hover::after { transform: scaleX(1); transform-origin: left; }
    main { flex: 1; display: flex; flex-direction: column; justify-content: center; padding: clamp(48px, 10vh, 120px) 0; }
    h1 { margin: 0; font-family: "Geist", "Helvetica Neue", Helvetica, Arial, sans-serif; font-weight: 700; font-size: clamp(52px, 9.5vw, 150px); line-height: 0.92; letter-spacing: -0.035em; text-transform: uppercase; }
    .w { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0.04em 0.04em 0.1em 0.02em; margin: -0.04em -0.04em -0.1em -0.02em; }
    .w__i { display: inline-block; transform: translateY(110%%); animation: up 1s var(--ease) forwards; animation-delay: var(--d, 0ms); }
    @keyframes up { to { transform: none; } }
    .role { margin: 18px 0 0; color: var(--muted); }
    .intro { max-width: 70ch; margin: 40px 0 0; line-height: 1.55; }
    .facts { display: grid; grid-template-columns: max-content 1fr; column-gap: 20px; margin: clamp(48px, 8vh, 96px) 0 0; }
    .facts dt, .facts dd { margin: 0; }
    .facts dd { text-align: right; }
    .links { display: grid; margin: clamp(48px, 8vh, 96px) 0 0; border-top: 1px solid var(--line); }
    .ln { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--line); transition: padding-left 0.5s var(--ease); }
    .ln:hover { padding-left: 12px; }
    .fade { opacity: 0; animation: fade 1s var(--ease) forwards; }
    .fade:nth-of-type(2) { animation-delay: 0.15s; } .fade:nth-of-type(3) { animation-delay: 0.3s; } .fade:nth-of-type(4) { animation-delay: 0.45s; } .fade:nth-of-type(5) { animation-delay: 0.6s; }
    @keyframes fade { to { opacity: 1; } }
    .bar { position: fixed; left: 0; right: 0; bottom: 0; height: var(--bar-h); display: flex; justify-content: space-between; align-items: center; padding-inline: var(--gutter); mix-blend-mode: difference; color: #fff; }
    .bar a { position: relative; }
    :root[data-env="staging"] .bar span::before { content: "Staging · "; }
    @media (min-width: 901px) { .facts { grid-template-columns: minmax(13ch, max-content) max-content; } .facts dd { text-align: left; } }
    @media (prefers-reduced-motion: reduce) { .w__i, .fade { animation: none; transform: none; opacity: 1; } }
  </style>
</head>
<body>
  <header class="top">
    <a href="./">piensaenpixel</a>
    <nav>%(nav)s</nav>
  </header>
  <main>
    <h1>%(words)s</h1>
    %(role)s
    %(intro_p)s
    %(facts)s
    <nav class="links fade">%(links)s</nav>
  </main>
  <div class="bar"><span>©%(year)s piensaenpixel</span><a href="photos/">Photos</a></div>
</body>
</html>
""" % {
    "env": ' data-env="staging"' if STAGING else "",
    "name": e(name),
    "intro": e(landing.get("intro", "")),
    "robots": '\n  <meta name="robots" content="noindex, nofollow">' if STAGING else "",
    "nav": nav_html,
    "words": words,
    "role": ('<p class="role fade">%s</p>' % e(landing["role"])) if landing.get("role") else "",
    "intro_p": ('<p class="intro fade">%s</p>' % e(landing["intro"])) if landing.get("intro") else "",
    "facts": ('<dl class="facts fade">%s</dl>' % facts_html) if facts_html else "",
    "links": links_html,
    "year": __import__("datetime").date.today().year,
}
with open(os.path.join(DEST, "index.html"), "w", encoding="utf-8") as f:
    f.write(landing_html)

# ------------------------------------------------------------------- CNAME
cname = os.path.join(DEST, "CNAME")
if not STAGING and landing.get("domain"):
    with open(cname, "w") as f:
        f.write(landing["domain"].strip() + "\n")
elif os.path.exists(cname):
    os.remove(cname)
open(os.path.join(DEST, ".nojekyll"), "a").close()
print("Sitio montado en %s (%s, versión %s): portada + photos/" % (DEST, a.env, a.version))
