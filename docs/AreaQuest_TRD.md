# AreaQuest — Grade 8 · Area and Perimeter (TRD)

**Companion to:** `AreaQuest_PRD.md` · **Repo name:** `G8-AreaQuest-main` · **Package name:** `area-quest`
**Clone source:** `angle-on-line-g7-main` (the shipped Grade 7 AngleQuest build, user-supplied). The TRD blueprint allows a newer sibling module as the clone source, and this one overrides the default `G2-Money-Money-main`.
**Section order (per blueprint):** 1 Reference Analysis Notes → 2 Tech Stack → 3 Folder Structure → 4 State Management → 5 Component Specs → 6 Data Layer → 7 Simulate Station Specs → 8 Audio Pipeline → 9 Gamification → 10 Design Tokens & Viewport → 11 Build/Deploy → 12 QA Plan → 13 Delivery Checklist → 14 Risks.

---

## 1. Reference Analysis Notes

The reference was read file by file (about 7 500 lines of source). It is a polished, working build with a good visual system, but it has real defects, and its own `docs/AngleQuest_TRD.md` describes several things it does not actually do. The rule applied throughout: **take UI/UX, layout, viewport and chrome patterns from the reference; where the code contradicts the PRD/TRD blueprints or is simply broken, fix it in AreaQuest and do not clone the defect.**

Everything below was found by reading the code. **Nothing has been executed**: I have not built or run the reference. Items marked *verify* need a browser check during the QA walkthrough (§12).

### 1.1 Blueprint §1 gotcha check, against the actual repo

| # | Gotcha | Finding | Action |
|---|---|---|---|
| 1 | Dead duplicate `src/features/*` | **Not present.** | Nothing to avoid. |
| 2 | Hardcoded story-panel count | **Already fixed.** `StoryPhase.jsx` and the reducer use `STORY_PANELS.length`. | Keep dynamic (6 panels). |
| 3 | Static vs procedural bank | Procedural (`generateQuestion(world, i, rng)`), but no ladder, weak QA (§1.2 D14). | Keep procedural; rebuild per §6.5 with an exact-arithmetic layer and a stricter stress test. |
| 4 | Viewport clipping | **Partly fixed, partly not.** `globals.css` uses `100dvh` and `--header-h` is measured by `useHeaderHeight`. But every card still caps itself with `max-h-[94vh]` / `92vh` / `90vh` / `62vh` / `32vh`, and `App.jsx` plus `CelebrationScreen` still use `w-screen h-screen`. | Fix per §10. |
| 5 | Leftover branding | `index.html` is correct for G7, but `IntroScreen` says "Grade 7 · Geometry", `CelebrationScreen` says "Singapore MOE Grade 7 Geometry Mastered!", and `docs/audio_generation_pipeline.md` still describes a *Place Value* module. | Rewrite all three (§11). |

### 1.2 Defect register (reference code → what AreaQuest does)

| ID | Severity | Defect (file) | Fix in AreaQuest |
|---|---|---|---|
| D1 | **High** | **Boss Battle never opens.** In `PlayPhase.startWorldSession`, boss mode calls `setShowBossIntro(true)` but never sets `activeWorld`. The modal then receives `DISTRICTS[null]?.boss` (undefined) and returns `null`, so clicking a world in Boss mode does nothing. Even if it rendered, `onStart` calls `setActiveWorld(activeWorld)` with the same null. | Add `pendingWorld` state. The modal reads `DISTRICTS[pendingWorld].boss`, and `onStart` sets `activeWorld = pendingWorld` and plays `bossStartNarration` (§5). |
| D2 | **High** | **Only 3 of 8 badges can ever unlock.** `PlayPhase` calls `checkBadges` with only `totalCorrect, streak, bestStreak, totalAnswered, badges`. It reads `onUpdateScore.totalCorrect`, which is a property of a *function* and so always undefined (`totalCorrect` is always 1, so `answered_20` never fires). `simCompleted`, `worldResults`, `bossesDefeated` and `journeyComplete` are never passed, so `sim_all`, `world_3star` and `boss_won` can never fire. | Evaluate badges **inside the reducer** on the full next state (§4, §9). `PlayPhase` stops calling `checkBadges`. |
| D3 | **High** | **Station D is not the Error-Detective.** `SimulatePhase` imports `RadiantPointLab` (a 360° explorer) as Station D. `CaseFileDetective.jsx` (the actual error-detective) is imported nowhere. The README claims it is Station D. | Station D is `SiteAuditDetective` (§7.4), wired in and tested. |
| D4 | **High (security)** | **`.env.local.example` contains what looks like a real ElevenLabs API key.** | **Do not clone this file.** Ship a placeholder-only `.env.local.example`. **Rotate the exposed key** and remove it from any repo history it was committed to. The key is deliberately not repeated in this document. |
| D5 | Medium | **Question narration never plays.** `PlayPhase` does not import `playQuestionNarration` or `bossStartNarration`, so only correct/wrong/hint/world-complete/boss-win lines are voiced. | Wire both, and add a 🔊 replay button on each question (§5, §8). |
| D6 | Medium | **Narration text is hand-written separately from the on-screen text**, e.g. Story panel 1's spoken text differs from `STORY_PANELS[0].text`. This breaks the blueprint's strict 1:1 parity rule. | Narration is **derived** from the on-screen strings through one `speak()` function (§8.2). |
| D7 | Medium | **`speak()` and `numberToWords()` cannot handle this topic.** `numberToWords` returns digits for values ≥ 1 000, and `parseInt` silently drops decimals. The degree regex `(\d+)°` would mangle "78.5". There is no unit, currency, fraction or π handling. | Rewrite (§8.2). Decimals, thousands, units, π, fractions and currency are covered by golden tests (§12.3). |
| D8 | Medium | **Sound effects triple-fire.** A global capture-phase click listener in `App.jsx` plays the click sound for every button, and `QuestionRenderer` and `PlayPhase.handleOptionSelect` also call `playClickSound()`. | Keep only the global listener; delete the explicit calls. |
| D9 | Medium | **Star thresholds applied to raw counts.** `calcStars(correctCount)` is used for every mode, so 5-question modes (Guided, Boss) can never exceed 1★ and the 8-question Timed mode never exceeds 2★. | Scale to a /10 basis: `calcStars(Math.round(10 × correct ÷ total))` (open question PRD §14e). |
| D10 | Medium | **Touch dragging is broken.** SVG drag handlers use `onPointerDown` with no `setPointerCapture` and no `touch-action: none`, plus a dead `e.touches` fallback (pointer events have no `touches`). On touch devices the page scrolls instead of the handle moving. | `touch-action: none` on every draggable SVG, `setPointerCapture`, and `getScreenCTM().inverse()` conversion (§7). |
| D11 | Medium | **Touch targets and text are too small.** The slider −/+ buttons are 32 px (`w-8 h-8`), and several captions use `text-[10px]` / `text-[11px]`. | Minimum 44 px targets and 14 px text in Simulate and Play; a lint-style grep in CI bans `text-[1` and `w-8 h-8` on buttons. |
| D12 | Low | **Reducer is mostly dead code.** `NEXT_STORY_PANEL`, `PREV_STORY_PANEL`, `ADVANCE_SIM_STATION`, `PREV_SIM_STATION`, `LOAD_QUESTIONS`, `USE_HINT`, `CLEAR_FEEDBACK`, `PREV_QUESTION`, `NEXT_QUESTION` are never dispatched. Story, Simulate and Play keep this state in local component state. `INITIAL_STATE.mode/worldIdx/questionIdx/questions/lives/hintsUsed/attempts` are also unused. | Delete them (a **documented, reversible deviation** from TRD blueprint §2.3, which says to keep the full action set). §4 lists what stays. |
| D13 | Low | **Impure reducer.** `TOGGLE_AUDIO` calls `setMuted()` inside the reducer; React StrictMode double-invokes reducers. | Sync with a `useEffect` on `state.audioEnabled`. |
| D14 | Low | **Weak stress test.** `scripts/stress_test_bank.js` accepts ≥ 7 distinct question texts per world (the PRD says 10), never recomputes an answer, and tests `generateBank` while Play uses `generateQuestion` directly. | Rebuild per §12.1 (independent recomputation; Play and test share one code path). |
| D15 | Low | **Story images:** the six `story_N.png` files are actually JPEG data, duplicated as `story_N.jpg` (about 9.4 MB for 12 files). | One true PNG per panel, 1024×1024. |
| D16 | Low | **Unused code and dependencies.** `useViewport.js` and `useAudio.js` are never imported. `framer-motion` and `lucide-react` are in `package.json` but never imported. `dotenv` and `node-fetch` are listed but the scripts use Node's global `fetch`. `.oxlintrc.json` exists but `oxlint` is not installed and there is no `lint` script. | Use or delete each (§2). |
| D17 | Low | **`/api/elevenlabs` does not exist.** With no client key, `audio.js` posts to this path, which 404s and silently returns `null`. | Ship the serverless proxy (§8.4) or accept silent skipping; the proxy is recommended. |
| D18 | Low | **`docs/audio_generation_pipeline.md` is stale.** It describes a different module and refers to `speak`/`preloadNarration` functions that do not exist in `audio.js`. | Rewrite for AreaQuest. |
| D19 | *Verify* | **Narrow viewports.** The top navigation (Home + five labelled phase pills + mute + close) very likely overflows at 390 px width. Nothing in the code collapses it below `sm`. | Compact mode below 640 px (§10). Confirm in the 390×844 and 844×390 checks. |

### 1.3 Reference patterns explicitly **adopted**
The glass-card / phase-band visual system and phase colour tokens; fluid `clamp()` type and spacing scale; the `TopNav` capsule with numbered phase pills, mute pill, Home/Close buttons and the "reset progress?" confirmation (already in the reference); the Story carousel with progress track in the header; the Simulate 2-column shell; the `Panel / Node / Msg / GoldBtn / GhostBtn` kit; the practice stats bar (⭐ ❤️ 🔥 ✨); the world-select grid with "unlock if previous world ≥ 1★"; `canvas-confetti` on completion; the `say/ask/cheer/emphasize/think/instruct/celebrate` segment helpers; the static-map → live-fetch → next-segment-preload audio queue; the seeded Mulberry32 `rng.js`; `generate_audio.js` deriving its phrase list from `getAllNarration()` (better than the blueprint's hand-kept array); `generateBank(seed)`; and the `getScreenCTM` pointer maths.

---

## 2. Tech Stack

```json
{
  "name": "area-quest",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=20.19" },
  "scripts": {
    "dev": "vite", "build": "vite build", "preview": "vite preview",
    "generate-audio": "node scripts/generate_audio.js",
    "clean-audio": "node scripts/clean_audio.js",
    "test:bank": "node scripts/stress_test_bank.js",
    "test:audio": "node scripts/test_audio_parity.js",
    "lint": "oxlint"
  },
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "framer-motion": "^12.42.0",
    "lucide-react": "^1.22.0",
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.2",
    "autoprefixer": "^10.5.2",
    "oxlint": "^1.69.0",
    "postcss": "^8.5.16",
    "tailwindcss": "^3.4.4",
    "vite": "^8.1.0"
  }
}
```

**Decisions and evidence**
- Versions follow TRD blueprint §2.1. I checked the npm registry: `react` 19.3.0, `vite` 8.3.3, `@vitejs/plugin-react` 6.1.2, `lucide-react` 1.53.0 and `oxlint` 1.87.0 all exist, so the ranges resolve. I have **not built against them**. The reference actually ships React 18.3.1 / Vite 5.4.14 / framer-motion 11 / lucide 0.475, which is the known-good fallback (§14 R1).
- **Tailwind must stay on v3.** The registry's latest is 4.3.3, but the config, `@tailwind` directives and PostCSS setup are v3-style. `^3.4.4` holds it there. Do not "upgrade".
- `framer-motion` and `lucide-react` are kept (blueprint-fixed) **but must be used**: `framer-motion` for `FeedbackOverlay`, `BossBattleModal` and the badge toast enter/exit; `lucide-react` for `kit.jsx` button icons (`Minus`, `Plus`, `Check`). If either is unused at the end of the build, remove it.
- `dotenv`, `node-fetch`, `@types/react`, `@types/react-dom` are dropped (not used by any script or file). Deviation from blueprint §2.1, noted here.
- `canvas-confetti` kept (used on Reflect/Celebration). `oxlint` added so the existing `.oxlintrc.json` actually runs.
- `vite.config.js`: `base: '/'`, `server.port 3000`. `tailwind.config.js`: keep `fontFamily`, `fontSize` overrides (these already make `text-xs` = 14 px, which §10 relies on) and the colour map. `postcss.config.js`: as-is. `vercel.json`: keep the rewrite `"/((?!assets/|api/).*)"` → `/`.

---

## 3. Folder Structure

The reference's real layout is used (it differs slightly from the blueprint skeleton: hooks live in `src/hooks/`, there is no `ProgressMap`, and `KingdomMap` is the world map).

```
G8-AreaQuest-main/
├── api/elevenlabs.js                      # NEW: serverless TTS proxy (§8.4)
├── public/
│   ├── favicon.svg                        # reskin (ruler/plot glyph)
│   └── assets/{audio/ (.gitkeep), story/story_1.png … story_6.png}   # 1024×1024 true PNG
├── scripts/
│   ├── generate_audio.js                  # as-is (phrases = getAllNarration())
│   ├── clean_audio.js                     # as-is
│   ├── stress_test_bank.js                # REWRITE (§12.1)
│   ├── test_audio_parity.js               # NEW (§12.3)
│   └── make_story_placeholders.js         # NEW: writes the 6 placeholder PNGs (replaces generate_story_art.js)
├── src/
│   ├── components/
│   │   ├── TopNav.jsx                     # MODIFY: labels, compact mode
│   │   ├── IntroScreen.jsx                # MODIFY: copy, Grade 8 · Measurement
│   │   ├── shared/  AreaVisual.jsx (NEW) · FloatingSymbols.jsx (reskin) · Mascot.jsx · FeedbackOverlay.jsx
│   │   ├── gamification/  KingdomMap.jsx · StarRating.jsx · BadgesModal.jsx
│   │   ├── quiz/  QuestionRenderer.jsx · BossBattleModal.jsx
│   │   ├── phases/  WonderPhase · StoryPhase · SimulatePhase · PlayPhase · ReflectPhase
│   │   └── simulations/
│   │       ├── ShapeShifterLab.jsx        # A · Concept Discovery
│   │       ├── FenceAndFill.jsx           # B · Build-to-Target
│   │       ├── ParkPlanBuilder.jsx        # C · Composite Construction
│   │       ├── SiteAuditDetective.jsx     # D · Error-Detective
│   │       ├── kit.jsx                    # Panel/Node/Msg/GoldBtn/GhostBtn + StepSlider
│   │       └── Stations.css
│   ├── config/  worlds.config.js · characters.config.js · audio.config.js
│   ├── hooks/   useHeaderHeight.js · useViewport.js (now used)      # useAudio.js deleted
│   ├── data/    storyContent.js · questionBank.js
│   ├── utils/   audio.js · audioMap.js(auto) · narration.js · speak.js (NEW) · badgeEngine.js
│   │            scoring.js · shuffle.js · rng.js · areaMath.js (NEW)
│   ├── styles/  design-tokens.css · globals.css
│   ├── App.jsx · main.jsx · index.css
├── docs/  AreaQuest_PRD.md · AreaQuest_TRD.md · audio_generation_pipeline.md (rewritten)
├── index.html · package.json · vite.config.js · tailwind.config.js · postcss.config.js
├── vercel.json · .oxlintrc.json · .gitignore · .env.local.example (placeholder only) · README.md
```
Do **not** create `src/features/`. Delete from the clone: `AngleVisual.jsx`, `ProtractorWorkshop.jsx`, `MatchTheMissingAngle.jsx`, `IntersectionPuzzle.jsx`, `RadiantPointLab.jsx`, `CaseFileDetective.jsx`, `angleMath.js`, `useAudio.js`, `generate_story_art.js`, all `story_*.jpg`, and every existing `audio_*.mp3` plus the generated `audioMap.js` contents.

### 3.1 File disposition

| Reference file | Action |
|---|---|
| `main.jsx`, `index.css`, `postcss.config.js`, `vercel.json`, `.gitignore`, `audio.config.js`, `useHeaderHeight.js`, `StarRating.jsx`, `shuffle.js`, `rng.js`, `clean_audio.js`, `generate_audio.js` | Reuse as-is |
| `App.jsx` | Modify (§4) |
| `TopNav`, `IntroScreen`, `WonderPhase`, `StoryPhase`, `SimulatePhase`, `PlayPhase`, `ReflectPhase`, `QuestionRenderer`, `BossBattleModal`, `FeedbackOverlay`, `Mascot`, `FloatingSymbols`, `KingdomMap`, `BadgesModal`, `kit.jsx`, `Stations.css`, `worlds/characters.config.js`, `storyContent.js`, `narration.js`, `audio.js`, `scoring.js`, `badgeEngine.js`, `design-tokens.css`, `globals.css`, `index.html`, `README.md`, `vite/tailwind` configs | Modify (§5–§11) |
| `AngleVisual` → `AreaVisual`; `angleMath` → `areaMath`; four stations; `questionBank.js`; `stress_test_bank.js` | Replace / rewrite |
| listed in "Delete" above | Delete |

---

## 4. State Management (`App.jsx`)

`useReducer`, pure. Kept actions (the ones the reference actually dispatches, plus one new): `SET_PHASE`, `COMPLETE_SIM_STATION`, `ANSWER_CORRECT`, `ANSWER_INCORRECT`, `UPDATE_WORLD_RESULT`, `UNLOCK_BADGE`, `COMPLETE_PHASE`, `TOGGLE_AUDIO`, `RESET_SESSION`, and **new** `CLEAR_BADGE_TOAST`. The nine dead actions listed in D12 are removed.

State: `phase, simCompleted[4], worldResults[10], xp, streak, bestStreak, totalCorrect, totalAnswered, bossesDefeated, badges[], toastBadges[], audioEnabled, journeyComplete`.

Rules:
- **Badge evaluation in the reducer (fixes D2).** Wrap the base reducer: `const next = base(state, action); const fresh = checkBadges(next); return fresh.length ? { ...next, badges: [...next.badges, ...fresh.map(b => b.id)], toastBadges: [...next.toastBadges, ...fresh] } : next;`. Because `checkBadges` sees the real `simCompleted`, `worldResults`, `bossesDefeated`, `totalAnswered` and `journeyComplete`, all 8 triggers can fire. `PlayPhase` shows `toastBadges[0]` in `FeedbackOverlay` and dispatches `CLEAR_BADGE_TOAST` on "Next". The badge toast is also shown after Simulate (sim_all) and Reflect (journey_complete).
- **Streak** increments on `ANSWER_CORRECT`, resets on `ANSWER_INCORRECT`; `bestStreak = max(bestStreak, streak)`. Never derived from stars.
- **`totalAnswered`** counts Practice answers only (the reference does too). Simulate-station checks do not count.
- **World unlock** is one exported function, `isWorldUnlocked(idx, worldResults)`, in `worlds.config.js` (world 0 always open, otherwise previous world ≥ 1★), used by `KingdomMap` **and** `PlayPhase` (the reference only checks in the map's click handler).
- **Audio mute** is synced with `useEffect(() => setMuted(!state.audioEnabled), [state.audioEnabled])`, not inside the reducer (D13).
- `RESET_SESSION` keeps `audioEnabled`; `TopNav`'s existing confirmation modal is kept (the reference already guards Home/Close when `hasProgress`).
- The global click-sound listener stays in `App.jsx` and is the **only** place `playClickSound` is called (D8).

---

## 5. Component Specs

- **TopNav** — as reference, with: copy ("Plan Sheet i of N" in the story progress row); a **compact mode below 640 px** (phase pills collapse to number + icon only, "Home" and "Sound On" labels hidden, tap targets ≥ 44 px); confirm-reset modal copy changed to "Keep Planning" / "Confirm Reset". Header height is already published as `--header-h` by `useHeaderHeight`.
- **IntroScreen** — pill "✨ Grade 8 · Measurement"; title "Area & Perimeter"; subtitle about planning Sunrise Park with Architect Tally; the three feature cards become "Shape Rules / Simulations / 10 Park Zones". No "Zara", "Angle", "Detective" strings remain (§13 grep).
- **WonderPhase** — "The Fence Dilemma" (PRD §7.1): two `AreaVisual type="rect"` plots side by side, labelled 25 m × 5 m and 15 m × 15 m, a callout "Both use 60 m of fence. Same space?", Tally speech bubble. Area values are *not* shown.
- **StoryPhase** — reference carousel, 6 panels, `image` with `imageBg`/`imageEmoji` fallback if the image fails. Labels: "Plan Sheet {n} of {N}", final button "Enter the Site Lab", others "Next Plan Sheet". Card cap uses the shared dvh-based class (§10).
- **SimulatePhase** — reference shell with `STATIONS` = the four new stations, in order A–D. Tabs stay freely clickable; the "Go to Practice" CTA stays gated on `simCompleted.every(Boolean)`. **Below 768 px** the left column becomes a horizontal, scrollable icon-tab strip with the CTA pinned beneath the station, so the station body is not pushed off-screen. Station completion dispatches `COMPLETE_SIM_STATION` with the station index.
- **PlayPhase** — mode picker (4 modes, PRD §5) → world map → quiz. Changes from the reference: `pendingWorld` for Boss (D1); question narration + replay button (D5); stars scaled to /10 (D9); no `checkBadges` call (D2); `isWorldUnlocked` enforced; Guided uses ladder positions 0–4, Boss 5–9, Independent 0–9, Timed 8 random of 0–9 (via `generateWorldSet`, §6.5); session ends in Timed when the 60 s expire, with unanswered questions counted wrong against the 8.
- **QuestionRenderer** — as reference with `AreaVisual` in place of `AngleVisual`, concept pill icon 📏, the diagram box capped at `min(32dvh, …)` with a minimum height of 160 px, a 🔊 "Listen again" button, and 44 px option buttons.
- **BossBattleModal** — copy ("BOSS DETECTED", "Site Boss") and it uses its `lives` prop instead of the hard-coded 3 hearts.
- **FeedbackOverlay** — copy changed ("Plan Approved!", "Let's Recheck"); `framer-motion` enter/exit; shows `toastBadges[0]` when present.
- **KingdomMap** — as reference; drop the inner `max-h-[62vh]` and let the flex parent scroll; import `isWorldUnlocked`.
- **ReflectPhase** — recap, scorecard and reflection as reference, with the 3 new recap questions (§5.1), the strip label "ZONE RESULTS", the textarea prompt "Explain the difference between perimeter and area to Architect Tally", and the celebration screen copy rewritten (no Grade 7 text).

### 5.1 Reflect recap (targets perimeter vs. area, perpendicular height, and units, the same misconceptions as Station D)
1. *"Two rectangles both have a perimeter of 24 m. Which statement must be true?"* → **They can have different areas** / They must have the same area / The longer one has the smaller perimeter / Area is found by adding the sides. *(8 m × 4 m has area 32 m²; 6 m × 6 m has area 36 m².)*
2. *"A parallelogram has a base of 12 cm, a slanted side of 13 cm and a perpendicular height of 5 cm. Mei Ling writes area = 12 × 13 = 156 cm². What is wrong?"* → **She used the slanted side; the area is base × perpendicular height = 12 × 5 = 60 cm²** / She should have added 12 and 13 / She should have halved 156 / Nothing is wrong.
3. *"A tile is 50 cm by 50 cm. Hafiz says its area is 2 500 cm², which is 25 m². What is wrong?"* → **1 m² = 10 000 cm², so 2 500 cm² is 0.25 m²** / 1 m² = 100 cm² so 25 m² is right / The area should be 200 cm² / Area is measured in metres, not square metres.

---

## 6. Data Layer

### 6.1 `config/worlds.config.js`
Ten entries, shape `{ id, name, emoji, accent, description, conceptFocus, boss: { name, emoji, reward } }`, verbatim from PRD §8. Also exports `isWorldUnlocked(idx, worldResults)`.

### 6.2 `config/characters.config.js`
```js
export const CHARACTERS = {
  hafiz:   { name: 'Hafiz',    role: 'Junior Park Planner', emoji: '👦', colour: '#38bdf8', mascotEmoji: '🦉', bio: '…' },
  meiling: { name: 'Mei Ling', role: 'Junior Park Planner', emoji: '👧', colour: '#f472b6', mascotEmoji: '🦉', bio: '…' },
  tally:   { name: 'Architect Tally', role: 'Chief Architect & Mentor', emoji: '🦉', colour: '#facc15', mascotEmoji: '🦉', bio: '…' },
};
export const MASCOT = { name: 'Tally', title: 'Architect Tally', emoji: '🦉', badge: 'Sunrise Park Studio' };
```

### 6.3 `data/storyContent.js`
`STORY_PANELS`, **length 6**, titles/concepts per PRD §7.2, shape `{ panel, id, title, text, highlight, character, characterEmoji, image, imageBg, imageEmoji, bubble }` (the reference's shape, which already carries `image`, `highlight` and `bubble`). On-screen text may contain `m²`, `½`, `π` and digits. **Narration is derived from these fields via `speak()`** (§8.2), never hand-written separately.

### 6.4 `utils/areaMath.js`: single source of maths truth
Pure functions used by the generator **and** by all four stations. All arithmetic is **exact**: decimals are held as integer hundredths and π as a rational, so no floating-point artefacts reach the screen.

```js
// ---- exact numeric layer -------------------------------------------------
export const PI = { frac: { num: 22, den: 7, label: '22/7' }, dec: { num: 314, den: 100, label: '3.14' } };
export const piFor = r => (r % 7 === 0 ? PI.frac : PI.dec);       // THE π rule (PRD §8.2)
export const toH = x => Math.round(x * 100);                       // → integer hundredths
export const fmtNum = h => { /* integer hundredths → '78.5', '121.12', '126'; ≥ 10000 → narrow-space grouped */ };
export function exact2dp(numerator, denominator) {                // returns hundredths or THROWS
  const h = (numerator * 100) / denominator;
  if (!Number.isInteger(h)) throw new Error('not exact to 2 dp');
  return h;                                                       // generator catches and re-draws
}

// ---- formulas (all return hundredths) ------------------------------------
export const rectArea = (l, w) => toH(l * w);
export const rectPerimeter = (l, w) => toH(2 * (l + w));
export const triangleArea = (b, h) => exact2dp(b * h, 2);          // throws if b*h odd → re-draw
export const parallelogramArea = (b, h) => toH(b * h);
export const trapeziumArea = (a, b, h) => exact2dp((a + b) * h, 2);
export const kiteArea = (d1, d2) => exact2dp(d1 * d2, 2);
export const circumference = (r, pi) => exact2dp(2 * pi.num * r, pi.den);
export const circleArea = (r, pi) => exact2dp(pi.num * r * r, pi.den);
export const arcLength = (r, theta, pi) => exact2dp(theta * 2 * pi.num * r, 360 * pi.den);
export const sectorArea = (r, theta, pi) => exact2dp(theta * pi.num * r * r, 360 * pi.den);
export const SECTOR_ANGLES = [90, 180, 270];
```
Every circle formula is written the same way: multiply out in integers, divide once, and assert the result is a whole number of hundredths. **If any candidate throws, the generator re-draws; a question is never emitted with an inexact value.** This is the single enforcement point for the PRD §8 clean-number rules. Exhaustive checking (r = 1–40) confirmed that with π = 3.14 every full-circle and semicircle value and every arc length is exact at 2 dp for any integer radius, and quadrant/sector areas at 90° and 270° need an **even** radius. With π = 22/7 (r a multiple of 7) arcs are whole numbers and sector areas are whole numbers or end in .5. The draw lists therefore need no special-casing; they simply reject whatever `exact2dp` rejects.

```js
export const TRIPLES = [[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20],[15,20,25],[7,24,25]];
export const UNIT = { m_cm: 100, m2_cm2: 10000, cm2_mm2: 100 };
export const REASONS = { perimeterVsArea: '…', perpHeight: '…', half: '…', diameter: '…', arcPlusDiameter: '…', outerEdges: '…', unitSquare: '…' };

// ---- geometrically consistent figure generators (take a seeded rng) -------
export function genParallelogram(rng)   // { b, h, slant, offset } from a triple: slant² = h² + offset²
export function genTrapezium(rng, { needLegs })   // legs from a triple when perimeter is asked
export function genKite(rng) / genRhombus(rng)    // diagonals d1, d2; rhombus side from a triple on (d1/2, d2/2)
export function genComposite(rng, kind)           // 'rect+semi' | 'L' | 'rect-triangle' | 'rect-semi'
//   → { components:[{id,shape,dims,area,op:'add'|'sub'}], edges:[{id,len,outer,label}], totalArea, perimeter, pi }
export function genRectilinear(rng)               // L / U / notch shapes; perimeter == bounding-box perimeter for notches
export function makeDistractors(correct, misconceptions, rng, count = 3)   // dedupe AFTER fmtNum; reject ≤ 0, equal to correct
```

**Validators** (asserted by the stress test on every question's `visualData`):
`validateParallelogram({b,h,slant,offset})` → `slant² === h² + offset²`; `validateTrapezium` (same relation for each leg); `validateComposite` → area equals the component sum/difference, `perimeter` equals the sum of edges with `outer: true` only, and no internal edge is `outer`; `validateRectilinear`; `validateCircleSet` → π stated, π rule respected, `exact2dp` passes; `validateUnits` → the stated unit matches the quantity (length → cm/m, area → cm²/m²).

**Hard rules:** (1) dimensions are integers (2–40 by default); (2) every circle value passes `exact2dp`; (3) slanted sides, legs and diagonals' sides come from `TRIPLES`, never independent random numbers; (4) composite figures are built **from components**, so area and perimeter are consistent by construction and re-asserted; (5) every option string passes through `fmtNum` **before** de-duplication.

### 6.5 `data/questionBank.js`
Exports: `generateBank(seed)` → 100 questions; `generateWorldSet(worldIdx, positions, rng)` → the questions for a Practice session (**the same code path the stress test exercises**); `DISTRICTS` derived from `WORLDS` (`{ id, name, icon, accent, conceptFocus, description, boss }`, as the reference). Fixed schema: `{ id, districtId, category, visual, questionText, options[4], correctAnswer, explanation, hint1, hint2, visualData }`.

Each template is a pair `{ build(rng, ladderPos) → question, solve(visualData) → correctAnswerString }`. **`solve` recomputes the answer from `visualData` alone** and is what the stress test compares against (§12.1). Within a world, templates are placed on an easy→hard ladder (position 0–9); a world's 10 questions must have 10 distinct `questionText`s.

| World | Templates (≥ 2 each) | Misconception distractors |
|---|---|---|
| 0 Fenceline Fields | rectangle/square perimeter; perimeter of an L-shape (bounding-box trick); missing side from perimeter | area (l × w); `l + w`; `2l + w`; forgetting one side |
| 1 Tile Terrace | rectangle/square area; missing side from area; cm² ↔ m² conversion; mm² ↔ cm² | perimeter; ×100 instead of ×10 000; ÷ instead of ×; area with the wrong unit |
| 2 Triangle Trail | area with given b, h; right triangle; **obtuse triangle (height outside the base)**; missing height/base | forgot ½ (`b × h`); `½ × b × side`; `b + h`; doubled |
| 3 Slant Plaza | area (slanted side given as a distractor); perimeter from base + slant; missing height | `b × slant`; `½ b h`; perimeter used for area; `b + h` |
| 4 Trapezium Terrace | trapezium area; missing parallel side; **kite/rhombus area from diagonals**; rhombus perimeter | forgot ½; `a × b × h`; used one parallel side only; `d1 × d2` (no ½) |
| 5 Pond Plaza | circumference from r or d; area from r or d; "which formula" | diameter used as radius; `πr` for area; `πd²`; circumference ↔ area swap |
| 6 Sector Garden | semicircle perimeter/area; quadrant perimeter/area; arc length; sector area (θ = 90/180/270) | **semicircle perimeter missing the diameter**; full-circle value; ½ vs ¼ swapped; quadrant perimeter missing both radii |
| 7 Composite Courtyard | area (add/subtract); perimeter (outer edges only); rect + semicircle; L-shape; rect − triangle cut-out | internal edge counted; added when it should be subtracted; forgot the arc; area of one component only |
| 8 Project Planner's Office | cost of fencing (perimeter × rate); cost/number of tiles (area ÷ tile area, with unit conversion); "find x" (linear, integer x) | used area for fencing; unit slip in tile count; forgot to divide; solved `x + k` wrongly |
| 9 Grand Finale | weighted draw from worlds 0–8 templates (ladder 5–9 of each) plus **2 simple-algebra items** | as the source template |

Each question fills `explanation` (states the value, the formula **and** the reason in words, using `REASONS`), `hint1` (names the formula or first step), `hint2` (shows the arithmetic with the numbers), and `visualData` (§6.6). Seeded PRNG (`utils/rng.js`, Mulberry32) for reproducible tests; runtime uses a random seed.

### 6.6 `shared/AreaVisual.jsx`
`<AreaVisual type data compact />`, pure SVG, colours from CSS variables only (never hex literals). Every length carries a **text label with its unit**; the perpendicular height is a dashed line with a right-angle marker; internal/hidden edges are drawn dashed and labelled "inside" (not colour alone). `compact` shrinks stroke and labels for the Play inline context. The SVG scales with `viewBox` and `preserveAspectRatio="xMidYMid meet"`.

| `type` | `data` | Renders |
|---|---|---|
| `rect` | `{ l, w, unit, show: ['perimeter'|'area'], unknown? }` | labelled rectangle (optionally gridded) |
| `rectilinear` | `{ edges:[…], unit }` | L/U/notch outline with every outer edge labelled |
| `triangle` | `{ b, h, kind:'acute'|'right'|'obtuse', unit }` | triangle with the base and the dashed perpendicular height (foot outside the base for obtuse) |
| `parallelogram` | `{ b, h, slant, offset, unit }` | slanted sides labelled, dashed perpendicular height |
| `trapezium` | `{ a, b, h, legs?, unit }` | parallel sides marked, height dashed |
| `kite`, `rhombus` | `{ d1, d2, side?, unit }` | diagonals drawn and labelled |
| `circle`, `semicircle`, `quadrant`, `sector` | `{ r, d?, theta?, unit, pi }` | radius/diameter marked; arc highlighted; π value shown in a caption |
| `composite` | `{ components:[…], edges:[…], unit }` | components tinted, outer boundary solid, shared edges dashed |
| `tile-grid`, `park-plan` | context-specific | tiling and plan illustrations for worlds 1, 8 |

---

## 7. Simulate Station Specs

**Contract (all four):** `<Station onComplete={fn} audioEnabled={bool} />`; self-contained state; SVG visuals styled with CSS variables; a `station-success` panel with a **"Complete Station ✓"** button calling `onComplete`.
**Interaction rules (all four, fixes D10/D11):**
- Every draggable SVG sets `style={{ touchAction: 'none' }}`, calls `setPointerCapture` on pointer down, and converts pointer position with `svg.getScreenCTM().inverse()`.
- Every slider has **−/+ buttons (≥ 44 × 44 px)** and arrow-key control on the focused handle (`role="slider"`, `aria-valuenow/min/max`, `aria-label`; `Shift` = larger step).
- All readouts are text (`aria-live="polite"`), not colour alone. Minimum text size 14 px.
- Cases are drawn with `createRNG` seeded per mount (not `Math.random`), so tests can seed them.

**A · `ShapeShifterLab` (Concept Discovery).** Three tabs: *Parallelogram*, *Triangle*, *Trapezium*. SVG `viewBox="0 0 480 300"`.
- *Parallelogram tab:* fixed base `b = 8 cm`, height `h = 5 cm`, shear offset slider `s = 0…8` (step 1). The shape is the rectangle sheared by `s`; a ghost rectangle and a coloured triangle that visually "moves" from one end to the other show the cut-and-move proof. Readouts: `base × height = 8 × 5 = 40 cm²` (constant), plus the slanted side and perimeter as **display-only values rounded to 1 d.p.** (labelled "not assessed"; Pythagoras is out of scope).
- *Triangle tab:* the parallelogram split along a diagonal into two equal triangles; readout `½ × 8 × 5 = 20 cm²`.
- *Trapezium tab:* a trapezium (a = 4, b = 8, h = 5) and a second copy that flips and joins in 25 % steps via a slider; at 100 % the pair forms a parallelogram of base a + b = 12; readout `½ × (4 + 8) × 5 = 30 cm²`.
- *Gate:* every tab visited with ≥ 2 distinct slider positions each (positions bucketed per tab), **then** the confirmation MCQ appears ("The slanted side got longer but the area stayed 40 cm². Why?" → **"Area depends on the base and the perpendicular height, not the slanted side"**; wrong → `Msg` + retry, no penalty). Complete when the MCQ is answered correctly.

**B · `FenceAndFill` (Build-to-Target).** Three seeded cases, in order:
1. *Fixed perimeter, hit a target area.* `P` even (24–48); the target is `w₀ × (P/2 − w₀)` for an integer `w₀`; the slider is the width `w` (1…P/2 − 1, step 1). Readouts: `length`, `width × length = area`, perimeter (fixed). Both `w₀` and `P/2 − w₀` are accepted (same rectangle turned). After success, a "discovery" `Msg`: *"The square (width = P ÷ 4) holds the most area for this fence."*
2. *Fixed area, hit a target perimeter.* `A` from a curated list with several divisor pairs (36, 48, 60, 72, 96); the slider **snaps to divisors of A** (−/+ jump to the next divisor); the target perimeter is `2(d + A/d)` for one divisor.
3. *Circle.* A radius slider `r = 1…15`, π = 3.14, hit a target area `3.14 × r₀²`.
- Ring colour: amber within 15 % of the target, green on exact match; **"Check" accepts exact only** (tolerance is guidance, not acceptance). Gate: 3 exact successes, each followed by a "New plot" press that draws fresh numbers.

**C · `ParkPlanBuilder` (Composite Construction).** Uses `genComposite` with four kinds (`rect+semi`, `L`, `rect-triangle`, `rect-semi`); each round uses a different kind. Two steps per round:
1. *Area.* Tap a component region → a picker of 4 area values (correct + misconception distractors) → a toggle **Add / Subtract** → the running total updates live. Done when every component is assigned and the total matches `totalArea`.
2. *Perimeter.* Tap edges to select them. Internal/shared edges are drawn dashed and labelled "inside"; tapping one gives a `Msg` ("That edge is inside the figure, so it is not part of the perimeter") and does not select it. Curved edges show their arc length once selected. "Check perimeter" accepts exactly the set of `outer` edges, whose lengths sum to `perimeter`.
- Gate: 2 rounds, each with correct area and perimeter. Targets LO 8.

**D · `SiteAuditDetective` (Error-Detective).** `genAuditCase(rng, errorType)` builds a four-line worked solution (given / formula / calculation / answer) with exactly one seeded error, and 3 candidate corrections (1 correct).

| Error type | Faulty line (example) | Correct fix |
|---|---|---|
| `perimeter-area-swap` | "Perimeter = 12 × 7 = 84 m" | "Perimeter = 2 × (12 + 7) = 38 m" |
| `forgot-half` | "Area = 14 × 9 = 126 cm²" (triangle) | "Area = ½ × 14 × 9 = 63 cm²" |
| `slant-as-height` | "Area = 12 × 13 = 156 cm²" (parallelogram) | "Area = 12 × 5 = 60 cm² (perpendicular height)" |
| `diameter-as-radius` | "Area = 3.14 × 10² = 314 cm²" (diameter 10) | "r = 5, so Area = 3.14 × 5² = 78.5 cm²" |
| `semicircle-no-diameter` | "Perimeter = arc = 22 cm" | "Perimeter = arc + diameter = 22 + 14 = 36 cm" |
| `internal-edge` | composite perimeter includes the shared edge | outer edges only |
| `unit-slip` | "3 m² = 3 × 100 = 300 cm²" | "3 × 10 000 = 30 000 cm²" |

The student taps the faulty line, then picks the fix. Gate: **3 cases, each a different error type** (drawn without replacement from the 7). `solve()` recomputes both the faulty and corrected statements so the "wrong" line is provably wrong and the fix provably right (asserted in tests, §12.2).

`SimulatePhase` wires all four in `STATIONS` (icons 🔄 🎯 🧩 🕵️, names "Station A: Shape Shifter Lab" … "Station D: Site Audit") and gates the CTA on `simCompleted.every(Boolean)`.

---

## 8. Audio Pipeline

### 8.1 Mechanics (from reference)
`utils/audio.js` is kept: `VOICE_ID`, `MODEL_ID`, `STYLE_SETTINGS`, `getAudioUrl` (static map → dynamic fetch, cached), `warmStatic`, the segment queue with next-segment preload, `setMuted`, `stopNarration`, and the helper constructors. **It already has no browser-speech fallback** (the reference's TRD wrongly said it did); confirm with `grep -ri speechSynthesis src` returning nothing. If a URL is null or playback fails, narration continues silently. The synthesised click sound stays.

### 8.2 `utils/speak.js` and `utils/narration.js`
`speak(text)` is rewritten as an ordered pipeline (fixes D6/D7). Order matters: abbreviations → currency → quantities with units → fractions → symbols → remaining decimals → remaining integers.
- Integers up to at least 99 999, spelled in British style ("one thousand, six hundred and twenty"). Grouped digits (`10 000`, `1 620`, `1,620`) are normalised before parsing.
- Decimals: `<integer words> point <digit by digit>`.
- Units are singular for exactly 1: "1 m" → "one metre", "1 m²" → "one square metre".

**Golden cases** (all must pass in `test:audio`):

| On-screen | Spoken |
|---|---|
| `78.5 cm²` | seventy-eight point five square centimetres |
| `121.12 m²` | one hundred and twenty-one point one two square metres |
| `10 000 cm²` | ten thousand square centimetres |
| `$1 620` | one thousand, six hundred and twenty dollars |
| `π = 22/7` | pi equals twenty-two over seven |
| `3.14` | three point one four |
| `½ × 14 × 9 = 63 cm²` | one half times fourteen times nine equals sixty-three square centimetres |
| `r²` | radius squared |
| `x = 5` | x equals five |
| `90°` | ninety degrees |

**Derived, not duplicated (D6):** every narration segment is built as `speak(onScreenString)`:
- Wonder: `say(speak(WONDER.text))`, `ask(speak(WONDER.question))`.
- Story panel *i*: `[say(speak(p.text)), emphasize(speak(p.highlight))]`, from `STORY_PANELS[i]`.
- Station intros: `instruct(speak(STATION_INTROS[i]))` where the same string is displayed in the station header.
- Practice: `ask(speak(q.questionText))`, hints `think(speak(hint1))` / `instruct(speak(hint2))`.

Exported names are the blueprint's: `wonderNarration`, `storyNarration(panel)`, `simStationIntro(stationIdx)`, `playQuestionNarration`, `playCorrectNarration`, `playWrongNarration`, `playHint1Narration`, `playHint2Narration`, `districtCompleteNarration`, `bossStartNarration`, `bossWinNarration`, `reflectNarration`, `reflectCompleteNarration`, plus `getAllNarration()`. `numberToWords` is superseded by `speak.js`.

### 8.3 Generation
`scripts/generate_audio.js` is kept unchanged: `phrases = getAllNarration()` (de-duplicated), 500 ms rate limit, skip-if-exists unless `--force`, rewrites `audioMap.js`. Static: wonder, story, station intros, correct/wrong lines, reflect. **Dynamic** (live ElevenLabs): question text, hints and boss/world names, since they are procedural. Run `npm run generate-audio` then `npm run clean-audio` after content lock. Delete all of the Grade 7 `.mp3`s first.

### 8.4 Key handling and proxy
`VITE_ELEVENLABS_API_KEY`, if set, is embedded in the client bundle; use it for local development only. For production, implement `api/elevenlabs.js` (Vercel serverless) that reads `ELEVENLABS_API_KEY` server-side and forwards `{ text, voiceId, modelId, voice_settings }`; leave the client variable **unset**. This fixes D17 and keeps the key out of the bundle. Dynamic question narration costs ElevenLabs credits per question; the 🔊 replay button reuses the in-memory cache (R3).

---

## 9. Gamification

- `utils/scoring.js`: `calcStars(correct)` → 9–10 → 3, 7–8 → 2, 5–6 → 1, else 0 (unchanged), plus `starsFor(correct, total) = calcStars(Math.round((10 * correct) / total))` (fixes D9). `calcXP({ attempts, hintsUsed, streak })` is kept as in the reference (base 10 − 3 × (attempts − 1) − 2 × hintsUsed, floor 2; streak bonus +2 per step above 2, capped at +10). The blueprint says "copy `calcXP` from G2"; that file was not supplied, so the reference's version is the working implementation (R2).
- `utils/badgeEngine.js`: `checkBadges(state)` unchanged in logic; `BADGES` strings from PRD §9. Trigger keys: `first_correct`, `streak_5`, `streak_10`, `sim_all`, `world_3star`, `boss_won`, `answered_20`, `journey_complete`. Called from the reducer wrapper (§4). Boss win also records the world's reward badge name from `WORLDS[i].boss.reward` for display in the Boss victory screen.
- Boss Battle: 5 questions (ladder 5–9), 3 lives, one per world; lose the last life → session ends, no stars recorded; finish with lives > 0 → `bossWon` and `UPDATE_WORLD_RESULT { stars, bossWon: true }`.
- Reflect scorecard shows `Stars n / 30`.

---

## 10. Design Tokens & Viewport

`styles/design-tokens.css`: keep the reference `:root` tokens unchanged (cosmic background, glass tokens, phase colours, `--world-0…9`, fluid `--space-*` and `--fs-*` clamps). **Replace** the angle tokens with:
```css
:root {
  --area-fill-a:#38bdf8; --area-fill-b:#fb923c; --area-known:#facc15;
  --area-unknown:#f43f5e; --area-ok:#4ade80; --area-hidden:#64748b;   /* internal edges */
  --tap-min:44px; --fs-min:14px;
}
```
**Viewport fixes (mandatory; these complete what the reference started):**
```css
/* globals.css: already has 100dvh on body and .app-container; ADD: */
.card-max { max-height: calc(100dvh - var(--header-h) - 16px); }   /* Story, Sim, Play, Reflect, Badges */
.sim-card, .reflect-card { max-height: calc(100dvh - var(--header-h) - 16px); }   /* keep */
@media (prefers-reduced-motion: reduce) { .floating-bg-item, .fade-in-up, .animate-shake { animation: none; } }
```
- Remove `w-screen h-screen` from the root in `App.jsx` and from `CelebrationScreen`; the `.app-container` class already supplies `100dvh`.
- Replace every `max-h-[94vh]`, `[92vh]`, `[90vh]`, `[62vh]` and `[32vh]` with the `dvh`-based class above (or, for the `KingdomMap` and the question diagram, flex sizing with `min-h-0 overflow-y-auto` and a `min-h` floor).
- Keep inner `overflow-y-auto` regions inside every card so nothing is unreachable on short or small screens. Keep the existing short-viewport compaction (`@media (max-height: 800px)`) but never size text below `--fs-min`.
- `index.html` keeps `viewport-fit=cover`. Use `useViewport` (now consumed) for the `isMobile`/`isShort` switches in `TopNav` and `SimulatePhase` (§5).
- **Test viewports:** 1366×768, 1440×900, 1920×1080, 1024×768 (tablet landscape), 768×1024 (tablet portrait), 390×844 (phone portrait), **844×390 (phone landscape, the shortest)**.
- CI guard: `grep -rEn "text-\[(9|10|11|12|13)px\]|[0-9]+vh\]" src` must return nothing.

---

## 11. Build / Deploy

`npm install && npm run build` from a clean extract; deploy on Vercel (SPA rewrite plus `api/elevenlabs.js`). `index.html`: title "AreaQuest · Grade 8 Maths", description/OG text for the Sunrise Park story, favicon file present (reskin the reference's SVG). Fonts as in the reference (Fredoka One, Nunito, Inter). README: run/build/audio/test commands, module summary, **art brief (PRD §12)**, no mention of browser speech. Rewrite `docs/audio_generation_pipeline.md` for AreaQuest (D18). Placeholder story art is produced by `scripts/make_story_placeholders.js` (six 1024×1024 PNGs with the panel title and emoji), replacing the reference's 683-line angle-specific art generator.

---

## 12. QA Plan

1. **Bank stress test.** `scripts/stress_test_bank.js`: **≥ 300 seeds × 100 questions** (30 000), using `generateBank` **and** `generateWorldSet` (the Play path). Per question assert: schema complete and no empty fields; no `NaN` / `undefined` / `e-` in the serialised question; no number with more than 2 decimal places in any option or text; exactly 4 options, all distinct **after formatting**; `correctAnswer ∈ options`; **`template.solve(visualData)` equals `correctAnswer`** (independent recomputation); the unit matches the quantity (`validateUnits`); `validateParallelogram` / `validateTrapezium` / `validateComposite` / `validateRectilinear` / `validateCircleSet` pass; every circle question states π and obeys the π rule; sector angles ∈ {90, 180, 270}; per world **10 distinct `questionText`s (exactly 10, not the reference's ≥ 7)**; world 9 draws from ≥ 5 different source worlds; ladder positions are monotonic in difficulty tag.
2. **Station tests.** `genAuditCase` for all 7 error types: the faulty line recomputes as wrong, the correct fix recomputes as right, exactly one of three corrections is correct. `genComposite` for all four kinds: `validateComposite` passes. Station B case generators: every drawn target is reachable by an integer slider position; Case 2's divisor list contains the target divisor.
3. **Audio parity.** `scripts/test_audio_parity.js`: (a) every golden case in §8.2 passes; (b) every string returned by a narration helper is either a key in `audioMap` or in an explicit `DYNAMIC_OK` list; (c) **no spoken string contains a digit or any of `° ² ½ π × ÷ = + − / $ %`**; (d) each Story/Wonder/Station narration equals `speak()` of the on-screen field it came from; (e) `grep -ri speechSynthesis` finds nothing in `src` and in `dist`.
4. **Journey walkthrough.** Wonder → Story (6 panels; header progress 1/6…6/6; last button "Enter the Site Lab") → Simulate (4 stations completable; CTA gated; badge toast `sim_all`) → Practice (map; **all 4 modes reachable; Boss Battle opens, is winnable and is losable (D1)**; all 8 badges can be unlocked (D2); streak independent of stars; Timed expires correctly) → Reflect (recap, scorecard, confetti); zero console/page errors.
5. **Viewport/regression** at every test viewport (§10): nothing clipped under the header (including the Story progress row); nothing needs a hidden scroll; the navigation fits at 390 px (D19); station drags work **by touch** and by keyboard; no text under 14 px, no target under 44 px (spot-check with devtools).
6. **Production build.** Clean clone, `npm install && npm run build`; `npm run lint`; `npm run test:bank && npm run test:audio`. If the blueprint versions fail to build, use the fallback pins (R1).
7. **Accessibility.** Focus rings visible; every slider has −/+ and arrow-key control and an `aria-label`; `prefers-reduced-motion` honoured; every dimension has a text label and unit; the keyboard alone can finish every station.
8. **High-stakes check.** Because question correctness is the product, have a reviewer who has not seen the generator code hand-verify a random sample of 60 questions (6 per world) against a calculator.

---

## 13. Delivery Checklist

- [ ] Zip excludes `node_modules/` and `dist/`.
- [ ] `public/assets/story/story_1.png … story_6.png` are **true PNGs at 1024×1024** (one copy each; no `.jpg` duplicates); README has the per-panel art brief (PRD §12).
- [ ] `README.md`, `index.html`, OG tags, `IntroScreen`, `CelebrationScreen` and `docs/audio_generation_pipeline.md` rewritten. `grep -rEi "angle|detective|inspector|working backwards|robo|zara|grade 7|place value" . --exclude-dir=node_modules --exclude-dir=dist` returns nothing except intentional uses.
- [ ] **`.env.local.example` contains only a placeholder** (`VITE_ELEVENLABS_API_KEY=your_key_here`) and `.env.local` is git-ignored. The exposed key from the reference has been rotated (D4).
- [ ] `vercel.json`, `.oxlintrc.json`, `api/elevenlabs.js`, favicon present.
- [ ] `audioMap.js` regenerated after content lock; `clean-audio` run; no Grade 7 `.mp3`s left.
- [ ] Pass logs attached for `test:bank` and `test:audio`.
- [ ] Defect register (§1.2) walked item by item; D1, D2, D3, D5 verified in the browser walkthrough.

---

## 14. Risks

| # | Risk | Mitigation |
|---|---|---|
| R1 | Blueprint dependency versions (React 19, Vite 8, plugin-react 6, framer-motion 12, lucide 1.x) exist in the registry but were **not built against here**; the reference ships a different, tested stack (React 18.3.1, Vite 5.4.14, framer-motion 11, lucide 0.475). | Install and build on day one. On any conflict, pin to the reference versions and log it. Tailwind stays on v3 either way. |
| R2 | The blueprint's `calcXP` source (`G2-Money-Money-main`) was not supplied. | The reference's `calcXP` is used (§9); swap in the G2 file if stakeholders require identical XP. |
| R3 | Question narration is generated live per procedural question (ElevenLabs credits, latency) and a client-side key would be exposed. | Serverless proxy with a server-side key; in-memory cache; replay button reuses it; narration silently skips if unavailable. |
| R4 | SVG drag maths and touch behaviour (D10). | `getScreenCTM`, `touch-action: none`, pointer capture, keyboard controls as the accessible fallback; tested at all viewports. |
| R5 | Geometrically inconsistent figures (slant ≠ √(h² + offset²), composite perimeter counting internal edges). | Figures built from triples and components; validators asserted in the stress test. |
| R6 | Floating-point artefacts or inexact decimals in options/answers. | Integer-hundredths arithmetic and the `exact2dp` gate; stress test rejects > 2 dp. |
| R7 | Spoken/on-screen drift. | Narration derived from on-screen strings by one `speak()`; parity test. |
| R8 | Scope misread (PRD §14a): if Grade 8 "Area and Perimeter" meant Sec 2 volume/surface area, the whole module is mis-scoped. | Confirm scope with stakeholders **before** building. Worlds 0–4 and 7 would transfer to a different brief; the rest would not. |
| R9 | Star scaling (D9) lets Boss/Guided earn 3★ and may feel too easy. | One function (`starsFor`); easy to revert to raw counts; confirm with stakeholders (PRD §14e). |
| R10 | World-unlock rule (≥ 1★ on the previous world) is inherited and unspecified by the blueprint. | Isolated in `isWorldUnlocked`; confirm. |
| R11 | Removing nine dead reducer actions deviates from blueprint §2.3. | Documented in D12; trivially reversible; no caller depends on them. |
| R12 | Station B's "snap to divisors" and Station C's tap-to-assign flows are new interaction patterns not present in the reference. | Prototype both early; keep −/+ keyboard paths as the baseline behaviour. |
