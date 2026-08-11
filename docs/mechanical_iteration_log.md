# VCE Systems Engineering: Mechanical Iteration Log

*This document records the iterative design of the sorting mechanism. The
finished design is described in [mechanical_design.md](mechanical_design.md).
The iteration history of the AI subsystem lives in the portfolio deck
(`portfolio/ai_bin.js`), not here.*

Every fault below was found before anything was printed, by checking the model
against calculated geometry rather than by eye. The method is described at the
end.

---

## Summary of faults found and corrected

| # | Fault | Consequence if built | Fixed by |
| :---: | :--- | :--- | :--- |
| 1 | Tray mounting boss stood 1mm proud of the saddle | Tray could not be bolted on at all | Boss capped by the tray's own surface |
| 2 | Pipe lock screw had 1.56mm of thread | Strips on assembly, leg pulls out | Screw moved to a pad on top, 6.2mm |
| 3 | Hardware list called for M3 x 12 into a 9mm foot | Screw bottoms out, joint never tightens | Corrected to M3 x 8, lengths now calculated |
| 4 | Thumbscrew length overstated by 3mm | Buying M3 x 25 that was never needed | Calculation corrected for the rib radius |
| 5 | Retaining tabs 0.25mm too tight for the real base | Pan-tilt will not drop into the plate | Bore opened from 124.5 to 125.6mm |
| 6 | Tray spacer could not bolt to the tilt arm | Tray cannot be attached | Replaced with a socketed mount |
| 7 | Spacer 15mm tall for clearance it did not need | Head taller and less stiff than necessary | Reduced to a 6mm plate after measuring |
| 8 | Mount plate offset 6.5mm from the tray boss | Looks like a mistake, boss unsupported | Plate resized to contain both footprints |
| 9 | Pan ring screws at R=44 broke into the bracket screw holes at R=42 | Screw wanders into the neighbouring hole, neither joint pulls up | Moved to R=50, clear of both existing hole circles |
| 10 | Servo's top face is a stepped stack 2.3mm proud of its case | Ring and yoke both sat on it; head would not seat flat | Bearing raised to 15.5mm, 1mm clear of the highest step |
| 11 | 1mm rib down the centre of the servo flange | Flange rocks on the rib instead of clamping | 3mm relief groove in the ring's pocket ceiling |
| 12 | Tilt servo's flange fouled the yoke's rib | Servo cannot drop into its tower | Servo moved 1.5mm outboard, rib notched 2.1mm |
| 13 | Camera head's bolt recess cut into the top face | Webcam hangs under the arm upside down | Recess moved to the underside, thread now points up |
| 14 | Lightening the sockets opened the camera post bore to the air | Post has no lid and no end stop, so the camera aim is unset | Bottom corners kept where anything is attached below |
| 15 | Box hanger's thumbscrew entered the face the box hangs on | Screw head trapped behind the box, which then cannot sit flat | Rib and screw swapped ends, screw now enters from inside the bin |

---

## Iteration 1: the tripod hub

### Implementation
A printed plate carrying three PVC legs to three rim clamps, replacing the
original plan of a laser-cut top plate sized to one specific bin.

### Evaluation
Good. Bin size becomes a pipe length rather than a new part, and the line-plus-
point clamp grips a rectangular bin, a round bin or a box without adjustment.
Two problems surfaced later and are recorded below as faults 2 and 5.

---

## Iteration 2: the sorting tray

### Implementation
First attempt was a curved tray with a rim. Rejected on reasoning before
modelling: a rim traps the item exactly when the tray is trying to tip it out.

Second attempt, and the current design, is a rimless saddle: sides curl up 10mm
to roll the item back to the middle, ends curl down 5mm so it leaves cleanly.

### Evaluation
The 5mm end drop was chosen against a calculated limit, not picked. It gives a
steepest slope of 9.5 degrees, comfortably under the roughly 19 degrees at which
plastic slides on PLA, so the item stays put until the tray is tipped.

---

## Iteration 3: the pipe sockets went from blocks to shells

### Implementation
Every part that holds a pipe (three leg brackets, two bin clamps, one camera
clamp) did it with a round bore through a solid block. The block was 663 mm2 in
section around a 343 mm2 bore, so 36% plastic and 64% air, and the plastic was
in the wrong place: **1.49mm of wall at the equator and 6mm in the corners.**

The outer face was replaced by the bore's own profile offset 2.5mm, with 45
degree flanks so it still prints without support. Cut as a subtraction from the
old outline, so the part can only shrink and no clearance in the assembly can
change.

### Evaluation
Sound, and cheaper than it looks. The four corners were not on any load path:
the section is nowhere thinner than the 1.49mm it already had, and the socket is
now a constant-section tube instead of a block with a hole in it.

| | Before | After | |
| :--- | ---: | ---: | ---: |
| Bin clamp, x2 | 17,478 mm3 | 13,709 mm3 | -21.6% |
| Camera clamp | 30,919 mm3 | 23,649 mm3 | -23.5% |
| Leg bracket, x3 | 16,137 mm3 | 14,657 mm3 | -9.2% |
| **All six** | **114.3 cm3** | **95.0 cm3** | **-16.8%** |

Two things were checked rather than assumed. The pipe lock screw still gets the
**6.2000mm** of thread engagement that fault 2 was raised to fix, measured by
binary search onto the two faces, because the full 10mm pad seat was deliberately
kept when everything around it was cut away. And the minimum wall is **1.50mm**,
the same figure as before, so nothing got thinner.

The saving in real filament will be smaller than 16.8%. These figures are solid
volume, and the corners that went were partly infill, not solid plastic. What
went is mostly the cheapest material in the part.

**The camera clamp is only 23.5% and the bracket only 9.2% because of fault 14
below**, which is the more interesting half of this iteration.

---

## Fault 14: cutting the corners opened the camera post socket

**Found** on inspection of the changed part, before it went any further.

**Cause.** The rule "the corners are doing nothing" was applied to all four
corners of all six parts without asking what was underneath each one. On the
camera clamp there is something underneath: the post socket. The block's bottom
face is that socket's lid, and the seat the post's end butts against.

**Consequence.** Narrowing the block's underside to a 9mm strip left the 20.46mm
post bore **open to the outside air** on both sides. Probed across the bore, the
column at y=9 and y=10 was air the whole way through. The post would also have
lost its end stop, so nothing would set how far it went in, which sets where the
camera points.

**Fix.** The bottom corners are kept on the camera clamp and on the leg bracket,
where the block lands on the foot and the tube walls, 25mm apart, have to reach
it. They are cut only on the bin clamp, where nothing is underneath. That costs
1,930 mm3 on the camera clamp and 2,289 mm3 on each bracket, and it is the whole
reason those two parts save so much less than the bin clamp.

**What it changes about the method.** Volume is a bad guide to what is load
bearing. The corner material on the bin clamp and the corner material on the
camera clamp measure the same and do completely different jobs. The check that
caught it was a containment probe across the bore, not a look at the number.

---

## Iteration 4: somewhere for the electronics to live

### Implementation
A box hanging on the outside of the bin rim, on a separate hanger that stays
with the bin when the box is lifted off. Three positions were considered and the
reasoning for the one chosen is in
[mechanical_design.md](mechanical_design.md).

The box was drawn as **one** part first, with the rim hook built into its back
wall. That was rejected on printing rather than on strength. An open-topped box
prints open side up with every wall vertical; a hook over the rim opens
downward, so its inner leg would have started in mid air and needed support
material through the slot the whole fit depends on. Splitting it lets the box
print open side up and the hanger print standing, where the slot's flat roof is
a 15mm bridge between two legs rather than an overhang.

### Evaluation
The split cost 18.1 cm3 for a second part and paid for it three times: the slot
prints clean, the box lifts off without disturbing the jaw's setting, and the
thumbscrew stays reachable, which fault 15 below turned out to depend on.

The box is the largest part in the project at 62.0 cm3, against 30.9 for the
tray and 28.3 for the hub plate. Cutting the walls to a frame took it from 85.2
to 62.0 cm3, which is 27%, and vents the Pi at the same time. That is the same
argument as iteration 3: a box is a shape you get by extruding a rectangle, and
most of what it encloses is doing no work.

One number is an assumption rather than a measurement. The inside is 185mm long
because a Pi 3B at 85mm and a **half-size** 83mm breadboard have to lie side by
side, and the breadboard was sized off the prototype photograph, not with
calipers. A full-size 165mm board would not fit and the box would have to grow
to 270mm, which would no longer clear the leg clamps on that wall.

---

## Fault 15: the thumbscrew was on the face the box hangs on

**Found** while working out the order the parts go together, before the hanger
was exported.

**Cause.** The hanger began as a copy of the bin clamp, which puts its rounded
rib inside the bin and takes its thumbscrew from the outside. On the clamp
nothing is ever attached to that outer face. On the hanger, that outer face is
precisely what the box hangs against.

**Consequence.** The screw head would have been sandwiched between the hanger
and the box's back wall. The box would have sat 3 to 5mm proud and rocked on the
screw head, and the screw could not have been reached at all without lifting the
box off first.

**Fix.** The rib moved to the outer leg and the screw now enters through the
inner leg, from inside the bin. The outer face is left flat, which is what the
box needs, and the screw is set once before the bags go in.

**What it changes about the method.** Copying a proven detail carries its
assumptions with it. The clamp's screw direction was free because nothing was
ever bolted to that face; the hanger's is not. Nothing about the clamp says so,
because on the clamp it never mattered.

---

## Fault 1: the mounting boss stood proud of the tray

**Found by** counting horizontal facets in the exported mesh. 318 of them sat at
exactly z = +1.0mm, which should not exist on a curved surface.

**Cause.** The boss was a plain prism running from 6mm below the shell to 1mm
above the origin. The saddle's surface at its centre is at zero, so the boss
finished 1mm above the face.

**Consequence.** Two, and the second is fatal:

1. A flat plateau in the middle of the sorting surface, exactly where the item
   lands and the camera looks.
2. The countersinks ended inside that plateau. Above them the hole was only
   3.4mm wide, and an M3 countersunk head is 6mm. **The tray could not be
   fastened to the tilt plate at all.**

**Fix.** The boss is now intersected with a copy of the tray's own top surface,
so it cannot break through whatever the parameters are changed to. The
countersink cone was also lengthened from 1.8 to 6mm, because on a curved
surface a cone that stops at a fixed height leaves a lip on the high side.

Tray volume dropped from 32,362 to 30,925 mm3, which is the protruding material
removed.

---

## Fault 2: the pipe lock had 1.56mm of thread

**Found by** calculating thread engagement at every threaded hole while checking
whether brass inserts would fit.

**Cause.** The screw entered from the side, and the bore is at its widest exactly
where the block's taper has pulled the wall in. That leaves 1.56mm of plastic:
about three threads of M3, self-tapped into PLA, holding a leg on.

**Consequence.** It strips if you lean on the screwdriver, and there is nowhere
near enough material for an insert.

**Fix.** The screw now enters through the block's flat top, through a 10mm pad,
giving 6.2mm of thread and room for a brass insert with 2.9mm of plastic around
it. The pad sits on a horizontal face, so the part still prints with no support.

---

## Fault 3 and 4: the hardware list drifted from the geometry

The list of screws was written by hand and stopped matching the model.

**Fault 3.** It called for M3 x 12 into the bracket feet. With an insert there is
only 9mm of depth, so a 12 would bottom out and never pull the joint tight. It
wants an 8. The pipe locks and tab screws were over-specified the same way.

**Fault 4.** The thumbscrew calculation measured the jaw gap from the centre of
the rib instead of its surface, overstating every thumbscrew by one 3mm rib
radius. That is what made the design ask for an M3 x 25 it never needed.

**Verified** by casting a ray down the screw axis through the exported mesh:
clear opening 13.124mm, screw touches a 4.5mm wall at 13.624mm. An M3 x 16 has
2.4mm of travel left.

**Fix.** The model now calculates and prints every screw length when it renders,
so the list cannot drift again.

---

## Fault 5: the retaining tabs were too tight for the real pan-tilt

**Found** when the supplied pan-tilt STEP was placed in the assembly. Its base
measures 125.00mm exactly. The plate had been cut for 124.5, measured off the
real part with calipers.

**Consequence.** The tabs sat 0.25mm inside the base on every side. The pan-tilt
would not have dropped into the plate, and this is not something you discover
until both parts are printed and in your hands.

**Fix.** Bore opened to 125.6mm, giving 0.3mm a side to seat. The plate grew to
132mm and the bracket feet moved out with it; the pipes came down to 103.73 /
118.00 / 103.73mm.

---

## Fault 6 and 7: the tray spacer

**Fault 6.** The spacer was a plain 43 x 26 x 15mm block with four holes on a
32 x 15 pattern, inherited from a bracket that is no longer being used. The tilt
arm offers **two** M3 holes 15mm apart on a 19 x 34mm face. Nothing lined up, so
the tray could not be attached. Two screws in a line would also have let the
tray rock.

**Fault 7.** The spacer was 15mm tall to clear the pan bracket at full tilt, a
figure chosen by guess. Sweeping the tray around the tilt axis against the
bracket shows the underside needs to be 27.2mm above that axis at any angle, and
the arm's top face is already 37mm up. The height was solving a problem that did
not exist.

**Fix.** A socketed mount replaces it. The socket drops over the end of the arm,
so the arm resists twisting rather than the screws. The top plate carries the
tray's four holes and, being wider than the arm, moves the tray back over the
pan axis, which sits 6.5mm away from the arm's mounting face. The plate is 6mm
instead of 15, so the head is lower and stiffer.

---

## Fault 8: the mount plate looked crooked

**Found** visually, in a render from underneath, and confirmed by measurement.

**Cause.** The plate was centred on the tilt arm and the tray's boss is centred
on the pan axis. Those are 6.5mm apart, so the two rectangles sat offset. All
four bolts were inside both, so it would have worked, but it read as an error.

**Fix.** The plate is now 52 x 45, sized to contain both footprints. Its 52mm
width is the tray boss exactly, so those edges line up on purpose. The offset
itself cannot be designed away, because the arm genuinely sits off the pan axis.

---

## Fault 13: the camera head's bolt recess was on the wrong face

**Found by** probing the solid down the bolt axis rather than looking at it. The
head is modelled with the pipe socket growing upward off its plate, then flipped
in the assembly so the socket drops over the post. The bolt recess was cut from
the same face the sketch sits on, which the flip turns into the arm's **top**.

**Cause.** Both cuts start 1mm above that sketch plane: the 6.6mm clearance hole
runs 10mm and goes clean through the 8mm arm, and the 11.5mm recess runs 5mm and
so stopped 4mm in. Correct depth, wrong end.

**Consequence.** The hex head would sit in a recess on top and the thread would
point **down**. A webcam has its tripod socket underneath, so it would have hung
below the arm inverted, and every frame would arrive rotated 180 degrees.

**Fix.** The recess now starts 4mm along instead of 1mm back, so the same 4mm
pocket opens on the underside and the thread comes up out of the top face at
z=238. Nothing else about the part changes.

**Why the usual checks missed it.** The part was verified on volume, and volume
cannot see this: moving a pocket from one end of a hole to the other removes
exactly the same 4mm of plastic. It measured 18806.1 mm3 before and after, the
same figure that was quoted as 0.000% off the calculation. Volume proves how
much material is gone, never where from.

---

## How the parts were checked

No part was accepted on appearance. Each was verified against geometry
calculated independently of the model:

- **Volume and bounding box** compared against figures worked out by hand from
  the design dimensions. Every part agrees to better than 0.03%, and two errors
  were caught this way: a hole that only drilled halfway through the bracket,
  and a profile 0.06% undersized.
- **Watertightness.** Every exported mesh is checked to be a closed manifold
  solid, which is what a slicer needs and what CAD needs to convert it.
- **Ray casting** through the mesh to measure real openings, which is how the
  thumbscrew error was caught.
- **Facet analysis** to find surfaces that should not exist, which is how the
  tray boss was caught.
- **Swept clearance** of the tray against the pan bracket through the full tilt
  range, which is how the spacer height was settled.

The limitation is that all of this validates the model against its own intent.
It cannot catch a wrong measurement of a bought part, which is exactly how fault
5 arose and why it was only found when the real pan-tilt model arrived.

---

## Toolchain notes

Two problems cost real time and are worth recording.

**OpenSCAD to STEP.** The hub was developed in OpenSCAD, which only exports
meshes. Converting to solid CAD via FreeCAD failed on two constructs: `hull()`,
and 2D boolean operations inside `linear_extrude()`. Both were rewritten to draw
the same shapes directly, geometry-neutral to within 0.0003%, after which all
parts converted. The parts have since been rebuilt natively in Fusion, which
removes the need for this conversion entirely.

**Fusion assembly positions.** Moving a component in a parametric assembly is a
position change, and Fusion discards those on the next rebuild unless they are
captured as a snapshot. An entire session of repositioning silently reverted
before this was understood.
