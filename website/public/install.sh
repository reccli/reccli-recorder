#!/bin/bash

# RecCli installation helper
# Installs the current tri-layer memory engine from its source repository.

set -e

echo "Installing RecCli — tri-layer memory for AI coding agents"
echo ""

# Check required tools.
if ! command -v git >/dev/null 2>&1; then
    echo "Error: git is required."
    exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
    echo "Error: Python 3 is required."
    exit 1
fi

echo "Run these commands to install RecCli:"
echo ""
echo "  git clone https://github.com/reccli/reccli.git"
echo "  cd reccli"
echo "  python3 -m pip install -r requirements.txt"
echo ""
echo "Then configure your coding agent:"
echo ""
echo "  # Claude Code"
echo "  python3 -m reccli.runtime.cli setup"
echo ""
echo "  # OpenAI Codex"
echo "  python3 -m reccli.runtime.cli setup --codex"
echo ""
echo "Documentation: https://github.com/reccli/reccli"
