#!/usr/bin/env python3
"""AKE Records -- Applique le theme clair sur les fichiers HTML du SITE"""
import os

SITE = r"C:\Users\axela\Desktop\AKE\SITE"
CSS = '\n<link rel="stylesheet" href="light-theme.css">'
MK = 'display=swap" rel="stylesheet">'

updated = []
for fn in ["studio.html", "ake_inner_circle.html", "AKE_press_kit_2026.html"]:
    p = os.path.join(SITE, fn)
    if not os.path.exists(p):
        print(f"SKIP: {fn} introuvable")
        continue
    with open(p, encoding="utf-8") as f:
        html = f.read()
    if "light-theme.css" in html:
        print(f"{fn} -- deja a jour")
        continue
    if MK in html:
        html = html.replace(MK, MK + CSS)
    else:
        html = html.replace("</head>", CSS + "\n</head>", 1)
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"{fn} -- light theme ajoute OK")
    updated.append(fn)

# Pour index.html: le fichier est fourni separement (index.html dans les fichiers telecharges)
idx = os.path.join(SITE, "index.html")
if os.path.exists(idx):
    with open(idx, encoding="utf-8") as f:
        content = f.read()
    if len(content) < 5000:
        print("\nATTENTION: index.html est un placeholder.")
        print("Place le fichier index.html telecharge dans:", SITE)
    elif "light-theme.css" not in content:
        content = content.replace(MK, MK + CSS)
        with open(idx, "w", encoding="utf-8") as f:
            f.write(content)
        print("index.html -- light theme ajoute OK")
    else:
        print("index.html -- deja a jour")

print("\nTermine! Lance maintenant: git_push.bat")
