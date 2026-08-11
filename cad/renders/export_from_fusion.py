"""Export the printed parts out of Fusion into cad/stl/ and cad/step/.

Fusion is the design source of truth, so the "current" panel of every evolution
render is drawn from these exports rather than from the old OpenSCAD files.
Run this whenever a part changes, before render.ps1, or the "current" panel
will quietly show the last thing you exported instead of the design.

HOW TO RUN IT

This is a Fusion script, not a normal one. It needs to run inside Fusion,
either through the Fusion MCP connector (paste the contents as the script
argument) or via Fusion's own Scripts and Add-Ins dialog.

It reads the parts out of the open assembly document, so open
"Smart Bin - assembly" first. It refuses to run if the assembly references an
out-of-date version of a part, since exporting a stale part is exactly the
failure this script exists to prevent.
"""

import os

import adsk.core
import adsk.fusion

BASE = "C:/Users/Sonny Taylor/Code/smart-sort-bin/cad"

# Fragment of the Fusion component name -> filename stem used in the repo.
PARTS = {
    "hub plate": "plate",
    "leg bracket": "bracket",
    "bin clamp": "clamp",
    "camera clamp": "camera_clamp",
    "camera head": "camera_head",
    "sorting tray": "tray",
    "pan ring": "pan_ring",
    "tilt yoke": "tilt_yoke",
    "tilt cradle": "tilt_cradle",
    "box hanger": "box_hanger",
    "electronics box": "electronics_box",
}

# "tray mount" is deliberately absent. The tilt cradle replaced it when the
# head was rebuilt, but cad/stl/tray_mount.stl stays in git because the
# design-evolution render of the mount family draws its old version from it.


def run(_context: str):
    app = adsk.core.Application.get()
    des = adsk.fusion.Design.cast(app.activeProduct)
    if des is None:
        raise RuntimeError("No design open. Open the Smart Bin assembly first.")

    root = des.rootComponent
    em = des.exportManager

    # Refuse to export a stale reference. An assembly can happily sit on an old
    # version of a part, and that is invisible in a render.
    stale = []
    for occ in root.allOccurrences:
        if not any(k in occ.component.name for k in PARTS):
            continue
        try:
            df = occ.component.parentDesign.parentDocument.dataFile
            if df.versionNumber != df.latestVersionNumber:
                stale.append("%s is v%d but v%d exists"
                             % (occ.component.name, df.versionNumber,
                                df.latestVersionNumber))
        except Exception:
            pass  # a local, unreferenced component has no version to check
    if stale:
        raise RuntimeError("Assembly references out-of-date parts, fix these "
                           "first: " + "; ".join(sorted(set(stale))))

    done = set()
    for occ in root.allOccurrences:
        comp = occ.component
        key = next((k for k in PARTS if k in comp.name), None)
        if key is None or key in done:
            continue
        done.add(key)
        stem = PARTS[key]

        stl_path = "%s/stl/%s.stl" % (BASE, stem)
        opts = em.createSTLExportOptions(comp, stl_path)
        opts.meshRefinement = adsk.fusion.MeshRefinementSettings.MeshRefinementHigh
        opts.isBinaryFormat = True
        em.execute(opts)

        step_path = "%s/step/%s.step" % (BASE, stem)
        em.execute(em.createSTEPExportOptions(step_path, comp))

        volume = sum(b.volume for b in comp.bRepBodies) * 1000  # cm3 -> mm3
        print("%-11s <- %-32s %9.1f mm3   stl %7d B   step %7d B"
              % (stem, comp.name, volume,
                 os.path.getsize(stl_path), os.path.getsize(step_path)))

    missing = sorted(set(PARTS) - done)
    if missing:
        raise RuntimeError("Not found in this document: %s. Is the assembly "
                           "open?" % ", ".join(missing))
