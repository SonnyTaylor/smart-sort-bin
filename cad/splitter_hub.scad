/* ============================================================
   AI SMART BIN  -  tripod hub + bin clamps  ("the Y splitter")

   WHAT THIS IS
   A printed tripod that clamps to the rim of any bin. The
   pan-tilt bolts on top. Three lengths of PVC pipe are the legs.

   Rubbish does NOT go through the pipes. It tips off the tray
   and free-falls past them into the bin below.

   IMPORTANT - LEG POSITIONS
   The three legs sit at 60 / 180 / 300 degrees.
   Aim the tray at 0 / 120 / 240 degrees, i.e. BETWEEN the legs,
   so rubbish falls through the gaps instead of hitting a leg.
   Put the three bin dividers directly under the three legs.

   WHY THE JAW IS SHAPED ODDLY
   Three legs 120 degrees apart cannot all meet a rectangular
   bin's walls square on. For the ecobin one leg is square and
   the other two are 30 degrees off. So the fixed jaw is a
   vertical rounded rib, which touches the wall along a line,
   and the thumbscrew pushes a single point opposite it. A line
   plus a point pinches at ANY angle, so the same clamp works on
   a rectangular bin, a round bin or a cardboard box.

   WHAT TO PRINT   (all of it prints with NO SUPPORTS)
     1 x plate     flat side down, retaining tabs pointing up
     3 x bracket   foot down, exactly as it appears
     3 x clamp     as it appears, jaws pointing UP.
                   In use it is flipped so the jaws hang down.

   Every pipe bore is a truncated teardrop, not a circle. The
   flat-topped peak is what lets a sideways hole print without
   support. A round pipe still slides in.

   HARDWARE
      6 x M3 x 12 countersunk   bracket feet, through the plate
      6 x M3 x 16               grub screws, lock the pipes
      3 x M3 x 25               thumbscrews, pinch the bin wall
      3 x M3 x 10               retain the pan-tilt base

   PIPE LENGTH
     length = distance_from_centre_to_rim - 50
   Render the preview and read the console, it echoes the exact
   figure for whatever settings you are using.

   For the 60L ecobin (347 x 277, 4.5mm corflute) the legs reach
   169mm on the short end and 155mm on the two long sides, so cut
   to about 119, 105 and 105mm. Different lengths is exactly how
   it copes with a rectangular bin.
   ============================================================ */

PART = "preview";   // "preview" | "plate" | "bracket" | "clamp"


/* ---------- MEASURE THESE ---------- */

base_dia     = 124.5;  // pan-tilt base outside diameter (measured)
lip_h        = 7;      // height of the tabs that stop the base sliding off
bin_wall_max = 8;      // thickest bin wall the clamp must grip
                       //   ecobin corflute is 4.5, cardboard 3-6

/* ---------- YOUR BIN ----------
   Outside dimensions. These do not change any printed part, they only
   work out how long to cut each pipe, and draw the bin in the preview.
   The three legs land at different distances on a rectangle, which is
   the whole reason the legs are pipes you cut rather than printed arms. */

bin_x        = 347;    // outside, long side   (60L ecobin)
bin_y        = 277;    // outside, short side
bin_t        = 4.5;    // wall thickness


/* ---------- PIPE ---------- */

pipe_od      = 20;     // PVC outside diameter. 20mm electrical conduit
                       //   is cheap, light and plenty strong for ~1kg
pipe_fit     = 0.45;   // slip fit. increase if the pipe won't push in
socket_len   = 32;     // how far the pipe goes into a socket


/* ---------- SHAPE ---------- */

wall         = 3.2;    // printed wall
plate_t      = 4;      // spoke and rim thickness
rim_w        = 10;     // width of the plate's outer rim
spoke_w      = 26;     // width of the three spokes
hub_r        = 15;     // radius of the centre hole (servo wires)
foot_t       = 5;      // bracket foot thickness
foot_w       = 26;     // bracket / clamp foot width
bolt_a       = 8;      // foot bolt, inner
bolt_b       = 24;     // foot bolt, outer
csk_d        = 6.4;    // M3 countersunk head, sits flush in the plate top
jaw_t        = 5;      // jaw plate thickness
jaw_w        = 20;     // inner jaw width (carries the rib)
post_w       = 9;      // outer jaw width. Deliberately narrow: a skewed
                       //   wall sweeps sideways across the jaw, and a wide
                       //   outer plate would block it before it seats.
jaw_h        = 25;     // how far the jaws reach down the bin wall
rib_r        = 3;      // the rounded rib that gives line contact
screw        = 3.4;    // M3 clearance
pinch_screw  = 2.7;    // M3 self-tapping into PLA
grub         = 2.7;    // M3 self-tapping, locks the pipe
$fn          = 48;


/* ------------------------------------------------------------
   Nothing below here needs changing for a different bin.
   ------------------------------------------------------------ */

socket_od = pipe_od + 2 * wall;           // width of the socket block
plate_r   = base_dia / 2 + wall;
foot_x0   = plate_r - socket_len;         // where a foot starts, from centre
bore_d    = pipe_od + pipe_fit;
peak_cut  = bore_d / 2 + 1.5;             // truncated teardrop height
leg_ang   = [60, 180, 300];

function bore_z(base) = base + bore_d / 2 + wall;
function block_h(base) = bore_z(base) + peak_cut + wall;

// Gap must clear the worst case: the thickest wall, skewed as far as a
// rectangular bin can skew it, sweeping sideways across the outer post.
jaw_gap = rib_r + post_w * tan(30) + bin_wall_max / cos(30) + 1;

// How far out each leg has to reach before it meets a wall. On a rectangle
// this differs per leg, which is why the three pipes are cut to different
// lengths. This is what stops the clamps sitting on a circle.
function leg_reach(a) =
    min(abs(cos(a)) < 0.001 ? 1e6 : (bin_x / 2 - bin_t) / abs(cos(a)),
        abs(sin(a)) < 0.001 ? 1e6 : (bin_y / 2 - bin_t) / abs(sin(a)));

jaw_offset = foot_x0 + 9 + jaw_t + rib_r;    // printed hardware at both ends
function pipe_for(a) = leg_reach(a) - jaw_offset;


// A sideways hole with a flat-topped 45 degree peak, so it prints
// without support and still takes a round pipe. Bore along +X.
module teardrop_x(d, len) {
    r = d / 2;
    rotate([0, 90, 0])
        rotate([0, 0, 90])
            linear_extrude(len)
                intersection() {
                    union() {
                        circle(r = r);
                        polygon([[-r * 0.7071, r * 0.7071],
                                 [ r * 0.7071, r * 0.7071],
                                 [0, r * 1.4142]]);
                    }
                    translate([-r * 2, -r * 2])
                        square([r * 4, r * 2 + peak_cut]);
                }
}


// The block a pipe pushes into. Straight sides so it prints perfectly,
// truncated teardrop bore so it needs no support. `base` is where the
// block starts in Z. stop = -1 blanks the -X end, +1 blanks the +X end,
// 0 leaves it open right through.
module socket_body(base = 0, stop = -1) {
    bz = bore_z(base);
    bh = block_h(base);
    difference() {
        hull() {
            translate([0, -socket_od / 2, base])
                cube([socket_len, socket_od, 0.1]);
            translate([0, -socket_od / 2 + 3, bh - 0.1])
                cube([socket_len, socket_od - 6, 0.1]);
        }
        translate([stop < 0 ? 5 : -1, 0, bz])
            teardrop_x(bore_d, stop == 0 ? socket_len + 2 : socket_len - 4);
        // grub screw locking the pipe, driven in from the side
        translate([socket_len - 9, socket_od, bz])
            rotate([90, 0, 0])
                cylinder(d = grub, h = socket_od * 2);
    }
}


/* ---------- the three printed parts ---------- */

module plate() {
    difference() {
        union() {
            // outer rim the pan-tilt base sits on
            difference() {
                cylinder(r = plate_r, h = plate_t);
                translate([0, 0, -1])
                    cylinder(r = plate_r - rim_w, h = plate_t + 2);
            }
            // three spokes, wide enough to carry the bracket feet
            for (a = leg_ang)
                rotate([0, 0, a])
                    translate([hub_r - 2, -spoke_w / 2, 0])
                        cube([plate_r - hub_r + 2, spoke_w, plate_t]);
            // centre ring framing the wire hole
            cylinder(r = hub_r + 6, h = plate_t);
            // three tabs that stop the base sliding off sideways
            for (a = [0, 120, 240])
                rotate([0, 0, a])
                    rotate_extrude(angle = 46)
                        translate([base_dia / 2, plate_t])
                            square([wall, lip_h]);
        }

        // wire pass-through
        translate([0, 0, -1])
            cylinder(r = hub_r, h = plate_t + 2);

        // Bolt holes for the bracket feet, countersunk from the top so the
        // heads sit flush and the pan-tilt base still lies flat on them.
        for (a = leg_ang)
            rotate([0, 0, a])
                for (x = [bolt_a, bolt_b])
                    translate([foot_x0 + x, 0, 0]) {
                        translate([0, 0, -1])
                            cylinder(d = screw, h = plate_t + 2);
                        translate([0, 0, plate_t - 1.7])
                            cylinder(d1 = screw, d2 = csk_d, h = 1.8);
                    }

        // screws that pin the pan-tilt base down through the tabs
        for (a = [20, 140, 260])
            rotate([0, 0, a])
                translate([base_dia / 2 + wall / 2, 0, plate_t + lip_h / 2])
                    rotate([0, 90, 0])
                        cylinder(d = pinch_screw, h = wall * 3, center = true);
    }
}


module bracket() {
    // Bolts under the plate. Prints exactly as it sits, foot down.
    difference() {
        translate([0, -foot_w / 2, 0])
            cube([socket_len, foot_w, foot_t]);
        for (x = [bolt_a, bolt_b])
            translate([x, 0, -1])
                cylinder(d = screw, h = foot_t + 2);
    }
    socket_body(base = foot_t, stop = -1);
}


module clamp() {
    // Shown jaws-up, which is how it prints. Flipped over in use.
    j0 = socket_len;                          // inner jaw, abuts the block
    j1 = j0 + jaw_t + jaw_gap;                // outer jaw

    socket_body(base = 0, stop = 1);

    difference() {
        union() {
            // strip tying the two jaws together along the bed
            translate([j0, -jaw_w / 2, 0])
                cube([j1 + jaw_t - j0, jaw_w, plate_t]);
            // inner jaw, full width
            translate([j0, -jaw_w / 2, 0])
                cube([jaw_t, jaw_w, jaw_h]);
            // outer jaw, narrow so a skewed wall can pass it
            translate([j1, -post_w / 2, 0])
                cube([jaw_t, post_w, jaw_h]);
            // The rounded rib. This is the whole trick: it touches the bin
            // wall along a vertical line, so the wall can sit at any angle.
            translate([j0 + jaw_t, 0, 0])
                cylinder(r = rib_r, h = jaw_h);
        }
        // thumbscrew through the outer jaw, pushes a point at the rib
        translate([j1 + jaw_t + 1, 0, jaw_h / 2])
            rotate([0, -90, 0])
                cylinder(d = pinch_screw, h = jaw_t + 3);
    }
}


/* ---------- output ---------- */

if (PART == "plate")        plate();
else if (PART == "bracket") bracket();
else if (PART == "clamp")   clamp();
else {
    // Assembly view, everything in its in-use position. Bracket and clamp
    // are both flipped over, so the pipe hangs below the plate.
    // Each leg gets its OWN pipe length, worked out from the bin above.
    engage = socket_len - 4;
    axis_z = -bore_z(foot_t);
    z_rim  = axis_z + bore_z(0) - plate_t;

    echo(str("BIN ", bin_x, " x ", bin_y, " outside, ", bin_t, "mm wall"));
    for (a = leg_ang)
        echo(str("   leg ", a, "deg  reaches ", leg_reach(a),
                 "mm  ->  CUT PIPE ", pipe_for(a), " mm"));

    plate();
    for (a = leg_ang) {
        pl      = pipe_for(a);
        clamp_x = foot_x0 + 5 + pl - engage;
        rotate([0, 0, a]) {
            translate([foot_x0, 0, 0])
                rotate([180, 0, 0])
                    color("gold") bracket();

            translate([foot_x0 + 5, 0, axis_z])
                rotate([0, 90, 0])
                    color("silver")
                        cylinder(d = pipe_od, h = pl);

            translate([clamp_x, 0, axis_z + bore_z(0)])
                rotate([180, 0, 0])
                    color("orange") clamp();
        }
    }

    // the bin, top 120mm only, so you can see the clamps land on flat wall
    color("Tomato", 0.35)
        translate([0, 0, z_rim - 120])
            difference() {
                translate([-bin_x / 2, -bin_y / 2, 0])
                    cube([bin_x, bin_y, 120]);
                translate([-bin_x / 2 + bin_t, -bin_y / 2 + bin_t, -1])
                    cube([bin_x - bin_t * 2, bin_y - bin_t * 2, 122]);
            }

    // the pan-tilt base, drawn so you can see the fit
    color("DeepSkyBlue", 0.3)
        translate([0, 0, plate_t])
            cylinder(d = base_dia, h = lip_h + 25);
}
