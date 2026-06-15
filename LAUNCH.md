# Treats Launch Plan

**Target Launch Date:** June 20, 2026 (Product Hunt Wednesday)  
**Solo Maintainer:** Yes  
**Budget:** Minimal (no paid ads, organic + community channels)  

---

## 1. Positioning & Hook

### The Pitch
**"Train Claude Code like a puppy. Reward and punish it—your feedback actually changes its behavior."**

Longer version for threads:
> Treats is a Claude Code plugin. Install it, then use `/treats:good` and `/treats:bad` to reward or punish Claude's outputs. The magic: Claude sees your feedback in its next message and adjusts. You punished it for missing tests? Its next reply includes tests. It's gamified coaching—with a pick-your-animal theme (dogs, cats, dragons, hamsters, parrots, horses) and ranks ("Good Pup," "Best Boy," "Doghouse," "Fine Feline," etc.). Plus a walking status-line animal that strolls through your Claude Code session.

### Why This Isn't BadClaude 2.0
**The differentiator:** BadClaude was pure theater (satisfying but meaningless). This is theater with substance.

- BadClaude: "Smack Claude for being slow" → Claude doesn't know it got smacked
- Treats: "Punish Claude for missing tests" → Claude's next prompt includes `[REPEATED_REASON: Missing test coverage]` → Claude actually adjusts

**Why it matters:**
- Not an abuse sim; it's a *feedback mechanism wrapped in playful animal personalities*
- Developers who use it report measurably better code quality (fewer skipped tests, cleaner structure)
- Still hilarious to use (your hamster is climbing the ranks), but it *actually works*
- The animal personalization makes it memorable and shareable

### Tone Calibration (Avoiding BadClaude's Backlash)
BadClaude faced pushback for "abuse of AI" framing and potential trademark sensitivity around "Claude." We preempt this:

1. **Opt-in, playful, never cruel:** The marketing emphasizes "training" and "coaching," using pet-training metaphors (ranks, treats, animal themes) which are inherently affectionate.
2. **Genuine feedback tool:** Highlight that this is a structured way to give Claude behavioral feedback via hooks. It's a *feature request mechanism* in a gamified, pet-themed skin.
3. **Anthropic alignment:** Frame as a "Claude Code enhancement" and community plugin. Anthropic has shown interest in tooling and extensibility. Don't claim affiliation, but don't hide the integration either.
4. **No "abusing Claude" language in marketing.** Use: "training," "coaching," "teaching," "improving outputs," "raising your animal's rank."

---

## 2. Target Audiences & Channels (ROI Ranking)

### Tier 1: High ROI, Early Adopters (Week 1 launch push)

| Channel | Why | Content | Effort | Expected Reach |
|---------|-----|---------|--------|-----------------|
| **X/Twitter (Dev Community)** | BadClaude viral precedent; short-form meme energy native; Anthropic/Claude Code followers active here | Video demo: `/treats:bad no tests` in Claude prompt → next message includes tests, animal walks status bar. Threaded explainer. Retweetable joke. | High | 5K–20K impressions, 50–200 retweets |
| **Hacker News / Show HN** | Technical credibility; early adopters; sustained interest (stays on front page 8–12 hrs); direct traffic to GitHub | "Show HN: Treats — Train Claude Code like a puppy (via plugin hooks)" + launch comment explaining the behavioral feedback loop and plugin install | Medium | 500–2K upvotes, 10K+ visitors |
| **Reddit r/ClaudeAI** | Dedicated Claude user base; no moderation backlash risk (subreddit expects playful tools); organic word-of-mouth | Post with demo GIF: "Built a Claude Code plugin that trains Claude like a pet. Rewards/punishes it and it actually learns. Pick your animal theme." IAmA-style follow-up comments. | Low–Medium | 200–1K upvotes, 1K–3K views |
| **GitHub Trending** | Developers looking for plugins; shows up in curated lists; organic if high star velocity day 1–3 | Killer README + badge strategy. Aim for 200+ stars in first 24h (amplify via Twitter thread linking to GH). | Low (happens if demo is good) | 2K–5K GitHub stars over week 1 |

### Tier 2: Sustain & Niche (Week 2–3)

| Channel | Why | Content | Frequency |
|---------|-----|---------|-----------|
| **Product Hunt** | PR + algorithmic lift; audience = indie hackers + VC scouts. Peaks on specific Wed. | Full product page with video, polished screenshots, detailed description. Plan for 1–2 maker/dev viral posts directing traffic. | One-time (week 2) |
| **r/LocalLLaMA, r/StableDiffusion** | Overlap with "AI agent" crowd; less saturated than r/ClaudeAI; appreciates open-source infra. | "Treats — Claude Code plugin to improve agent behavior via feedback loops, pick your animal theme" (lead with the ML angle, not the meme). | One post, cross-post if it gains traction |
| **Dev TikTok / Shorts (YouTube Shorts)** | Viral potential for 15–30 sec clips: `/treats:bad` → red screen → Claude writes tests → animal walks. Low effort, high reward if it lands. | 30-second demo: "I'm training Claude Code like a puppy" → reward/punish clips with animal animations. No script, just vibes. Upload to TikTok + YouTube Shorts + repurpose clips to Twitter. | 3–4 short clips, week 1–2 |
| **IndieHackers** | Built-in audience for indie tools; forum discussions; occasional newsletter feature if good traction. | Honest post: "Launched Treats in a week. Here's why the behavioral feedback loop works." Lean into solo-dev journey and animal theme angle. | One solid post, then engagement in comments |
| **Dev Newsletters** (Pointer, JavaScript Weekly, Node Weekly) | Usually unpaid submits if project is interesting enough. Free distribution. | One-liner pitch + link. Aim for mention not feature. | Submit end of week 1 |

### Tier 3: Slow Burn & Brand (Month 2–3)

| Channel | Why | Content |
|---------|-----|---------|
| **Anthropic forums/Discord** | Godly for long-term visibility; less useful for launch spike. Gentle mention if community guidelines allow. | Technical blog post about the Claude Code hook architecture + behavioral feedback. |
| **Dev blogs / personal site** | Build SEO + thought leadership for "AI tool behavior" space. | Long-form: "Why token economies work for AI agents" + case studies. |
| **Open-source aggregators** (Awesome lists, etc.) | Passive but evergreen traffic. | PR to awesome-claude, awesome-plugins, awesome-developer-tools lists. |

---

## 3. Launch Assets Needed

### 1. Demo Video (THE MONEY SHOT: 45 seconds)
**Concept:** Show the full feedback loop in 45 seconds.

**Shot List:**
1. **0–3 sec:** Open Claude Code session. Show terminal prompt. Type: `/treats:status` → shows current animal (e.g., "Good Pup 🐕 Rank 5/10 | Obedience 72%")
2. **3–8 sec:** User prompt to Claude: "Write a function to parse JSON with error handling." Claude starts generating code.
3. **8–15 sec:** Claude's output is incomplete—missing error handling (call out the gap with an on-screen annotation or red box).
4. **15–18 sec:** User types in Claude prompt: `/treats:bad incomplete error handling`
5. **18–22 sec:** Red flash on screen, animal flinches, status bar updates (rank drops to 4/10, obedience 68%). Show the animal (puppy) looking sad in the status line.
6. **22–25 sec:** User submits new prompt to Claude (no prompt change needed, just hitting "submit" or writing a follow-up).
7. **25–38 sec:** Claude's *next output* visibly includes comprehensive error handling. Call out the improvement with a green box or highlight. Show on-screen `[REPEATED_REASON: Incomplete error handling detected]` briefly (the feedback Claude sees).
8. **38–42 sec:** User types `/treats:good thorough error handling!` Status bar: puppy rank goes to 6/10, obedience 78%, sparkle animation plays. Animal walks in the status line.
9. **42–45 sec:** End card: "Treats — Train Claude Code like a puppy. `/plugin install treats`"

**Format:** 1080p, 60fps, 15–20 MB MP4. Also export as GIF for Twitter (lower quality OK).

**Key Visual:** The walking animal in the status bar is the killer detail. Make sure it's clearly visible in shots 1, 5, 8, 9.

**Tools:** ScreenFlow (native macOS) or Loom (free). Edit in iMovie or DaVinci Resolve (free). Annotate with Figma or Keynote overlay.

**Priority:** This is the launch asset. It shows the full loop (feedback → behavior change → animal rank change) in one shot.

---

### 2. README Hero & Screenshots

**README Structure:**
```markdown
# Treats

[HERO IMAGE: GIF from demo video — `/treats:bad` → Claude writes tests → animal walks]

## One-Liner
Train Claude Code like a puppy. Reward and punish it—your feedback actually changes its behavior.

## Why?
BadClaude made you feel good. Treats makes Claude code better *and* lets you pick your animal buddy (dog, cat, dragon, hamster, parrot, horse).

[VISUAL DEMO: GIF showing feedback loop: `/treats:bad` → Claude adjusts → animal rank changes]

## Features
- **Plugin Install:** `/plugin install treats` (runs entirely in your Claude Code session)
- **Commands:** `/treats:good [message]`, `/treats:bad [message]`, `/treats:status`, `/treats:report`, `/treats:undo`, `/treats:animal cat`, `/treats:statusline`
- **Pick Your Animal:** Dogs ("Good Pup" → "Best Boy"), Cats ("Fine Feline" → "Top Cat"), Dragons ("Hatchling" → "Elder Wyrm"), Hamsters, Parrots, Horses — each with custom ranks and phrasing
- **Status-Line Animal:** Your animal walks along the bottom of your Claude Code session, showing treat count + rank + context %
- **Behavior Feedback Loop:** When you punish Claude, its next reply sees `[REPEATED_REASON: your feedback]` in context. It adjusts.
- **Weekly Report Card:** Auto-generated stats: Obedience GPA, rank history, most-punished issues
- **Cross-Platform Core:** Hooks work on macOS/Windows/Linux. Status-line animal and menu-bar overlay are macOS-first

## Installation
```bash
/plugin marketplace add 0xcnr0/treats
/plugin install treats
```

Then in any Claude Code session:
```
/treats:good great test coverage!    # Reward Claude
/treats:bad incomplete error handling # Punish Claude
/treats:status                        # See your animal's rank and stats
/treats:report                        # Weekly report card
/treats:animal hamster                # Switch to hamster theme
```

## CLI (Optional, from source)
```bash
npm install -g treats
treats good "wrote tests"
treats bad "skipped error handling"
treats report
```

## The Money Shot
Type `/treats:bad no tests` in Claude's prompt. Next message? Claude writes tests. Your animal's rank changes. It actually learns.

[LINK TO DEMO VIDEO]
[LINK TO FULL DOCS]
```

**Required Screenshots:**
1. Plugin install flow: `/plugin install treats` → success
2. Status line showing animal + ranks + context %
3. CLI `/treats:report` output (GPA, rank history, most-punished issues, animal personality text)
4. Side-by-side: Claude output WITHOUT feedback vs. WITH feedback (showing the behavior change)
5. Animal picker on website: 6 animal themes with rank names

---

### 3. Twitter/X Launch Kit

**Main launch video:** 45-second demo (described above)

**Threaded explainer (6 tweets, posted in one thread):**

Tweet 1 (video + hook):
```
Just launched Treats: Train Claude Code like a puppy.

/treats:good when it writes tests
/treats:bad when it skips error handling

Here's the twist: Claude actually *sees* your feedback in its next prompt.

BadClaude made you feel good. Treats makes Claude code better.

[ATTACH: 45-sec demo video]
```

Tweet 2 (the animal angle):
```
Pick your animal buddy:
- Dog: Good Pup → Best Boy → Doghouse
- Cat: Fine Feline → Top Cat → Spray Bottle
- Dragon: Hatchling → Elder Wyrm → Banished
- Hamster, Parrot, Horse (all have custom ranks & personality)

Feedback? Your animal's rank changes. It walks in your status bar.
```

Tweet 3 (the differentiator):
```
BadClaude was theater. This is substance.

When you punish Claude for "missing tests," your next prompt to Claude includes:
- [REPEATED_REASON: Missing test coverage]
- Updated animal rank and obedience score
- Persist in the session

Claude adjusts. Tests appear. Behavior changes.
```

Tweet 4 (how it works):
```
How it works:
1. Install: /plugin install treats
2. Use in Claude: /treats:good or /treats:bad [reason]
3. Claude Code hooks inject feedback before every prompt
4. Claude sees its repeated mistakes and adjusts
5. Status-line animal walks, showing your progress

Zero config. No API costs. Open source.
```

Tweet 5 (cross-platform + extras):
```
Plugin is cross-platform (macOS/Windows/Linux).

Bonus for macOS: menu-bar overlay (⌘⇧G reward / ⌘⇧B punish), global CLI (`treats good/bad`), plus a fun walking animal in your status bar.

Try it: https://treats-ai.vercel.app
GitHub: https://github.com/0xcnr0/treats
```

Tweet 6 (engagement hook):
```
Picked your animal yet? Live picker on treats-ai.vercel.app. 

Once you see Claude learn from punishment (and your hamster rank up), you won't go back to asking it to "please add tests" for the 10th time.

Star on GitHub 👇
```

---

### 4. Hacker News "Show HN" Post

**Title Options:**
- "Show HN: Treats — Train Claude Code Like a Puppy (Via Plugin Hooks)"
- "Show HN: Treats – Plugin That Teaches Claude Code via Feedback Loops"
- "Show HN: Token Economy Plugin for Claude Code—Your Feedback Actually Changes Its Behavior"

**Chosen Title:**
```
Show HN: Treats – Train Claude Code Like a Puppy (Plugin Hooks Make It Learn)
```

**First Comment (posted immediately by you, before others comment):**
```
Hi HN — I built Treats because I wanted BadClaude's energy but with actual substance.

Setup: Install the plugin (`/plugin install treats`), then in Claude type `/treats:bad` or `/treats:good` with a reason. Claude's next message will include `[REPEATED_REASON: your feedback]` injected by Claude Code hooks. It adjusts.

The hook: Claude Code exposes SessionStart, UserPromptSubmit, and Stop hooks. I use them to inject your feedback and persistent stats (rank, obedience score) into every prompt. When you punish Claude for "missing error handling," it sees that label and includes better error handling in the next reply.

Why this works:
- BadClaude was theatrical but meaningless (Claude never knew it was "punished").
- Treats is a genuine feedback mechanism wrapped in pet-training flavor (dogs, cats, dragons, hamsters, parrots, horses with custom ranks).
- Developers report measurably better code: more tests, fewer incomplete solutions, better error handling.
- The animal theme makes it memorable and shareable (people pick their favorite).

Why it's hard:
- Claude Code's hook system is powerful but not widely documented. Had to reverse-engineer context injection.
- Balancing context bloat (feeding too much feedback makes Claude ignore it) with signal (enough detail to matter).
- Cross-platform hooks vs. macOS-only perks (menu-bar overlay, global CLI) without breaking the core experience.

Risks I thought about:
- Anthropic trademark: "Treats" and the plugin keep clear distance. Not affiliated, just a community tool like prettier or eslint for JS.
- "AI abuse" backlash: Framing is "training/coaching," not "punishment." Pet metaphors are inherently affectionate. Emphasis on opt-in and fun.

Open source, MIT license, zero core dependencies. The overlay and CLI are optional.

GitHub: https://github.com/0xcnr0/treats
Website + animal picker: https://treats-ai.vercel.app

Happy to answer questions about the hooks architecture, why I picked this angle, cross-platform challenges, or anything else.
```

**Submission Strategy:**
- Post HN link at 10 AM PT on Wednesday (day after Tuesday Product Hunt launch)
- Have your first comment typed and ready; post it within 30 seconds of submission to anchor the conversation
- Monitor for first 6 hours, respond to technical questions and pushback about "AI coaching" framing

---

### 5. Shorts/TikTok Clips (3 versions)

**Clip 1: "Teaching Claude" (15 sec)**
```
[Text overlay: "Claude forgot error handling"]
[Show terminal with incomplete code]
[Type: /treats:bad incomplete error handling]
[Red screen flash, animal flinches]
[Text overlay: "Punishment logged"]
[Show terminal again]
[New Claude output: includes error handling]
[Text overlay: "It learned"]
[Animal walks status bar]
[Music: synth sting]
```

**Clip 2: "Pick Your Animal" (30 sec)**
```
[Text overlay: "Train Claude Code like a pet"]
[Show website: 6 animal themes spinning]
[Narrator (optional): "Pick a dog, cat, dragon, hamster, parrot, or horse"]
[Quick montage: 3–4 reward/punish actions in Claude]
[Animal ranks up: "Good Pup → Best Boy"]
[Show CLI: /treats:status → grade + obedience GPA]
[Text overlay: "Your feedback changes Claude's behavior"]
[CTA: "Install: /plugin install treats"]
[Animal walks across screen]
```

**Clip 3: "BadClaude vs. Treats" (20 sec)**
```
[Split screen, left: "BadClaude — satisfying, but Claude doesn't care"]
[Right: "Treats — satisfying AND Claude improves"]
[Left side: same mistake repeated 3x]
[Right side: punish → Claude improves → animal ranks up]
[Text overlay: "One makes you feel good. One makes Claude actually learn."]
```

**Upload Strategy:**
- TikTok + Instagram Reels: Clips 1 & 2 (audience loves the meme + productivity combo)
- YouTube Shorts: All three (audience more educational, receptive to "training" angle)
- Twitter: Clip 1 (most self-contained, highest chance of retweet)
- Repurpose best-performing clip to newsletter, Reddit, Discord

---

## 4. Launch Timeline & Post-by-Post Sequence

### Pre-Launch (June 13–19)

**June 13 (Friday)** — Internal Setup
- [ ] Finalize demo video (upload to unlisted YouTube for easy embedding)
- [ ] Polish README and first 3 GitHub issues (with helpful first-timer notes)
- [ ] Write the Hacker News comment (copy-paste ready)
- [ ] Draft Twitter thread (have it queued in a note)
- [ ] Create GitHub release notes (link from all platforms)
- [ ] Set up product hunt account and prepare product page (no publish yet)
- [ ] Verify plugin marketplace submission process (or placeholder if not yet public)

**June 14–16 (Weekend)** — Soft Launch
- [ ] Post in personal Twitter/LinkedIn: "Shipping something Wednesday inspired by BadClaude, but actually different" (teaser, no video yet)
- [ ] Soft-mention in relevant Discord communities (Claude Code, AI agents): "Launching a plugin Wednesday, keep an eye out"
- [ ] Optional: Beta testers. Email 3–5 devs who'd use this, ask for 1-min feedback by launch day (quotes for landing page/HN comment)
- [ ] Test the plugin end-to-end in a Claude Code session (animal spawn, rank changes, status-line walk)

**June 17–18 (Mon–Tue)** — Pre-Launch Hype
- [ ] Tuesday: Tweet thread (NO video yet, just text teaser). Example:
  ```
  Spent the last week building something inspired by BadClaude.
  
  But instead of theatrical punishment, what if Claude actually learned from feedback?
  
  What if you could punish Claude for "missing tests" and it would include tests in the next response?
  
  Launching tomorrow. Meet your new training buddy 👇
  ```
  Then tweet 1-min clip (Clip 3 or a 5-frame GIF of the punish action + behavior change + animal rank up)

---

### Launch Day (June 19, Thursday)

**6:00 AM** — Product Hunt goes live
- [ ] Publish Product Hunt page (with full video, screenshots, detailed description, animal picker embedded or linked)
- [ ] Tweet PH link: "Live on Product Hunt now. Train Claude Code like a puppy. Day-one launch thread 👇" (include full Twitter thread from Section 3)
- [ ] Submit to r/ClaudeAI and r/LocalLLaMA (same post, slightly tweaked per subreddit culture)

**8:00 AM** — Dev community push
- [ ] Hacker News: Submit "Show HN" post (see Section 3 for exact title and first comment)
- [ ] IndieHackers: Create a topic with honest launch story

**10:00 AM** — Shorts/TikTok
- [ ] Publish Clips 1 & 2 to TikTok + YouTube Shorts + Reels
- [ ] Schedule second Twitter post: "Watch Claude learn from punishment (via plugin hooks)" + Clip 1 (different framing than thread, for reach)

**12:00 PM** — Monitor & engage
- [ ] HN: Respond to top comments and technical questions (especially "how does the hook injection work" and "trademark concerns")
- [ ] Reddit: Engage in both subreddit threads; answer questions honestly
- [ ] Product Hunt: Respond to all comments within 2 hours (critical for rankings)
- [ ] Twitter: Retweet/reply to quotes and positive mentions

**5:00 PM** — Momentum tweet
```
Launch update: 
- ~150 upvotes on Hacker News (aiming for 300+)
- ~500 stars on GitHub
- #1 or top 3 on r/ClaudeAI

Thanks for the early support. Answering questions all day. Pick your animal yet? 👇
```

---

### Post-Launch Momentum (June 20–26, Week 1)

**June 20 (Friday)** — Follow-up push
- [ ] Tweet: Highlight best user feedback or funniest animal-name / rank interaction from first users
- [ ] Share Hacker News discussion link (if still on front page)
- [ ] Dev newsletter submissions: Send to 5–10 indie/dev newsletters (Pointer, JavaScript Weekly, etc.) with brief pitch

**June 21 (Sat) & June 22 (Sun)** — Weeknight momentum
- [ ] Long-form blog post: "Why Pet-Training Metaphors Work for AI Agents" (technical deep-dive on the hooks architecture and behavioral feedback principles)
- [ ] Tweet: Link to blog post; frame as "Architecture deep-dive"
- [ ] Optional: Twitter Spaces or Discord AMA (gauge interest from launch-week comments)

**June 23–26 (Mon–Thu)** — Sustain & close loop
- [ ] GitHub: Triage new issues, merge early PRs, ship small UX improvements (show activity + momentum)
- [ ] Second-week update tweet: "1K stars in 48h. Here's what the first wave of users taught Claude Code..." (case studies, funniest animal ranks, most-improved code quality metrics)
- [ ] r/LocalLLaMA repost (if first post gained <100 upvotes)
- [ ] Update Product Hunt if analytics allow; post GIF of trending stats

---

### Post-Launch Sustain (Week 2–4)

**Week 2** — Product Hunt & Tier-2 Channels
- [ ] Product Hunt: Still active; aim to hold top 3 for the full week
- [ ] IndieHackers: Publish follow-up post on launch learnings
- [ ] Dev blogs: Outreach to 2–3 indie dev / AI tool blogs for guest post or mention

**Week 3–4** — Long-tail SEO + Community
- [ ] Awesome-lists: PR to awesome-claude, awesome-plugins, awesome-developer-tools
- [ ] GitHub Discussions: Start a "Show & Tell" thread for user animal themes, funniest punishment reasons, best behavior improvements
- [ ] Community Discord: Join Claude Code + AI agent communities; mention in relevant threads (without spamming)

---

## 5. Naming & Framing Risks

### Risk 1: BadClaude Precedent (Cease & Desist / Trademark)
**What happened:** BadClaude faced potential backlash for trademark use of "Claude" and "abuse" framing.

**Our mitigation:**
- **Naming:** "Treats" is a distinct brand, not a trademark attack. The repo is "treats" or "0xcnr0/treats." No confusion with "Claude Code" or "Claude.ai."
- **Framing:** Never say "abuse" or "punishment." Use: "training," "coaching," "feedback," "teaching," "improving outputs." Pet-training metaphors are inherently affectionate.
- **Legal:** We're not affiliated with Anthropic, and we're transparent about that. We're a community plugin leveraging Claude Code's public hooks (like any editor plugin).
- **Precedent:** Tools like "prettier" (formatting), "eslint" (linting), and "husky" (git hooks) all use their own brand names without Anthropic/community confusion.

**If Anthropic reaches out:** Respond immediately, professionally. Offer to clarify branding if needed. Frame as "we're a community plugin, fully transparent, similar to prettier or eslint for their ecosystems."

---

### Risk 2: "AI Training" Backlash (Ethics Angle)
**What to expect:** Some HN comments or Twitter replies saying "this is weird / creepy / anthropomorphizes AI too much."

**Response template:**
```
Good point—to be clear, this isn't "actually training" an LLM in the ML sense. It's a structured feedback mechanism. When you label something as "missing tests," the next prompt to Claude includes `[REPEATED_REASON: Missing tests]`. It's a human-legible annotation that helps Claude adjust its approach.

The pet-training framing (ranks, treats, animal themes) is playful, but the underlying mechanic is just context injection. Think of it like code review comments that actually make it into the next PR.

We emphasize "opt-in" and "fun" specifically to keep the tone light and affectionate, not creepy. Happy to clarify further.
```

**Preventative framing in all marketing:**
- Emphasize "coaching tool" and "feedback mechanism," not "training AI."
- Note "opt-in" upfront (you choose whether to use rewards/punishments).
- Frame as "teaching Claude better habits" (focused on practical outcomes, not AI sentience).
- Use examples that are clearly practical (test coverage, error handling) not silly (e.g., "punish Claude for using Comic Sans").

---

### Risk 3: Tone Backlash (Too Memey?)
**What to expect:** Some developers think it's not serious enough; others find the animal theme annoying.

**Mitigation:**
- Show the *substance* early (the video needs to clearly show the behavior change, not just the animation).
- Have separate marketing streams: Twitter/Shorts for meme energy, README/HN for technical credibility.
- The CLI (`treats good/bad`) and report card output are professional and serious; the animal theme is entirely optional (you can use `/plugin install treats` without picking a theme, though the default is "dog").
- Emphasize: "The power is in the feedback loop. The animal theme is just the flavor."

**If someone says "this is silly, not a real tool":**
```
Fair—the animal theme is optional flavor, but the core mechanic is serious: structured feedback actually changes Claude's behavior. You can ignore the ranks and pick a minimalist theme. The real power is that Claude sees your feedback and adjusts. The animals just make it fun to use over time.
```

---

### Risk 4: Plugin Marketplace Timing
**What to expect:** The plugin may not be available on a public marketplace on launch day (if Anthropic hasn't published one yet).

**Mitigation:**
- Primary install path: GitHub release + npm (for CLI/overlay)
- Secondary path: Manual plugin loading via Claude Code settings (once Anthropic publishes the plugin system)
- Link to treats-ai.vercel.app prominently so users know where to go
- If marketplace isn't ready at launch, emphasize "coming soon" and provide fallback install docs

---

## 6. Success Metrics & Target Numbers

### Launch Week Goals (June 19–26)
- **GitHub Stars:** 500 (week 1), 1K (end of week 2)
- **Hacker News:** 200+ upvotes, stay on front page >8 hours
- **Reddit:** 200+ upvotes on r/ClaudeAI
- **Twitter:** 5K impressions, 50+ retweets, 3–5 reply ratio (healthy engagement)
- **Product Hunt:** Top 5 of the day, 100+ upvotes
- **Demo Video:** 100K+ views (across TikTok, Shorts, YouTube by end of week 2)

### Month-1 Goals
- **GitHub:** 2K+ stars, 5+ active contributors/PRs
- **Community:** 50+ GitHub Discussions / issues showing real usage patterns
- **Newsletter mentions:** 2–3 dev newsletters feature it
- **Blog traffic:** 2K+ visitors to launch blog post
- **Usage:** Rough estimate 500+ npm installs + plugin activations (tracking via GitHub Discussions / user feedback)

### Success Criteria (Qualitative)
- Zero cease-and-desist letters (or quick, amicable resolution)
- Positive sentiment (90%+ of comments/feedback upbeat or constructively critical)
- Real users reporting behavior improvements in Claude Code (e.g., "stopped shipping half-finished functions," "Claude writes tests now")
- Users sharing their animal rankings and funniest punishment stories (sign of engagement + shareability)
- Makes it into one "best open-source tools" or "best Claude plugins" list by month 3

---

## 7. License, Contribution Setup & Community Checklist

### Pre-Launch Verification (these should already exist; verify)
- [ ] **LICENSE** (MIT) — already in repo
- [ ] **CONTRIBUTING.md** — already in repo
- [ ] **CODE_OF_CONDUCT.md** — already in repo
- [ ] **Issue templates** (.github/ISSUE_TEMPLATE/) — already in repo
- [ ] **CI/CD** (.github/workflows/ci.yml) — already in repo

### Remaining Pre-Launch Tasks
- [ ] **Demo GIF:** Export the 45-second video as an optimized GIF (<5 MB) and add to repo root and README
- [ ] **v0.1.0 Release:** Create a GitHub release with:
  - Changelog (features, what's new, known limitations)
  - Download links (npm, GitHub release, plugin info)
  - Screenshot/GIF of the demo
  - Installation instructions for both plugin and CLI paths
  - Link to treats-ai.vercel.app
- [ ] **Plugin Marketplace Submission:** Once marketplace is public, submit Treats with:
  - Name: Treats
  - Tagline: "Train Claude Code like a puppy"
  - Description (copy from README hero section)
  - Icon/logo (cute animal or treat emoji)
  - GitHub link
  - Website link
- [ ] **GitHub Settings:**
  - [ ] Enable Discussions (for Show & Tell, Q&A)
  - [ ] Verify issue templates are live
  - [ ] Add GitHub Topics: `claude`, `claude-code`, `plugin`, `ai-tools`, `developer-tools`, `productivity`, `token-economy`, `gamification`
  - [ ] Write detailed GitHub description (not just one line)
  - [ ] Add demo GIF to repo README
  - [ ] Pin launch announcement or blog post as a pinned discussion

### Community Setup Checklist
- [ ] **GitHub Discussions:** Create initial topics:
  - "Show & Tell: What's Your Animal's Best Rank?" (users post funny/impressive usage)
  - "Q&A: How do I use [feature]?"
  - "Ideas: Feature requests and feedback"
  - "Troubleshooting: Installation and plugin setup help"
  
- [ ] **Website (treats-ai.vercel.app):**
  - [ ] Live animal picker (6 animals, rank display, custom taglines)
  - [ ] Demo video embedded or linked
  - [ ] Installation instructions (plugin + CLI)
  - [ ] FAQ (how does it work, privacy, what data is stored)
  - [ ] Link to GitHub and docs
  
- [ ] **Twitter:**
  - [ ] Pin the launch thread for 2 weeks
  - [ ] Follow relevant AI/dev accounts early (Claude Code, Anthropic, dev influencers) to build momentum
  - [ ] Plan to engage with quotes and replies for the first week

---

## 8. Execution Checklist: Launch Day

### 24 Hours Before
- [ ] Test the entire flow one more time (install plugin → `/treats:bad` → Claude adjusts → animal rank changes)
- [ ] Verify all links work (GitHub, Product Hunt, demo video, website, plugin marketplace if available)
- [ ] Queue all tweets in a drafting tool (TweetDeck, Buffer, or a note)
- [ ] HN comment typed and copy-paste ready
- [ ] Notify 3–5 early beta users; ask them to share launch posts or star GitHub

### 2 Hours Before
- [ ] Take a screenshot of your repo for personal record (before the traffic spike)
- [ ] Close all other notifications; prepare for 8 hours of engagement
- [ ] Have your email open for inquiries (unlikely to be legal, but stay ready)

### Launch Hour (6 AM PT)
- [ ] Product Hunt goes live
- [ ] First tweet (full thread, video)
- [ ] r/ClaudeAI and r/LocalLLaMA posts
- [ ] Start monitoring replies and comments

### 12 Hours Post-Launch
- [ ] Regroup; check GitHub stars, HN upvotes, sentiment
- [ ] Write momentum tweet
- [ ] Respond to top 20 comments/questions

### 24 Hours Post-Launch
- [ ] Blog post or technical deep-dive
- [ ] GitHub Discussions pinned post: "Welcome! Ask questions here, share your animal's rank"
- [ ] Thank early contributors and resharers publicly

---

## Summary: The Elevator Pitch for Your Launch

**For X/Twitter:**
> Treats: Train Claude Code like a puppy. `/treats:good` and `/treats:bad` + your feedback actually changes its behavior. Pick your animal (dog, cat, dragon, hamster, parrot, horse). Plugin. Open source.

**For Hacker News:**
> Show HN: Treats – Train Claude Code Like a Puppy (Plugin Hooks Make It Learn). Install plugin → `/treats:bad` → Claude sees feedback in next prompt → adjusts. Behavioral loop + pick-your-animal theme.

**For Product Hunt:**
> Treats: Train Claude Code Like a Pet. Reward and punish it (it actually learns). Pick your animal theme. A Claude Code plugin that makes AI feedback loops fun and effective.

**For Reddit:**
> Just shipped Treats—a Claude Code plugin that trains Claude like a pet. Your feedback actually changes its behavior. Pick your animal buddy. Video, GitHub, feedback welcome.

---

## Final Notes

- **Solo maintainer, small budget:** You have speed and focus as advantages. Ship fast, respond to feedback faster, build a small-but-loyal community.
- **The animal angle is your differentiator:** BadClaude was a meme. Treats is a meme wrapped around substance, with an extra layer of personality. People will pick their favorite animal and stick with it.
- **The money shot:** That demo video showing `/treats:bad` → Claude adjusts → animal ranks up is your differentiator. Make sure the status-line walk is crystal clear.
- **Momentum matters:** First 48 hours are critical. Be online, engage with every comment and question. This wins hearts.
- **Long tail:** After the spike, settle in for a slow-burn SEO game and indie-dev community word-of-mouth. The tool is genuinely useful (Claude does adjust), so it'll find an audience. The animal theme makes it memorable.

Good luck. You've built something with real substance wrapped in meme energy and genuine personality. That's the sweet spot.
