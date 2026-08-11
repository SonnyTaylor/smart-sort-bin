# CAD

The mechanical parts. **Autodesk Fusion is the source of truth.** The models
live in the Autodesk project *Systems engineerring*; everything in this folder
is exported from there.

## The parts

| Fusion document | Qty | Size | What it does |
| :--- | :---: | :--- | :--- |
| Smart Bin - hub plate | 1 | 132 dia x 4 | Holds the pan servo, spans the bin on three legs |
| Smart Bin - leg bracket | 3 | 32 x 26.4 x 36.4 | Bolts under the plate, takes a pipe |
| Smart Bin - bin clamp | 2 | 58.1 x 24.4 x 31.4 | Grips the bin rim at the far end of each pipe |
| Smart Bin - camera clamp | 1 | 58.1 x 26.4 x 66.4 | The same clamp with a 20mm socket on top for the camera post. Replaces one of the three |
| Smart Bin - camera head | 1 | 50 x 32 x 38 | Caps the camera post. Side arm carries a 1/4-20 bolt for the webcam |
| Smart Bin - pan ring | 1 | 96.3 x 111.2 x 11.5 | Traps the pan servo against the plate and carries the yoke's bearing |
| Smart Bin - tilt yoke | 1 | 60 x 116.5 x 62.5 | Turns on the ring, carries the tilt servo out past the tray |
| Smart Bin - tilt cradle | 1 | 52 x 92 x 31 | Tips the tray about the tilt axis |
| Smart Bin - sorting tray | 1 | 120 x 90 x 18 | The saddle the rubbish lands on |
| Smart Bin - box hanger | 1 | 33 x 44 x 26 | Hooks over the bin rim and carries the box below |
| Smart Bin - electronics box | 1 | 71 x 190 x 42.5 | Holds the Pi, breadboard, PD board and wiring |
| Smart Bin - assembly | | | All of the above in position, plus the bin |

Not printed: **four** lengths of 20mm PVC electrical conduit, three for the
legs and one standing up for the camera, plus two MG996R servos.

The head is our own design. It used to be a bought MakerWorld pan-tilt
tracker, which is why some older pictures show a 125mm dome under the tray.
[`docs/mechanical_design.md`](../docs/mechanical_design.md) explains how the
replacement works and why.

### The head, in one paragraph

The pan servo drops through the hub plate and hangs underneath, with its
flange trapped between the plate's top face and the pan ring. The ring's top
face is a plain bearing. The tilt yoke turns on it, bolted to the pan servo's
horn, and reaches out past the edge of the tray on both sides: the tilt servo
on one arm, a 10mm idler boss on the other. The tilt cradle spans between
them and the tray bolts to it. Tilt axis 58mm above the plate, tray underside
73mm.

### The camera post

The post goes on the **180 degree leg**, the long one, and is in the assembly.
Its axis sits 142.5mm from the tray centre, and the tray only sweeps a 75mm
radius when it pans, so nothing moving comes near it.

The camera itself sits on the head's side arm, which reaches back toward the
tray, so the **bolt axis is 122.5mm** from the tray centre. That is the number
every sighting figure below is worked from, not the post's own 142.5.

With a **235mm** length of conduit the arm's top face finishes at z=238, and the
tray's surface at its centre is at z=81, so the camera sits 157mm above the tray
and 122.5mm to one side. That is looking down about **52 degrees** from **199mm**
away. A longer pipe gives a steeper, more overhead view: the camera ends up
roughly `122.5 x tan(angle)` above the tray surface.

This was 300mm when the tray sat 65mm higher. Cutting a 300 now gives 61 degrees
from 254mm away, which still works and is actually a squarer view of the tray,
but it puts the camera further off and stands the whole thing taller.

The webcam mounts with a **1/4-20 bolt** through the head's side arm, head
recessed underneath, thread pointing up. The arm sticks out toward the tray so
the pipe is not in shot and so the bolt head is reachable.

**The post locks with an M3 screw** through a pad on the outboard side of the
socket, 26mm above the rim. The socket wall on its own is 2.97mm, too thin to
take a brass insert, so the pad stands 4mm proud of it and gives the insert its
full 5mm. Aim the camera first, then tighten. The screw tip reaches 3mm into the
bore and bites the conduit.

## The electronics box

It goes on one of the **long side walls, on the outside**, centred 63mm from the
middle of that wall toward the camera-post end. That leaves 15.5mm to the bin's
corner and 14.8mm to the nearest leg clamp, which is the tightest pair of
clearances on the part. It sticks out 77mm from the wall and hangs 42.5mm below
the rim. Nothing about it is tied to that spot; it can go anywhere there is
190mm of clear rim.

The hanger goes on first and stays there. Its thumbscrew enters **from inside
the bin**, so it is set once, before the bags go in, and the box then lifts on
and off without touching it. The box's top edge finishes level with the rim, so
cables from the hub and the camera post cross the rim and drop straight in
through the 10mm gap between the box's back wall and the bin.

Inside is **185 x 62 x 40mm**. A Raspberry Pi 3B and a half-size breadboard lie
side by side along the floor with 17mm to spare. **Measure your breadboard
first:** this is sized for the half-size 83 x 55mm board in the prototype
photos, and a full-size 165mm one will not fit beside the Pi.

Four pegs in the floor match the Pi's own 58 x 49mm hole pattern and stand it
3mm clear. The board drops on and no screws are needed.

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
It writes all nine parts to `stl/` and `step/` in one go, and refuses to run if
the assembly is sitting on an out-of-date version of a part.

By hand, if you prefer: **Utilities > Make > 3D Print** for STL, **File >
Export** for STEP, saved into `stl/` and `step/` under the same name.

Either way, commit the exports. They are the only copy of a Fusion part that
lives in git, and the design-evolution renders draw the current version of each
part from them.

Renders of the finished parts come out of the Fusion assembly document and land
in `../portfolio/images/cad/`.

Renders showing how a part **changed over time** are made by
[`renders/`](renders/README.md) instead, and land in
`../portfolio/images/cad/evolution/`. Those are generated from git history, so
after changing a part, re-run them and the "current" panel updates itself.

## Cutting the pipes

Three different lengths, because a three-legged thing does not sit on a
rectangle symmetrically. For the 60L ecobin (347 x 277 outside, 4.5mm corflute):

| Leg | Cut to |
| :--- | :--- |
| 60 deg | 103.73 mm |
| 180 deg | 118.00 mm |
| 300 deg | 103.73 mm |
| camera post, standing up off the 180 deg clamp | 235 mm |

Change the bin and the three leg lengths change. The old `splitter_hub.scad`
still works out the figures from bin dimensions if you need them for a
different bin. The camera post does not depend on the bin, only on how steeply
you want the camera to look down.

## Hardware

24 x M3 brass heat-set inserts: 6 in the bracket feet, 6 in the pipe lock pads,
3 in the clamp jaws, 3 in the pan ring, 4 in the tilt cradle, 1 in the box
hanger, 1 in the camera post lock pad.

| Qty | Screw | Into |
| ---: | :--- | :--- |
| 6 | M3 x 8 countersunk | plate, down into the bracket feet. **Not longer:** past 9mm it bottoms out |
| 6 | M3 x 8 | pipe locks, down through the pads onto the conduit |
| 3 | M3 x 10 | up through the plate's spokes at R=50 into the pan ring. These are what clamp the pan servo |
| 4 | M3 x 12 countersunk | tray, down into the tilt cradle |
| 1 | M3 x 10 + washer | through the cradle's idler wall into the yoke's boss. Self-taps into a 2.5mm pilot |
| 3 | M3 x 16 or 20 | clamp thumbscrews. 16 leaves 2.4mm of travel, 20 leaves 6.4mm |
| 1 | 1/4-20 UNC x 12 or so | camera head, up through the side arm into the webcam. Hex head sits in the 11.5mm recess underneath. Any tripod screw works |
| 1 | M3 x 16 | box hanger jaw, entering from **inside** the bin. Crosses a 7.5mm gap to a 4.5mm wall with 3.5mm to spare. A 20 also fits |
| 1 | M3 x 10 | camera post lock, through the pad on the socket. Reaches 3mm past the bore onto the conduit |

The servos are fixed with **the small screws that came in their own bag**, not
with M3:

| Qty | Screw | Into |
| ---: | :--- | :--- |
| 4 | servo mounting screws | tilt servo flange, into 2.5mm pilots in the yoke's tower wall |
| 4 | servo horn screws | pan horn, up into the yoke's skirt |
| 4 | servo horn screws | tilt horn, through the cradle's driven wall |

**The pan servo takes no screws at all.** Its flange sits in a 2mm pocket and
the pan ring clamps it down; the case sits in a 41.6 x 21mm slot which is what
actually takes the panning torque. That is deliberate, and the reason is in
[`../docs/mechanical_iteration_log.md`](../docs/mechanical_iteration_log.md).

## Assembly order

1. Melt the inserts in. Everything is easier before anything is bolted together.
2. Bracket feet to the plate, countersunk screws from above so the heads finish
   flush.
3. Pipes into the brackets, lock screws down through the pads.
4. Clamps onto the far ends of the pipes, lock screws down. The **camera clamp**
   goes on the 180 degree leg, the long one.
5. Drop the assembly over the bin and nip up the three thumbscrews.
6. **Pan servo down through the plate's centre slot from above**, cable first,
   body hanging underneath, flange flat on the plate. The body points along the
   180 degree spoke, the same way as the long leg.
7. Pan ring over it, three M3 x 10 up through the plate's spokes. The ring
   traps the flange; nothing screws into the servo.
8. Tilt servo into the yoke's tower, its four own screws through the flange.
9. Pan horn onto the pan servo's shaft, then the yoke down onto it. Four horn
   screws up through the skirt, then the servo's centre screw through the 9mm
   hole in the middle. **The yoke's weight sits on the ring, not on the horn.**
10. Tilt horn onto the tilt servo's shaft. Cradle over it: horn into the pocket
    in the driven wall, four horn screws, then the idler screw and washer
    through the far wall into the yoke's boss.
11. Tray onto the cradle, four countersunk screws.
12. Camera post into the camera clamp's socket, head onto the top of it, webcam
    bolted to the head's side arm. Aim it before you tighten anything.
13. Box hanger over the rim on a long side wall, thumbscrew tightened from
    inside the bin. Then drop the electronics box onto its cleat. The box only
    goes on one way round, and it lifts straight off again.

Centre both servos in software before step 9, or the head will be built at an
angle and the whole travel will be off to one side.

## Three things to measure before you print

**The tilt servo's flange holes.** The yoke's four pilot holes are on a
48 x 8.5mm pattern, taken off the servo model. The figure quoted in most places
online is 49.5 x 10mm. Those cannot both be right, and 0.75mm a side is enough
to stop the screws going in. Put calipers across the real flange. Nothing else
in the design depends on this number, on purpose, but the yoke does.

**The servo horns.** The yoke and the cradle each have a 25.5mm round pocket for
a horn, with four 2.5mm pilots on a 16mm circle. MG996R horns vary between
sellers. Measure yours and say so if it is not a 25mm round one.

**The inserts.** M3 inserts run 4.0 to 4.6mm outside depending on supplier. Every
insert hole here is 4.2mm. Measure yours, and if they differ the holes need
changing before you print anything.
