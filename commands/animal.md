---
description: Show or change your animal (dog, cat, dragon, horse, hamster, parrot, fox, panda, frog, penguin, rabbit)
argument-hint: "[name] [--here]"
allowed-tools: Bash(node:*)
---

!`node "${CLAUDE_PLUGIN_ROOT}/packages/core/bin/treats.js" animal $ARGUMENTS`
