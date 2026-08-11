# Working on the CAD

This is a VCE Systems Engineering project, so the design **process** is assessed,
not just the finished object. A change that nobody can see the reasoning behind
is worth less than a slightly worse change that is documented. Keep that in mind
when changing a part.

Fusion is the source of truth for the parts themselves. See
[README.md](README.md) for what exists and how it bolts together.

---

## When a design change needs a picture

Add a version to the evolution renders when the change is one you would have to
**explain** to someone. Rough test: could you write a sentence saying what was
wrong before?

Worth a render:

- The shape changed for a reason. A rim removed, a jaw reshaped, a solid disc
  becoming a spoked one.
- A fault was found and fixed. This is the most valuable kind, because "found it
  before printing" is exactly what the assessment is looking for.
- A part was replaced by a different part, like the spacer becoming the mount.
- The change is one you might otherwise argue about later.

Not worth a render:

- Fillets, chamfers, tolerance nudges, a hole moving 0.5mm.
- Renaming things, tidying the model tree, re-exporting an STL.
- Anything where the picture would look identical to the one before it.

Two or three versions per part across the whole project is about right. Five is
usually a sign that some of them are noise. **Do not add a stage for every
commit.**

## How to add one

Everything lives in [`renders/`](renders/README.md). Add an entry to
`renders/stages.json` and run the two commands in that README. The scripts pull
the old version out of git history, so the picture is the real superseded design
rather than a redrawing of it.

The "current" panel of each part points at the working copy, so it updates by
itself. You only pin a commit when a version becomes history.

## Writing the caption

Three short lines, under each picture. Say what was **wrong**, not what the part
is. The picture already shows what it is.

Good:

> The pipe lock screw enters from the side, where the taper has pulled the wall
> in. That leaves 1.56mm of thread.

Bad:

> Improved bracket with optimised screw placement for better reliability.

Use the real number wherever there is one. "1.56mm of thread" is evidence,
"too thin" is an opinion. If a figure came from a measurement or a calculation,
say which.

## Committing a design change

Stage the files you actually changed, by name. Never `git add -A`.

A design change usually touches:

- the part, in Fusion, plus its export in `stl/` and `step/`
- `renders/stages.json`, if it earned a version
- the regenerated images in `../portfolio/images/cad_evolution/`

Write the commit message about the problem, not the edit. `cad: the tray boss
stood proud of the saddle, so it could not be bolted on` is a better record than
`cad: fix tray`. These messages are what the render scripts and the iteration
log get written from later, so they are worth thirty seconds.

## Do not delete the .scad files

They are no longer the design source. They are kept because their git history is
what the superseded versions are rendered from. Deleting them deletes the
evidence.
