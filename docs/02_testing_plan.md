# VCE Systems Engineering: Evaluation & Testing Plan

This document outlines how the integrated AI Smart Bin will be tested against the measurable parameters defined in the Design Brief.

## 1. Classification Accuracy Testing (>90%)
**Objective:** Verify the cloud VLM and ESP32-CAM integration correctly identify waste types.
**Procedure:**
1. Collect a test batch of 50 common waste items (15x plastic bottles/containers, 15x paper/cardboard, 20x general non-recyclable waste).
2. Ensure the bin is placed under its standard operating LED lighting.
3. Drop each item onto the tray one by one.
4. Record the classification returned by the cloud VLM via the web dashboard.
5. Record the physical bin partition the item is dropped into.
**Success Criteria:** ≥ 45 items successfully recognised and routed to the correct physical partition.

## 2. Sorting Time Parameter (<3 Seconds)
**Objective:** Ensure the system completes the closed-loop cycle quickly to prevent user queues.
**Procedure:**
1. Start a stopwatch the exact moment an item breaks the HC-SR04 ultrasonic sensor threshold.
2. Stop the stopwatch the exact moment the tray completes its final tilt and the item falls into the bin.
3. Repeat 10 times with different objects.
**Success Criteria:** The average time across 10 trials must be < 3.0 seconds. Note: cloud VLM latency (~1-2s) is the primary bottleneck; the mechanical sort adds ~0.7-1s.

## 3. Power Consumption Testing (<15W Standby)
**Objective:** Verify the power-saving and sleep modes of the ESP32-CAM, ESP32, and servos.
**Procedure:**
1. Connect a digital inline multimeter between the USB-C PD charger output and the system's power distribution board.
2. Measure the peak wattage drawn during servo actuation (active state).
3. Wait 30 seconds for the system to enter 'sleep' state (LEDs off, servos unpowered, ESP32-CAM in idle).
4. Measure the standby wattage.
**Success Criteria:** Standby wattage reads < 15W. Active peak wattage stays within the USB-C PD charger's output rating.

## 4. UART Communication Reliability
**Objective:** Verify the serial link between ESP32-CAM and ESP32 operates without data loss under sustained operation.
**Procedure:**
1. Run the system in a continuous sorting loop for 100 consecutive sort operations.
2. Log every command sent by the ESP32-CAM and every ACK/NACK received from the ESP32.
3. Record any dropped commands, timeouts, or retry events.
**Success Criteria:** ≥ 99% of commands receive a valid ACK within 100ms. No unrecoverable failures in 100 operations.

## 5. Web Dashboard Responsiveness
**Objective:** Verify the web dashboard loads and updates in real time without excessive latency.
**Procedure:**
1. Connect a laptop/phone to the same Wi-Fi network as the ESP32-CAM.
2. Open the dashboard at `http://<esp32-cam-ip>:8080`.
3. Trigger 10 sort operations and observe the dashboard's stats and camera feed updates.
**Success Criteria:** Dashboard initial load < 3 seconds. Stats update within 1 second of a sort completing.
