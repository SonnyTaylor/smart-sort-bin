# Mechanical Design

*How the sorting mechanism works and why it is shaped the way it is. The
iteration history behind these decisions is in [08_mechanical_iteration_log.md](08_mechanical_iteration_log.md).*

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

### Why the legs sit at 60, 180 and 300 degrees

The drops go at 0, 120 and 240, midway between the legs. If they lined up, the
tray would fling items straight into a leg. The three bin dividers go directly
under the three legs, so each sector is a clean opening.

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

## 3. The tray mount

The tray does not bolt to the tilt arm directly. The arm presents a 19 x 34mm
face with two M3 holes 15mm apart; the tray wants four holes on a 32 x 15
pattern. Nothing lines up, and two screws in a line would let the tray rock.

The mount is a **cap**. Its socket drops over the end of the arm, so the arm
itself resists twisting rather than the screws having to. The top plate carries
the tray's four holes.

**It also recentres the tray.** The tracker's pan axis sits 10mm off its own base
centre, because the designer centred the servo body rather than its output
shaft. The plate being wider than the arm is what pulls the tray back over the
axis it actually rotates about.

Print it upside down, plate flat on the bed, and every overhang faces the bed.

---

## 4. Getting three bins out of a 180 degree servo

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
| Tray swinging past the pan bracket | underside at least 27.2mm above the tilt axis, at any tilt angle | 43mm |
| Pan-tilt base seating in the plate's tabs | tabs must clear a 125.0mm base | 125.6mm bore, 0.3mm a side |
| Thumbscrew reaching a 4.5mm bin wall | 13.6mm of travel | M3 x 16 gives 2.4mm spare, M3 x 20 gives 6.4mm |
| Pipe lock thread engagement | enough for an M3 insert, about 4mm | 6.2mm |
| Screw into the bracket feet | must not bottom out in 9mm | M3 x 8 |

---

## Bought parts

- **Pan-tilt tracker**, printed brackets supplied as `Tracker.step`. 125mm base,
  133mm tall. Its own camera mount plate is removed; the tray mount replaces it.
- **2 x MG996R servos**, 40.7 x 19.7 x 42.9mm, mounted on 49 x 10mm flange
  patterns in the stand and the tilt arm.
- **20mm PVC electrical conduit**, cheap, light and far stiffer than needed for
  roughly 1kg.
