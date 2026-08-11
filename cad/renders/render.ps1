<#
.SYNOPSIS
  Renders every version of every part listed in stages.json, straight out of
  git history, so the portfolio can show how each part changed.

.DESCRIPTION
  Reads stages.json. For each stage it pulls the OpenSCAD source out of the
  named commit (or uses the working copy), sets the PART variable, and renders
  a PNG with a camera fixed per part family so the versions stay comparable.

  Raw renders land in cad/renders/raw/. Run compose.py afterwards to crop them
  and build the labelled comparison strips.

.PARAMETER Only
  Render just one family, e.g. -Only tray. Handy while tuning a camera.

.PARAMETER WhatIf
  List what would be rendered and stop.

.EXAMPLE
  .\render.ps1
  .\render.ps1 -Only tray
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [string] $Only
)

$ErrorActionPreference = "Stop"

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$repo = Resolve-Path (Join-Path $here "..\..")
$cfg = Get-Content (Join-Path $here "stages.json") -Raw | ConvertFrom-Json

$osc = $cfg.openscad
if (-not (Test-Path $osc)) {
    throw "OpenSCAD not found at '$osc'. Install it, or fix the 'openscad' path in stages.json."
}

$raw = Join-Path $here "raw"
$src = Join-Path $here "src"
$logs = Join-Path $here "logs"
New-Item -ItemType Directory -Force $raw -WhatIf:$false | Out-Null
New-Item -ItemType Directory -Force $src -WhatIf:$false | Out-Null
New-Item -ItemType Directory -Force $logs -WhatIf:$false | Out-Null

$imgsize = "$($cfg.imgsize[0]),$($cfg.imgsize[1])"
$rendered = 0
$failed = @()

foreach ($fam in $cfg.families) {
    if ($Only -and $fam.key -ne $Only) { continue }

    foreach ($stage in $fam.stages) {
        $name = $stage.name
        $s = $stage.source
        $png = Join-Path $raw "$name.png"

        # Work out where the geometry comes from and write a .scad we can render.
        $scad = Join-Path $src "$name.scad"
        if ($s.stl) {
            $stlPath = (Join-Path $repo $s.stl) -replace '\\', '/'
            if (-not (Test-Path $stlPath)) { $failed += "$name : no such STL, $($s.stl)"; continue }
            $origin = "stl $($s.stl)"
            "import(`"$stlPath`");" | Set-Content $scad -Encoding utf8 -WhatIf:$false
        }
        else {
            if ($s.commit) {
                $origin = "$($s.commit) $($s.file)"
                $text = & git -C $repo show "$($s.commit):$($s.file)" 2>&1
                if ($LASTEXITCODE -ne 0) { $failed += "$name : cannot read $($s.file) at $($s.commit)"; continue }
            }
            else {
                $origin = "working copy $($s.file)"
                $p = Join-Path $repo $s.file
                if (-not (Test-Path $p)) { $failed += "$name : no such file, $($s.file)"; continue }
                $text = Get-Content $p
            }
            # These files pick which part to build with a PART variable near the
            # top. Rewrite that line rather than passing -D, which is fragile to
            # quote through PowerShell.
            $hit = $false
            $text = $text | ForEach-Object {
                if (-not $hit -and $_ -match '^\s*PART\s*=') { $hit = $true; "PART = `"$($s.part)`";" } else { $_ }
            }
            if (-not $hit) { $failed += "$name : no PART assignment found in $($s.file)"; continue }
            $text | Set-Content $scad -Encoding utf8 -WhatIf:$false
        }

        if ($PSCmdlet.ShouldProcess("$name", "render from $origin")) {
            if (Test-Path $png) { Remove-Item $png -Force }
            $argv = @(
                "-o", $png,
                "--imgsize=$imgsize",
                "--render=cgal",                  # full geometry, not the preview, or coincident faces z-fight
                "--autocenter",
                "--camera=$($fam.camera)",
                "--projection=p",
                "--colorscheme=$($cfg.colorscheme)",
                $scad
            )
            # openscad.exe is a GUI binary, so the call operator does not
            # reliably wait for it. Start-Process -Wait does, but it joins an
            # argument array on spaces without quoting, which splits any path
            # containing a space (this repo lives under "Sonny Taylor"). So
            # quote them here.
            $line = ($argv | ForEach-Object {
                if ($_ -match '\s') { '"' + $_ + '"' } else { $_ }
            }) -join ' '
            # OpenSCAD is chatty, and the echoes from the model (screw lengths,
            # slope angles) are worth keeping, so park them in a log.
            $p = Start-Process -FilePath $osc -ArgumentList $line -Wait -PassThru -NoNewWindow `
                -RedirectStandardOutput (Join-Path $logs "$name.out.txt") `
                -RedirectStandardError (Join-Path $logs "$name.log.txt")
            if ((Test-Path $png) -and (Get-Item $png).Length -gt 0) {
                $rendered++
                "  {0,-18} {1,-8} {2}" -f $name, $stage.label, $origin
            }
            else {
                $failed += "$name : OpenSCAD exited $($p.ExitCode) and wrote no image, see logs\$name.log.txt"
            }
        }
        else {
            "  {0,-18} {1,-8} {2}" -f $name, $stage.label, $origin
        }
    }
}

""
if ($failed.Count) {
    "$rendered rendered, $($failed.Count) failed:"
    $failed | ForEach-Object { "  $_" }
    exit 1
}
"$rendered rendered into $raw"
"Now run:  python `"$(Join-Path $here 'compose.py')`""
