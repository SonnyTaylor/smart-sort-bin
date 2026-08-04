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

   WHAT TO PRINT   (all of it prints with NO SUPPORTS)
     1 x plate     flat side down, retaining ring pointing up
     3 x bracket   foot down, exactly as it appears
     3 x clamp     as it appears, jaws pointing UP.
                   In use it is flipped over so the jaws hang down.

   Every pipe bore is a teardrop, not a circle. The little peak on
   top is what lets a sideways hole print without support. A round
   pipe still slides in, the peak is only in the top corner.

   HARDWARE
     12 x M3 x 12  bracket and clamp feet
      6 x M3 x 16  grub screws locking the pipes
      3 x M3 x 20  thumbscrews, pinch the bin rim
      3 x M3 x 10  retain the pan-tilt base

   PIPE LENGTH
     length = distance_from_centre_to_rim - 45
   Render the preview and read the console, it echoes the exact
   figure for whatever settings you are using.

   For the 60L ecobin (347 x 277) the legs reach 155, 169 and
   155mm, so cut to about 110, 124 and 110mm. Legs can be
   different lengths, that is how it copes with a rectangular bin.
   Cut long and trim, each socket swallows 39mm of pipe so there
   is slop to spare.
   ============================================================ */

PART = "preview";   // "preview" | "plate" | "bracket" | "clamp"


/* ---------- MEASURE THESE ---------- */

base_dia     = 124.5;  // pan-tilt base outside diameter (measured)
lip_h        = 7;      // height of the ring that stops the base sliding off
bin_wall_max = 8;      // thickest bin wall the clamp must grip
                       //   ecobin corflute is 4.5, cardboard 3-6


/* ---------- PIPE ---------- */

pipe_od      = 20;     // PVC outside diameter. 20mm electrical conduit
                       //   is cheap, light and plenty strong for ~1kg
pipe_fit     = 0.45;   // slip fit. increase if the pipe won't push in
socket_len   = 45;     // how far the pipe goes into a socket


/* ---------- SHAPE ---------- */

wall         = 3.2;    // printed wall
plate_t      = 5;      // top plate thickness
foot_t       = 5;      // bracket / clamp foot thickness
foot_w       = 30;     // width of a bracket / clamp foot
bolt_a       = 13;     // foot bolt, inner
bolt_b       = 33;     // foot bolt, outer
csk_d        = 6.4;    // M3 countersunk head, sits flush in the plate top
screw        = 3.4;    // M3 clearance
pinch_screw  = 2.7;    // M3 self-tapping into PLA
grub         = 2.7;    // M3 self-tapping, locks the pipe
$fn          = 48;


/* ------------------------------------------------------------
   Nothing below here needs changing for a different bin.
   ------------------------------------------------------------ */

socket_od = pipe_od + 2 * wall;   // width of the socket block
plate_dia = base_dia + 2 * wall;
foot_x0   = plate_dia / 2 - socket_len;   // where a foot starts, from centre
bore_d    = pipe_od + pipe_fit;
bore_z    = foot_t + bore_d / 2 + wall;   // pipe centre height on a foot
peak_z    = bore_z + bore_d / 2 * 1.4142; // tip of the teardrop
block_h   = peak_z + wall;                // so the peak stays buried
wire_dia  = 30;                           // hole for the servo wires
leg_ang   = [60, 180, 300];


// A sideways hole with a 45 degree peak on top, so it prints without
// support and still takes a round pipe. Bore runs along +X, peak up.
module teardrop_x(d, len) {
    r = d / 2;
    rotate([0, 90, 0])
        rotate([0, 0, 90])
            linear_extrude(len)
                union() {
                    circle(r = r);
                    polygon([[-r * 0.7071, r * 0.7071],
                             [ r * 0.7071, r * 0.7071],
                             [0, r * 1.4142]]);
                }
}


// The block a pipe pushes into. Straight sides so it prints perfectly,
// teardrop bore inside so it needs no support. Sits on a foot, bore
// along X. stop = -1 blanks off the -X end, stop = +1 blanks off +X.
module socket_body(stop = -1) {
    difference() {
        hull() {
            translate([0, -socket_od / 2, foot_t])
                cube([socket_len, socket_od, 0.1]);
            translate([0, -socket_od / 2 + 3, block_h - 0.1])
                cube([socket_len, socket_od - 6, 0.1]);
        }
        // pipe bore, blind at one end so the pipe bottoms out
        translate([stop < 0 ? 6 : -1, 0, bore_z])
            teardrop_x(bore_d, socket_len - 5);
        // grub screw locking the pipe, driven in from the side
        translate([socket_len - 12, socket_od, bore_z])
            rotate([90, 0, 0])
                cylinder(d = grub, h = socket_od * 2);
    }
}


module foot(len) {
    difference() {
        translate([0, -foot_w / 2, 0])
            cube([len, foot_w, foot_t]);
        for (x = [bolt_a, bolt_b])
            translate([x, 0, -1])
                cylinder(d = screw, h = foot_t + 2);
    }
}


/* ---------- the three printed parts ---------- */

module plate() {
    difference() {
        union() {
            cylinder(d = plate_dia, h = plate_t);

            // retaining ring the pan-tilt base drops into
            difference() {
                cylinder(d = plate_dia, h = plate_t + lip_h);
                translate([0, 0, plate_t])
                    cylinder(d = base_dia + 0.6, h = lip_h + 1);
            }

        }

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

        // wire pass-through
        translate([0, 0, -1])
            cylinder(d = wire_dia, h = plate_t + lip_h + 2);

        // screws that pin the pan-tilt base down through the ring
        for (a = [0, 120, 240])
            rotate([0, 0, a])
                translate([base_dia / 2 + wall / 2, 0, plate_t + lip_h / 2])
                    rotate([0, 90, 0])
                        cylinder(d = pinch_screw, h = wall * 3, center = true);
    }
}


module bracket() {
    // Bolts under a plate ear. Prints exactly as it sits, foot down.
    foot(socket_len);
    socket_body();
}


module clamp() {
    // Shown jaws-up, which is how it prints. Flipped over in use, so the
    // foot ends up on top and becomes the depth stop for the bin wall.
    jaw_t = 5;
    jaw_h = 25;
    gap   = bin_wall_max + 1;
    j0    = socket_len + 3;                       // start of the jaw zone
    j1    = j0 + jaw_t + gap;                     // outer jaw plate

    foot(j1 + jaw_t + 3);
    socket_body(stop = 1);      // pipe enters from -X, blanked off at +X

    // Two plates straddling the bin wall. The gap runs ALONG the pipe,
    // because the bin wall sits square to it. Both stand on the foot,
    // so nothing needs bridging.
    difference() {
        for (x = [j0, j1])
            translate([x, -socket_od / 2, foot_t])
                cube([jaw_t, socket_od, jaw_h]);
        // thumbscrew through the outer plate, pinches the bin wall
        translate([j1 + jaw_t + 1, 0, foot_t + jaw_h / 2])
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
    // are both flipped over, so their flat printed face mates upward and
    // the pipe hangs below the plate.
    pipe_len = 83;                       // ecobin long leg
    engage   = socket_len - 6;           // pipe swallowed by each socket
    clamp_x  = foot_x0 + 6 + pipe_len - engage;
    jaw_r    = clamp_x + socket_len + 3 + 5 + (bin_wall_max + 1) / 2;

    echo(str("CUT PIPES TO:  (centre-to-rim) - ", jaw_r - pipe_len, " mm"));
    echo(str("check: an ", pipe_len, "mm pipe grips the rim at ",
             jaw_r, "mm from centre"));

    plate();
    for (a = leg_ang)
        rotate([0, 0, a]) {
            translate([foot_x0, 0, 0])
                rotate([180, 0, 0])
                    color("gold") bracket();

            translate([foot_x0 + 6, 0, -bore_z])
                rotate([0, 90, 0])
                    color("silver")
                        cylinder(d = pipe_od, h = pipe_len);

            translate([clamp_x, 0, 0])
                rotate([180, 0, 0])
                    color("orange") clamp();
        }
    // the pan-tilt base, drawn so you can see the fit
    color("DeepSkyBlue", 0.3)
        translate([0, 0, plate_t])
            cylinder(d = base_dia, h = lip_h + 25);
}
