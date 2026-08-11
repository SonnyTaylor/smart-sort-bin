# Documentation

**The portfolio deck is the documentation.** It lives in
[`../portfolio/ai_bin.js`](../portfolio/ai_bin.js) and generates
`AI_Smart_Bin.pptx`. Anything that is portfolio content belongs there, not in
this folder.

What is left here is the two things the deck does not cover: the mechanical
design, and the notes for actually running the build.

## Mechanical design

| Document | Description |
| :--- | :--- |
| [Mechanical Design](mechanical_design.md) | How the sorting mechanism works and why it is shaped that way, with verified clearances |
| [Mechanical Iteration Log](mechanical_iteration_log.md) | Eight faults found and corrected before printing, and how each was caught |

Not yet in the deck. The renders that go with them are in
[`../portfolio/images/cad_evolution/`](../portfolio/images/cad_evolution), and
[`../cad/renders/`](../cad/renders/README.md) is what makes them.

## Build and setup notes

| Document | Description |
| :--- | :--- |
| [Pi Prototype Setup](pi_prototype_setup.md) | Wiring, OS configuration, troubleshooting |
| [Pi Prototype TODO](pi_prototype_todo.md) | Outstanding hardware, software and AI tasks |
| [Handoff](handoff.md) | Current state, how to deploy, next tasks |
| [cv2 hang](pi_cv2_hang.md) | The OpenCV capture hang and its fix |

See also [`../cad/README.md`](../cad/README.md) for the parts, hardware list and
assembly order.

---

## What used to be here

Six numbered documents covering risk, testing, budget, the AI iteration log,
future scope and a UART protocol. All were written for the two-board ESP32-CAM
design, and the build has since moved to a single Raspberry Pi. The deck carries
the current version of all of it, so they were deleted rather than left around
looking authoritative.

They are still in git history if a figure is ever needed:

```
git log --diff-filter=D --oneline -- docs/
```
