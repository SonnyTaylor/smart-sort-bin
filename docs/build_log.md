# Build log

A dated record of what has actually been built, so the portfolio can be written
from fact rather than memory. [pi_todo.md](pi_todo.md) is
the list of what is left; this is the list of what happened.

**Add a new entry at the top when something gets built, printed, wired or
tested.** Photograph it at the time. A photo taken later, with the thing already
working, is not evidence of the step.

---

## Where it stands: 11 August 2026

### Built and working

The electronics and software half of the prototype runs.

| | |
| :--- | :--- |
| Pan-tilt head | Bought MakerWorld bracket, 2 x MG996R servos, assembled |
| Controller | Raspberry Pi 3B, on the LAN, code deployed and running |
| Power | USB-C PD trigger board on a separate 5V rail, 1000uF capacitor, common ground through the breadboard |
| Camera | USB webcam capturing through `/dev/video0`, **not yet mounted** on the head |
| Motion | Servo jitter solved with pigpio hardware-timed PWM |
| Software | Dashboard, classify-and-sort pipeline, animation engine, calibration, stats. See the root README |

### Designed but not made

**None of the seven printed parts exist yet.** Hub plate, three leg brackets,
two bin clamps, one camera clamp, camera head, sorting tray and tray mount are
modelled in Fusion, verified against calculated geometry, and not printed. That
is seven designs and ten pieces off the printer.

Also not yet bought or made: the 60L bin, the three lengths of 20mm PVC
conduit, the M3 brass inserts, and the bags and bulldog clips.

So at this date the mechanism has been **designed and checked, not built or
tested**. Anything written up about it should say so.

### What the checking did and did not prove

Eight faults were found and fixed before printing, listed in
[mechanical_iteration_log.md](mechanical_iteration_log.md). That work is real
and worth claiming, but be precise about it: every part was verified against
independently calculated geometry, which proves the model matches its intent.

It cannot prove the parts fit each other in the hand, or that the tripod is
stiff enough, or that items land where the maths says. Those need the printer.

---

## Entries

### 11 August 2026: the camera had nowhere to go

Found while checking what was left to do. The pan-tilt's own camera plate was
removed so the tray mount could take its place, and nothing was ever designed to
hold the webcam or the LED ring. Printing the five parts and assembling them
would have ended with the camera in mid air.

Sonny's fix: put a vertical length of the same 20mm conduit on top of one of the
bin clamps, with a camera mount on the end of it. Better than mounting off the
hub plate, which is exactly where the tray sweeps when it tilts.

**Done:**

- A *camera clamp*, a copy of the bin clamp with a 20mm socket on top. Verified
  at 30919.1 mm3, the original clamp plus a socket of exactly the calculated
  volume.
- A *camera head* that caps the post. Verified at 18806.1 mm3, 0.000% off the
  calculated figure. The webcam turned out to have a 1/4-20 tripod thread, which
  is far better than clipping to something, so the head carries a 1/4-20 bolt
  through a side arm with the head recessed underneath. The arm points at the
  tray so the pipe is not in shot.
- Both are in the assembly with a 300mm length of conduit between them. That
  puts the lens about 48 degrees above the tray, 230mm away.

**Not done:** no lock screw for the post, so nothing stops the pipe turning and
swinging the camera off aim.

Print two standard clamps and one camera clamp. The camera clamp cannot print
flat on the same face as the standard one, since the socket grows out of it.

### 11 August 2026: decided against printed bin dividers

Three ordinary bin bags on bulldog clips, one per sector, instead of a divider
part. The three legs already cut the opening into three, so no new part is
needed. Reasoning and the drop-geometry numbers are in
[mechanical_design.md](mechanical_design.md).

Removes a part from the build and about $10 from the budget. Costs some rigidity
once the bags are fairly full.

The bigger reason came out afterwards: cut dividers would have to be re-cut for
every new bin, which would have cancelled out the fits-any-bin property the
clamps and the cut-to-length legs were designed for. Bags keep it, so moving the
whole rig to a different bin is three saw cuts and nothing else.

### 11 August 2026: parts rebuilt natively in Fusion

The hub and tray were originally drawn in OpenSCAD. The course needs the CAD to
be Fusion work, so all five parts were rebuilt there and Fusion became the
design source. The OpenSCAD files stay in the repo because their history is the
only copy of the early versions, and
[cad/renders/](../cad/renders/README.md) draws the design-evolution pictures
from it.

---

## What to capture as you build

The portfolio is marked on the process, so the awkward moments are worth more
than the tidy result.

- **Photograph a part coming off the printer**, before cleanup, especially if
  something went wrong.
- **Photograph anything that did not fit**, and write down the measurement.
  A part that had to be reprinted is stronger evidence than one that did not.
- **Write down numbers when you test**, not impressions. How many items out of
  how many landed in the right sector. What tilt speed. How long a sort took.
- **Note anything that surprised you.** That is where the design reasoning in
  the write-up comes from.

