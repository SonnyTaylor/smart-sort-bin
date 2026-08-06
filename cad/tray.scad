/* ============================================================
   AI SMART BIN  -  sorting tray

   Bolts to the tilt servo. Rubbish lands here, the camera looks
   at it, then the tray tips and drops it into one of three bins.

   THE SHAPE
   A bowl, so the item always rolls to the middle and the camera
   sees it in the same place every time. But it is deliberately
   NOT a round bowl:

     ACROSS  (the tilt axis)   deep, 16mm.
       When the head pans, the item gets thrown sideways along
       this axis. The steep sides are what stop a drink can
       leaving the tray. A flat plate loses it immediately.

     ALONG   (the dump direction)   shallow, 11mm.
       This is where the item has to leave, so it is a gentler
       climb. The rim is also arched down at these two ends, so
       there is almost nothing to get over when the tray tips.

   It is SYMMETRIC in both directions, which is not optional.
   Tilting backward throws the item 180 degrees opposite to
   where the pan is aiming, and that trick is the only reason
   three bins work on a servo that only turns 180 degrees. A
   tray that can dump one way but not the other kills it.

   WHAT TO PRINT   (no supports)
     1 x tray     flat side down, bowl facing up. The bowl is
                  concave upward, so there is not a single
                  overhang anywhere in the part.
     1 x spacer   sets the gap between tray and servo bracket.
                  Print it as tall as you need, or skip it and
                  stack nuts instead.

   PRINT IT IN A PLAIN LIGHT COLOUR. The camera classifies the
   item against this background, so a busy or shiny surface
   costs you accuracy. Matte white or grey. Not the silk blue.
   ============================================================ */

PART = "tray";   // "tray" | "spacer" | "preview" | "cut_across" | "cut_along"


/* ---------- MEASURE THESE ----------
   The bolt pattern on your tilt plate. Take the servo horn or the
   MakerWorld bracket's top plate and measure hole to hole.       */

bolt_dx    = 32;    // hole spacing across the tray
bolt_dy    = 15;    // hole spacing along the tray
bolt_d     = 3.4;   // M3 clearance
bolt_csk   = 6.4;   // M3 countersunk head
spacer_h   = 12;    // gap between tray underside and the tilt plate.
                    //   Enough that the tray clears the bracket arms
                    //   at full tilt. Measure, then reprint if wrong.


/* ---------- SHAPE ---------- */

tray_l     = 130;   // X, the dump direction
tray_w     = 95;    // Y, along the tilt axis
r_across   = 78;    // bowl radius across. SMALLER = deeper = grips harder
r_along    = 200;   // bowl radius along.  LARGER = flatter = dumps easier
floor_t    = 3.5;   // material under the lowest point of the bowl
rim_h      = 22;    // rim height at the middle of each long side
arch_drop  = 7.6;   // how much lower the rim sits at the two dump ends
rim_flat   = 3;     // flat width of the rim. Without this the bowl runs
                    //   out to the edge and leaves a knife edge that is
                    //   fragile and prints badly.

$fa = 2;
$fs = 0.8;


/* ------------------------------------------------------------
   Nothing below here normally needs changing.
   ------------------------------------------------------------ */

// radius of the cylinder that arches the rim down at the two dump ends
arch_r = (pow(tray_l / 2, 2) + pow(arch_drop, 2)) / (2 * arch_drop);

depth_across = r_across - sqrt(pow(r_across, 2) - pow(tray_w / 2 - rim_flat, 2));
depth_along  = r_along  - sqrt(pow(r_along,  2) - pow(tray_l / 2 - rim_flat, 2));


// The bowl cavity. Two crossed cylinders: a tight one curving across,
// a lazy one curving along. Both bottom out at the same point, so the
// result is symmetric in every direction with a single low spot in the
// middle. Clipped inside the footprint so a flat rim survives.
module bowl() {
    intersection() {
        translate([0, 0, floor_t + r_across])
            rotate([0, 90, 0])
                cylinder(r = r_across, h = tray_l * 3, center = true);
        translate([0, 0, floor_t + r_along])
            rotate([90, 0, 0])
                cylinder(r = r_along, h = tray_w * 3, center = true);
        scale([(tray_l - rim_flat * 2) / (tray_w - rim_flat * 2), 1, 1])
            translate([0, 0, -1])
                cylinder(d = tray_w - rim_flat * 2, h = rim_h + 2);
    }
}


module tray() {
    difference() {
        // solid body: oval footprint, top arched down at the two ends
        intersection() {
            scale([tray_l / tray_w, 1, 1])
                cylinder(d = tray_w, h = rim_h);
            translate([0, 0, rim_h - arch_r])
                rotate([90, 0, 0])
                    cylinder(r = arch_r, h = tray_w * 3, center = true);
        }

        bowl();

        // mounting bolts, countersunk from inside the bowl so the heads
        // finish flush and nothing catches on them
        for (x = [-bolt_dx / 2, bolt_dx / 2], y = [-bolt_dy / 2, bolt_dy / 2])
            translate([x, y, 0]) {
                translate([0, 0, -1])
                    cylinder(d = bolt_d, h = floor_t + 3, $fn = 24);
                translate([0, 0, floor_t - 1.7])
                    cylinder(d1 = bolt_d, d2 = bolt_csk, h = 1.8, $fn = 24);
            }
    }
}


module spacer() {
    difference() {
        hull()
            for (x = [-bolt_dx / 2, bolt_dx / 2],
                 y = [-bolt_dy / 2, bolt_dy / 2])
                translate([x, y, 0])
                    cylinder(d = 11, h = spacer_h, $fn = 32);
        for (x = [-bolt_dx / 2, bolt_dx / 2], y = [-bolt_dy / 2, bolt_dy / 2])
            translate([x, y, -1])
                cylinder(d = bolt_d, h = spacer_h + 2, $fn = 24);
    }
}


/* ---------- output ---------- */

echo(str("ACROSS the tilt axis: ", depth_across,
         "mm deep  (holds the item during the pan sweep)"));
echo(str("ALONG the dump direction: ", depth_along,
         "mm deep  (has to let it slide out)"));
echo(str("rim ", rim_h, "mm at the sides, ", rim_h - arch_drop,
         "mm at the two dump ends"));

if (PART == "tray")             tray();
else if (PART == "spacer")      spacer();
else if (PART == "cut_across")  intersection() {   // slice at x = 0
                                    tray();
                                    translate([0, -100, -5])
                                        cube([200, 200, 60]);
                                }
else if (PART == "cut_along")   intersection() {   // slice at y = 0
                                    tray();
                                    translate([-100, 0, -5])
                                        cube([200, 200, 60]);
                                }
else {
    tray();
    translate([0, 0, -spacer_h]) color("orange") spacer();
}
