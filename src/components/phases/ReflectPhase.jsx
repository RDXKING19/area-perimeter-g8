import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { narrate, stopNarration, playClickSound } from '../../utils/audio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { WORLDS } from '../../config/worlds.config.js';

const RECAP_QUESTIONS = [
  {
    id: 1,
    q: 'Two rectangles both have a perimeter of 24 m. Which statement must be true?',
    options: [
      'They can have different areas',
      'They must have the same area',
      'The longer one has the smaller perimeter',
      'Area is found by adding the sides'
    ],
    correct: 'They can have different areas',
    explanation: '8 m × 4 m has perimeter 24 m and area 32 m²; 6 m × 6 m has perimeter 24 m and area 36 m². Perimeter does not fix area!'
  },
  {
    id: 2,
    q: 'A parallelogram has a base of 12 cm, a slanted side of 13 cm and a perpendicular height of 5 cm. Mei Ling writes area = 12 × 13 = 156 cm². What is wrong?',
    options: [
      'She used the slanted side; the area is base × perpendicular height = 12 × 5 = 60 cm²',
      'She should have added 12 and 13',
      'She should have halved 156',
      'Nothing is wrong'
    ],
    correct: 'She used the slanted side; the area is base × perpendicular height = 12 × 5 = 60 cm²',
    explanation: 'Area of a parallelogram strictly requires the perpendicular height meeting the base at a right angle (90°), never the slanted side!'
  },
  {
    id: 3,
    q: 'A tile is 50 cm by 50 cm. Hafiz says its area is 2 500 cm², which is 25 m². What is wrong?',
    options: [
      '1 m² = 10 000 cm², so 2 500 cm² is 0.25 m²',
      '1 m² = 100 cm² so 25 m² is right',
      'The area should be 200 cm²',
      'Area is measured in metres, not square metres'
    ],
    correct: '1 m² = 10 000 cm², so 2 500 cm² is 0.25 m²',
    explanation: 'Because 1 m = 100 cm, 1 m² = (100 cm)² = 10 000 cm². Therefore 2 500 cm² = 0.25 m².'
  }
];

export function ReflectPhase({
  xp = 0,
  stars = 0,
  bestStreak = 0,
  badges = [],
  worldResults = Array(10).fill(null),
  muted = false,
  onComplete
}) {
  const [recapIdx, setRecapIdx] = useState(0);
  const [recapAnswers, setRecapAnswers] = useState({});
  const [recapCompleted, setRecapCompleted] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [recapFeedback, setRecapFeedback] = useState(null);

  const currentRecapQ = RECAP_QUESTIONS[recapIdx];

  useEffect(() => {
    if (!muted) narrate(reflectNarration(), true);
    return () => stopNarration();
  }, [muted]);

  const handleRecapSelect = (opt) => {
    playClickSound();
    const isCorrect = opt === currentRecapQ.correct;
    setRecapAnswers((prev) => ({ ...prev, [currentRecapQ.id]: opt }));

    if (isCorrect) {
      setRecapFeedback({ status: 'correct', text: currentRecapQ.explanation });
    } else {
      setRecapFeedback({ status: 'wrong', text: `Review the rule: ${currentRecapQ.explanation}` });
    }
  };

  const handleNextRecap = () => {
    setRecapFeedback(null);
    if (recapIdx < RECAP_QUESTIONS.length - 1) {
      setRecapIdx((i) => i + 1);
    } else {
      setRecapCompleted(true);
    }
  };

  const handleSubmit = () => {
    if (!muted) narrate(reflectCompleteNarration(), true);
    try {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
    } catch (e) {
      // Ignore
    }
    onComplete();
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2.5 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-4xl max-h-[calc(100dvh-var(--header-h)-16px)] glass-panel-strong p-4 sm:p-6 shadow-2xl flex flex-col items-center z-20 my-auto overflow-y-auto">
        {/* Accent Bar */}
        <div className="w-20 h-1.5 bg-purple-400 rounded-full mb-2 shadow-[0_0_18px_rgba(168,85,247,0.85)] shrink-0" />

        {/* Header */}
        <h2 className="font-display font-900 text-xl sm:text-2xl md:text-3xl text-white mb-2.5 flex items-center gap-2 shrink-0">
          <span className="text-2xl sm:text-3xl">🏆</span>
          <span>Architect Debrief & Scorecard</span>
        </h2>

        {/* ---------------- PART 1: 3-QUESTION CONCEPTUAL RECAP ---------------- */}
        {!recapCompleted && (
          <div className="w-full bg-[#1e1044]/95 border-2 border-purple-400/40 rounded-2xl p-3.5 sm:p-5 flex flex-col items-center gap-3 mb-2 shrink-0">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                📝 Conceptual Debrief Quiz (Question {recapIdx + 1} of 3)
              </span>
              <span className="text-xs text-slate-300 font-bold">
                Targets: Area vs. Perimeter & Units
              </span>
            </div>

            <p className="font-display font-900 text-sm sm:text-lg text-white text-center leading-snug">
              {currentRecapQ.q}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {currentRecapQ.options.map((opt, i) => {
                const isSelected = recapAnswers[currentRecapQ.id] === opt;
                const isCorrect = opt === currentRecapQ.correct;
                const showResult = isSelected && recapFeedback;

                return (
                  <button
                    key={i}
                    onClick={() => handleRecapSelect(opt)}
                    className={`min-h-[44px] p-2.5 sm:p-3 rounded-xl border-2 font-display text-xs sm:text-sm text-left transition cursor-pointer ${
                      showResult
                        ? isCorrect
                          ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200'
                          : 'border-rose-400 bg-rose-950/80 text-rose-200'
                        : isSelected
                        ? 'border-amber-400 bg-amber-950/50 text-white'
                        : 'border-white/15 bg-white/5 text-slate-200 hover:border-amber-400/40'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {recapFeedback && (
              <div className="w-full flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10 shrink-0">
                <span className="text-xs text-slate-100 font-extrabold flex-1 mr-2">
                  {recapFeedback.text}
                </span>
                <button
                  onClick={handleNextRecap}
                  className="gold-btn min-h-[38px] text-xs sm:text-sm py-1.5 px-4 rounded-xl cursor-pointer shrink-0"
                >
                  {recapIdx < RECAP_QUESTIONS.length - 1 ? 'Next Question →' : 'View Full Scorecard →'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- PART 2: FINAL SCORECARD & REFLECTION ---------------- */}
        {recapCompleted && (
          <div className="w-full flex flex-col gap-3 shrink-0">
            {/* Scorecard Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full">
              <div className="bg-[#1b0d3a]/90 border border-amber-400/40 rounded-xl p-2.5 text-center">
                <span className="text-xs text-slate-300 font-bold block">Total XP</span>
                <span className="font-display font-900 text-xl text-amber-300">✨ {xp}</span>
              </div>
              <div className="bg-[#1b0d3a]/90 border border-yellow-400/40 rounded-xl p-2.5 text-center">
                <span className="text-xs text-slate-300 font-bold block">Stars Earned</span>
                <span className="font-display font-900 text-xl text-yellow-400">⭐ {stars}/30</span>
              </div>
              <div className="bg-[#1b0d3a]/90 border border-rose-400/40 rounded-xl p-2.5 text-center">
                <span className="text-xs text-slate-300 font-bold block">Best Streak</span>
                <span className="font-display font-900 text-xl text-rose-400">🔥 {bestStreak}</span>
              </div>
              <div className="bg-[#1b0d3a]/90 border border-purple-400/40 rounded-xl p-2.5 text-center">
                <span className="text-xs text-slate-300 font-bold block">Badges Unlocked</span>
                <span className="font-display font-900 text-xl text-purple-300">🎖️ {badges.length}/8</span>
              </div>
            </div>

            {/* Zone Results Strip */}
            <div className="w-full bg-[#160a32] border border-white/10 rounded-xl p-2.5">
              <span className="text-xs font-black text-amber-300 block mb-1.5 uppercase">
                ZONE RESULTS (PARK BLUEPRINTS):
              </span>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center">
                {WORLDS.map((w, idx) => (
                  <div key={w.id} className="bg-white/5 rounded-lg p-1 border border-white/10">
                    <span className="text-xs block">{w.emoji}</span>
                    <span className="text-[10px] font-bold text-amber-300">
                      {worldResults[idx] != null ? `${worldResults[idx]}★` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection Textarea */}
            <div className="w-full bg-[#1b0e3e] border border-purple-400/35 rounded-xl p-3 flex flex-col gap-1.5 text-left">
              <label htmlFor="reflectionInput" className="text-xs font-bold text-slate-200">
                Explain the difference between perimeter and area to Architect Tally:
              </label>
              <textarea
                id="reflectionInput"
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Dear Architect Tally, perimeter and area are different because perimeter measures the boundary fence around a shape in linear metres, while area measures the flat surface enclosed inside in square metres..."
                className="w-full h-16 bg-[#100624] border border-white/20 rounded-lg p-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Final CTA */}
            <button
              onClick={handleSubmit}
              className="gold-btn min-h-[44px] text-sm sm:text-base py-2.5 px-8 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.6)] cursor-pointer self-center"
            >
              Submit Park Blueprints & Celebrate! 🎉
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CelebrationScreen({ xp = 0, stars = 0, bestStreak = 0, onRestart }) {
  useEffect(() => {
    try {
      confetti({ particleCount: 180, spread: 100, origin: { y: 0.5 } });
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-2xl glass-panel-strong p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center z-20 my-auto">
        <span className="text-6xl sm:text-7xl mb-3 animate-bounce">🏆</span>

        <div className="bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-900 px-5 py-1 rounded-full shadow-lg mb-2 tracking-wide uppercase">
          🎉 SUNRISE PARK OFFICIALLY OPENED!
        </div>

        <h1 className="font-display font-900 text-3xl sm:text-5xl text-white mb-2">
          Master Park Architect
        </h1>

        <p className="text-slate-200 text-sm sm:text-base max-w-lg mb-5 font-bold leading-relaxed">
          Architect Tally, Hafiz, and Mei Ling applaud your dedication! You have successfully mastered perimeter, area, circles, and composite figures across all 10 park zones!
        </p>

        {/* Highlight Stats */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="text-xs text-slate-300 font-bold block">Final XP</span>
            <span className="font-display font-900 text-xl text-amber-300">✨ {xp}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="text-xs text-slate-300 font-bold block">Total Stars</span>
            <span className="font-display font-900 text-xl text-yellow-400">⭐ {stars}/30</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="text-xs text-slate-300 font-bold block">Best Streak</span>
            <span className="font-display font-900 text-xl text-rose-400">🔥 {bestStreak}</span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="gold-btn min-h-[48px] text-base sm:text-lg px-10 py-3 rounded-full shadow-[0_0_30px_rgba(250,204,21,0.7)] hover:scale-105 cursor-pointer"
        >
          Plan Another Park 📐
        </button>
      </div>
    </div>
  );
}
