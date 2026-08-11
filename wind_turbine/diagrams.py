"""Generates every engineering diagram used in the wind turbine deck as a PNG.

Everything here is drawn with matplotlib so the deck carries real images rather
than shapes assembled inside PowerPoint. Run: python diagrams.py
"""
import os
import math

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import (FancyArrowPatch, FancyBboxPatch, Rectangle, Circle,
                                Polygon, Arc)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
os.makedirs(OUT, exist_ok=True)

DARK = "#0B2E33"
TEAL = "#028090"
SEA = "#00A896"
MINT = "#02C39A"
LIGHT = "#F4F7F6"
BORDER = "#DDE6E4"
TEXT = "#16302E"
MUTED = "#5B7370"
AMBER = "#C08A2E"
RED = "#B0413E"
WIRE = "#1A1A1A"

plt.rcParams["font.family"] = "Calibri"
plt.rcParams["font.size"] = 10


def fig(w, h, k=1.0):
    """k < 1 shrinks the canvas without changing the output pixel size, which
    makes point-sized text and line weights larger relative to the drawing.
    Use it for diagrams that end up small on the slide."""
    f = plt.figure(figsize=(w * k, h * k), dpi=220 / k)
    ax = f.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, w)
    ax.set_ylim(0, h)
    ax.axis("off")
    f.patch.set_facecolor(LIGHT)
    return f, ax


def save(f, name):
    path = os.path.join(OUT, name)
    f.savefig(path, facecolor=f.get_facecolor(), edgecolor="none")
    plt.close(f)
    print("wrote", path)


def block(ax, x, y, w, h, title, sub=None, fill="#FFFFFF", edge=TEAL,
          tcol=TEXT, tsize=11, ssize=8.5, lw=1.5):
    ax.add_patch(FancyBboxPatch((x, y), w, h,
                                boxstyle="round,pad=0,rounding_size=0.07",
                                facecolor=fill, edgecolor=edge, linewidth=lw))
    if sub:
        ax.text(x + w / 2, y + h * 0.63, title, ha="center", va="center",
                fontsize=tsize, color=tcol, fontweight="bold")
        ax.text(x + w / 2, y + h * 0.28, sub, ha="center", va="center",
                fontsize=ssize, color=MUTED)
    else:
        ax.text(x + w / 2, y + h / 2, title, ha="center", va="center",
                fontsize=tsize, color=tcol, fontweight="bold")


def arrow(ax, p1, p2, color=TEAL, lw=1.8, ms=12, ls="-"):
    ax.add_patch(FancyArrowPatch(p1, p2, arrowstyle="-|>", mutation_scale=ms,
                                 color=color, linewidth=lw, linestyle=ls,
                                 shrinkA=0, shrinkB=0, zorder=4))


def poly(ax, pts, color=TEAL, lw=1.8, ls="-", zorder=2):
    ax.plot([p[0] for p in pts], [p[1] for p in pts], color=color, lw=lw,
            linestyle=ls, solid_capstyle="round", zorder=zorder)


# ---------------------------------------------------------------- 1. block diagram
def system_block():
    f, ax = fig(12.0, 5.2)

    ry, bh, bw = 3.45, 1.00, 1.90
    xs = [0.25, 2.45, 4.65, 6.85]
    block(ax, xs[0], ry, bw, bh, "Rotor & hub", "three blades", edge=SEA)
    block(ax, xs[1], ry, bw, bh, "Gear train", "single-stage step-up", edge=SEA)
    block(ax, xs[2], ry, bw, bh, "DC generator", "rotation to voltage", edge=TEAL)
    block(ax, xs[3], ry, bw, bh, "Rectify & smooth", "steady DC bus", edge=TEAL)
    cx, cw = 9.05, 2.70
    block(ax, cx, ry, cw, bh, "Controller", "selects the output path",
          fill=DARK, edge=DARK, tcol="#FFFFFF", tsize=12.5, ssize=8.5)
    ax.text(cx + cw / 2, ry + bh * 0.28, "selects the output path", ha="center",
            va="center", fontsize=8.5, color="#9FC6C2")

    for i in range(3):
        arrow(ax, (xs[i] + bw, ry + bh / 2), (xs[i + 1], ry + bh / 2))
    arrow(ax, (xs[3] + bw, ry + bh / 2), (cx, ry + bh / 2))

    gaps = [("low speed,\nhigh torque", (xs[0] + bw + xs[1]) / 2),
            ("high speed,\nlow torque", (xs[1] + bw + xs[2]) / 2),
            ("varying DC", (xs[2] + bw + xs[3]) / 2),
            ("clean DC", (xs[3] + bw + cx) / 2)]
    for t, gx in gaps:
        ax.text(gx, ry + bh + 0.16, t, ha="center", va="bottom", fontsize=7.5,
                color=MUTED, linespacing=1.3)
    ax.text(xs[0], ry + bh + 0.16, "wind energy in", ha="left", va="bottom",
            fontsize=7.5, color=MUTED)

    # distribution bus below the controller
    bus_y = 2.55
    poly(ax, [(cx + cw / 2, ry), (cx + cw / 2, bus_y)])
    poly(ax, [(1.55, bus_y), (cx + cw / 2, bus_y)])

    dests = [(1.55, "Battery storage", "charge while below the set voltage", SEA),
             (4.85, "Direct load", "run a device while the wind holds", TEAL),
             (8.15, "Dump load", "divert surplus current as heat", AMBER)]
    for dx, name, sub, col in dests:
        arrow(ax, (dx, bus_y), (dx, 2.42))
        block(ax, dx - 1.25, 1.45, 2.50, 0.95, name, sub, edge=col, tsize=10.5, ssize=8)

    # feedback path
    fy = 0.95
    poly(ax, [(dx + 1.25, 1.925), (11.35, 1.925), (11.35, ry)], color=MINT,
         lw=1.6, ls=(0, (5, 3)))
    arrow(ax, (11.35, ry - 0.12), (11.35, ry), color=MINT, lw=1.6)
    ax.text(11.20, 2.10, "feedback", ha="right", fontsize=8.5, color="#0F7A60",
            fontweight="bold")

    ax.add_patch(FancyBboxPatch((0.25, 0.28), 11.50, 0.62,
                                boxstyle="round,pad=0,rounding_size=0.07",
                                facecolor="#EAF5F2", edgecolor=MINT, linewidth=1.2))
    ax.text(6.0, 0.59,
            "Closed loop: the controller reads the battery and bus voltage every cycle and re-selects which of the three paths receives the current.",
            ha="center", va="center", fontsize=9.5, color="#0F5F52")
    save(f, "system_block.png")


# ---------------------------------------------------------------- 2. IPO
def ipo():
    f, ax = fig(12.0, 5.3)
    cols = [(0.30, 1.95, ""), (2.25, 2.55, "INPUT"), (4.80, 4.05, "PROCESS"),
            (8.85, 2.85, "OUTPUT")]
    head_y, head_h = 4.60, 0.46
    for x, w, t in cols:
        if not t:
            continue
        col = {"INPUT": TEAL, "PROCESS": SEA, "OUTPUT": MINT}[t]
        ax.add_patch(Rectangle((x, head_y), w, head_h, facecolor=col, edgecolor="none"))
        ax.text(x + w / 2, head_y + head_h / 2, t, ha="center", va="center",
                fontsize=11, color="#FFFFFF", fontweight="bold")
    ax.text(0.30, head_y + head_h / 2, "SUBSYSTEM", ha="left", va="center",
            fontsize=9.5, color=DARK, fontweight="bold")

    rows = [
        ("Mechanical", "Moving air across the\nswept area of the rotor",
         "Blades convert the air flow into shaft rotation, and the\ngear train multiplies that speed for the generator",
         "Generator shaft turning\nfast enough to be useful"),
        ("Electronic", "Rotating generator\nshaft",
         "The generator induces a voltage, then the rectifier and\nsmoothing stage turn it into steady DC",
         "Stable DC bus voltage\nand current"),
        ("Control", "Measured bus and\nbattery voltage",
         "The controller compares each reading against its set\nthresholds and switches one output path on",
         "Battery, direct load or\ndump load engaged"),
    ]
    y = 4.45
    rh = 1.05
    for idx, (name, i_txt, p_txt, o_txt) in enumerate(rows):
        y -= rh
        ax.add_patch(FancyBboxPatch((0.30, y), 11.40, rh,
                                    boxstyle="round,pad=0,rounding_size=0.06",
                                    facecolor="#FFFFFF", edgecolor=BORDER, linewidth=1.2))
        ax.text(0.52, y + rh / 2, name, fontsize=10.5, color=TEAL,
                fontweight="bold", va="center")
        for (cx, _, _), txt in zip(cols[1:], (i_txt, p_txt, o_txt)):
            ax.text(cx + 0.22, y + rh / 2, txt, fontsize=9, color=TEXT,
                    va="center", linespacing=1.45)
        for gx in (2.25, 4.80, 8.85):
            ax.plot([gx, gx], [y + 0.12, y + rh - 0.12], color=BORDER, lw=1)
        for gx in (4.80, 8.85):
            arrow(ax, (gx - 0.30, y + rh / 2), (gx + 0.10, y + rh / 2),
                  color=SEA, lw=1.5, ms=10)
        if idx < len(rows) - 1:
            y -= 0.16

    fb_h = 0.58
    fb_y = y - 0.22 - fb_h
    ax.add_patch(FancyBboxPatch((0.30, fb_y), 11.40, fb_h,
                                boxstyle="round,pad=0,rounding_size=0.06",
                                facecolor="#EAF5F2", edgecolor=MINT, linewidth=1.2))
    ax.text(6.0, fb_y + fb_h / 2,
            "FEEDBACK    the measured battery voltage returns to the control subsystem, which re-selects the output path on the next cycle",
            ha="center", va="center", fontsize=9.5, color="#0F5F52", fontweight="bold")
    poly(ax, [(10.90, y), (10.90, fb_y + fb_h + 0.06)], color=MINT, lw=1.5, ls=(0, (4, 3)))
    arrow(ax, (10.90, fb_y + fb_h + 0.08), (10.90, fb_y + fb_h), color=MINT, lw=1.5, ms=10)
    save(f, "ipo.png")


# ---------------------------------------------------------------- 3. gear train
def gear(ax, cx, cy, r, teeth, color, fill, zorder=3):
    th = 2 * math.pi / teeth
    depth = r * 0.14
    pts = []
    for i in range(teeth):
        a0 = i * th
        for frac, rr in ((0.06, r - depth), (0.20, r + depth),
                         (0.44, r + depth), (0.58, r - depth)):
            a = a0 + frac * th
            pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    ax.add_patch(Polygon(pts, closed=True, facecolor=fill, edgecolor=color,
                         linewidth=1.5, zorder=zorder))
    ax.add_patch(Circle((cx, cy), r * 0.18, facecolor="#FFFFFF",
                        edgecolor=color, linewidth=1.4, zorder=zorder + 1))
    ax.add_patch(Circle((cx, cy), r * 0.06, facecolor=color, edgecolor="none",
                        zorder=zorder + 2))
    ax.add_patch(Circle((cx, cy), r, facecolor="none", edgecolor=color,
                        linewidth=0.8, linestyle=(0, (4, 3)), alpha=0.55,
                        zorder=zorder + 1))


def mech_subsystem():
    f, ax = fig(11.0, 5.0, 0.78)

    ax.add_patch(FancyBboxPatch((1.70, 0.35), 5.70, 3.65,
                                boxstyle="round,pad=0,rounding_size=0.12",
                                facecolor="#FFFFFF", edgecolor=BORDER, linewidth=1.6))
    ax.text(1.90, 3.82, "GEARBOX HOUSING", fontsize=8, color=MUTED, va="center")

    shaft_y = 2.55
    r1, r2 = 1.20, 0.50
    c1x = 4.05
    c2x = c1x + r1 + r2

    # shafts
    poly(ax, [(0.35, shaft_y), (c1x, shaft_y)], color=DARK, lw=5)
    poly(ax, [(c2x, shaft_y), (8.05, shaft_y)], color=DARK, lw=4)

    # bearings on the rotor shaft
    for bx in (2.05, 2.45):
        ax.add_patch(Rectangle((bx - 0.12, shaft_y - 0.30), 0.24, 0.60,
                               facecolor="#FFFFFF", edgecolor=MUTED, linewidth=1.2, zorder=3))
        ax.plot([bx - 0.12, bx + 0.12], [shaft_y - 0.30, shaft_y + 0.30],
                color=MUTED, lw=0.8, zorder=4)
        ax.plot([bx - 0.12, bx + 0.12], [shaft_y + 0.30, shaft_y - 0.30],
                color=MUTED, lw=0.8, zorder=4)
    ax.plot([2.25, 2.25], [shaft_y + 0.34, 3.32], color=MUTED, lw=0.8,
            linestyle=(0, (3, 3)))
    ax.text(2.25, 3.40, "sealed bearings", ha="center", fontsize=8, color=MUTED)

    gear(ax, c1x, shaft_y, r1, 24, TEAL, "#DCEFF0")
    gear(ax, c2x, shaft_y, r2, 10, SEA, "#DDF4EE", zorder=6)

    ax.text(c1x, shaft_y - r1 - 0.42, "Driver gear", ha="center", fontsize=9.5,
            color=TEAL, fontweight="bold")
    ax.text(c1x, shaft_y - r1 - 0.66, "24 teeth", ha="center", fontsize=8.5, color=MUTED)
    ax.text(c2x, shaft_y - r2 - 0.42, "Pinion", ha="center", fontsize=9.5,
            color=SEA, fontweight="bold")
    ax.text(c2x, shaft_y - r2 - 0.66, "10 teeth", ha="center", fontsize=8.5, color=MUTED)

    # rotation direction
    ax.add_patch(Arc((c1x, shaft_y), 2 * r1 * 0.72, 2 * r1 * 0.72,
                     theta1=110, theta2=180, color=TEAL, lw=1.5, zorder=7))
    arrow(ax, (c1x - r1 * 0.72, shaft_y + 0.06), (c1x - r1 * 0.70, shaft_y - 0.10),
          color=TEAL, lw=1.5, ms=10)
    ax.add_patch(Arc((c2x, shaft_y), 2 * r2 * 1.55, 2 * r2 * 1.55,
                     theta1=8, theta2=78, color=SEA, lw=1.5, zorder=7))
    arrow(ax, (c2x + 0.20, shaft_y + 0.74), (c2x + 0.40, shaft_y + 0.68),
          color=SEA, lw=1.5, ms=10)

    # rotor side
    ax.text(0.35, shaft_y + 0.34, "drive from the rotor", fontsize=8.5, color=MUTED)
    arrow(ax, (0.35, shaft_y - 0.55), (1.30, shaft_y - 0.55), color=MUTED, lw=1.3, ms=10)
    ax.text(0.35, shaft_y - 0.90, "480 rpm", fontsize=9, color=TEXT, fontweight="bold")

    # generator
    ax.add_patch(FancyBboxPatch((8.05, shaft_y - 0.72), 1.55, 1.44,
                                boxstyle="round,pad=0,rounding_size=0.09",
                                facecolor=DARK, edgecolor=DARK))
    ax.text(8.82, shaft_y + 0.10, "GENERATOR", ha="center", va="center",
            fontsize=9.5, color="#FFFFFF", fontweight="bold")
    ax.text(8.82, shaft_y - 0.30, "1150 rpm", ha="center", va="center",
            fontsize=10, color=MINT, fontweight="bold")
    ax.text(8.82, shaft_y - 1.02, "torque drops by the\nsame factor of 2.4",
            ha="center", va="top", fontsize=8, color=MUTED, linespacing=1.4)

    ax.add_patch(FancyBboxPatch((0.30, 4.20), 10.40, 0.62,
                                boxstyle="round,pad=0,rounding_size=0.07",
                                facecolor="#EAF5F2", edgecolor=MINT, linewidth=1.2))
    ax.text(5.50, 4.51,
            "Step-up ratio  =  driver teeth ÷ pinion teeth  =  24 ÷ 10  =  2.4 : 1        "
            "so a rotor at 480 rpm drives the generator at 1150 rpm",
            ha="center", va="center", fontsize=10, color=DARK, fontweight="bold")
    save(f, "mech_subsystem.png")


# ---------------------------------------------------------------- 4. exploded view
def exploded():
    f, ax = fig(11.0, 4.9)
    axis_y = 2.55
    ax.plot([0.30, 10.70], [axis_y, axis_y], color=BORDER, lw=1.2,
            linestyle=(0, (6, 4)), zorder=0)

    def note(n, x, txt, up=True, dx=0.0):
        ty = 4.15 if up else 0.95
        lx = x + dx
        ax.plot([lx, lx], [axis_y + (0.72 if up else -0.72), ty + (-0.20 if up else 0.20)],
                color=MUTED, lw=0.8, linestyle=(0, (3, 3)))
        ax.add_patch(Circle((lx, ty), 0.17, facecolor=TEAL, edgecolor="none"))
        ax.text(lx, ty, str(n), ha="center", va="center", fontsize=8.5,
                color="#FFFFFF", fontweight="bold")
        ax.text(lx, ty + (0.27 if up else -0.27), txt, ha="center",
                va="bottom" if up else "top", fontsize=8.5, color=TEXT)

    x = 0.70
    ax.add_patch(Polygon([(x - 0.34, axis_y), (x + 0.28, axis_y + 0.44),
                          (x + 0.28, axis_y - 0.44)], closed=True,
                         facecolor="#DCEFF0", edgecolor=TEAL, linewidth=1.4))
    note(1, x, "Nose cone")

    x = 2.05
    for a in (90, 210, 330):
        r = math.radians(a)
        ux, uy = math.cos(r), math.sin(r)
        nx, ny = -uy, ux
        ax.add_patch(Polygon([(x + 0.10 * ux + 0.16 * nx, axis_y + 0.10 * uy + 0.16 * ny),
                              (x + 0.85 * ux + 0.07 * nx, axis_y + 0.85 * uy + 0.07 * ny),
                              (x + 0.85 * ux - 0.07 * nx, axis_y + 0.85 * uy - 0.07 * ny),
                              (x + 0.10 * ux - 0.16 * nx, axis_y + 0.10 * uy - 0.16 * ny)],
                             closed=True, facecolor="#8FD9C8", edgecolor=TEAL, linewidth=1.2))
    note(2, x, "Blades  x3", up=False)

    x = 3.05
    ax.add_patch(Circle((x, axis_y), 0.42, facecolor="#FFFFFF", edgecolor=TEAL, linewidth=1.6))
    ax.add_patch(Circle((x, axis_y), 0.13, facecolor=TEAL, edgecolor="none"))
    for a in (30, 150, 270):
        r = math.radians(a)
        ax.add_patch(Circle((x + 0.27 * math.cos(r), axis_y + 0.27 * math.sin(r)),
                            0.06, facecolor=LIGHT, edgecolor=MUTED, linewidth=0.9))
    note(3, x, "Blade hub")

    x = 4.20
    ax.add_patch(Rectangle((x - 0.55, axis_y - 0.09), 1.10, 0.18,
                           facecolor=DARK, edgecolor="none"))
    note(4, x, "Main shaft", up=False)

    x = 5.25
    for off in (-0.17, 0.17):
        ax.add_patch(Circle((x + off, axis_y), 0.29, facecolor="#FFFFFF",
                            edgecolor=MUTED, linewidth=1.4))
        ax.add_patch(Circle((x + off, axis_y), 0.13, facecolor=LIGHT,
                            edgecolor=MUTED, linewidth=1.0))
    note(5, x, "Bearings  x2")

    x = 6.45
    gear(ax, x, axis_y, 0.60, 24, TEAL, "#DCEFF0")
    note(6, x, "Driver gear", up=False)

    x = 7.50
    gear(ax, x, axis_y, 0.30, 10, SEA, "#DDF4EE")
    note(7, x, "Pinion")

    x = 8.50
    ax.add_patch(FancyBboxPatch((x - 0.45, axis_y - 0.64), 0.90, 1.28,
                                boxstyle="round,pad=0,rounding_size=0.07",
                                facecolor="none", edgecolor=TEAL, linewidth=1.6))
    ax.add_patch(Circle((x, axis_y), 0.16, facecolor="none", edgecolor=TEAL, linewidth=1.2))
    note(8, x, "Gearbox housing", up=False)

    x = 9.55
    ax.add_patch(FancyBboxPatch((x - 0.42, axis_y - 0.46), 0.84, 0.92,
                                boxstyle="round,pad=0,rounding_size=0.07",
                                facecolor=DARK, edgecolor=DARK))
    ax.text(x, axis_y, "G", ha="center", va="center", fontsize=12,
            color="#FFFFFF", fontweight="bold")
    note(9, x, "DC generator")

    x = 10.45
    ax.add_patch(Rectangle((x - 0.32, axis_y - 0.78), 0.64, 0.16,
                           facecolor="#DCEFF0", edgecolor=TEAL, linewidth=1.2))
    ax.add_patch(Rectangle((x - 0.08, axis_y - 1.55), 0.16, 0.77,
                           facecolor=DARK, edgecolor="none"))
    note(10, x, "Base plate & tower", up=False, dx=-0.55)

    ax.text(0.30, 4.72, "Parts assemble along one axis, so the nacelle can be opened for maintenance without disturbing the tower.",
            fontsize=8.5, color=MUTED)
    save(f, "exploded.png")


# ---------------------------------------------------------------- 5. circuit
def circuit():
    f, ax = fig(12.0, 4.9, 0.75)

    def wire(pts, color=WIRE, lw=1.4, ls="-"):
        poly(ax, pts, color=color, lw=lw, ls=ls)

    def node(x, y):
        ax.add_patch(Circle((x, y), 0.05, facecolor=WIRE, edgecolor="none", zorder=5))

    def hop(y, x, r=0.13):
        """Wire crossing marker: a small bump so the two lines read as unjoined."""
        ax.add_patch(Arc((x, y), 2 * r, 2 * r, theta1=0, theta2=180,
                         color=WIRE, lw=1.4, zorder=3))

    def resistor(x, y0, y1):
        ax.add_patch(Rectangle((x - 0.11, y0), 0.22, y1 - y0, facecolor="#FFFFFF",
                               edgecolor=WIRE, linewidth=1.3, zorder=3))

    top, bot = 4.10, 0.55

    # generator
    gx, gy = 1.05, 2.35
    ax.add_patch(Circle((gx, gy), 0.45, facecolor="#FFFFFF", edgecolor=WIRE,
                        linewidth=1.5, zorder=3))
    ax.plot([gx - 0.22, gx - 0.07, gx + 0.07, gx + 0.22],
            [gy, gy + 0.17, gy - 0.17, gy], color=WIRE, lw=1.4, zorder=4)
    ax.text(gx, 0.90, "Generator", ha="center", fontsize=9.5, color=TEXT,
            fontweight="bold")
    ax.text(gx, 0.67, "driven by the gear train", ha="center", fontsize=8, color=MUTED)

    # bridge rectifier
    bx, by, s = 3.00, 2.35, 0.75

    def diode(p1, p2):
        mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2
        ang = math.atan2(p2[1] - p1[1], p2[0] - p1[0])
        c, sn = math.cos(ang), math.sin(ang)
        tri = [(-0.12, -0.11), (-0.12, 0.11), (0.10, 0.0)]
        ax.add_patch(Polygon([(mx + px * c - py * sn, my + px * sn + py * c)
                              for px, py in tri], closed=True, facecolor=WIRE,
                             edgecolor=WIRE, zorder=4))
        bxp, byp = 0.11, 0.12
        pa = (mx + bxp * c - byp * sn, my + bxp * sn + byp * c)
        pb = (mx + bxp * c + byp * sn, my + bxp * sn - byp * c)
        ax.plot([pa[0], pb[0]], [pa[1], pb[1]], color=WIRE, lw=1.7, zorder=4)
        wire([p1, p2])

    L, R, T, B = (bx - s, by), (bx + s, by), (bx, by + s), (bx, by - s)
    diode(L, T); diode(B, R); diode(B, L); diode(T, R)
    ax.text(2.20, 3.35, "full-wave\nrectifier", ha="center", va="center",
            fontsize=8.5, color=MUTED, linespacing=1.4)

    wire([(gx + 0.45, gy), (L[0], L[1])])
    wire([(gx, gy - 0.45), (gx, 1.15), (2.72, 1.15)])
    hop(1.15, bx)
    wire([(bx + 0.13, 1.15), (4.60, 1.15), (4.60, by), (R[0], R[1])])
    wire([(T[0], T[1]), (bx, top)])
    wire([(B[0], B[1]), (bx, bot)])

    # rails
    wire([(bx, top), (11.55, top)])
    wire([(bx, bot), (11.55, bot)])
    ax.text(11.55, top + 0.20, "+ DC bus", ha="right", fontsize=9.5, color=TEXT,
            fontweight="bold")
    ax.text(11.55, bot - 0.30, "0 V", ha="right", fontsize=9.5, color=TEXT,
            fontweight="bold")

    # fuse
    ax.add_patch(Rectangle((3.55, top - 0.11), 0.60, 0.22, facecolor="#FFFFFF",
                           edgecolor=WIRE, linewidth=1.3, zorder=3))
    ax.text(3.85, top + 0.20, "fuse", ha="center", fontsize=8, color=MUTED)

    # smoothing capacitor
    cx = 4.85
    wire([(cx, top), (cx, 2.62)])
    ax.plot([cx - 0.26, cx + 0.26], [2.62, 2.62], color=WIRE, lw=1.9, zorder=4)
    ax.plot([cx - 0.26, cx + 0.26], [2.42, 2.42], color=WIRE, lw=1.9, zorder=4)
    wire([(cx, 2.42), (cx, bot)])
    node(cx, top); node(cx, bot)
    ax.text(cx - 0.36, 2.52, "smoothing\ncapacitor", ha="right", va="center",
            fontsize=8, color=MUTED, linespacing=1.4)

    # voltage divider
    dx = 6.05
    wire([(dx, top), (dx, 3.35)])
    resistor(dx, 2.95, 3.35)
    wire([(dx, 2.95), (dx, 2.60)])
    resistor(dx, 2.20, 2.60)
    wire([(dx, 2.20), (dx, bot)])
    node(dx, top); node(dx, bot); node(dx, 2.775)
    ax.text(dx - 0.20, 3.15, "voltage\ndivider", ha="right", va="center",
            fontsize=8, color=MUTED, linespacing=1.4)

    # controller
    ax.add_patch(FancyBboxPatch((6.75, 2.05), 1.85, 1.45,
                                boxstyle="round,pad=0,rounding_size=0.09",
                                facecolor=DARK, edgecolor=DARK, zorder=3))
    ax.text(7.68, 3.05, "CONTROLLER", ha="center", va="center", fontsize=9.5,
            color="#FFFFFF", fontweight="bold", zorder=4)
    ax.text(7.68, 2.55, "compares the sensed\nvoltage with its set\nthresholds", ha="center",
            va="center", fontsize=7.5, color="#9FC6C2", zorder=4, linespacing=1.4)
    wire([(dx, 2.775), (6.75, 2.775)], color=TEAL, lw=1.3)
    wire([(7.68, 2.05), (7.68, bot)])
    node(7.68, bot)
    ax.text(6.60, 2.94, "sense", ha="right", fontsize=8, color=TEAL)

    # three switched legs
    legs = [(9.10, "Battery", "charge path"),
            (10.20, "Direct load", "direct use"),
            (11.30, "Dump load", "surplus as heat")]
    for lx, name, sub in legs:
        wire([(lx, top), (lx, 3.55)])
        ax.plot([lx, lx + 0.30], [3.55, 3.26], color=WIRE, lw=1.6, zorder=4)
        node(lx, 3.55); node(lx, 3.15)
        wire([(lx, 3.15), (lx, 2.50)])
        if name == "Battery":
            for i, yy in enumerate((2.50, 2.30, 2.10, 1.90)):
                w = 0.24 if i % 2 == 0 else 0.12
                ax.plot([lx - w, lx + w], [yy, yy], color=WIRE, lw=1.7, zorder=4)
            wire([(lx, 1.90), (lx, bot)])
        else:
            ax.add_patch(Rectangle((lx - 0.17, 1.95), 0.34, 0.55, facecolor="#FFFFFF",
                                   edgecolor=WIRE, linewidth=1.3, zorder=3))
            if name == "Dump load":
                ax.plot([lx + 0.24, lx + 0.44], [2.10, 2.36], color=AMBER, lw=1.3)
                ax.plot([lx + 0.40, lx + 0.60], [2.10, 2.36], color=AMBER, lw=1.3)
            wire([(lx, 1.95), (lx, bot)])
        mask = dict(boxstyle="square,pad=0.22", facecolor=LIGHT, edgecolor="none")
        ax.text(lx, 1.72, name, ha="center", va="top", fontsize=8.5, color=TEXT,
                fontweight="bold", bbox=mask, zorder=6)
        ax.text(lx, 1.48, sub, ha="center", va="top", fontsize=7.5, color=MUTED,
                bbox=dict(boxstyle="square,pad=0.22", facecolor=LIGHT,
                          edgecolor="none"), zorder=6)
        node(lx, bot)

    # control lines to the switches
    trunk_y, up_y = 3.20, 3.42
    wire([(8.60, trunk_y), (10.95, trunk_y)], color=TEAL, lw=1.2, ls=(0, (4, 3)))
    for lx, vx in ((9.10, 8.75), (10.20, 9.85), (11.30, 10.95)):
        wire([(vx, trunk_y), (vx, up_y)], color=TEAL, lw=1.2, ls=(0, (4, 3)))
        arrow(ax, (vx, up_y), (lx + 0.14, up_y), color=TEAL, lw=1.2, ms=9,
              ls=(0, (4, 3)))
    ax.text(9.10, 4.30, "switching stage", ha="left", fontsize=8, color=MUTED)

    ax.text(0.30, 4.68, "Function-level schematic. No part numbers are given, so any component that meets the voltage and current rating can be used.",
            fontsize=8.5, color=MUTED)
    save(f, "circuit.png")


# ---------------------------------------------------------------- 6. gantt
def gantt():
    f, ax = fig(11.6, 5.9)
    left, right = 3.35, 11.30
    weeks = 10
    colw = (right - left) / weeks
    top_y = 5.05

    tasks = [
        ("Research wind resource and generator data", 1, 2, "done"),
        ("Model gear train, confirm step-up ratio", 1, 2, "done"),
        ("Design and draw the controller circuit", 2, 2, "done"),
        ("Print and fabricate gears, hub and blades", 3, 2, "done"),
        ("Build tower mount and bearing housing", 4, 2, "done"),
        ("Assemble and bench-test the controller", 5, 2, "part"),
        ("Integrate subsystems onto the mount", 7, 1, "todo"),
        ("Functional and safety testing, log data", 7, 2, "todo"),
        ("Modify, repair and retest", 9, 1, "todo"),
        ("Evaluate against criteria, finalise report", 9, 2, "todo"),
    ]
    colours = {"done": TEAL, "part": SEA, "todo": "#9FC6C2"}

    for w in range(weeks):
        x = left + w * colw
        ax.add_patch(Rectangle((x, top_y), colw, 0.34, facecolor=DARK,
                               edgecolor=LIGHT, linewidth=1))
        ax.text(x + colw / 2, top_y + 0.17, f"W{w + 1}", ha="center", va="center",
                fontsize=8.5, color="#FFFFFF", fontweight="bold")
    ax.text(left, top_y + 0.52, "Week of the school-assessed task", fontsize=8.5, color=MUTED)

    rh = 0.38
    y = top_y
    for i, (name, start, dur, state) in enumerate(tasks):
        y -= rh
        if i % 2 == 0:
            ax.add_patch(Rectangle((left, y), right - left, rh,
                                   facecolor="#FFFFFF", edgecolor="none", zorder=0))
        ax.text(left - 0.18, y + rh / 2, name, ha="right", va="center",
                fontsize=8.5, color=TEXT)
        bx = left + (start - 1) * colw
        ax.add_patch(FancyBboxPatch((bx + 0.05, y + 0.07), dur * colw - 0.10, rh - 0.16,
                                    boxstyle="round,pad=0,rounding_size=0.05",
                                    facecolor=colours[state], edgecolor="none", zorder=2))
    bottom_y = y

    for w in range(weeks + 1):
        x = left + w * colw
        ax.plot([x, x], [bottom_y, top_y], color=BORDER, lw=0.8, zorder=1)

    tx = left + 5.7 * colw
    ax.plot([tx, tx], [bottom_y, top_y + 0.34], color=RED, lw=1.4,
            linestyle=(0, (4, 3)), zorder=5)
    ax.text(tx + 0.07, top_y + 0.52, "today", fontsize=8, color=RED)

    # milestone strip
    ms_y = bottom_y - 0.34
    ax.plot([left, right], [ms_y, ms_y], color=BORDER, lw=1)
    miles = [(2, "design frozen"), (4, "parts made"), (6, "controller bench-tested"),
             (8, "system integrated"), (10, "evaluated")]
    for idx, (w, name) in enumerate(miles):
        x = left + w * colw
        ax.add_patch(Polygon([(x, ms_y + 0.13), (x + 0.11, ms_y),
                              (x, ms_y - 0.13), (x - 0.11, ms_y)],
                             closed=True, facecolor=DARK, edgecolor="none"))
        ha = "right" if idx == len(miles) - 1 else "center"
        ax.text(x if ha == "center" else x + 0.10, ms_y - 0.24, name, ha=ha,
                va="top", fontsize=7.5, color=MUTED)

    for i, (k, t) in enumerate([("done", "complete"), ("part", "in progress"),
                                ("todo", "scheduled")]):
        lx = 0.30 + i * 1.60
        ax.add_patch(Rectangle((lx, 0.30), 0.32, 0.17, facecolor=colours[k], edgecolor="none"))
        ax.text(lx + 0.42, 0.385, t, va="center", fontsize=8.5, color=MUTED)
    lx = 0.30 + 3 * 1.60
    ax.add_patch(Polygon([(lx + 0.16, 0.51), (lx + 0.27, 0.385),
                          (lx + 0.16, 0.26), (lx + 0.05, 0.385)],
                         closed=True, facecolor=DARK, edgecolor="none"))
    ax.text(lx + 0.42, 0.385, "milestone", va="center", fontsize=8.5, color=MUTED)
    save(f, "gantt.png")


# ---------------------------------------------------------------- 7. risk matrix
def risk_matrix():
    f, ax = fig(7.2, 4.4, 0.62)
    x0, y0 = 1.55, 0.95
    cw, chh = 1.22, 0.76
    cons = ["Minor", "Moderate", "Major", "Severe"]
    like = ["Rare", "Unlikely", "Possible", "Likely"]

    def band(i, j):
        score = (i + 1) + (j + 1)
        if score <= 3:
            return "#DDF0E9", "#2E7D5B", "Low"
        if score <= 5:
            return "#FFF1D6", "#8A6318", "Medium"
        if score <= 6:
            return "#FBDFC9", "#A5561F", "High"
        return "#F6D0CD", "#8E2F2C", "Extreme"

    for j in range(4):
        for i in range(4):
            fc, tc, name = band(i, j)
            ax.add_patch(Rectangle((x0 + i * cw, y0 + j * chh), cw, chh,
                                   facecolor=fc, edgecolor="#FFFFFF", linewidth=1.6))
            ax.text(x0 + i * cw + 0.09, y0 + j * chh + chh - 0.11, name,
                    fontsize=7, color=tc, va="top")

    for i, c in enumerate(cons):
        ax.text(x0 + i * cw + cw / 2, y0 - 0.14, c, ha="center", va="top",
                fontsize=9, color=TEXT)
    for j, l in enumerate(like):
        ax.text(x0 - 0.16, y0 + j * chh + chh / 2, l, ha="right", va="center",
                fontsize=9, color=TEXT)
    ax.text(x0 + 2 * cw, y0 - 0.50, "CONSEQUENCE", ha="center", fontsize=9.5,
            color=DARK, fontweight="bold")
    ax.text(x0 - 1.05, y0 + 2 * chh, "LIKELIHOOD", ha="center", va="center",
            rotation=90, fontsize=9.5, color=DARK, fontweight="bold")

    risks = [("R1", 3, 1), ("R2", 2, 2), ("R3", 1, 2), ("R4", 2, 0),
             ("R5", 0, 3), ("R6", 1, 1)]
    for rid, ci, li in risks:
        cx = x0 + ci * cw + cw / 2
        cy = y0 + li * chh + chh / 2 - 0.07
        ax.add_patch(Circle((cx, cy), 0.21, facecolor=DARK, edgecolor="#FFFFFF",
                            linewidth=1.4))
        ax.text(cx, cy, rid, ha="center", va="center", fontsize=8,
                color="#FFFFFF", fontweight="bold")

    ax.text(0.30, 4.15, "Residual rating, after the controls in the table are applied.",
            fontsize=8.5, color=MUTED)
    save(f, "risk_matrix.png")


# ---------------------------------------------------------------- 8. title mark
def title_mark():
    f, ax = fig(3.0, 4.6)
    f.patch.set_facecolor(DARK)
    hub = (1.50, 3.05)

    ax.add_patch(Polygon([(hub[0] - 0.09, hub[1] - 0.10), (hub[0] + 0.09, hub[1] - 0.10),
                          (hub[0] + 0.16, 0.25), (hub[0] - 0.16, 0.25)],
                         closed=True, facecolor="#1C5B57", edgecolor="none"))
    ax.add_patch(Rectangle((hub[0] - 0.42, 0.15), 0.84, 0.14,
                           facecolor="#1C5B57", edgecolor="none"))

    for a in (90, 210, 330):
        r = math.radians(a)
        ux, uy = math.cos(r), math.sin(r)
        nx, ny = -uy, ux
        ax.add_patch(Polygon([(hub[0] + 0.10 * ux + 0.16 * nx, hub[1] + 0.10 * uy + 0.16 * ny),
                              (hub[0] + 1.28 * ux + 0.05 * nx, hub[1] + 1.28 * uy + 0.05 * ny),
                              (hub[0] + 1.28 * ux - 0.03 * nx, hub[1] + 1.28 * uy - 0.03 * ny),
                              (hub[0] + 0.10 * ux - 0.16 * nx, hub[1] + 0.10 * uy - 0.16 * ny)],
                             closed=True, facecolor=SEA, edgecolor="none"))
    ax.add_patch(Circle(hub, 0.17, facecolor=MINT, edgecolor="none"))
    save(f, "turbine_mark.png")


if __name__ == "__main__":
    title_mark()
    system_block()
    ipo()
    mech_subsystem()
    exploded()
    circuit()
    gantt()
    risk_matrix()
