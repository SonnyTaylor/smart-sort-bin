/*  ═══════════════════════════════════════════════════════════════
 *  AI Smart Bin – "Ameru Style" Curved Sorting Tray
 *  ═══════════════════════════════════════════════════════════════
 *
 *  Design:
 *  - Top-down profile: Elliptical to match the bin opening but narrower
 *  - Cross-section: "Smile" curve to center the rubbish
 *  - Side profile: Tilted forward so the front lip is lower (chute) and the back is high.
 *  - Skeletonized mounting block to save material and print time
 */

$fn = 150; // High resolution for smooth 3D printing

// --- Parameters ---
tray_length = 170;       // Length of the tray (front-to-back, Y-axis)
tray_width = 130;        // Width of the tray (side-to-side, X-axis) - Made narrower
thickness = 4;           // Thickness of the plastic shell
smile_radius = 110;      // Radius of the horizontal curve (smaller = steeper sides)
front_tilt = 12;         // Degrees to tilt down at the front (+Y is the front chute)
riser_height = 20;       // Height of the center mounting block (acts as a spacer)

// Mounting Block (Matches MG996R aluminium bracket)
block_w = 45;
block_l = 40;
bolt_d = 3.4;            // M3 clearance hole
hole_x = 32;
hole_y = 15;
wall_t = 4;              // Thickness of the skeletonized block walls

module ameru_tray() {
    difference() {
        // --------------------------------------------------------
        // 1. ADDITIVE PHASE: Create the solid outer bounds
        // --------------------------------------------------------
        intersection() {
            // Elliptical footprint instead of a perfect circle
            scale([tray_width/tray_length, 1, 1])
            cylinder(d=tray_length, h=smile_radius + riser_height + 50);
            
            union() {
                // The solid outer curve (the "smile")
                translate([0, 0, smile_radius + riser_height])
                rotate([-front_tilt, 0, 0]) // Tilt +Y side downwards
                rotate([0, 90, 0])          // Lay the cylinder horizontally
                cylinder(r=smile_radius, h=tray_width+50, center=true);
                
                // The skeletonized center mounting block
                // (We build a solid block here, and hollow it out in the subtractive phase)
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
        cylinder(r=smile_radius-thickness, h=tray_width+52, center=true);
        
        // Remove the top half of the horizontal cylinder entirely 
        // (so it's an open chute, not a closed pipe)
        translate([0, 0, smile_radius + riser_height])
        rotate([-front_tilt, 0, 0])
        translate([-tray_width, -tray_length, 0])
        cube([tray_width*2, tray_length*2, smile_radius]);
        
        // Skeletonize the mounting block (hollow out the center from below)
        // This leaves a wall_t border and 4 corner posts for the bolts
        translate([-block_w/2 + wall_t, -block_l/2 + wall_t, -1])
        cube([block_w - wall_t*2, block_l - wall_t*2, riser_height + 15]);
        
        // Drill the 4 bolt holes through the mounting block corner posts
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