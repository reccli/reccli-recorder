# RecCli

RecCli is a tri-layer memory system for AI coding agents.

It gives tools such as Claude Code and OpenAI Codex persistent, project-aware
memory across sessions:

1. **`.devproject`** — a durable map of the project's features, files, and
   structure.
2. **`.devsession` summary** — compact working memory containing decisions,
   problems solved, code changes, open issues, and next steps.
3. **`.devsession` conversation** — the full source-of-truth session, linked
   back to the summary so agents can recover exact prior reasoning.

Temporal and semantic links connect the three layers. Agents can start informed,
search prior work, and expand a result back to its original conversation instead
of relying on flat notes or lossy compaction.

## Current product

The active RecCli engine is maintained at
[github.com/reccli/reccli](https://github.com/reccli/reccli).

RecCli runs as an MCP server and provides:

- automatic project mapping from a codebase scan;
- session continuity for Claude Code and Codex;
- crash-safe session capture using a write-ahead log;
- hybrid retrieval using dense search, BM25, and reciprocal-rank fusion;
- verifiable links from summaries to exact source messages;
- local, human-readable `.devproject` and `.devsession` files;
- durable multi-agent organization workflows.

## Install

### Claude Code

```bash
git clone https://github.com/reccli/reccli.git
cd reccli
pip install -r requirements.txt
python3 -m reccli.runtime.cli setup
```

### OpenAI Codex

```bash
git clone https://github.com/reccli/reccli.git
cd reccli
pip install -r requirements.txt
python3 -m reccli.runtime.cli setup --codex
```

## This repository

This repository contains the public Next.js website deployed at
[reccli.com](https://reccli.com). The website source lives in [`website/`](website/).

The root Python/Tkinter recorder (`reccli.py`, `src/`, the root installer, and
the legacy static `index.html`) belongs to an earlier product direction. It is
retained only as historical code and is not the current RecCli product or
installation path.

## Open formats

The `.devproject` and `.devsession` specifications are human-readable JSON
formats designed for interoperable agent memory. The core engine is MIT
licensed, and the format specifications are CC0.

## License

MIT. See [LICENSE](LICENSE).
