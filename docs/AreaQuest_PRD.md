# AreaQuest — Grade 8 · Area and Perimeter (PRD)

**Grade:** 8 (Singapore Sec 2 equivalent) &nbsp;|&nbsp; **Topic:** Area and Perimeter of Plane Figures &nbsp;|&nbsp; **Module name:** AreaQuest
**Clone source for this build:** `angle-on-line-g7-main` (the shipped Grade 7 AngleQuest build, user-supplied). It supersedes the default `G2-Money-Money-main` reference for UI/UX, layout, viewport handling and component chrome. The paired TRD lists exactly what is cloned, fixed or replaced.
**Special instructions given:** none. All blueprint defaults apply.

---

## 1. Overview

AreaQuest is a Grade 8 module that consolidates and extends *area and perimeter of plane figures*. Students work with rectangles, triangles, parallelograms, trapezia, kites and rhombuses, circles, semicircles, quadrants and sectors, and composite figures. The module's central idea is that **perimeter and area measure different things**: perimeter is the distance around a shape and area is the space inside it. The two are independent, and most errors at this level come from mixing them up.

Two junior park planners, **Hafiz** and **Mei Ling**, work in **Architect Tally's Park Planning Studio** on a community park called *Sunrise Park*. Each world is a zone of the park: fences, tiled terraces, a triangular flower bed, a pond, a curved garden and a final courtyard. The five-phase Wonder → Story → Simulate → Practice → Reflect journey, the XP/Stars/Streak/Badge system, the 100-question procedural bank (10 worlds × 10) and the ElevenLabs-only narration are all inherited unchanged from the Intellia Global architecture (PRD blueprint §A).

## 2. Background

This module follows the same "Grade + Topic in, build-ready PRD/TRD pair out" process as AngleQuest (Grade 7) and the earlier Intellia modules. A project-based setting (designing a park) suits Grade 8 better than the younger "detective" framing. It also lets every question be a real design decision: how much fencing, how many tiles, how much turf.

AreaQuest is a strong fit for the Simulate archetypes. Shearing a parallelogram, stretching a fenced plot and tapping the edges of a composite figure are all visual, drag-and-tap interactions.

## 3. Standards Alignment

### 3.1 Where this topic sits in the Singapore syllabus (research finding, please read)

- The Grade 7 module (AngleQuest) was framed as Singapore Sec 1, so Grade 8 is treated as **Sec 2**.
- Published Sec 2 syllabus summaries list the new Sec 2 mensuration content as **volume and surface area of pyramids, cones and spheres**. Area and perimeter of plane figures is taught earlier (primary school, with parallelogram, trapezium, circle, sector and composite work consolidated in lower secondary).
- This module is therefore a **consolidation plus extension** of plane-figure area and perimeter, not a brand-new syllabus topic. The extension is multi-step, algebraic and "work backwards" problems, composite figures with curved parts, and unit conversion.
- **Evidence limit:** I could only confirm this against third-party syllabus summaries (e.g. [learner.net Sec 2 page](https://learner.net/u/singapore-secondary-two-mathematics)). I could not retrieve the official MOE syllabus PDF in this session. Treat §3.1 as an assumption to confirm (see §14a).

### 3.2 Precise skills in scope

- Perimeter and area of rectangles and squares, including rectilinear (L-shaped) figures, and conversion between cm², m² (and mm²).
- Area of a triangle (½ × base × perpendicular height), including obtuse triangles where the height falls outside the base, and finding a missing base or height from the area.
- Area of a parallelogram (base × perpendicular height) and its perimeter, where the slanted side is **not** the height.
- Area of a trapezium (½ × (sum of parallel sides) × height), finding a missing parallel side, and perimeter given the legs.
- Area of a kite and a rhombus from the diagonals (½ × d₁ × d₂). *Extension item, see §14b.*
- Circumference and area of a circle, using a stated value of π (22/7 or 3.14).
- Perimeter and area of a semicircle and a quadrant; arc length and sector area for sectors of 90°, 180° and 270° (the fraction θ/360 of a circle).
- Area and perimeter of composite figures (add or subtract component areas; count only the outer boundary for perimeter).
- Real-world multi-step problems: cost of fencing or tiling, number of tiles, and "find x" problems where an area or perimeter is given.

### 3.3 Adjacent skills scoped out (bridge only, not tested)

- **Volume and surface area** of prisms, cylinders, pyramids, cones and spheres is the next sub-topic in the strand. It appears only as a one-line teaser in the closing Story panel ("what if the park had a third dimension…?") and is never assessed. It is a natural next module.
- **Pythagoras' theorem** to *find* a missing height or slant side is deliberately out of scope. It belongs to the sibling module *Finding Unknown Sides*. In AreaQuest, heights and slant sides are always **given** in the question or labelled in the diagram. Pythagorean triples are used only behind the scenes so that diagrams are geometrically consistent (TRD §6.4).
- Sector problems with angles other than 90°, 180° and 270° are out of scope. They would force awkward fractions of π.

### 3.4 Domain conventions students are expected to know

- Use the **perpendicular** height, shown as a dashed line with a right-angle marker, never the slanted side.
- State units on every answer: cm, m for length and perimeter; cm², m² for area. Unit conversions used: 1 m = 100 cm, 1 m² = 10 000 cm², 1 cm² = 100 mm².
- **Every circle question states the value of π** (22/7 or 3.14). Students are never asked to choose π.
- "Circumference" is the perimeter of a full circle. A semicircle's perimeter includes its **diameter**.
- Decimal answers are given to at most 2 decimal places, and every generated question is built so the answer is exact at that precision (§8 clean-number rule).

## 4. Learning Objectives

By the end of this module, a student should be able to:
1. Distinguish perimeter from area and calculate both for rectangles, squares and rectilinear figures, with correct units.
2. Convert between square units (cm² ↔ m², mm² ↔ cm²) and find a missing side from a given area or perimeter.
3. Calculate the area of a triangle using a base and its perpendicular height, including obtuse triangles.
4. Calculate the area of a parallelogram and recognise that the slanted side is not the height.
5. Calculate the area of a trapezium, and of a kite or rhombus from its diagonals, and find a missing length from the area.
6. Calculate the circumference and area of a circle, using a given value of π.
7. Calculate the perimeter and area of semicircles and quadrants, and the arc length and area of sectors.
8. Calculate the area and perimeter of composite figures, handling shared and hidden edges correctly.
9. Solve real-world and algebraic problems that combine these skills (cost, tiling, "find x").

The order runs recall → single-step → comparison/reasoning → composite → real-world, and drives both the Story sequence (§7.2) and the world sequence (§8).

## 5. Inherited Standards (copied from PRD blueprint §A, not re-derived)

- **Five-phase architecture:** Wonder → Story → Simulate → Play ("Practice" in the UI) → Reflect.
- **Gamification:** XP per question (attempts/hints/streak-weighted); Stars 0–3 per world (9–10 correct = 3★, 7–8 = 2★, 5–6 = 1★, below = 0★); continuous streak tracking; 8 fixed badge triggers (relabelled, §9); Boss Battles (5 questions, 3 lives, one per world, 10 total).
- **Practice modes** (unchanged):

| Mode | Questions | Hints | Timed | Lives |
|---|---|---|---|---|
| Guided Practice | 5 | Yes | No | No |
| Independent Practice | 10 | No | No | No |
| Timed Challenge | 8 | No | Yes (60s) | No |
| Boss Battle | 5 | No | No | Yes (3) |

- **Audio:** ElevenLabs "Alice" (`Xb7hH8MSUJpSbSDYk0k2`), `eleven_multilingual_v2`, six style presets; pre-generated static `.mp3`s via `generate_audio.js` → `audioMap.js`; dynamic ElevenLabs fetch only for procedurally varying text; **no browser Web Speech API fallback under any circumstance**; strict 1:1 spoken/on-screen parity; all symbols and notation spoken in full natural language (list in §10).
- **Question bank:** 10 worlds × 10 questions = 100, procedurally generated from templates and stress-tested (≥300 randomized runs); fixed schema (`id, districtId, category, visual, questionText, options[4], correctAnswer, explanation, hint1, hint2, visualData`); World 9 is always the mixed-review grand finale.
- **Product standards:** React/Vite/Tailwind/Framer Motion, pixel-faithful dark glassmorphism per `design-tokens.css`, Fredoka/Nunito fonts, surgical reuse of every non-topic-specific reference file, zip delivery excluding `node_modules`/`dist` with placeholder story art plus an art-brief README.

## 6. Module Identity

- **Name:** AreaQuest (follows the `{Topic}Quest` convention). "Perimeter" is covered in the subtitle, "Area and Perimeter", on the intro screen and in `index.html`, so the name stays short and distinct from sibling modules.
- **Story theme:** *The Sunrise Park Project.* Architect Tally's studio has been asked to design a new community park. Every world is a zone of the park, and every question is a design decision (fence it, tile it, plant it, pave it). A project-based setting suits Grade 8's age.
- **Characters:** **Hafiz** and **Mei Ling**, two junior park planners (Singaporean-multicultural naming, first names only, per blueprint default). Proposed defaults, not stakeholder-approved (§14c).
- **Mascot:** **Tally the Owl** 🦉 (default retained), styled as **Architect Tally** with a hard hat and a tape measure. This is a reskin of the established mascot, not a swap.

## 7. Five-Phase Journey Detail

### 7.1 Wonder
Single hook screen, *"The Fence Dilemma"*. Hafiz and Mei Ling have exactly **60 m of fencing** for a garden. Hafiz sketches a long thin plot, 25 m by 5 m. Mei Ling sketches a square, 15 m by 15 m. Both use all 60 m of fence. Tally poses the driving question: *"If two gardens use exactly the same length of fence, do they hold the same amount of grass?"* The screen shows both plots side by side with labelled sides; the area reveal (125 m² against 225 m²) is withheld until the Story.

### 7.2 Story — 6 panels
The default is 4 panels. AreaQuest uses **6** because the topic has two distinct formula families (straight-sided, curved) plus a composite synthesis, and the reference build ships 6. The app reads the panel count from `STORY_PANELS.length` (the reference already does this correctly).

| # | Title | Concept delivered | Narrative beat |
|---|---|---|---|
| 1 | "The Fence Dilemma" | Concrete hook: same fence, different space | Hafiz and Mei Ling meet Architect Tally and the Sunrise Park brief. |
| 2 | "Around vs. Inside" | Perimeter (distance around) vs. area (space inside); units cm / cm² / m²; 1 m² = 10 000 cm² | The two plots are measured: both 60 m, but 125 m² and 225 m². |
| 3 | "Half and Slant" | Triangle = ½ × base × height; parallelogram = base × height; trapezium; perpendicular height vs. slanted side | The terrace is cut into triangles and slanted beds; Tally warns "height means straight up, not slanted". |
| 4 | "Round the Pond" | Circumference and area of a circle; π as 22/7 or 3.14 (always stated) | The pond must be fenced and covered; π is introduced as the circle's constant. |
| 5 | "Slices and Curves" | Semicircle, quadrant, sector; arc length; θ/360 of a circle; semicircle perimeter includes the diameter | The curved garden is a slice of a circle, and Mei Ling nearly forgets the straight edge. |
| 6 | "Putting the Park Together" | Composite figures (add/subtract areas; only the outer boundary counts for perimeter); teaser: volume | Tally hands over the master plan and sends the planners to the Site Lab. |

### 7.3 Simulate — 4 stations (archetype heuristic)
The reference's Simulate shell is kept: a 2-column layout (station tabs on the left, activity panel on the right), the CTA gated on all four stations being complete, and the `Panel / Node / Msg / GoldBtn` chrome kit. Each station implements the fixed contract `<Station onComplete audioEnabled />`.

1. **Concept Discovery Lab — "The Shape Shifter Lab."** The student drags a **shear slider** on a rectangle to turn it into a parallelogram. The base and perpendicular height stay fixed and the slanted side grows. A live readout shows `base × height = 40 cm²` staying constant while the perimeter readout changes. Two further tabs show the same idea for the triangle (a parallelogram cut along its diagonal gives half the area) and the trapezium (two copies, one flipped, make a parallelogram of base a + b). *Gate:* all three tabs visited with at least 2 distinct slider positions each, **and** one confirmation question ("The slanted side got longer but the area did not change. Why?" → "Area depends on the base and the perpendicular height, not the slanted side").
2. **Build-to-Target Challenge — "Fence & Fill."** The student has a fixed amount of fencing (or a fixed area) and drags a **width slider** (with −/+ buttons) to hit a target. Live: the rectangle resizes, the readouts show `length × width = area` and the perimeter, and a ring turns amber within tolerance and green on an exact match. Three cases: (1) fixed perimeter, hit a target area (two valid answers); (2) fixed area, hit a target perimeter; (3) a circular pond with a radius slider, hit a target area (π = 3.14). *Gate:* 3 exact successes, each followed by "New plot". The cases include the discovery that the square encloses the most area for a given perimeter.
3. **Multi-Step / Composite Construction Challenge — "Park Plan Builder."** A composite figure (rectangle + semicircle, L-shape, or rectangle with a triangular cut-out) is shown. The student (a) **taps each component region**, picks its area from a small set, and chooses **add or subtract**, watching a running total build; then (b) **taps the edges that belong to the perimeter**. Shared and internal edges are greyed and counted as wrong if tapped, and a curved edge shows its arc length once selected. This station targets the most advanced objective (LO 8). *Gate:* 2 rounds, each with the correct total area and the correct perimeter.
4. **Error-Detective — "Architect Tally's Site Audit."** A four-line worked solution (given / formula / calculation / answer) contains **one seeded realistic mistake**. The student taps the faulty line, then chooses the correct fix. Error types: perimeter ↔ area swap, forgetting the ½, slanted side used as height, diameter used as radius, semicircle perimeter missing the diameter, internal edge counted in a composite perimeter, unit slip (m² → cm² ×100 instead of ×10 000). *Gate:* 3 cases, each a different error type. This station reinforces the module's core misconception (§7.5).

### 7.4 Play / Practice
Unchanged mechanics (§5): world map of 10 worlds, 4 selectable modes, Boss Battle per world. Each world's 10 questions form an **easy → hard ladder** (position 0 is easiest). Guided uses positions 0–4, Boss uses 5–9, Independent uses all 10, and Timed draws 8 at random. Stars are scaled to a /10 basis so 5- and 8-question modes can still earn them (see §14e).

### 7.5 Reflect
A 3-question conceptual recap targeting the module's most-misunderstood ideas (the same ones the Error-Detective station targets), a scorecard (Total XP / Stars out of 30 / Best Streak / badges), and an open reflection prompt to Tally ("Dear Architect Tally, perimeter and area are different because…"). Recap items are specified in TRD §5.1.

## 8. World & Question Bank Table

10 worlds, foundational → applied; **World 9 is the mixed-review grand finale** (standard). Accent colours are the existing `--world-0…9` tokens.

| id | Name | Emoji | Accent | conceptFocus | Description | Boss (name · emoji · reward badge) |
|---|---|---|---|---|---|---|
| 0 | Fenceline Fields | 🌾 | `#f472b6` | `perimeter-basics` | Perimeter of rectangles, squares and rectilinear shapes; missing sides. | The Fence Fiddler 🪵 · "Perimeter Pro" |
| 1 | Tile Terrace | 🧱 | `#fb923c` | `area-rect-units` | Area of rectangles and squares; cm² ↔ m²; missing side from area. | The Tile Trickster 🎲 · "Tile Titan" |
| 2 | Triangle Trail | 🔺 | `#fbbf24` | `area-triangle` | Triangle area with any base/height pair, obtuse triangles, missing height. | The Half-Forgetter ➗ · "Triangle Tamer" |
| 3 | Slant Plaza | 🏘️ | `#4ade80` | `area-parallelogram` | Parallelogram area and perimeter; perpendicular height vs. slanted side. | Slant Sam 📏 · "Height Hero" |
| 4 | Trapezium Terrace | 🪜 | `#38bdf8` | `area-trapezium-kite` | Trapezium area and missing parallel side; kite and rhombus from diagonals. | The Terrace Twister 🌀 · "Terrace Master" |
| 5 | Pond Plaza | ⭕ | `#818cf8` | `circle-basics` | Circumference and area of circles with a stated π; radius vs. diameter. | The Pi Pirate 🏴‍☠️ · "Pi Pilot" |
| 6 | Sector Garden | 🥧 | `#c084fc` | `arcs-sectors` | Semicircles, quadrants, arc length and sector area. | The Slice Swiper 🍕 · "Sector Specialist" |
| 7 | Composite Courtyard | 🧩 | `#22d3ee` | `composite-figures` | Area and perimeter of composite figures; shared and hidden edges. | The Hidden-Edge Hacker ✂️ · "Composite Champion" |
| 8 | Project Planner's Office | 💰 | `#facc15` | `real-world-algebra` | Cost, tiling and "find x" problems with area or perimeter given. | The Budget Buster 💸 · "Project Pro" |
| 9 | Grand Park Finale | 🏆 | `#f43f5e` | `mixed-review` | Hardest boss; mixes every question type from worlds 0–8. | The Grand Demolisher 🏚️ · "Sunrise Park Opened!" |

**Sample questions** (illustrative; every value below was checked by hand, and the generator must re-verify every question independently, TRD §12):

- **World 0:** "A rectangular garden is 12 m long and 7 m wide. Find its perimeter." → **38 m** / 84 m / 19 m / 31 m. *2 × (12 + 7) = 38 m. 84 m is the area (a perimeter/area slip); 31 m is 2 × 12 + 7, one side forgotten.*
- **World 1:** "A rectangular terrace is 9 m by 14 m. Find its area." → **126 m²** / 46 m² / 126 m / 23 m². *9 × 14 = 126 m². Area is in square metres.*
- **World 2:** "A triangle has a base of 14 cm and a perpendicular height of 9 cm. Find its area." → **63 cm²** / 126 cm² / 23 cm² / 46 cm². *½ × 14 × 9 = 63 cm². 126 is the answer with the ½ forgotten.*
- **World 3:** "A parallelogram has a base of 12 cm, a slanted side of 13 cm and a perpendicular height of 5 cm. Find its area." → **60 cm²** / 156 cm² / 65 cm² / 30 cm². *Base × perpendicular height = 12 × 5 = 60 cm². 156 uses the slanted side.*
- **World 4:** "A trapezium has parallel sides of 8 cm and 14 cm and a height of 6 cm. Find its area." → **66 cm²** / 132 cm² / 48 cm² / 84 cm². *½ × (8 + 14) × 6 = 66 cm².*
- **World 5:** "A circular pond has a radius of 14 m. Use π = 22/7. Find its circumference." → **88 m** / 44 m / 616 m / 176 m. *2 × 22/7 × 14 = 88 m. 616 m is the area.*
- **World 6:** "A semicircle has a diameter of 14 cm. Use π = 22/7. Find its perimeter." → **36 cm** / 22 cm / 44 cm / 29 cm. *Arc = ½ × 22/7 × 14 = 22 cm, plus the diameter 14 cm = 36 cm.*
- **World 7:** "A 12 m by 8 m rectangle has a semicircle on one 8 m side (π = 3.14). Find the area of the whole figure." → **121.12 m²** / 96 m² / 108.56 m² / 146.24 m². *96 + ½ × 3.14 × 4² = 121.12 m².*
- **World 8:** "Fencing costs $12 per metre. A rectangular plot is 15 m by 9 m. Find the cost of fencing all the way round." → **$576** / $1 620 / $288 / $108. *Perimeter 48 m × $12 = $576.*
- **World 9:** mixes any of the above, plus 2 simple-algebra items, e.g. "A rectangle has length (x + 4) cm and width 6 cm. Its area is 54 cm². Find x." → **5** / 9 / 13 / 50. *6(x + 4) = 54, so x + 4 = 9 and x = 5. 9 forgets to subtract 4; 50 is 54 − 4.*

**Clean-number / geometric-validity constraints (hard rules, carried into the TRD's generation logic):**
1. **Dimensions** are positive integers (typically 2–40). Triangle, trapezium, kite and rhombus items are generated so the product under the ½ is **even**, keeping answers whole or ending in .5 only where the question allows.
2. **π rule.** If the radius is a multiple of 7, the question states π = 22/7. Otherwise it states π = 3.14. Every circle question states π.
3. **Sector and quadrant rule.** With π = 3.14, quadrant and sector *areas* (θ = 90° or 270°) use an **even radius**, which keeps the answer at 2 decimal places or fewer. Arc length and full-circle values are exact at 2 decimal places for any integer radius. With π = 22/7, radii are multiples of 7 and answers are whole numbers or end in .5. Sector angles are limited to 90°, 180° and 270°. These rules were checked by exhaustive enumeration for radii 1–40.
4. **Geometric consistency, not just arithmetic.** A parallelogram's slanted side, perpendicular height and horizontal offset must satisfy slant² = height² + offset². Isosceles and right trapezium legs must satisfy the same relation. The generator draws these from Pythagorean triples (3-4-5, 5-12-13, 8-15-17, 7-24-25 and their multiples) and a dedicated validator asserts it. This is the area-and-perimeter analogue of AngleQuest's "intersections are generated from (a, b), never four independent numbers" rule.
5. **No floating-point artefacts.** All decimal arithmetic is done in integer hundredths and formatted to at most 2 decimal places, so no option ever shows a value like 31.400000000000002.
6. **Composite figures** are generated from named component shapes. Their stated area equals the component sum or difference, and their stated perimeter counts only the outer boundary.

## 9. Gamification Naming (8 fixed triggers, relabelled)

| Trigger (fixed) | Badge name |
|---|---|
| First correct answer | First Measure Taken 📏 |
| 5-answer streak | Measuring Momentum 🔥 |
| 10-answer streak | Master Planner Streak 🏗️ |
| All 4 Simulate stations complete | Fully Equipped Surveyor 🧰 |
| Any world scores 3 stars | Plot Perfect ⭐⭐⭐ |
| Any Boss Battle won | Site Boss Beaten 🏆 |
| 20+ questions answered in Practice | Persistent Planner 🗺️ |
| Full 5-phase journey complete | Chief Park Architect 🎖️ |

## 10. Audio & Narration Content Rules

Topic-specific terms that must always be spoken in full, never as symbols, abbreviations or bare digits:
- Units: "square centimetres" (never "cm²" or "cm squared"), "square metres", "square millimetres", "centimetres", "metres", "millimetres". Costs are spoken as "dollars".
- "π" → "pi"; "22/7" → "twenty-two over seven"; "3.14" → "three point one four". Decimals are read as "<integer> point <digit by digit>", so "78.5" is "seventy-eight point five".
- "r²" → "radius squared"; "×" → "times"; "÷" → "divided by"; "½" → "one half"; "°" → "degrees"; "=" → "equals"; "x = 5" → "x equals five".
- "perpendicular height", "base", "parallel sides", "diagonal", "diameter", "radius", "circumference", "arc length", "sector", "semicircle", "quadrant", "composite figure" are always the full words.
- Numbers of any size are spelled out. The reference's number helper stops at 999 and reads larger values as digits, so it must be extended to at least 99 999 (areas and costs reach the thousands).

## 11. Accessibility

- Enlarged fonts and touch targets in Simulate and Practice, calibrated to Grade 8 (more restrained than the lower-primary modules, but never below **14 px text** or **44 px touch targets**; the reference's 32 px −/+ buttons and 11 px captions are not carried over).
- Every dimension in a diagram carries a **text label with its unit**. Perpendicular heights are drawn dashed with a right-angle marker. Colour is never the only carrier of meaning.
- Every drag interaction (shear slider, fence slider, radius slider) exposes keyboard −/+ buttons and arrow-key control, and works by touch (`touch-action: none`, pointer capture). The reference has neither, so the page scrolls while a finger drags an SVG handle.
- Animations and the floating background respect `prefers-reduced-motion`.

## 12. Assets Required

6 story images at **1024×1024 PNG** (matching the reference's shipped dimensions), one per Story panel (§7.2). The reference's `.png` files are actually JPEG data duplicated as `.jpg`; deliver true PNGs, one copy each. An art-brief README must describe each panel's scene, characters (Hafiz, Mei Ling, Architect Tally) and mood, e.g.:

| Panel | Scene & mood |
|---|---|
| 1 | A bare plot of land in a Singapore housing estate, a roll of fencing, a sketch pad; Hafiz and Mei Ling meet Architect Tally in his hard hat. Curious, bright morning light. |
| 2 | Two fenced garden plots side by side, a thin 25×5 and a square 15×15, each with a coil of fencing; Tally points between them. Playful, comparative. |
| 3 | A terrace tiled in triangles, a parallelogram flower bed and a trapezium path; Mei Ling holds a set-square showing the perpendicular height. Warm afternoon light. |
| 4 | A round pond with a tape measure stretched across the diameter; Hafiz marks the radius. Calm, reflective water. |
| 5 | A curved garden bed shaped like a pie slice; a semicircular bench and a quadrant lawn. Mei Ling traces the straight edge Hafiz forgot. Lively, colourful. |
| 6 | The finished master plan unrolled on Tally's studio table, with a doorway to the Site Lab. Celebratory send-off. |

## 13. Success Metrics / Acceptance Criteria

In addition to the fixed criteria (bank stress test, audio parity, clean build, full walkthrough):
- **Geometric and numeric validity**, not just schema checks. Every generated question is independently recomputed from its `visualData` and must match its stated answer. The π, sector and Pythagorean-triple rules (§8) are asserted across ≥300 seeds, with no value showing more than 2 decimal places.
- All 4 Simulate stations are genuinely interactive SVG-based activities with their own completion gates, usable by touch and keyboard.
- **Defects found in the reference build must not recur** (TRD §1.3): Boss Battle opens and is winnable, all 8 badges can actually unlock, Station D is the Error-Detective, and nothing is clipped at any test viewport.
- The Reflect recap's 3 questions target the perimeter/area and perpendicular-height misconceptions that the Error-Detective station targets.
- Spoken narration is derived from the on-screen text through one function, so 1:1 parity holds by construction.

## 14. Assumptions & Open Questions

(a) **To confirm with stakeholders (most important):** the scope reading in §3.1. If Grade 8 "Area and Perimeter" was meant to mean Sec 2 *volume and surface area* (pyramids, cones, spheres), this PRD is the wrong module and a different topic brief is needed. If it is plane figures, confirm that consolidation-plus-extension is intended.
(b) **Kites and rhombuses by diagonals** (World 4) are included as an extension item because I could not confirm they sit in the MOE syllabus at this level. They can be dropped from World 4 without affecting any other world.
(c) Character names (Hafiz, Mei Ling) and the Architect Tally reskin are proposed defaults per blueprint convention, not yet stakeholder-approved.
(d) **π values:** the module uses 22/7 and 3.14, always stated. Confirm whether the calculator's π (answers to 1–2 d.p.) should also be taught; the clean-number guarantee would then need rounding questions added.
(e) **Star scaling:** the blueprint defines stars from "correct out of 10". The reference applied the thresholds to raw counts, which means Guided and Boss (5 questions) could never exceed 1★ and Timed (8 questions) never exceeded 2★. This PRD scales every mode to a /10 basis. Confirm that Boss Battle and Guided Practice should be able to earn 3★.
(f) The world-unlock rule (≥1★ in the previous world) is inherited from the reference and is not specified by the blueprint; confirm.
(g) Volume and surface area is the natural next module (working name: VolumeQuest).
