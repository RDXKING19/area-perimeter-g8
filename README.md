# AreaQuest · Grade 8 Mathematics

> **Interactive Park Planning Studio: Mastering Area & Perimeter of Plane Figures**  
> Aligned with Singapore Secondary 2, NCERT Grade 8, and US Common Core (8.G) Standards.

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Voice](https://img.shields.io/badge/ElevenLabs-Alice-facc15)](https://elevenlabs.io/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel%20Ready-000000?logo=vercel&logoColor=white)](https://vercel.com/)

---

## 🏗 Overview

**AreaQuest** is a game-based learning module for Grade 8 students. Users step into the shoes of junior park planners at **Sunrise Park Planning Studio**, guided by **Architect Tally** and peer planners **Hafiz** and **Mei Ling**.

Through interactive discovery, hands-on geometric simulations, and progressive practice challenges, students master the fundamental distinction between one-dimensional boundary length (perimeter) and two-dimensional enclosed surface (area).

---

## 🎯 5-Phase Pedagogical Architecture

1. **Wonder Phase — The Fence Dilemma**
   - Side-by-side exploration of two 60-meter fence plots: Hafiz's $25\text{ m} \times 5\text{ m}$ plot ($125\text{ m}^2$) versus Mei Ling's $15\text{ m} \times 15\text{ m}$ plot ($225\text{ m}^2$).
   - Disproves the common misconception: *"Equal perimeter does not imply equal area."*
   - Zero-scroll, compact interface with instant interactive prediction feedback.

2. **Story Phase — Sunrise Park Planning Studio**
   - 4-panel illustrated visual narrative featuring custom 3D Pixar/Disney style artwork.
   - Panel 1: The Fencing Paradox (Perimeter vs. Area).
   - Panel 2: Around vs. Inside (Linear meters vs. square meters).
   - Panel 3: Halves, Slants & Slopes (90° Perpendicular height vs. slant edge).
   - Panel 4: Curves, Pond & Master Plan (Circle circumference, $\pi r^2$, and composite park zones).

3. **Simulate Phase — Real-World Park Engineering Labs**
   - **Section A: Shape Shifter Lab** — Interactive shearing slider demonstrates Cavalieri’s principle: shearing a parallelogram or triangle leaves base and perpendicular height intact, preserving exact area.
   - **Section B: Fence & Fill Target Lab** — Dynamic slider challenge sizing park flowerbeds to match designated target areas and perimeter limits.
   - **Section C: Park Plan Builder** — Composite park planner allowing students to add/subtract sub-regions and isolate outer perimeter boundaries from internal dividing fences.

4. **Play Phase — Practice Across 10 Themed Worlds (100 Questions)**
   - 10 distinct worlds spanning Rectangles, Squares, Triangles (acute, right, obtuse with external height), Parallelograms, Trapeziums, Rhombuses & Kites, Circles & Sectors, Composite Shapes, Unit Conversions ($\text{cm}^2 \leftrightarrow \text{m}^2 \leftrightarrow \text{mm}^2$), and Real-World Budgeting.
   - 4 adaptive play modes:
     - 🎓 **Guided Exploration** (hints & visual scaffolds)
     - ⚡ **Independent Practice** (standard testing)
     - ⏱ **Timed Challenge** (speed & accuracy)
     - 👑 **Boss Battle** (5 questions, 3 lives against Site Bosses)
   - Procedural question generation engine guarantees unique numeric scenarios with mathematically verified distractors.
   - 🔊 Audio replay button on every question for full auditory accessibility.

5. **Reflect Phase — Studio Synthesis & Master Accreditation**
   - 3 conceptual multiple-choice reflection questions cementing core principles.
   - Comprehensive performance scorecard detailing accuracy, stars earned (scaled /10), badges unlocked, and speed.
   - Confetti celebration and Certificate of Completion.

---

## 🎙 ElevenLabs Audio & Speech Pipeline

AreaQuest features an integrated text-to-speech audio narration system utilizing ElevenLabs **Alice** (`eleven_multilingual_v2`, Voice ID: `Xb7hH8MSUJpSbSDYk0k2`).

### Hybrid Speech Architecture
1. **Pre-Generated Static Assets:** High-frequency phase instructions, story slides, and cheers are pre-rendered into `public/assets/audio/*.mp3` mapped via `src/utils/audioMap.js`.
2. **On-the-Fly Dynamic Generation:** Questions and un-cached phrases generate on-the-fly via ElevenLabs API using `VITE_ELEVENLABS_API_KEY` or the serverless `/api/elevenlabs` proxy.
3. **Tactile Web Audio API Synthesizer:** Zero-latency mechanical audio pops synthesize natively in the browser on every button click and selection.
4. **Graceful Silence:** If an API key is not provided and static audio is absent, the app operates silently with full visual functionality (no robotic browser Web Speech fallbacks).

---

## 📁 Repository Structure

```text
├── api/
│   └── elevenlabs.js           # Vercel serverless function for ElevenLabs TTS proxy
├── docs/
│   ├── AreaQuest_PRD.md        # Product Requirements Document
│   ├── AreaQuest_TRD.md        # Technical Requirements Document
│   └── audio_generation_pipeline.md # Narration architecture specification
├── public/
│   ├── assets/
│   │   ├── audio/              # Pre-generated static .mp3 files
│   │   └── story/              # High-res 3D story phase artwork (story_1..4.png)
│   └── favicon.svg             # SVG application icon
├── scripts/
│   ├── clean_audio.js          # Cleans orphaned MP3s not in audioMap
│   ├── generate_audio.js       # Batch ElevenLabs speech generation
│   ├── stress_test_bank.js     # 50-seed question bank validator (100% uniqueness)
│   └── test_audio_parity.js    # Spoken pronunciation & math translation test
├── src/
│   ├── components/
│   │   ├── layout/             # TopNav, Mascots, Reset Dialog
│   │   ├── phases/             # Wonder, Story, Simulate, Play, Reflect
│   │   ├── shared/             # AreaVisual SVG renderer, FeedbackOverlay, FloatingSymbols
│   │   └── simulations/        # Section A, B, C park simulators
│   ├── config/                 # Worlds, Characters, Audio configuration
│   ├── data/                   # 100-question procedural bank & story content
│   ├── hooks/                  # Viewport, local storage, audio hooks
│   └── utils/                  # Exact math, badge engine, scoring, narration, speak layer
├── .env.local                  # Local ElevenLabs API keys (gitignored)
├── .env.local.example          # Environment template
├── .gitignore                  # Git hygiene rules
├── vercel.json                 # Vercel SPA routing & rewrites configuration
├── vite.config.js              # Vite configuration
└── package.json                # Project dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9 or higher)

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd "area and perimeter g8"

# Install dependencies
npm install
```

### Environment Configuration
Copy `.env.local.example` to `.env.local` and add your ElevenLabs API key:
```bash
cp .env.local.example .env.local
```

Inside `.env.local`:
```env
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

### Development Server
```bash
npm run dev
```
The application will launch locally at `http://localhost:3000`.

---

## 🧪 Verification & Testing

Run all automated test suites to verify math logic and audio parity:

```bash
# 1. Verify 10 worlds × 10 questions across 50 random seeds (no duplicate options)
npm run test:bank

# 2. Verify spoken unit translations (e.g., m² -> square metres, $ -> dollars)
npm run test:audio

# 3. Verify clean production build
npm run build
```

---

## ☁️ Deployment

### Option A: Vercel (Recommended)
1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` (or `vite build`).
4. Output Directory: `dist`.
5. Environment Variables:
   - Add `ELEVENLABS_API_KEY` (and optionally `VITE_ELEVENLABS_API_KEY`).
6. Deploy! The included `vercel.json` and `api/elevenlabs.js` configure SPA routes and serverless TTS automatically.

### Option B: Netlify
1. Connect repository on Netlify.
2. Build Command: `npm run build`.
3. Publish Directory: `dist`.
4. Add rewrite rule in `public/_redirects`: `/* /index.html 200`.

### Option C: Static Hosting (GitHub Pages, Cloudflare Pages, S3)
Run `npm run build` and upload the contents of the `dist/` directory to your static host.

---

## 📜 License
Educational MIT License. Built for mathematics learners worldwide.
