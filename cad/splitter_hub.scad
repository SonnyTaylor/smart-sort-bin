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

   HARDWARE   (as set up, i.e. with use_inserts on)
     15 x M3 brass heat-set inserts
                                6 in the bracket feet, 6 in the pipe lock
                                pads, 3 in the clamp outer jaws
      6 x M3 x 8 countersunk    bracket feet, down through the plate.
                                NOT longer. Past 9mm it bottoms out in the
                                5mm foot and stops pulling the joint tight.
      6 x M3 x 8                pipe locks, down through the pads
      3 x M3 x 8 self-tapping   retain the pan-tilt base. No insert here:
                                the tabs are one wall thick, 3.2mm, and an
                                M3 insert is about 4mm long.
      3 x M3 x 16 or 20         thumbscrews, pinch the bin wall. 16 touches a
                                4.5mm wall with 2.4mm of travel left, 20 gives
                                6.4mm. bin_wall_max is what sets this.

   Render and read the console. It works the lengths out for your settings
   rather than making you trust the list above.

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

base_dia     = 125.6;  // pan-tilt base outside diameter, plus clearance.
                       //   The supplied Tracker.step measures 125.00 exactly.
                       //   This was 124.5, taken off the real thing with
                       //   calipers, which put the retaining tabs 0.25mm
                       //   inside the base on every side: it would not have
                       //   dropped in. 125.6 leaves 0.3mm a side to seat.
lip_h        = 7;      // height of the tabs that stop the base sliding off
bin_wall_max = 6;      // thickest bin wall the clamp must grip.
                       //   ecobin corflute is 4.5, cardboard 3-6, so 6 covers
                       //   everything this is actually going on.
                       //
                       //   This one number sets how long the thumbscrew has to
                       //   be, because the jaw gap has to clear a wall this
                       //   thick skewed as far as a rectangular bin can skew
                       //   it. It was 8, which wanted an M3 x 25. At 6 an
                       //   M3 x 20 does it with 3mm of travel spare. Raise it
                       //   for a chunkier bin and buy longer screws.

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
lock_boss_d  = 10;     // pad carrying the pipe lock screw
lock_boss_h  = 3;      // how far that pad stands off the block
$fn          = 48;


/* ---------- BRASS HEAT-SET INSERTS ----------
   Set false and every threaded hole goes back to a self-tapping screw
   straight into PLA.

   MEASURE YOUR OWN INSERTS. M3 inserts vary a lot between suppliers:
   4.0 to 4.6mm outside, 3 to 6mm long. insert_d wants to be a couple of
   tenths under the outside diameter so the brass melts its way in.

   Inserts are used in the three places with the plastic to take them:
   the bracket feet, the pipe locks and the thumbscrews. NOT in the plate
   tabs, which are only one wall thick, so those stay self-tapping. */

use_inserts  = true;
insert_d     = 4.2;    // hole for the insert
insert_len   = 4;      // how deep it sits, used to check there is room


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
//
// The outline is one closed polygon: the circle's arc the long way round the
// bottom, then the two 45 degree faces of the peak, then the flat that tops it
// off. It used to be a circle unioned with a triangle and then cut by a
// square. That drew the same shape, but a 2D boolean inside linear_extrude is
// the thing that stops the part converting to STEP, so it is spelled out.
module teardrop_x(d, len) {
    r    = d / 2;
    step = 360 / $fn;
    k0   = round($fn * 3 / 8);          // 135 deg, where the peak meets the arc
    k1   = round($fn * 9 / 8);          // 405 deg, i.e. 45 deg the long way
    // Never let the flat top rise above the peak itself, or the outline
    // would cross over itself on a small bore.
    pc   = min(peak_cut, r * sqrt(2) - 0.01);
    xt   = r * sqrt(2) - pc;            // half width of the flat, on a 45 deg slope

    rotate([0, 90, 0])
        rotate([0, 0, 90])
            linear_extrude(len)
                polygon(concat(
                    [for (k = [k0 : k1]) [r * cos(step * k), r * sin(step * k)]],
                    [[xt, pc], [-xt, pc]]
                ));
}


// The block a pipe pushes into. Straight sides so it prints perfectly,
// truncated teardrop bore so it needs no support. `base` is where the
// block starts in Z. stop = -1 blanks the -X end, +1 blanks the +X end,
// 0 leaves it open right through.
module socket_body(base = 0, stop = -1) {
    bz = bore_z(base);
    bh = block_h(base);
    h  = bh - base;
    y0 = socket_od / 2;          // full width down at the bed
    y1 = socket_od / 2 - 3;      // tucked in at the top
    difference() {
        union() {
            // The tapered block, drawn as one profile swept along X. This used
            // to be a hull() of two thin slabs. Same solid to the last micron,
            // but hull() is the one operation that will not convert to STEP,
            // so the shape is written out directly instead. The 0.1mm ledge at
            // the bottom is the old slab thickness, kept so the part does not
            // move; above it the wall runs dead straight to the top corner,
            // which is what the hull actually did.
            translate([0, 0, base])
                rotate([90, 0, 90])
                    linear_extrude(socket_len)
                        polygon([[-y0, 0], [y0, 0], [y0, 0.1],
                                 [y1, h], [-y1, h], [-y0, 0.1]]);
            // Pad for the pipe lock screw.
            //
            // The screw used to go in from the side, where it had 1.56mm of
            // plastic to bite: the bore is at its widest exactly where the
            // block has tapered in. That is three threads, in PLA, holding a
            // leg on. It strips if you lean on the screwdriver.
            //
            // Coming down through the top instead gives the full wall, and
            // this pad adds the rest. The block's top is a flat horizontal
            // face, so the pad prints with no overhang anywhere.
            translate([socket_len - 9, 0, bh - 0.01])
                cylinder(d = lock_boss_d, h = lock_boss_h + 0.01);
        }
        translate([stop < 0 ? 5 : -1, 0, bz])
            teardrop_x(bore_d, stop == 0 ? socket_len + 2 : socket_len - 4);
        // pipe lock, driven down through the pad and onto the pipe
        translate([socket_len - 9, 0, bz])
            cylinder(d = use_inserts ? insert_d : grub,
                     h = bh + lock_boss_h - bz + 1);
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
        // With inserts these take the thread, so the countersunk screw comes
        // down through the plate and pulls straight into brass. Without them
        // the hole is clearance and you are holding a nut under a bracket you
        // cannot see or reach once the legs are on.
        for (x = [bolt_a, bolt_b])
            translate([x, 0, -1])
                cylinder(d = use_inserts ? insert_d : screw, h = foot_t + 2);
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
        // Thumbscrew through the outer jaw, pushes a point at the rib. This is
        // the one you undo and redo every time the bin moves, so it is the
        // joint most worth putting brass in. The post is only post_w wide, so
        // an insert leaves about 2.4mm of plastic around it.
        translate([j1 + jaw_t + 1, 0, jaw_h / 2])
            rotate([0, -90, 0])
                cylinder(d = use_inserts ? insert_d : pinch_screw, h = jaw_t + 3);
    }
}


/* ---------- output ---------- */

// How much depth each threaded hole actually has. An M3 insert is about
// insert_len long and wants a couple of mm of plastic around it.
echo(str("threaded depth  bracket foot ", foot_t,
         "mm   pipe lock ", wall + lock_boss_h,
         "mm   thumbscrew ", jaw_t,
         "mm   plate tab ", wall, "mm (self-tapping, too thin for brass)"));
echo(str("plastic around a ", insert_d, "mm hole:  thumbscrew post ",
         (post_w - insert_d) / 2, "mm   lock pad ",
         (lock_boss_d - insert_d) / 2, "mm   (want 2mm or more)"));

// Screw lengths, worked out rather than remembered.
echo(str("SCREWS  foot csk ", plate_t + insert_len, " to ", plate_t + foot_t,
         "mm   pipe lock ", wall + lock_boss_h + 1.5,
         "mm   tab ", wall + 2, "mm"));
// jaw_gap is measured from the rib's CENTRE, so the actual opening the screw
// has to cross is jaw_gap - rib_r. Getting that wrong overstates the screw by
// a whole rib radius, which is how this asked for an M3 x 25 it never needed.
echo(str("        clear jaw opening ", jaw_gap - rib_r,
         "mm, so the thumbscrew touches a ", bin_t, "mm wall at ",
         jaw_t + jaw_gap - rib_r - bin_t, "mm.  M3 x 16 or 20."));

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
