# VCE Systems Engineering: Evaluation & Testing Plan

This document outlines how the integrated AI Smart Bin will be tested against the measurable parameters defined in the Design Brief (Section 6 & 7).

## 1. Classification Accuracy Testing (>90%)
**Objective:** Verify the YOLO26 model and camera integration correctly identify waste types.
**Procedure:**
1. Collect a test batch of 50 common waste items (15x plastic bottles/containers, 15x paper/cardboard, 20x general non-recyclable waste).
2. Ensure the bin is placed under its standard operating LED lighting.
3. Drop each item onto the tray one by one.
4. Record the class identified by the MaixCAM Pro's UI overlay.
5. Record the physical bin partition the item is dropped into.
**Success Criteria:** ≥ 45 items successfully recognized and routed to the correct physical partition.

## 2. Sorting Time Parameter (<3 Seconds)
**Objective:** Ensure the system completes the closed-loop cycle quickly to prevent user queues.
**Procedure:**
1. Start a stopwatch the exact moment an item breaks the HC-SR04 ultrasonic sensor threshold.
2. Stop the stopwatch the exact moment the tray completes its final tilt and the item falls into the bin.
3. Repeat 10 times with different objects.
**Success Criteria:** The average time across 10 trials must be < 3.0 seconds.

## 3. Power Consumption Testing (<15W Standby)
**Objective:** Verify the power-saving and sleep modes of the MaixCAM Pro and Servos.
**Procedure:**
1. Connect a digital inline multimeter between the 5V 5A power supply and the system's power distribution board.
2. Measure the peak wattage drawn during servo actuation (active state).
3. Wait 30 seconds for the system to enter 'sleep' state (LEDs off, servos unpowered, MaixCAM in idle).
4. Measure the standby wattage.
**Success Criteria:** Standby wattage reads < 15W. Active peak wattage does not exceed 25W (5V 5A limit).
