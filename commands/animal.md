---
description: Show or change your animal (dog, cat, dragon, horse, hamster, parrot)
argument-hint: "[name]"
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/packages/core/bin/treats.js" animal $ARGUMENTS`
