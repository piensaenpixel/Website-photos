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
email = landing.get("email") or site.get("email") or ""

def ext_attrs(url):
    return 'href="%s"%s' % (e(url), ' target="_blank" rel="noopener"' if url.startswith("http") else "")

links = []
if email:
    links.append(("Email", "mailto:" + email))
if landing.get("linkedin"):
    links.append(("LinkedIn", landing["linkedin"]))
links.append(("Photos", "photos/"))
if landing.get("cv"):
    cv = landing["cv"]
    links.append(("CV (PDF)", cv if cv.startswith(("http", "/")) else "photos/" + cv))
links_html = " · ".join('<a %s>%s</a>' % (ext_attrs(u), e(l)) for l, u in links)

def job_html(j):
    dates = e(j.get("from", "")) + (" — " + e(j["to"]) if j.get("to") else "")
    return (
        '<article class="job">'
        '<div class="job__when">' + dates + (("<br>" + e(j["place"])) if j.get("place") else "") + "</div>"
        '<div class="job__what"><h3>' + e(j.get("title", "")) + "</h3>"
        + (('<p class="job__co">' + e(j["company"]) + "</p>") if j.get("company") else "")
        + (('<p class="job__desc">' + e(j["description"]) + "</p>") if j.get("description") else "")
        + "</div></article>"
    )
experience_html = "".join(job_html(j) for j in landing.get("experience") or [])
words = " ".join('<span class="w"><span class="w__i" style="--d:%dms">%s</span></span>' % (i * 70, e(w)) for i, w in enumerate(name.split()))

landing_html = """<!DOCTYPE html>
<html lang="en"%(env)s>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>%(name)s — %(role)s</title>
  <meta name="description" content="%(intro)s">
  <meta name="theme-color" content="#ffffff">%(robots)s
  <link rel="icon" href="photos/img/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700;800&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root { --bg: #fff; --ink: #000; --muted: #6f6f6f; --line: #d4d4d4; --gutter: clamp(20px, 2.6vw, 40px); --bar-h: 56px; --ease: cubic-bezier(0.22, 1, 0.36, 1); }
    @media (prefers-color-scheme: dark) { :root { --bg: #000; --ink: #fff; --muted: #9a9a9a; --line: #2e2e2e; } }
    *, *::before, *::after { box-sizing: border-box; }
    html { background: var(--bg); color: var(--ink); }
    body { margin: 0; min-height: 100svh; font-family: "Geist", "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.5; background: var(--bg); color: var(--ink); padding: calc(var(--gutter) * 1.2) var(--gutter) calc(var(--bar-h) + 32px); -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    .mono { font-family: "Geist Mono", "JetBrains Mono", Menlo, monospace; font-size: 13px; text-transform: uppercase; }
    .top { display: flex; justify-content: space-between; gap: 24px; }
    .top a, .bar a, .links a { position: relative; }
    .top a::after, .bar a::after, .links a::after { content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform 0.45s var(--ease); }
    .top a:hover::after, .bar a:hover::after, .links a:hover::after { transform: scaleX(1); transform-origin: left; }
    main { max-width: 860px; padding: clamp(56px, 12vh, 140px) 0 0; }
    h1 { margin: 0; font-weight: 700; font-size: clamp(44px, 7vw, 96px); line-height: 0.95; letter-spacing: -0.035em; text-transform: uppercase; }
    .w { display: inline-block; overflow: hidden; vertical-align: bottom; padding: 0.04em 0.04em 0.1em 0.02em; margin: -0.04em -0.04em -0.1em -0.02em; }
    .w__i { display: inline-block; transform: translateY(110%%); animation: up 1s var(--ease) forwards; animation-delay: var(--d, 0ms); }
    @keyframes up { to { transform: none; } }
    .role { margin: 20px 0 0; font-size: 18px; }
    .links { margin: 12px 0 0; color: var(--muted); }
    .links a { color: var(--ink); }
    hr { border: 0; border-top: 1px solid var(--ink); margin: 36px 0; }
    .intro { max-width: 62ch; margin: 0; font-size: 17px; line-height: 1.55; }
    .exp { margin: clamp(48px, 8vh, 80px) 0 0; }
    .exp h2 { margin: 0 0 8px; font-weight: 400; color: var(--muted); }
    .job { display: grid; grid-template-columns: 180px 1fr; gap: 24px; padding: 22px 0; border-top: 1px solid var(--line); }
    .job:last-child { border-bottom: 1px solid var(--line); }
    .job__when { color: var(--muted); line-height: 1.6; }
    .job h3 { margin: 0; font-size: 18px; font-weight: 700; line-height: 1.3; }
    .job__co { margin: 2px 0 0; color: var(--muted); }
    .job__desc { margin: 10px 0 0; max-width: 60ch; }
    .fade { opacity: 0; animation: fade 1s var(--ease) forwards; }
    .fade:nth-of-type(2) { animation-delay: 0.1s; } .fade:nth-of-type(3) { animation-delay: 0.2s; } .fade:nth-of-type(4) { animation-delay: 0.3s; } .fade:nth-of-type(5) { animation-delay: 0.4s; } .fade:nth-of-type(6) { animation-delay: 0.5s; }
    @keyframes fade { to { opacity: 1; } }
    .bar { position: fixed; left: 0; right: 0; bottom: 0; height: var(--bar-h); display: flex; justify-content: space-between; align-items: center; padding-inline: var(--gutter); mix-blend-mode: difference; color: #fff; }
    :root[data-env="staging"] .bar span::before { content: "Staging · "; }
    @media (max-width: 640px) { .job { grid-template-columns: 1fr; gap: 6px; } }
    @media (prefers-reduced-motion: reduce) { .w__i, .fade { animation: none; transform: none; opacity: 1; } }
  </style>
</head>
<body>
  <header class="top mono">
    <a href="./">piensaenpixel</a>
    <nav><a href="photos/">Photos</a></nav>
  </header>
  <main>
    <h1>%(words)s</h1>
    %(role)s
    <p class="links mono fade">%(links)s</p>
    <hr class="fade">
    %(intro_p)s
    %(experience)s
  </main>
  <div class="bar mono"><span>©%(year)s piensaenpixel</span><a href="photos/">Photos →</a></div>
</body>
</html>
""" % {
    "env": ' data-env="staging"' if STAGING else "",
    "name": e(name),
    "role": e(landing.get("role", "")),
    "intro": e(landing.get("intro", "")),
    "robots": '\n  <meta name="robots" content="noindex, nofollow">' if STAGING else "",
    "words": words,
    "role": ('<p class="role fade">%s</p>' % e(landing["role"])) if landing.get("role") else "",
    "links": links_html,
    "intro_p": ('<p class="intro fade">%s</p>' % e(landing["intro"])) if landing.get("intro") else "",
    "experience": ('<section class="exp fade"><h2 class="mono">Experience</h2>%s</section>' % experience_html) if experience_html else "",
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
