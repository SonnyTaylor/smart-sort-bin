/* ============================================================
   AI SMART BIN  -  sorting tray

   Bolts to the tilt servo. Rubbish lands here, the camera looks
   at it, then the tray tips and drops it into one of three bins.

   THE SHAPE
   A shallow saddle, like a Pringle, same as the Ameru tray.
   NO RIM ANYWHERE. The surface runs straight out to a thin
   edge. A rim would trap the item exactly when you are trying
   to tip it out, which is the opposite of the job.

     ACROSS  (the tilt axis)   sides curl UP 10mm.
       When the head pans, the item gets thrown sideways along
       this axis, and this gentle valley rolls it back to the
       middle. That is the only retention there is, and it is
       enough because it works with gravity rather than
       blocking anything.

     ALONG   (the dump direction)   ends curl DOWN 5mm.
       Where the item leaves. Curling down means there is
       nothing at all to climb, so it goes as soon as it tips.

   HOW STEEP THE ENDS CAN BE
   drop_end is a real trade-off. Curl down too hard and the item
   creeps off on its own while the head is still panning. At 5mm
   the steepest slope is about 9.5 degrees, well under the
   roughly 19 degrees where plastic starts sliding on PLA, so it
   stays put until you actually tip it. Past about 8mm you are
   relying on luck.

   WHAT TO PRINT
     1 x tray     saddle side UP, with a brim.
                  A saddle has no flat face, so this one part
                  does need light support under the two ends and
                  the outer underside. Roughly 8g, and it snaps
                  off a convex surface easily. The top face, the
                  one the camera sees and the item slides on,
                  prints upward and comes out clean.
     1 x spacer   sets the gap between tray and servo bracket.

   PRINT IT IN A PLAIN LIGHT COLOUR. The camera classifies the
   item against this background, so a busy or shiny surface
   costs you accuracy. Matte white or grey. Not the silk blue.
   ============================================================ */

PART = "tray";      // "tray" | "spacer" | "preview"


/* ---------- MEASURE THESE ----------
   The bolt pattern on your tilt plate. Take the servo horn or the
   MakerWorld bracket's top plate and measure hole to hole.       */

bolt_dx    = 32;    // hole spacing across the tray
bolt_dy    = 15;    // hole spacing along the tray
bolt_d     = 3.4;   // M3 clearance
bolt_csk   = 6.4;   // M3 countersunk head, reached 1.8mm up from bolt_d
csk_run    = 6;     // how far the countersink cone is actually run.
                    //   The saddle is curved, so a cone stopping at a fixed
                    //   height leaves a lip on the high side and the head
                    //   will not drop in. Running it long costs nothing and
                    //   does not move where the head seats.
spacer_h   = 15;    // gap between tray underside and the tilt plate.
                    //   Enough that the tray clears the bracket arms
                    //   at full tilt. Measure, then reprint if wrong.
                    //
                    //   Was 12. It went up because the two screws now come in
                    //   from opposite ends, and at 12 their tips met in the
                    //   middle and neither could pull tight. Taller is the
                    //   safe direction: it only ever adds clearance.


/* ---------- BRASS HEAT-SET INSERTS ----------
   One in each end of the spacer, so the tray screws down into the top and the
   servo bracket screws up into the bottom. Two short screws instead of one
   long one through the lot, and no nut to hold underneath where you cannot
   see it. Set false and it goes back to clearance holes and nuts. */

use_inserts = true;
insert_d   = 4.2;   // hole for the insert. MEASURE YOURS, they vary
insert_len = 4;     // how deep it sits


/* ---------- SHAPE ---------- */

tray_l     = 120;   // X, the dump direction (ends curl down)
tray_w     = 90;    // Y, along the tilt axis (sides curl up)
rise_side  = 10;    // how far the two long sides curl UP.
                    //   MORE = rolls back to the middle harder
drop_end   = 5;     // how far the two ends curl DOWN.
                    //   MORE = dumps easier, but see the note above
shell_t    = 3;     // wall thickness. It is a shell, not a slab.
end_w      = 12;    // blunt width at the two ends, so they are not points
boss_h     = 3;     // extra material under the middle for the bolts

slices     = 72;    // smoothness along the length
steps      = 28;    // smoothness across the width


/* ------------------------------------------------------------
   The surface: z = rise*(y/half_w)^2 - drop*(x/half_l)^2, a
   hyperbolic paraboloid. Built as a stack of thin cross-sections,
   because the shape is separable: the profile across is the same
   everywhere and simply gets lowered as you move toward an end.
   ------------------------------------------------------------ */

function sag(x)  = drop_end  * pow(x / (tray_l / 2), 2);
function rise(y) = rise_side * pow(y / (tray_w / 2), 2);

// half width at position x, so the outline is a rounded oval
function hw(x) = max(end_w / 2,
                     (tray_w / 2) * sqrt(max(0, 1 - pow(x / (tray_l / 2), 2))));


// Built as one polyhedron over a grid. Not stacked slabs (the oval edge
// comes out visibly stair-stepped) and not hulled slices (hull() takes the
// CONVEX hull, which fills the valley in and turns the shell into a wedge).
nx = 140;   // grid points along the length
ny = 44;    // grid points across the width

function gx(i) = -tray_l / 2 + tray_l * i / (nx - 1);
function gy(i, j) = let (h = hw(gx(i))) -h + 2 * h * j / (ny - 1);
function gz(i, j) = rise(gy(i, j)) - sag(gx(i));

function T(i, j) = i * ny + j;
function B(i, j) = nx * ny + i * ny + j;

// floor_z = undef gives the 3mm shell, which is the tray itself. Give it a
// number instead and you get a solid block under the same top surface, which
// is what caps the boss.
module grid_solid(floor_z = undef) {
    polyhedron(
        points = concat(
            [for (i = [0:nx-1], j = [0:ny-1]) [gx(i), gy(i,j), gz(i,j)]],
            [for (i = [0:nx-1], j = [0:ny-1])
                [gx(i), gy(i,j), floor_z == undef ? gz(i,j) - shell_t : floor_z]]
        ),
        faces = concat(
            // the surface the rubbish sits on
            [for (i = [0:nx-2], j = [0:ny-2])
                [T(i,j), T(i,j+1), T(i+1,j+1), T(i+1,j)]],
            // underside
            [for (i = [0:nx-2], j = [0:ny-2])
                [B(i,j), B(i+1,j), B(i+1,j+1), B(i,j+1)]],
            // the thin edge, all the way round
            [for (i = [0:nx-2]) [T(i,0), T(i+1,0), B(i+1,0), B(i,0)]],
            [for (i = [0:nx-2]) [T(i,ny-1), B(i,ny-1), B(i+1,ny-1), T(i+1,ny-1)]],
            [for (j = [0:ny-2]) [T(0,j), B(0,j), B(0,j+1), T(0,j+1)]],
            [for (j = [0:ny-2]) [T(nx-1,j), T(nx-1,j+1), B(nx-1,j+1), B(nx-1,j)]]
        ),
        convexity = 10
    );
}

module saddle() { grid_solid(); }

// Everything below the top surface. Nothing that gets intersected with this
// can break through the face the camera looks at.
module under_surface() { grid_solid(-40); }


// A rounded rectangle, as four corner posts bridged by two slabs.
// This is exactly hull() of the same four posts: at $fn = 32 each post has a
// vertex square on every axis, so the slab edges meet the posts on their flats
// with nothing sticking out. Written the long way because hull() does not
// convert to STEP, and both the boss and the spacer want this shape.
module rrect(dx, dy, d, h) {
    r = d / 2;
    union() {
        for (x = [-dx / 2, dx / 2], y = [-dy / 2, dy / 2])
            translate([x, y, 0])
                cylinder(d = d, h = h, $fn = 32);
        translate([-dx / 2, -dy / 2 - r, 0]) cube([dx, dy + 2 * r, h]);
        translate([-dx / 2 - r, -dy / 2, 0]) cube([dx + 2 * r, dy, h]);
    }
}


module tray() {
    difference() {
        union() {
            saddle();
            // Small boss under the middle, so the bolts have real material to
            // sit in rather than 3mm of shell.
            //
            // It MUST be capped by the tray's own top surface. Left uncapped
            // it stands 1mm proud of the saddle, which puts a flat plateau in
            // the middle of the sorting surface and, worse, buries the
            // countersinks inside it: above them the hole is only bolt_d wide,
            // so a countersunk M3 head cannot physically pass. The tray could
            // not be bolted on at all.
            intersection() {
                translate([0, 0, -shell_t - boss_h])
                    rrect(bolt_dx + 10, bolt_dy + 10, 10, boss_h + shell_t + 1);
                under_surface();
            }
        }

        // mounting bolts, countersunk from above so the heads finish
        // flush with the saddle and nothing catches on them
        for (x = [-bolt_dx / 2, bolt_dx / 2], y = [-bolt_dy / 2, bolt_dy / 2])
            translate([x, y, 0]) {
                translate([0, 0, -shell_t - boss_h - 1])
                    cylinder(d = bolt_d, h = boss_h + shell_t + 3, $fn = 24);
                translate([0, 0, -1.7])
                    cylinder(d1 = bolt_d,
                             d2 = bolt_d + (bolt_csk - bolt_d) * csk_run / 1.8,
                             h = csk_run, $fn = 24);
            }
    }
}


module spacer() {
    difference() {
        rrect(bolt_dx, bolt_dy, 11, spacer_h);
        // With inserts this is the insert bore, one pressed into each end.
        // The middle is left as bare hole, which is where the two screw tips
        // end up and is why spacer_h has to be more than twice their reach.
        for (x = [-bolt_dx / 2, bolt_dx / 2], y = [-bolt_dy / 2, bolt_dy / 2])
            translate([x, y, -1])
                cylinder(d = use_inserts ? insert_d : bolt_d,
                         h = spacer_h + 2, $fn = 24);
    }
}


/* ---------- output ---------- */

echo(str("sides curl UP ", rise_side, "mm, steepest ",
         atan(2 * rise_side / (tray_w / 2)),
         " deg  (rolls the item back to the middle)"));
echo(str("ends curl DOWN ", drop_end, "mm, steepest ",
         atan(2 * drop_end / (tray_l / 2)),
         " deg  (keep under ~19 or it creeps off by itself)"));
echo(str("overall ", tray_l, " x ", tray_w, " x ",
         rise_side + drop_end + shell_t, "mm"));

// Screw lengths for the spacer, and the check that the two do not meet.
bracket_t = 2;      // the metal servo bracket's top plate. Measure yours.
echo(str("SPACER SCREWS  from above ", shell_t + boss_h + insert_len,
         "mm minimum (countersunk), from below ", bracket_t + insert_len, "mm minimum"));
echo(str("  an M3x12 above reaches ", 12 - shell_t - boss_h,
         "mm in and an M3x8 below reaches ", 8 - bracket_t,
         "mm in, spacer is ", spacer_h, "mm, leaving ",
         spacer_h - (12 - shell_t - boss_h) - (8 - bracket_t),
         "mm between the tips.  Must stay above zero."));

if (PART == "tray")        tray();
else if (PART == "spacer") spacer();
else {
    tray();
    translate([0, 0, -shell_t - boss_h - spacer_h])
        color("orange") spacer();
}
