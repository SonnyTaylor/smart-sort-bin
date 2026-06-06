# UART Serial Protocol: ESP32-CAM <-> ESP32

This document defines the serial communication protocol between the ESP32-CAM (brain) and the ESP32 DevKit (hardware controller).

## Physical Layer

| Parameter | Value |
| :--- | :--- |
| Interface | UART (TX/RX, 3.3V logic) |
| Baud Rate | 115200 |
| Data Bits | 8 |
| Parity | None |
| Stop Bits | 1 |
| Wiring | ESP32-CAM TX -> ESP32 RX, ESP32-CAM RX -> ESP32 TX, Common GND |

## Message Format

All messages are newline-terminated ASCII strings for simplicity and debuggability. No binary framing is used.

```
<COMMAND>:<PAYLOAD>\n
```

- `COMMAND` -- Uppercase identifier (max 16 chars).
- `PAYLOAD` -- Command-specific data. May be empty.
- Messages are terminated with `\n` (0x0A).

## Commands: ESP32-CAM -> ESP32

| Command | Payload | Description | Example |
| :--- | :--- | :--- | :--- |
| `SORT` | `<category>` | Sort an item into the given category. ESP32 executes the full pan-tilt-home sequence. | `SORT:recycling\n` |
| `HOME` | *(none)* | Return servos to the home (neutral) position immediately. | `HOME:\n` |
| `CALIBRATE` | `<servo>,<angle>` | Move a specific servo to a specific angle for calibration purposes. | `CALIBRATE:pan,120\n` |
| `PING` | *(none)* | Heartbeat check. ESP32 must respond with `PONG`. | `PING:\n` |
| `SET_ANGLE` | `<category>,<angle>` | Update the stored pan angle for a waste category. Persisted in ESP32 EEPROM. | `SET_ANGLE:recycling,120\n` |

## Responses: ESP32 -> ESP32-CAM

| Response | Payload | Description | Example |
| :--- | :--- | :--- | :--- |
| `ACK` | `<command>` | Command received and execution started. | `ACK:SORT\n` |
| `DONE` | `<command>` | Command execution completed successfully. | `DONE:SORT\n` |
| `NACK` | `<command>,<reason>` | Command rejected or failed. | `NACK:SORT,servo_stall\n` |
| `PONG` | *(none)* | Heartbeat response. | `PONG:\n` |
| `ITEM` | *(none)* | HC-SR04 has detected an item on the tray. ESP32-CAM should capture and classify. | `ITEM:\n` |

## Waste Categories

The following category strings are valid payloads for the `SORT` and `SET_ANGLE` commands:

| Category String | Default Pan Angle | Description |
| :--- | :--- | :--- |
| `general` | 0° | General waste (non-recyclable) |
| `recycling` | 120° | Recyclable plastics, metals, glass |
| `compost` | 240° | Organic / compostable waste |

Angles are configurable via `SET_ANGLE` and persisted in ESP32 EEPROM across reboots.

## Timing & Reliability

| Parameter | Value |
| :--- | :--- |
| ACK timeout | 100ms (ESP32-CAM retries up to 3 times) |
| DONE timeout | 5000ms (full sort sequence max duration) |
| Heartbeat interval | ESP32-CAM sends `PING` every 2 seconds |
| Watchdog timeout | ESP32 homes servos if no `PING` received for 5 seconds |

## Sort Sequence (ESP32 Internal)

When the ESP32 receives a `SORT:<category>` command:

1. Send `ACK:SORT\n`
2. Rotate pan servo to the category's configured angle
3. Wait 200ms for servo to settle
4. Tilt servo to drop angle (e.g., 45°)
5. Wait 500ms for item to slide
6. Return tilt servo to level (0°)
7. Return pan servo to home (0°)
8. Send `DONE:SORT\n`

If any servo reports a stall or the sequence exceeds 5 seconds, send `NACK:SORT,timeout\n` and home all servos.

## Example Conversation

```
ESP32 -> ESP32-CAM:  ITEM:
ESP32-CAM -> ESP32:  SORT:recycling
ESP32 -> ESP32-CAM:  ACK:SORT
                     ... (servos execute) ...
ESP32 -> ESP32-CAM:  DONE:SORT
ESP32-CAM -> ESP32:  PING:
ESP32 -> ESP32-CAM:  PONG:
```
