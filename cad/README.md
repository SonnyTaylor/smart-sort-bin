# CAD

The mechanical parts. **Autodesk Fusion is the source of truth.** The models
live in the Autodesk project *Systems engineerring*; everything in this folder
is exported from there.

## The parts

| Fusion document | Qty | Size | What it does |
| :--- | :---: | :--- | :--- |
| Smart Bin - hub plate | 1 | 132 dia x 11 | Carries the pan-tilt, spans the bin on three legs |
| Smart Bin - leg bracket | 3 | 32 x 26.4 x 36.4 | Bolts under the plate, takes a pipe |
| Smart Bin - bin clamp | 2 | 58.1 x 26.4 x 31.4 | Grips the bin rim at the far end of each pipe |
| Smart Bin - camera clamp | 1 | 58.1 x 26.4 x 66.4 | The same clamp with a 20mm socket on top for the camera post. Replaces one of the three |
| Smart Bin - camera head | 1 | 50 x 32 x 38 | Caps the camera post. Side arm carries a 1/4-20 bolt for the webcam |
| Smart Bin - sorting tray | 1 | 120 x 90 x 18 | The saddle the rubbish lands on |
| Smart Bin - tray mount | 1 | 52 x 45 x 18 | Joins the tray to the tilt arm |
| Smart Bin - assembly | | | All of the above in position, plus the bin |

Not printed: **four** lengths of 20mm PVC electrical conduit, three for the
legs and one standing up for the camera, plus the pan-tilt tracker and two
MG996R servos.

### The camera post

The post goes on the **180 degree leg**, the long one, and is in the assembly.
Its axis sits 152.5mm from the tray centre, and the tray only sweeps a 75mm
radius when it pans, so nothing moving comes near it.

With a **300mm** length of conduit the head plate finishes at z=303, which puts
a typical webcam lens looking down about **48 degrees** from **230mm** away.
Cut the pipe shorter for a steeper, tighter view: the lens ends up roughly
`152.5 x tan(angle)` above the tray surface.

The webcam mounts with a **1/4-20 bolt** through the head's side arm, head
recessed underneath, thread pointing up. The arm sticks out toward the tray so
the pipe is not in shot and so the bolt head is reachable.

**Still missing: no lock screw for the post.** The socket is a 35mm slip fit,
so nothing stops the pipe turning and swinging the camera off aim. Drill and
tap it by hand for now, or wait for the part to be updated.

## Folders

| Folder | Use |
| :--- | :--- |
| `stl/` | **Print from here.** Exported from Fusion at high refinement |
| `step/` | Solid models for anyone who wants to open the parts elsewhere |
| `renders/` | Makes the design-evolution pictures for the portfolio, by rendering old versions of parts out of git history. See [`renders/README.md`](renders/README.md) |
| `*.scad` | The OpenSCAD source the hub and tray were originally developed in. No longer the design source, but **do not delete**: the version history in these files is what `renders/` draws the superseded designs from |

## Exporting after a change

Open the assembly document and run
[`renders/export_from_fusion.py`](renders/export_from_fusion.py) inside Fusion.
It writes all five parts to `stl/` and `step/` in one go, and refuses to run if
the assembly is sitting on an out-of-date version of a part.

By hand, if you prefer: **Utilities > Make > 3D Print** for STL, **File >
Export** for STEP, saved into `stl/` and `step/` under the same name.

Either way, commit the exports. They are the only copy of a Fusion part that
lives in git, and the design-evolution renders draw the current version of each
part from them.

Renders of the finished parts come out of the Fusion assembly document and land
in `../portfolio/images/cad_*.png`.

Renders showing how a part **changed over time** are made by
[`renders/`](renders/README.md) instead, and land in
`../portfolio/images/cad_evolution/`. Those are generated from git history, so
after changing a part, re-run them and the "current" panel updates itself.

## Cutting the pipes

Three different lengths, because a three-legged thing does not sit on a
rectangle symmetrically. For the 60L ecobin (347 x 277 outside, 4.5mm corflute):

| Leg | Cut to |
| :--- | :--- |
| 60 deg | 103.73 mm |
| 180 deg | 118.00 mm |
| 300 deg | 103.73 mm |
| camera post, standing up off the 180 deg clamp | 300 mm |

Change the bin and the three leg lengths change. The old `splitter_hub.scad`
still works out the figures from bin dimensions if you need them for a
different bin. The camera post does not depend on the bin, only on how steeply
you want the camera to look down.

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
| 1 | 1/4-20 UNC x 12 or so | camera head, up through the side arm into the webcam. Hex head sits in the 11.5mm recess underneath. Any tripod screw works |

## Assembly order

1. Melt the inserts in. Everything is easier before anything is bolted together.
2. Bracket feet to the plate, countersunk screws from above so the heads finish
   flush and the pan-tilt base still sits flat on them.
3. Pipes into the brackets, lock screws down through the pads.
4. Clamps onto the far ends of the pipes, lock screws down. The **camera clamp**
   goes on the 180 degree leg, the long one.
5. Drop the assembly over the bin and nip up the three thumbscrews.
6. Pan-tilt base into the plate's three tabs, pinned with the three tab screws.
7. Tray mount over the end of the tilt arm, two screws down into it. **Do this
   before the tray goes on**, or you cannot reach them.
8. Tray onto the mount, four countersunk screws.
9. Camera post into the camera clamp's socket, head onto the top of it, webcam
   bolted to the head's side arm. Aim it before you tighten anything.

## Two things to check before you print

**The mount's socket** is a 19.6 x 34.6mm pocket over a 19 x 34mm arm, so 0.3mm
a side. Measure your arm first; printers vary and this is a slip fit.

**The inserts.** M3 inserts run 4.0 to 4.6mm outside depending on supplier. Every
insert hole here is 4.2mm. Measure yours, and if they differ the holes need
changing before you print anything.
