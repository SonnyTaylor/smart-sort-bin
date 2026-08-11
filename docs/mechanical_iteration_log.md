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
