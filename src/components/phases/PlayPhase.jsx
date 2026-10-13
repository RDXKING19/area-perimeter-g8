import React, { useState, useEffect, useRef } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { KingdomMap } from '../gamification/KingdomMap.jsx';
import { QuestionRenderer } from '../quiz/QuestionRenderer.jsx';
import { BossBattleModal } from '../quiz/BossBattleModal.jsx';
import { FeedbackOverlay } from '../shared/FeedbackOverlay.jsx';
import { BadgesModal } from '../gamification/BadgesModal.jsx';
import { generateWorldSet } from '../../data/questionBank.js';
import { WORLDS } from '../../config/worlds.config.js';
import { createRNG } from '../../utils/rng.js';
import { calcStars, calcXP } from '../../utils/scoring.js';
import { narrate, playClickSound } from '../../utils/audio.js';
import {
  questionNarration,
  playCorrectNarration,
  playWrongNarration,
  playHint1Narration,
  playHint2Narration,
  districtCompleteNarration,
  bossStartNarration,
  bossWinNarration
} from '../../utils/narration.js';

const MODES = [
  { id: 'guided', name: 'Guided Practice', icon: '🧭', questions: 5, hints: true, timed: false, lives: null },
  { id: 'independent', name: 'Independent Practice', icon: '📝', questions: 10, hints: false, timed: false, lives: null },
  { id: 'timed', name: 'Timed Challenge', icon: '⏱️', questions: 8, hints: false, timed: true, lives: null },
  { id: 'boss', name: 'Boss Battle', icon: '👑', questions: 5, hints: false, timed: false, lives: 3 }
];

export function PlayPhase({
  muted = false,
  xp = 0,
  streak = 0,
  bestStreak = 0,
  badges = [],
  toastBadge = null,
  onClearToastBadge,
  worldResults = Array(10).fill(null),
  onUpdateScore,
  onGoReflect
}) {
  const [selectedMode, setSelectedMode] = useState('independent');
  const [activeWorld, setActiveWorld] = useState(null); // null = map view, number = quiz view
  const [pendingWorld, setPendingWorld] = useState(null); // Fixes D1: Boss battle pending target
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [correctInSession, setCorrectInSession] = useState(0);
  const [showBossIntro, setShowBossIntro] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const timerRef = useRef(null);
  const rngRef = useRef(createRNG(Date.now()));

  const totalStars = worldResults.reduce((a, b) => a + (b || 0), 0);
  const allWorldsCompleted = worldResults.every((r) => r != null && r > 0);

  // Auto-play question narration whenever active question changes (TRD §1.2 D5)
  useEffect(() => {
    if (activeWorld !== null && questions[qIdx] && !feedback && !muted) {
      narrate(questionNarration(questions[qIdx]), true);
    }
  }, [activeWorld, qIdx, feedback, muted]);

  // Timer for Timed Challenge Mode
  useEffect(() => {
    if (activeWorld !== null && selectedMode === 'timed' && timeLeft > 0 && !feedback) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finishQuizSession(correctInSession);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [activeWorld, selectedMode, timeLeft, feedback, correctInSession]);

  const startWorldSession = (worldIdx, modeId = selectedMode) => {
    const modeConfig = MODES.find((m) => m.id === modeId) || MODES[1];

    let positions;
    if (modeId === 'guided') {
      positions = [0, 1, 2, 3, 4];
    } else if (modeId === 'boss') {
      positions = [5, 6, 7, 8, 9];
    } else if (modeId === 'timed') {
      // 8 random of 0..9
      positions = rngRef.current.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 8);
    } else {
      positions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    const list = generateWorldSet(worldIdx, positions, rngRef.current);

    setQuestions(list);
    setQIdx(0);
    setSelectedOption(null);
    setFeedback(null);
    setHintLevel(0);
    setCorrectInSession(0);
    setTimeLeft(60);
    setLives(modeConfig.lives || 3);

    // TRD D1 Fix: For Boss mode, set pendingWorld and display Boss intro modal
    if (modeId === 'boss') {
      setPendingWorld(worldIdx);
      setShowBossIntro(true);
      if (!muted) {
        narrate(bossStartNarration(WORLDS[worldIdx].boss.name), true);
      }
    } else {
      setActiveWorld(worldIdx);
    }
  };

  const handleStartBossBattle = () => {
    setShowBossIntro(false);
    setActiveWorld(pendingWorld);
  };

  const handleOptionSelect = (option) => {
    playClickSound();
    if (selectedOption !== null || feedback !== null) return;
    setSelectedOption(option);

    const q = questions[qIdx];
    const isCorrect = option === q.correctAnswer;

    if (isCorrect) {
      const nextCorrect = correctInSession + 1;
      setCorrectInSession(nextCorrect);
      const earnedXP = calcXP({ attempts: 1, hintsUsed: hintLevel, streak: streak + 1 });

      if (!muted) narrate(playCorrectNarration(nextCorrect), true);

      onUpdateScore({
        xpDelta: earnedXP,
        isCorrect: true
      });

      setFeedback({
        status: 'correct',
        title: 'Plan Approved! 🎯',
        explanation: q.explanation,
        xpGained: earnedXP
      });
    } else {
      let remainingLives = lives;
      if (selectedMode === 'boss') {
        remainingLives = lives - 1;
        setLives(remainingLives);
      }

      if (!muted) narrate(playWrongNarration(), true);

      onUpdateScore({
        isCorrect: false
      });

      if (selectedMode === 'boss' && remainingLives <= 0) {
        setFeedback({
          status: 'wrong',
          title: 'Planner Lives Depleted! 💔',
          explanation: `The Site Boss defeated our plan. ${q.explanation}`,
          xpGained: 0,
          isBossDefeat: true
        });
      } else {
        setFeedback({
          status: 'wrong',
          title: "Let's Recheck 📐",
          explanation: q.explanation,
          xpGained: 0
        });
      }
    }
  };

  const handleUseHint = () => {
    if (hintLevel < 2) {
      const nextHint = hintLevel + 1;
      setHintLevel(nextHint);
      const q = questions[qIdx];
      if (!muted) {
        if (nextHint === 1) narrate(playHint1Narration(q.hint1), true);
        if (nextHint === 2) narrate(playHint2Narration(q.hint2), true);
      }
    }
  };

  const handleNextQuestion = () => {
    if (onClearToastBadge) onClearToastBadge();

    if (feedback?.isBossDefeat) {
      setActiveWorld(null);
      setPendingWorld(null);
      setFeedback(null);
      return;
    }

    if (qIdx < questions.length - 1) {
      setQIdx((i) => i + 1);
      setSelectedOption(null);
      setFeedback(null);
      setHintLevel(0);
    } else {
      finishQuizSession(correctInSession);
    }
  };

  const finishQuizSession = (finalCorrect) => {
    // TRD D9: stars scaled to /10 basis
    const earnedStars = calcStars(finalCorrect, questions.length);
    const isBossWin = selectedMode === 'boss' && lives > 0;

    onUpdateScore({
      worldIdx: activeWorld,
      stars: earnedStars,
      bossWon: isBossWin
    });

    if (isBossWin) {
      if (!muted) narrate(bossWinNarration(WORLDS[activeWorld].boss.name), true);
    } else {
      if (!muted) narrate(districtCompleteNarration(WORLDS[activeWorld].name, earnedStars), true);
    }

    setActiveWorld(null);
    setPendingWorld(null);
    setFeedback(null);
  };

  const currentBoss = pendingWorld !== null ? WORLDS[pendingWorld]?.boss : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-between p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Top Gamification Status Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between bg-[#14082c]/95 border-2 border-purple-400/35 rounded-2xl px-3 sm:px-5 py-2 shadow-2xl backdrop-blur-md z-20 shrink-0 mb-1">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <span className="text-base sm:text-lg">✨</span>
            <span className="font-display font-900 text-sm sm:text-base text-amber-300">{xp} XP</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-base sm:text-lg">🔥</span>
            <span className="font-display font-900 text-sm sm:text-base text-rose-400">
              {streak} <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">(Best: {bestStreak})</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-base sm:text-lg">⭐</span>
            <span className="font-display font-900 text-sm sm:text-base text-yellow-400">{totalStars}/30</span>
          </div>
        </div>

        {/* Right Controls: Badges Modal Trigger & Reflect CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBadgesModal(true)}
            className="ghost-btn min-h-[38px] text-xs sm:text-sm py-1.5 px-3 rounded-full flex items-center gap-1.5 cursor-pointer"
          >
            <span>🎖️</span>
            <span className="hidden sm:inline font-bold">Badges ({badges.length})</span>
          </button>

          <button
            onClick={onGoReflect}
            className={`min-h-[38px] px-3 sm:px-4 py-1.5 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
              allWorldsCompleted || totalStars >= 5
                ? 'gold-btn'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            <span>📝</span>
            <span>Reflect Phase →</span>
          </button>
        </div>
      </div>

      {/* ---------------- VIEW 1: WORLD MAP SELECTION ---------------- */}
      {activeWorld === null && (
        <div className="w-full max-w-5xl flex-1 min-h-0 flex flex-col justify-between items-center z-20 overflow-hidden">
          {/* Mode Selector Pill Tabs */}
          <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2.5 my-1 overflow-x-auto shrink-0 pb-1">
            {MODES.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMode(m.id)}
                  className={`min-h-[40px] px-3 sm:px-4 py-1.5 rounded-full font-display font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_16px_rgba(250,204,21,0.6)] scale-105'
                      : 'bg-[#180a36]/90 border border-white/15 text-slate-200 hover:border-amber-400/40'
                  }`}
                >
                  <span className="text-sm">{m.icon}</span>
                  <span>{m.name}</span>
                </button>
              );
            })}
          </div>

          {/* 10 Worlds Interactive Grid */}
          <KingdomMap
            worldResults={worldResults}
            onSelectWorld={(wIdx) => startWorldSession(wIdx)}
            totalStars={totalStars}
            onGoReflect={onGoReflect}
            allCompleted={allWorldsCompleted}
          />
        </div>
      )}

      {/* ---------------- VIEW 2: ACTIVE QUIZ WORKSPACE ---------------- */}
      {activeWorld !== null && questions[qIdx] && (
        <div className="w-full max-w-5xl flex-1 min-h-0 flex flex-col justify-between items-center z-20 overflow-hidden py-1">
          {/* Quiz Session Header Bar */}
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-1.5 mb-1 shrink-0">
            <button
              onClick={() => setActiveWorld(null)}
              className="text-xs sm:text-sm font-black text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              ← Back to Zones Map
            </button>

            <span className="font-display font-900 text-xs sm:text-sm text-amber-300">
              {WORLDS[activeWorld].name} · Question {qIdx + 1} of {questions.length}
            </span>

            {/* Lives or Timed Indicator */}
            {selectedMode === 'boss' && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-rose-300 font-bold mr-1">Lives:</span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`text-base ${i < lives ? 'text-rose-400' : 'text-slate-600'}`}>
                    ❤️
                  </span>
                ))}
              </div>
            )}
            {selectedMode === 'timed' && (
              <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-rose-400 bg-rose-950/70 border border-rose-400/40 px-2.5 py-0.5 rounded-full">
                <span>⏱️</span>
                <span>{timeLeft}s</span>
              </div>
            )}
          </div>

          {/* Active Question Renderer */}
          <QuestionRenderer
            question={questions[qIdx]}
            selectedOption={selectedOption}
            onSelectOption={handleOptionSelect}
            showHints={selectedMode === 'guided'}
            hintLevel={hintLevel}
            onUseHint={handleUseHint}
            onReplayAudio={() => narrate(questionNarration(questions[qIdx]), true)}
            disabled={selectedOption !== null || feedback !== null}
          />
        </div>
      )}

      {/* Feedback Overlay Modal on Answer */}
      {feedback && (
        <FeedbackOverlay
          status={feedback.status}
          title={feedback.title}
          explanation={feedback.explanation}
          xpGained={feedback.xpGained}
          badge={toastBadge}
          onNext={handleNextQuestion}
          nextLabel={qIdx < questions.length - 1 ? 'Next Problem →' : 'Finish Zone Session →'}
        />
      )}

      {/* Boss Battle Intro Modal (Fixes D1) */}
      {showBossIntro && currentBoss && (
        <BossBattleModal
          boss={currentBoss}
          lives={3}
          onStart={handleStartBossBattle}
          onClose={() => {
            setShowBossIntro(false);
            setPendingWorld(null);
          }}
        />
      )}

      {/* Badges Modal */}
      {showBadgesModal && (
        <BadgesModal
          unlockedBadges={badges}
          onClose={() => setShowBadgesModal(false)}
        />
      )}
    </div>
  );
}
