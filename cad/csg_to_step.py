"""
Turn the OpenSCAD parts into real STEP solids that Fusion 360 opens natively.

STL hands Fusion a bag of triangles. STEP hands it actual cylinders, planes and
holes, so faces are selectable and fillets work. The route is:

    tray.scad / splitter_hub.scad  ->  .csg  ->  FreeCAD  ->  .step

The tray itself is deliberately not here. Its surface is a grid of points in
tray.scad, so there is no exact shape to recover; use cad/fusion/tray.stl.

Run it with FreeCAD's own interpreter, not the system python:

    "/c/Users/Sonny Taylor/AppData/Local/Programs/FreeCAD 1.1/bin/FreeCADCmd.exe" cad/csg_to_step.py

It calls OpenSCAD itself, so the .csg files are always current. Set OPENSCAD in
the environment if yours is not in the usual place. Every part is checked
against the matching STL: anything more than 0.5% off in volume is reported as
suspect rather than quietly written out.
"""

import os
import struct
import subprocess
import sys

import FreeCAD
import Part
import importCSG

HERE = os.path.dirname(os.path.abspath(__file__))
CSG_DIR = os.path.join(HERE, "csg")
OUT_DIR = os.path.join(HERE, "step")
STL_DIR = os.path.join(HERE, "stl")

OPENSCAD = os.environ.get("OPENSCAD", r"C:\Program Files\OpenSCAD\openscad.exe")

# name, source file, the PART value that draws it
PARTS = [
    ("plate", "splitter_hub.scad", "plate"),
    ("bracket", "splitter_hub.scad", "bracket"),
    ("clamp", "splitter_hub.scad", "clamp"),
    ("tray_spacer", "tray.scad", "spacer"),
]

TOLERANCE = 0.005  # 0.5% volume difference against the mesh


def stl_volume(path):
    """Signed-tetrahedron volume of a binary STL, in mm^3."""
    with open(path, "rb") as fh:
        fh.read(80)
        count = struct.unpack("<I", fh.read(4))[0]
        total = 0.0
        for _ in range(count):
            d = struct.unpack("<12fH", fh.read(50))
            a, b, c = d[3:6], d[6:9], d[9:12]
            total += (
                a[0] * (b[1] * c[2] - b[2] * c[1])
                - a[1] * (b[0] * c[2] - b[2] * c[0])
                + a[2] * (b[0] * c[1] - b[1] * c[0])
            ) / 6.0
    return abs(total)


def write_csg(name, source, part):
    """Ask OpenSCAD for the CSG tree. Absolute paths only, it rejects the rest."""
    out = os.path.join(CSG_DIR, name + ".csg")
    subprocess.run(
        [OPENSCAD, "-o", out, "-D", 'PART="%s"' % part,
         os.path.join(HERE, source)],
        check=True, capture_output=True,
    )
    return out


def patch_importer():
    """
    Work around a bug in FreeCAD 1.1's CSG importer.

    When a union has exactly two children it reads their shapes immediately,
    before they have been computed. Its guard against that recomputes the one
    object, which is not enough if the thing underneath is also still pending,
    and the union then fails on an empty shape. Recomputing the whole document
    instead does the parts in dependency order. Unions of three or more take a
    different path and never hit this, which is why only some parts failed.
    """
    original = importCSG.checkObjShape

    def checked(obj):
        shape = getattr(obj, "Shape", None)
        if shape is not None and shape.isNull():
            doc = getattr(obj, "Document", None)
            if doc is not None:
                doc.recompute()
        original(obj)

    importCSG.checkObjShape = checked


def roots(doc):
    """Top-level objects, i.e. the ones nothing else consumes."""
    return [o for o in doc.Objects if not o.InList and hasattr(o, "Shape")]


def surface_kinds(shape):
    """Tally of face types. Mostly planes on a round part means it got meshed."""
    tally = {}
    for face in shape.Faces:
        name = type(face.Surface).__name__
        tally[name] = tally.get(name, 0) + 1
    return tally


def convert(name, source, part):
    csg = write_csg(name, source, part)

    doc = importCSG.open(csg)
    doc.recompute()

    # Only the objects carrying geometry. The importer leaves empty
    # placeholders at the top level and Part.export chokes on those.
    objs = [o for o in roots(doc)
            if getattr(o, "Shape", None) and not o.Shape.isNull()]
    if not objs:
        FreeCAD.closeDocument(doc.Name)
        return "imported empty", None

    shapes = [o.Shape for o in objs]
    shape = shapes[0] if len(shapes) == 1 else Part.makeCompound(shapes)

    problem = None
    if len(shape.Solids) != 1:
        problem = "%d solids, expected 1" % len(shape.Solids)
    elif not shape.isValid():
        problem = "invalid geometry"

    stl = os.path.join(STL_DIR, name + ".stl")
    if problem is None and os.path.exists(stl):
        want = stl_volume(stl)
        err = abs(shape.Volume - want) / want
        if err > TOLERANCE:
            problem = "volume off by %.1f%% vs STL (%.0f vs %.0f mm3)" % (
                err * 100, shape.Volume, want)

    if problem:
        FreeCAD.closeDocument(doc.Name)
        return problem, None

    out = os.path.join(OUT_DIR, name + ".step")
    Part.export(objs, out)
    result = (shape.Volume, len(shape.Faces), surface_kinds(shape))
    FreeCAD.closeDocument(doc.Name)
    return None, result


def main():
    for path in (CSG_DIR, OUT_DIR):
        if not os.path.isdir(path):
            os.makedirs(path)

    patch_importer()

    lines = []
    failed = []
    for name, source, part in PARTS:
        try:
            problem, ok = convert(name, source, part)
        except Exception as exc:  # noqa: BLE001 - report, do not abort the batch
            problem, ok = "%s: %s" % (type(exc).__name__, exc), None

        if ok:
            volume, faces, kinds = ok
            shown = ", ".join("%s %d" % (k, v) for k, v in sorted(kinds.items()))
            lines.append("OK    %-12s %8.0f mm3  %4d faces  [%s]"
                         % (name, volume, faces, shown))
        else:
            lines.append("FAIL  %-12s %s" % (name, problem))
            failed.append(name)

    lines.append("")
    lines.append("%d of %d converted" % (len(PARTS) - len(failed), len(PARTS)))
    report = "\n".join(lines)

    # FreeCAD swallows stdout from scripts, so the report goes to a file too.
    with open(os.path.join(OUT_DIR, "report.txt"), "w") as fh:
        fh.write(report + "\n")
    print(report)
    return 1 if failed else 0


sys.exit(main())
