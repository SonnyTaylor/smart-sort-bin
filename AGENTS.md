# Smart Sort Bin

A bin lid that sorts rubbish. A camera on a pan-tilt head photographs each item,
a cloud vision model classifies it, and two servos tip it into one of three bags
hanging in the bin. The head sits on a printed tripod that clamps across the bin
rim on three PVC legs.

This is **Sonny's VCE Systems Engineering Unit 3 & 4 project**. Two things
follow from that and they shape everything:

- **The design process is what gets marked, not just the finished object.** A
  fault found and fixed is worth more than a part that happened to work. Record
  the reasoning and the numbers.
- **Sonny does not write code.** Explain in plain English, define any term you
  have to use, and make the technical calls yourself rather than asking him to
  choose a library or an architecture.

## Where the build is up to

**Read [`docs/build_log.md`](docs/build_log.md) before saying anything about
what exists.** As of August 2026 the electronics and software run, and none of
the eleven printed parts have been made. Say "designed and checked", not "built
and tested", until the build log says otherwise.

## Layout

| Path | What lives there |
| :--- | :--- |
| `portfolio/` | The assessed PowerPoint, generated from `ai_bin.js`. This is the real documentation |
| `src/` | The code that runs the bin. See `src/AGENTS.md` |
| `cad/` | Fusion exports and the design-evolution renders. See `cad/AGENTS.md` |
| `docs/` | Build log, mechanical write-ups, Pi setup notes |
| `tools/` | `deploy.py` to push to the Pi, `check_docs.py` to catch doc rot |
| `PLAN.md` | The original plan. Historical, frozen, do not update it |

---

# Documentation rules

Docs here have rotted repeatedly: a README claimed exports came from Fusion when
they came from OpenSCAD, an index described a document by the wrong contents, and
the deploy commands were written out in three files that were free to disagree.
These rules exist because of those, not in the abstract.

## One home per fact

Every fact has exactly one home. Everywhere else **links** to it.

| Fact | Its only home |
| :--- | :--- |
| What has actually been built | [`docs/build_log.md`](docs/build_log.md) |
| How the mechanism works and why | [`docs/mechanical_design.md`](docs/mechanical_design.md) |
| Faults found before printing | [`docs/mechanical_iteration_log.md`](docs/mechanical_iteration_log.md) |
| Parts, hardware list, assembly order | [`cad/README.md`](cad/README.md) |
| How the evolution renders are made | [`cad/renders/README.md`](cad/renders/README.md) |
| Pi wiring, OS config, deploy commands | [`docs/pi_setup.md`](docs/pi_setup.md) |
| What is left to do | [`docs/pi_todo.md`](docs/pi_todo.md) |
| Everything the course assesses | `portfolio/ai_bin.js` |

If you are about to write a fact that already has a home, link instead. A
one-line summary plus a link is fine. A second full copy is not.

## Check it

```
python tools/check_docs.py
```

Finds broken links, backticked paths that no longer exist, and commands written
out in more than one document. **Run it after moving, renaming or deleting
anything**, and before saying a documentation job is done.

## Do not create new documents by default

The instinct to write a new `.md` is usually wrong. Add to the document that
already owns the subject. A new file is justified when the subject genuinely has
no home yet, and then it goes in the table above in the same commit.

`README.md` is for a human arriving at a folder. `AGENTS.md` is for an agent
working in one. Do not write a third index.

---

# Working here

## Before saying something is true

Check the thing itself, not the doc about it. Repo docs, READMEs and your own
earlier claims are leads. Read the code, query Fusion, measure the file. The
Fusion-versus-OpenSCAD mixup was found by measuring both, and it would not have
been found by reading.

## Commits

- **Never `git add -A` or `git add .`** Sonny keeps work in progress in the same
  tree, and a blanket add has swept half-finished work into a commit before.
  Run `git status`, stage by name, and say so if there are changes you did not
  make.
- Write the message about the problem, not the edit. `cad: the tray boss stood
  proud of the saddle, so it could not be bolted on` beats `cad: fix tray`.
  These messages are what the write-ups get built from later.
- Commit and push, then say plainly whether it is live.

## Bugs

Every bug in this repo came from an agent, not from Sonny. Never call something
"pre-existing" or "inherited". Find one, fix it in the same turn, and search for
the rest of its class before calling it fixed.

## Writing style

No em dashes, no emoji, no marketing voice. Real numbers, and say so when
something is uncertain or untested. Short. Sonny reads all of it.
