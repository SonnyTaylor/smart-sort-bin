"""Render a .pptx to PNGs using the installed PowerPoint (no LibreOffice here)."""
import os, sys, glob, shutil
import win32com.client

src = os.path.abspath(sys.argv[1])
out = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else "render")
if os.path.isdir(out):
    shutil.rmtree(out)
os.makedirs(out, exist_ok=True)

app = win32com.client.Dispatch("PowerPoint.Application")
pres = app.Presentations.Open(src, WithWindow=False)
pres.SaveCopyAs(os.path.join(out, "deck.png"), 18)  # ppSaveAsPNG
pres.Close()
app.Quit()

# PowerPoint drops the images into a folder named after the file
folder = os.path.join(out, "deck")
if os.path.isdir(folder):
    for f in sorted(set(glob.glob(os.path.join(folder, "*.[pP][nN][gG]")))):
        shutil.move(f, os.path.join(out, os.path.basename(f)))
    os.rmdir(folder)


def order(p):
    n = "".join(c for c in os.path.basename(p) if c.isdigit())
    return int(n or 0)


for f in sorted(set(glob.glob(os.path.join(out, "*.[pP][nN][gG]"))), key=order):
    print(f)
