# Discovery / submission kit

Ready-to-paste content for getting Treats listed. **These lists require a human
to submit via their web form/PR — do not automate them.**

## awesome-claude-code (the big one)

> ⚠️ Submit via the **issue form only** — PRs and `gh` CLI are banned there.
> Form: https://github.com/hesreallyhim/awesome-claude-code/issues/new?template=recommend-resource.yml

- **Display name:** Treats
- **Primary link:** https://github.com/0xcnr0/treats
- **Category:** Tooling → Plugins (also fits Slash-Commands / Hooks / Status Lines)
- **License:** MIT
- **Description (paste):**
  > A cute desktop pet that helps you train Claude Code. A little animal sits in
  > your screen corner — pet it with your mouse when the AI does good work,
  > right-click to scold a slip — and your reaction is quietly handed back to the
  > AI, so it actually does better next time (scold "no tests" → next time it
  > writes them). Pick your animal (dog/cat/dragon/horse/hamster/parrot/fox/panda/frog/penguin), each
  > with its own moods, ranks and report cards. Every project keeps its own score.
  > Don't want the pet? Optional `/treats:good` · `/treats:bad` work too.
- **Security notes (they ask):** Fully local — no network calls, no telemetry, no
  bypass-permissions required. Data lives in `~/.treats/`. Hooks exit 0 and
  swallow errors so they can never block a session.
- **How to validate (paste):**
  1. In a Claude Code session: `/plugin marketplace add 0xcnr0/treats` then `/plugin install treats`
  2. Run `/treats:good wrote tests` then `/treats:status` — see the score.
  3. Ask Claude "what's your treats standing?" — it quotes the injected context.
  4. (Pet) `git clone … && npm install && npm run pet` → click the animal.

## Other lists (PRs usually welcome — confirm each repo's CONTRIBUTING)

- travisvn/awesome-claude-skills
- ComposioHQ/awesome-claude-skills
- jqueryscript/awesome-claude-code

Use the same name/link/description above. Check whether each wants a README edit
or a CSV/data entry before opening a PR.

## Community plugin marketplaces

- cc-marketplace (ananddtyagi) — PR a marketplace entry, source `0xcnr0/treats`.
- claudecodemarketplace.net/marketplace — web submission form.
