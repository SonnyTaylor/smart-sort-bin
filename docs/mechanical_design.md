# Mechanical Design

*How the sorting mechanism works and why it is shaped the way it is. The
iteration history behind these decisions is in
[mechanical_iteration_log.md](mechanical_iteration_log.md).*

---

## The problem

Sort an item into one of three compartments of an ordinary wheelie-style bin,
without modifying the bin, using two servos.

## The solution in one line

A printed tripod clamps across the bin's rim and carries a pan-tilt head. The
item lands on a tray, the head turns to face a compartment, the tray tips, and
the item free-falls in.

---

## 1. The tripod hub

Three lengths of 20mm PVC electrical conduit radiate from a printed plate to
three clamps that grip the bin rim.

**The legs are structure, not chutes.** Rubbish never goes through them. It tips
off the tray and falls past them. This is what keeps the mechanism small: the
only thing that has to be printer-sized is the hub, and the span is a pipe you
cut to length.

**Bin size is a pipe length.** Changing bins means cutting three new pipes, not
reprinting anything. For the 60L ecobin the three legs come out at 103.73,
118.00 and 103.73mm, and the fact that they differ is exactly the point: three
legs at 120 degrees cannot reach the walls of a rectangle at equal distances.

This is the design's main idea, and every other decision protects it. The clamp
shape (below) is what lets it grip a bin of any shape, and using bags rather
than cut dividers (section 4) is what stops the compartments tying it back to
one bin.

### Why the legs sit at 60, 180 and 300 degrees

The drops go at 0, 120 and 240, midway between the legs. If they lined up, the
tray would fling items straight into a leg.

It also means **the legs are the dividers**. Three legs 120 degrees apart cut
the bin opening into three sectors, and each drop aims at the middle of one. No
separate divider part is needed, which is the second job the legs are already
doing.

### Why the clamp is shaped oddly

Three legs at 120 degrees cannot all meet a rectangular bin's walls square on.
On the ecobin one leg is square to its wall and the other two are 30 degrees
off.

So the fixed jaw is a **vertical rounded rib**, which touches the wall along a
line, and the thumbscrew pushes a **single point** at it from the other side. A
line plus a point pinches at any angle. The same clamp therefore grips a
rectangular bin, a round bin or a cardboard box, with no adjustment.

The outer post is deliberately narrow at 9mm. A wall arriving at an angle sweeps
sideways across the jaw, and a wide outer plate would foul it before it seated.

### Printing without supports

Every pipe socket bore is a **truncated teardrop**, not a circle: a flat-topped
45 degree peak over a round bore. That is what lets a sideways hole print with
no support. A round pipe still slides in.

---

## 2. The tray

A shallow saddle, 120 x 90mm, 3mm shell. Mathematically a hyperbolic paraboloid:

```
z = 10 * (y/45)^2  -  5 * (x/60)^2
```

**No rim anywhere.** A rim would trap the item exactly when you are trying to tip
it out, which is the opposite of the job. The surface runs out to a thin edge.

| Direction | Shape | Why |
| :--- | :--- | :--- |
| Across (the tilt axis) | curls **up** 10mm | When the head pans, the item is thrown sideways. This gentle valley rolls it back to the middle. It is the only retention there is, and it works with gravity rather than blocking anything |
| Along (the dump direction) | curls **down** 5mm | Where the item leaves. Curling down means there is nothing to climb, so it goes as soon as it tips |

**Why 5mm and not more.** At 5mm the steepest slope is 9.5 degrees, well under
the roughly 19 degrees at which plastic starts sliding on PLA. So the item stays
put until the tray is actually tipped. Past about 8mm you are relying on luck.

Print it matte white or grey. The camera classifies the item against this
surface, so a busy or shiny background costs accuracy.

---

## 3. The head

The head was a bought MakerWorld pan-tilt tracker. It is now three printed
parts of our own, because the bought one put the tray **147mm above the bin
rim** and 85mm of that was its own stacking. The measurements, and the reason
it could not just be shimmed lower, are in
[mechanical_iteration_log.md](mechanical_iteration_log.md).

### Why a hobby pan-tilt is tall

A standard pan-tilt stands its tilt servo on end inside a U-bracket. An MG996R
is 40.7mm long with its output shaft 10.2mm off centre, so mounted that way the
**body finishes 37mm above the tilt axis**. The tray then has to clear the
servo before it clears anything else, and that alone sets the height. Everything
below it, the base and the pan servo, is stacked underneath again.

### What replaced it

**The pan servo drops through the hub plate.** Its flange sits in a 2mm pocket
on the plate's top face and the *pan ring* clamps it there; the body hangs
underneath, inside the bin, where there was nothing anyway. That deletes the
tracker's 125mm dome outright, and with it the 27mm the dome stood above the
plate and the 14.5mm gap above the servo.

**The tilt servo goes beside the tray, not under it.** This is the part that
buys the height. Hanging it below the tilt axis was tried first and does not
work: the tray sweeps a circle about that axis, so at 45 degrees of backward
tilt it comes down into the servo. But the tray is only 90mm wide and it tilts
about a **y-parallel axis**, so it sweeps in x only. Move the servo out past
y = 45mm and the tray can never reach it, at any angle.

So the *tilt yoke* turns on the ring and reaches out past both edges of the
tray: the tilt servo on one arm, a 10mm idler boss on the other. The *tilt
cradle* spans between them and carries the tray.

### What sets the height now

Not the servos. **The tray's own swing.** At 60 degrees its far corner reaches
44.5mm below the tilt axis, so the axis cannot come closer than that to the hub
plate. The axis sits at z=58 and the tray's underside at z=73, which is 82mm
above the bin rim against 147mm before.

| | Before | After |
| :--- | ---: | ---: |
| Tray underside above the rim | 147 mm | 82 mm |
| Plastic in the head | 138.4 cm3 | 100.8 cm3 |
| Printed parts in the head | 4 bought + mount | 3 |

### The bearing

The yoke's weight sits on the pan ring's top face, not on the servo horn. A
servo spline is for torque, not for carrying a cantilevered tray. The horn only
turns the yoke; a 60mm annular face takes the load and the overturning moment
from the tilt servo hanging out at y=66.

### Nothing screws into the pan servo

Its flange is trapped rather than bolted. The servo model gives the flange hole
pattern as 48 x 8.5mm and the figure quoted online is 49.5 x 10mm, and those
cannot both be right. A clamp does not care. The case sits in a 41.6 x 21mm
slot, and that is what takes the panning torque.

---

## 4. The three compartments

Three ordinary bin bags, bulldog-clipped to the rim and to the two legs either
side of them. One bag per sector. **No divider part is printed or cut**, because
the legs already divide the opening.

### Why this works, in numbers

Measured off the assembly with the bin in place:

| | |
| :--- | :--- |
| Tray underside above the bin rim | 82 mm |
| Tray underside above the bin floor | 202 mm |
| Item leaves the tray at a radius of | about 60 mm |
| Fall time from that height | 0.20 s |
| Bin wall along the three drop directions | 169, 155, 155 mm |

At a slow tip, roughly 0.3 m/s, an item lands about 120 mm from the centre. At
0.8 m/s it would reach 220 mm, which is past the wall.

The important consequence: **nothing lands near the middle.** The three sectors
converge at the hub, and that is exactly where no item falls, so the one place
bags would fight each other never gets used.

### What this trades away

- Bags sag, and once fairly full they bulge into each other. This is a
  three-quarters-full solution, not a brim-full one. Rigid dividers would not
  have that problem.
- The landing distance spread above is wide enough that a fast tilt throws items
  at the wall. **Tip speed has to be calibrated on the real thing.** It is a
  software number rather than a reprint, which is the advantage of doing the
  motion with servos.

### Why not corflute dividers

Corflute was the original plan and was in the budget. Bags win on the things
that come up every time you use it: a bag lifts straight out, where corflute
means lifting rubbish over a wall; a bag holds liquid; it is about $5 against
$15; and it needs no cutting and no new CAD.

**But the real reason is that corflute would have broken the one property the
whole design is built around.**

The clamp is deliberately shaped to grip a rectangular bin, a round bin or a
cardboard box, and changing bins is meant to cost nothing but three new pipe
lengths. Corflute dividers would have undone that: every new bin needs three
panels cut to that bin's exact cross-section, and a round bin needs curved ones.
The adaptable half of the design would have been dragged back down to one
specific bin.

Bags do not care what shape the bin is. So the fit-any-bin claim now holds all
the way through:

| To move the whole thing to a different bin | |
| :--- | :--- |
| Printed parts | none change |
| PVC legs | cut three new lengths |
| Clamps | no adjustment, they pinch at any angle |
| Compartments | clip the bags to the new rim |

That is the entire changeover. Three saw cuts.

---

## 5. Getting three bins out of a 180 degree servo

Tilting the tray **backward** throws the item 180 degrees opposite to where the
pan is aiming. Every pan position therefore covers two directions, and three
drops 120 degrees apart need only 120 degrees of pan:

| Drop | Pan | Tilt |
| :--- | :--- | :--- |
| 0 deg | 0 | forward |
| 120 deg | 120 | forward |
| 240 deg | 60 | backward |

Without this the mechanism would need 240 degrees of pan and a servo upgrade.

---

## Verified clearances

These were measured against the assembled model rather than estimated.

| Check | Requirement | Actual |
| :--- | :--- | :--- |
| Whole assembly, everything against everything | no interference | none, across all 14 parts |
| Tray through its tilt range | clear from -60 to +60 degrees | clear; first contact at -65 |
| Tray's lowest reach at 60 degrees | calculated 13.54mm | 13.51mm measured on the model |
| Tilt servo clear of the tray's sweep | tray is 90mm wide, tilts about y | servo starts at y=48.5 |
| Yoke's bearing above the servo's top face | servo's top steps up to 14.5mm | bearing at 15.5mm |
| Thumbscrew reaching a 4.5mm bin wall | 13.6mm of travel | M3 x 16 gives 2.4mm spare, M3 x 20 gives 6.4mm |
| Pipe lock thread engagement | enough for an M3 insert, about 4mm | 6.2mm |
| Screw into the bracket feet | must not bottom out in 9mm | M3 x 8 |

The first two are Fusion's own interference analysis, run on the assembled
model and then re-run at 13 tilt angles from -65 to +65 degrees, rather than
checked by eye.

---

## Bought parts

- **2 x MG996R servos**, 40.7 x 19.7 x 42.9mm. The pan one is clamped by the
  pan ring, the tilt one bolts to the yoke.
- A **pan-tilt tracker** was bought and built, and is no longer used. Its
  `Tracker.step` is what made the replacement possible: with only the STL it had
  to be treated as fixed.
- **20mm PVC electrical conduit**, cheap, light and far stiffer than needed for
  roughly 1kg. Cut to length per bin; this is the only thing that changes
  between bins.
- **Three bin bags and a handful of bulldog clips**, which are the three
  compartments. Nothing is printed or cut for these.
