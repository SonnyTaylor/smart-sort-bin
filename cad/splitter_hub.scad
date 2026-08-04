/* ============================================================
   AI SMART BIN  -  tripod hub + bin clamps  ("the Y splitter")

   WHAT THIS IS
   A printed 3-way junction that three lengths of PVC pipe push
   into. The pan-tilt bolts on top. The other end of each pipe
   goes into a printed clamp that grips the rim of any bin.

   Rubbish does NOT go through the pipes. It tips off the tray
   and free-falls past them into the bin below.

   IMPORTANT - LEG POSITIONS
   The three legs sit at 60 / 180 / 300 degrees.
   Aim the tray at 0 / 120 / 240 degrees, i.e. BETWEEN the legs,
   so rubbish falls through the gaps instead of hitting a leg.
   Put the three bin dividers directly under the three legs.

   WHAT TO PRINT
     1 x hub
     3 x clamp
   Plus 3 lengths of PVC pipe, cut to suit your bin.

   PIPE LENGTH
   Legs are flat (splay 90) by default, so it just sits across
   the bin opening rather than towering over it.
     length = distance_from_centre_to_rim - 39
   For the 60L ecobin (347 x 277) the three legs reach 155, 169
   and 155mm, so cut pipes to about 116, 130 and 116mm.
   Cut them long and trim. Legs can be different lengths, that
   is how it copes with a rectangular bin.
   ============================================================ */

PART = "preview";   // "preview" | "hub" | "clamp"


/* ---------- MEASURE THESE ---------- */

base_dia     = 124.5;  // pan-tilt base outside diameter (measured)
lip_h        = 7;      // height of the ring that stops the base sliding off
bin_wall_max = 8;      // thickest bin wall the clamp must grip
                       //   ecobin corflute is 4.5, cardboard 3-6


/* ---------- PIPE ---------- */

pipe_od      = 20;     // PVC outside diameter. 20mm electrical conduit
                       //   is cheap, light and plenty strong for ~1kg
pipe_fit     = 0.45;   // slip fit. increase if the pipe won't push in
socket_len   = 38;     // how far the pipe goes into hub and clamp


/* ---------- SHAPE ---------- */

splay        = 90;     // legs, degrees from vertical
                       //   90 = flat, sits across the bin opening
                       //   less than 90 tilts the legs down, which
                       //   raises the hub above the rim
wall         = 3.2;    // printed wall
plate_t      = 5;      // top plate thickness
screw        = 3.4;    // M3 clearance
grub         = 3.4;    // pipe locking screw
pinch_screw  = 2.7;    // M3 self-tapping into PLA (clamp thumbscrew)
$fn          = 64;


/* ------------------------------------------------------------
   Nothing below here needs changing for a different bin.
   ------------------------------------------------------------ */

socket_od = pipe_od + 2 * wall;
plate_dia = base_dia + 2 * wall;
leg_r     = plate_dia / 2 - socket_od;       // where the socket starts
leg_z     = -socket_od / 2 + 2;              // legs hang under the plate so
                                             // they never foul the pan-tilt
wire_dia  = 30;                              // hole for the servo wires


module leg_axis(i) {
    // Places a child on leg i, pointing outward (and downward if splay < 90).
    rotate([0, 0, 60 + i * 120])
        translate([leg_r, 0, leg_z])
            rotate([0, 180 - splay, 0])
                children();
}


module leg_lug(i) {
    // Fills the gap between the plate and the socket hanging below it.
    hull() {
        leg_axis(i) cylinder(d = socket_od, h = 1);
        rotate([0, 0, 60 + i * 120])
            translate([leg_r, 0, plate_t / 2])
                cube([socket_od, socket_od, plate_t], center = true);
    }
}


module hub() {
    difference() {
        union() {
            // top plate
            cylinder(d = plate_dia, h = plate_t);

            // retaining lip the pan-tilt base drops into
            difference() {
                cylinder(d = plate_dia, h = plate_t + lip_h);
                translate([0, 0, plate_t])
                    cylinder(d = base_dia + 0.6, h = lip_h + 1);
            }

            // three pipe sockets, plus the lug that ties each to the plate
            for (i = [0:2]) {
                leg_axis(i)
                    translate([0, 0, -14])
                        cylinder(d = socket_od, h = socket_len + 14);
                leg_lug(i);
            }
        }

        // pipe bores
        for (i = [0:2])
            leg_axis(i)
                translate([0, 0, -1])
                    cylinder(d = pipe_od + pipe_fit, h = socket_len + 2);

        // grub screw through each socket to lock the pipe
        for (i = [0:2])
            leg_axis(i)
                translate([0, 0, socket_len - 12])
                    rotate([90, 0, 0])
                        cylinder(d = grub, h = socket_od, center = true);

        // wire pass-through
        translate([0, 0, -1])
            cylinder(d = wire_dia, h = plate_t + lip_h + 2);

        // three screw holes to pin the base down through the lip
        for (i = [0:2])
            rotate([0, 0, i * 120])
                translate([base_dia / 2 + wall / 2, 0, plate_t + lip_h / 2])
                    rotate([0, 90, 0])
                        cylinder(d = screw, h = wall * 3, center = true);
    }
}


module clamp() {
    jaw_w   = 26;
    jaw_t   = 5;
    jaw_h   = 34;
    gap     = bin_wall_max + 1;
    bridge  = 7;

    difference() {
        union() {
            // inner jaw plate
            translate([-gap / 2 - jaw_t, -jaw_w / 2, -jaw_h])
                cube([jaw_t, jaw_w, jaw_h]);
            // outer jaw plate
            translate([gap / 2, -jaw_w / 2, -jaw_h])
                cube([jaw_t, jaw_w, jaw_h]);
            // bridge across the top
            translate([-gap / 2 - jaw_t, -jaw_w / 2, 0])
                cube([gap + jaw_t * 2, jaw_w, bridge]);
            // pipe socket, angled to match the leg
            translate([0, 0, bridge])
                rotate([0, -splay, 0])
                    cylinder(d = socket_od, h = socket_len);
        }

        // pipe bore. Open at the far end (the pipe comes in from the hub
        // side), capped near the bridge so the pipe has something to stop on.
        translate([0, 0, bridge])
            rotate([0, -splay, 0])
                translate([0, 0, 2])
                    cylinder(d = pipe_od + pipe_fit, h = socket_len);

        // thumbscrew through the outer jaw, pinches the bin wall.
        // Undersized so an M3 cuts its own thread in the PLA.
        translate([gap / 2 + jaw_t + 2, 0, -jaw_h / 2])
            rotate([0, -90, 0])
                cylinder(d = pinch_screw, h = jaw_t + 5);

        // grub screw to lock the pipe
        translate([0, 0, bridge])
            rotate([0, -splay, 0])
                translate([0, 0, socket_len - 12])
                    rotate([90, 0, 0])
                        cylinder(d = grub, h = socket_od, center = true);
    }
}


/* ---------- output ---------- */

if (PART == "hub") {
    hub();
}
else if (PART == "clamp") {
    // laid flat-ish for printing; supports needed on the socket
    clamp();
}
else {
    // rough assembly view, pipes shown as plain rods
    pipe_len = 120;
    reach    = leg_r + pipe_len * sin(splay);
    z_end    = leg_z - pipe_len * cos(splay);

    hub();
    for (i = [0:2]) {
        leg_axis(i)
            color("silver")
                cylinder(d = pipe_od, h = pipe_len);
        rotate([0, 0, 60 + i * 120])
            translate([reach, 0, z_end - 7])
                color("orange")
                    clamp();
    }
    // the pan-tilt base, drawn as a disc so you can see the fit
    color("DeepSkyBlue", 0.3)
        translate([0, 0, plate_t])
            cylinder(d = base_dia, h = lip_h + 30);
}
