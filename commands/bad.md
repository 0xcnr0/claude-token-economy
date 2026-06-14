---
description: Scold your AI for bad work (-1)
argument-hint: [reason]
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/packages/core/bin/treats.js" bad $ARGUMENTS`

🚫 Scolding recorded. (No further action needed — this just logs feedback.)
