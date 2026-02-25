// AI Smart Bin - Sorting Tray for MG996R Aluminium Pan/Tilt Bracket
// OpenSCAD Parametric Design
// This creates a "U-shaped" chute (like a half-pipe with a back wall)
// with a reinforced flat mounting base and 4 bolt holes for the aluminium bracket.

// --- Parameters (Adjust these in mm) ---

// General Tray Dimensions
tray_length = 160;    // How long the chute is (front to back)
tray_width = 120;     // How wide the chute is
tray_height = 45;     // How tall the side walls are
wall_thickness = 3;   // Thickness of the plastic walls

// Mounting Base (Matches the flat top of the aluminium bracket)
mount_width = 45;     // Width of the flat mounting area
mount_length = 40;    // Length of the flat mounting area
mount_thickness = 5;  // Extra thickness on the bottom for strength

// Bolt Holes (For M3 bolts to attach to the metal bracket)
hole_spacing_x = 32;  // Distance between holes left-to-right (Check your specific bracket)
hole_spacing_y = 15;  // Distance between holes front-to-back
hole_diameter = 3.2;  // M3 clearance hole

// Smoothing (Higher = smoother curves, longer render time)
$fn = 100;

// --- Module: The Main Chute ---
module chute() {
    difference() {
        // Outer curved hull
        hull() {
            // Left top edge
            translate([-tray_width/2 + wall_thickness, 0, tray_height])
                rotate([-90, 0, 0])
                cylinder(r=wall_thickness, h=tray_length);
            // Right top edge
            translate([tray_width/2 - wall_thickness, 0, tray_height])
                rotate([-90, 0, 0])
                cylinder(r=wall_thickness, h=tray_length);
            // Bottom curved base
            translate([0, 0, wall_thickness])
                rotate([-90, 0, 0])
                cylinder(r=tray_width/2, h=tray_length);
        }
        
        // Inner cutout (creates the hollow U-shape)
        translate([0, -1, wall_thickness])
            hull() {
                translate([-tray_width/2 + wall_thickness*2, 0, tray_height + 10])
                    rotate([-90, 0, 0])
                    cylinder(r=wall_thickness, h=tray_length + 2);
                translate([tray_width/2 - wall_thickness*2, 0, tray_height + 10])
                    rotate([-90, 0, 0])
                    cylinder(r=wall_thickness, h=tray_length + 2);
                translate([0, 0, 0])
                    rotate([-90, 0, 0])
                    cylinder(r=(tray_width/2) - wall_thickness, h=tray_length + 2);
            }
            
        // Flatten the very bottom so it doesn't print as a sharp curve
        translate([-tray_width, -10, -20])
            cube([tray_width*2, tray_length+20, 20]);
    }
}

// --- Module: The Flat Mounting Base ---
module mount_base() {
    translate([-mount_width/2, tray_length/2 - mount_length/2, 0])
        cube([mount_width, mount_length, mount_thickness]);
}

// --- Module: The Back Stop Wall ---
// Prevents items rolling off the back before the tilt activates
module back_wall() {
    translate([0, tray_length - wall_thickness, tray_height/2])
        cube([tray_width - wall_thickness*2, wall_thickness, tray_height], center=true);
        
    // Fill the curved gap at the back
    difference() {
        translate([0, tray_length - wall_thickness, 0])
            rotate([-90, 0, 0])
            cylinder(r=tray_width/2, h=wall_thickness);
            
        translate([-tray_width, tray_length-2, -50])
            cube([tray_width*2, 10, 50]);
    }
}

// --- Final Assembly ---
difference() {
    union() {
        // The U-shape chute
        chute();
        
        // The reinforced flat mounting pad on the bottom
        mount_base();
        
        // The back wall
        back_wall();
    }
    
    // Drill the 4 mounting holes through the flat base
    // Centered around the middle of the tray length
    for(x = [-hole_spacing_x/2, hole_spacing_x/2]) {
        for(y = [tray_length/2 - hole_spacing_y/2, tray_length/2 + hole_spacing_y/2]) {
            translate([x, y, -10])
                cylinder(d=hole_diameter, h=mount_thickness + 20);
        }
    }
}