"""Turn the raw OpenSCAD renders into labelled comparison strips.

Reads stages.json, crops each render down to the part itself, scales every
version of a part by the same factor so they stay comparable, and lays them
out left to right with the label and caption underneath.

Run render.ps1 first. Output goes to the folder named by "out_images" in
stages.json:

    <out_images>/<family>.png          the comparison strip
    <out_images>/parts/<stage>.png     each version on its own, cropped

    python compose.py
    python compose.py tray        # just one family
"""

import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
RAW = os.path.join(HERE, "raw")

BG = (255, 255, 255)
INK = (26, 32, 44)
MUTED = (100, 112, 128)
ACCENT = (198, 62, 48)
RULE = (226, 230, 236)

CELL_W, IMG_H = 470, 380
PAD, TOP, CAP_H = 26, 92, 122


def font(size, bold=False):
    name = "seguisb.ttf" if bold else "segoeui.ttf"
    try:
        return ImageFont.truetype(os.path.join(os.environ.get("WINDIR", r"C:\Windows"),
                                               "Fonts", name), size)
    except OSError:
        return ImageFont.load_default(size)


def crop_to_part(path):
    """Trim the flat background and drop it out, leaving just the part.

    OpenSCAD renders on a solid colour, so anything that differs from the
    top-left pixel is geometry. The soft edge keeps the antialiasing.
    """
    im = Image.open(path).convert("RGB")
    bgcol = im.getpixel((2, 2))
    px = im.load()
    w, h = im.size
    alpha = Image.new("L", im.size, 0)
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            diff = abs(r - bgcol[0]) + abs(g - bgcol[1]) + abs(b - bgcol[2])
            if diff > 6:
                ap[x, y] = 255 if diff > 30 else (diff - 6) * 255 // 24
    box = alpha.getbbox()
    if box is None:
        raise SystemExit("%s is blank. Did the render fail?" % os.path.basename(path))
    out = Image.new("RGB", (box[2] - box[0], box[3] - box[1]), BG)
    out.paste(im.crop(box), (0, 0), alpha.crop(box))
    return out


def build(fam, out_dir, parts_dir):
    stages = fam["stages"]
    missing = [s["name"] for s in stages
               if not os.path.exists(os.path.join(RAW, s["name"] + ".png"))]
    if missing:
        raise SystemExit("No render for %s. Run render.ps1 first."
                         % ", ".join(missing))

    # One shared scale factor per family. Every stage was rendered from the
    # same camera distance, so this is what keeps a bulky v1 looking bulky
    # next to a slimmed-down v3.
    tiles = [(crop_to_part(os.path.join(RAW, s["name"] + ".png")), s) for s in stages]
    scale = min(min((CELL_W - PAD * 2) / im.width, IMG_H / im.height) for im, _ in tiles)

    n = len(tiles)
    W, H = CELL_W * n, TOP + IMG_H + CAP_H
    sheet = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(sheet)
    d.text((PAD, 24), fam["title"], font=font(34, True), fill=INK)
    d.text((PAD, 64), "how it changed, and why", font=font(19), fill=MUTED)
    d.line([(0, TOP - 6), (W, TOP - 6)], fill=RULE, width=2)

    for i, (im, stage) in enumerate(tiles):
        im = im.resize((max(1, round(im.width * scale)),
                        max(1, round(im.height * scale))), Image.LANCZOS)
        im.save(os.path.join(parts_dir, "%s.png" % stage["name"]))

        x0 = i * CELL_W
        if i:
            d.line([(x0, TOP + 6), (x0, H - 16)], fill=(238, 241, 245), width=2)
        sheet.paste(im, (x0 + (CELL_W - im.width) // 2, TOP + (IMG_H - im.height) // 2))

        cy = TOP + IMG_H + 8
        label = stage["label"]
        d.text((x0 + PAD, cy), label.upper(), font=font(17, True),
               fill=ACCENT if label == "current" else MUTED)
        d.multiline_text((x0 + PAD, cy + 26), stage["caption"], font=font(17),
                         fill=INK, spacing=6)

    out = os.path.join(out_dir, "%s.png" % fam["key"])
    sheet.save(out)
    print("%-10s %d versions  %dx%d  -> %s"
          % (fam["key"], n, W, H, os.path.relpath(out, REPO)))


def main():
    cfg = json.load(open(os.path.join(HERE, "stages.json"), encoding="utf-8"))
    out_dir = os.path.join(REPO, cfg["out_images"])
    parts_dir = os.path.join(out_dir, "parts")
    os.makedirs(parts_dir, exist_ok=True)
    only = sys.argv[1] if len(sys.argv) > 1 else None
    hit = False
    for fam in cfg["families"]:
        if only and fam["key"] != only:
            continue
        hit = True
        build(fam, out_dir, parts_dir)
    if not hit:
        raise SystemExit("No family called %r in stages.json. Known: %s"
                         % (only, ", ".join(f["key"] for f in cfg["families"])))


if __name__ == "__main__":
    main()
