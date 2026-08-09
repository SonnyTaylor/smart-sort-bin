# Fusion 360 import set

Same parts as `cad/stl/`, re-exported for CAD work rather than printing.
**Print from `cad/stl/`, not from here.**

The only difference is the tray, exported on a coarser grid: 7,468 triangles
instead of 23,220. The shape is the same to within 0.02 mm (the saddle is a
parabola, so sampling it less often costs almost nothing), but Fusion turns
every triangle into a face, and 23k faces makes it crawl.

Every file here is a closed, manifold solid, which is what Fusion needs to
convert a mesh into a body it can cut, fillet and put in a drawing.

## Importing

1. **Insert > Insert Mesh**, pick the file, units **millimeters**.
2. Right-click the mesh body > **Convert Mesh** (or Mesh tab > Modify > Convert Mesh).
3. Method: **Prismatic** for `plate` / `bracket` / `clamp` / `tray_spacer` —
   they are flat faces, holes and cylinders, and prismatic rebuilds those as
   real geometry. Use **Faceted** for `tray`, whose surface is genuinely curved.
4. Uncheck "Operate on a new body" if you want it to replace the mesh.

## What you get, and what you don't

You get a solid body: measurable, cuttable, usable in assemblies and drawings.

You do not get the parameters. Fusion has no idea `plate` was built from
`base_dia` and `wall`. To change a dimension, edit the `.scad` file and
re-export — do not try to edit the converted body and keep the two in sync.

## Re-exporting

```bash
OS="/c/Program Files/OpenSCAD/openscad.exe"
"$OS" -o cad/fusion/tray.stl -D 'PART="tray"' -D nx=64 -D ny=26 --export-format binstl cad/tray.scad
"$OS" -o cad/fusion/tray_spacer.stl -D 'PART="spacer"' --export-format binstl cad/tray.scad
for p in plate bracket clamp; do
  "$OS" -o cad/fusion/$p.stl -D "PART=\"$p\"" --export-format binstl cad/splitter_hub.scad
done
```
