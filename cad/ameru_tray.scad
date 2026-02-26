/*  ═══════════════════════════════════════════════════════════════
 *  AI Smart Bin – "Ameru Style" Curved Sorting Tray
 *  ═══════════════════════════════════════════════════════════════
 *
 *  Design:
 *  - Top-down profile: Perfect circle to match the bin opening
 *  - Cross-section: "Smile" curve to center the rubbish
 *  - Side profile: Tilted forward so the front lip is lower (chute) and the back is high.
 *  - No vertical side walls. Just a smooth, continuous saddle curve.
 *  - Tall mounting block acts as a spacer so the curved front lip clears the servos below.
 */

$fn = 150; // High resolution for smooth 3D printing

// --- Parameters ---
tray_dia = 170;          // Outer diameter of the circular tray
thickness = 4;           // Thickness of the plastic shell
smile_radius = 120;      // Radius of the horizontal curve (smaller = steeper sides)
front_tilt = 12;         // Degrees to tilt down at the front (+Y is the front chute)
riser_height = 25;       // Height of the center mounting block (acts as a spacer)

// Mounting Block (Matches MG996R aluminium bracket)
block_w = 45;
block_l = 40;
bolt_d = 3.4;            // M3 clearance hole
hole_x = 32;
hole_y = 15;

module ameru_tray() {
    difference() {
        // --------------------------------------------------------
        // 1. ADDITIVE PHASE: Create the solid outer bounds
        // --------------------------------------------------------
        intersection() {
            // Keep everything inside the perfect circular footprint
            cylinder(d=tray_dia, h=smile_radius + riser_height);
            
            union() {
                // The solid outer curve (the "smile")
                translate([0, 0, smile_radius + riser_height])
                rotate([-front_tilt, 0, 0]) // Tilt +Y side downwards
                rotate([0, 90, 0])          // Lay the cylinder horizontally
                cylinder(r=smile_radius, h=tray_dia+50, center=true);
                
                // The rectangular center mounting block
                translate([-block_w/2, -block_l/2, 0])
                cube([block_w, block_l, riser_height + 20]);
            }
        }
        
        // --------------------------------------------------------
        // 2. SUBTRACTIVE PHASE: Hollow it out and drill holes
        // --------------------------------------------------------
        
        // Hollow out the tray (subtract the inner curved shell)
        translate([0, 0, smile_radius + riser_height])
        rotate([-front_tilt, 0, 0])
        rotate([0, 90, 0])
        cylinder(r=smile_radius-thickness, h=tray_dia+52, center=true);
        
        // Remove the top half of the horizontal cylinder entirely 
        // (so it's an open chute, not a closed pipe)
        translate([0, 0, smile_radius + riser_height])
        rotate([-front_tilt, 0, 0])
        translate([-tray_dia, -tray_dia, 0])
        cube([tray_dia*2, tray_dia*2, smile_radius]);
        
        // Drill the 4 bolt holes through the mounting block
        for(x = [-hole_x/2, hole_x/2]) {
            for(y = [-hole_y/2, hole_y/2]) {
                translate([x, y, -5])
                cylinder(d=bolt_d, h=riser_height + 50);
            }
        }
    }
}

// Render the final object
ameru_tray();