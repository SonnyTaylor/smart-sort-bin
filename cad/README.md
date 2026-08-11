# CAD

The mechanical parts. **Autodesk Fusion is the source of truth.** The models
live in the Autodesk project *Systems engineerring*; everything in this folder
is exported from there.

## The parts

| Fusion document | Qty | Size | What it does |
| :--- | :---: | :--- | :--- |
| Smart Bin - hub plate | 1 | 132 dia x 11 | Carries the pan-tilt, spans the bin on three legs |
| Smart Bin - leg bracket | 3 | 32 x 26.4 x 36.4 | Bolts under the plate, takes a pipe |
| Smart Bin - bin clamp | 3 | 58.1 x 26.4 x 31.4 | Grips the bin rim at the far end of each pipe |
| Smart Bin - sorting tray | 1 | 120 x 90 x 18 | The saddle the rubbish lands on |
| Smart Bin - tray mount | 1 | 52 x 45 x 18 | Joins the tray to the tilt arm |
| Smart Bin - assembly | | | All of the above in position, plus the bin |

Not printed: three lengths of 20mm PVC electrical conduit, the pan-tilt
tracker, and two MG996R servos.

## Folders

| Folder | Use |
| :--- | :--- |
| `stl/` | **Print from here.** Exported from Fusion at high refinement |
| `step/` | Solid models for anyone who wants to open the parts elsewhere |
| `*.scad` | Superseded. The OpenSCAD source the hub and tray were originally developed in, kept as the design record |
| `fusion/`, `csg_to_step.py` | Superseded. The old pipeline that got OpenSCAD parts into Fusion, before the parts were rebuilt natively |

`stl/tray_spacer.stl` and `stl/spacer.stl` are the old spacer block, replaced by
the tray mount. They can go.

## Exporting after a change

Fusion, with the part document open: **Utilities > Make > 3D Print** for STL, or
**File > Export** for STEP. Save into `stl/` and `step/` with the same name, and
commit, so the repo always matches what is in Fusion.

Renders for the portfolio come out of the assembly document and land in
`../portfolio/images/cad_*.png`.

## Cutting the pipes

Three different lengths, because a three-legged thing does not sit on a
rectangle symmetrically. For the 60L ecobin (347 x 277 outside, 4.5mm corflute):

| Leg | Cut to |
| :--- | :--- |
| 60 deg | 103.73 mm |
| 180 deg | 118.00 mm |
| 300 deg | 103.73 mm |

Change the bin and these change. The old `splitter_hub.scad` still works out the
figures from bin dimensions if you need them for a different bin.

## Hardware

19 x M3 brass heat-set inserts: 6 in the bracket feet, 6 in the pipe lock pads,
3 in the clamp jaws, 4 in the tray mount.

| Qty | Screw | Into |
| ---: | :--- | :--- |
| 6 | M3 x 8 countersunk | plate, down into the bracket feet. **Not longer:** past 9mm it bottoms out |
| 6 | M3 x 8 | pipe locks, down through the pads onto the conduit |
| 3 | M3 x 8 self-tapping | plate tabs, pinching the pan-tilt base. No insert, the tab is one 3.2mm wall |
| 2 | M3 x 8 | tray mount, down into the tilt arm |
| 4 | M3 x 12 countersunk | tray, down into the mount |
| 3 | M3 x 16 or 20 | clamp thumbscrews. 16 leaves 2.4mm of travel, 20 leaves 6.4mm |

## Assembly order

1. Melt the inserts in. Everything is easier before anything is bolted together.
2. Bracket feet to the plate, countersunk screws from above so the heads finish
   flush and the pan-tilt base still sits flat on them.
3. Pipes into the brackets, lock screws down through the pads.
4. Clamps onto the far ends of the pipes, lock screws down.
5. Drop the assembly over the bin and nip up the three thumbscrews.
6. Pan-tilt base into the plate's three tabs, pinned with the three tab screws.
7. Tray mount over the end of the tilt arm, two screws down into it. **Do this
   before the tray goes on**, or you cannot reach them.
8. Tray onto the mount, four countersunk screws.

## Two things to check before you print

**The mount's socket** is a 19.6 x 34.6mm pocket over a 19 x 34mm arm, so 0.3mm
a side. Measure your arm first; printers vary and this is a slip fit.

**The inserts.** M3 inserts run 4.0 to 4.6mm outside depending on supplier. Every
insert hole here is 4.2mm. Measure yours, and if they differ the holes need
changing before you print anything.
