import React from 'react';
import { AreaVisual } from '../shared/AreaVisual.jsx';

export function QuestionRenderer({
  question,
  selectedOption = null,
  onSelectOption,
  showHints = false,
  hintLevel = 0,
  onUseHint,
  onReplayAudio,
  disabled = false
}) {
  if (!question) return null;

  return (
    <div className="w-full flex flex-col items-center gap-2 sm:gap-2.5 max-w-3xl sm:max-w-4xl my-auto">
      {/* Concept Tag Pill & Listen Button Row */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="inline-flex items-center gap-1.5 bg-[#2a1752] border border-purple-400/40 px-3.5 py-1 rounded-full text-purple-200 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <span>📏</span>
          <span>{question.category ? question.category.replace(/-/g, ' ') : 'Park Survey'}</span>
        </div>

        {onReplayAudio && (
          <button
            onClick={onReplayAudio}
            className="inline-flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/35 border border-amber-400/50 px-3 py-1 rounded-full text-amber-300 text-xs sm:text-sm font-black transition-all cursor-pointer"
            title="Listen to question narration again"
          >
            <span>🔊</span>
            <span className="hidden sm:inline">Listen Again</span>
          </button>
        )}
      </div>

      {/* Main Question Text */}
      <h3 className="font-display font-900 text-base sm:text-xl md:text-2xl text-white text-center leading-snug max-w-3xl shrink-0 px-2">
        {question.questionText}
      </h3>

      {/* Visual Diagram - Enlarged and Centered */}
      <div className="w-full max-w-xl sm:max-w-2xl h-40 sm:h-48 md:h-52 min-h-[160px] max-h-[30dvh] bg-[#120726]/90 border-2 border-purple-400/35 rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 flex items-center justify-center shadow-2xl relative overflow-hidden shrink-0">
        <AreaVisual type={question.visual} data={question.visualData} />
      </div>

      {/* Hint Banner (if active in Guided Mode) */}
      {hintLevel > 0 && (
        <div className="w-full max-w-2xl bg-amber-950/70 border border-amber-400/60 rounded-xl p-2.5 sm:p-3 text-left shrink-0">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase mb-0.5">
            <span>💡</span>
            <span>Architect Tally's Clue #{hintLevel}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-100 font-extrabold leading-snug">
            {hintLevel === 1 ? question.hint1 : question.hint2}
          </p>
        </div>
      )}

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-2xl sm:max-w-3xl shrink-0">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === opt;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectOption(opt)}
              className={`min-h-[44px] py-2.5 sm:py-3 px-4 sm:px-5 rounded-2xl border-2 font-display font-900 text-sm sm:text-base md:text-lg flex items-center justify-between text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-amber-400 bg-[#351b68] text-white shadow-[0_0_18px_rgba(250,204,21,0.5)] scale-[1.02]'
                  : 'border-white/15 bg-[#170b33]/90 text-slate-100 hover:border-amber-400/50 hover:bg-[#201042]'
              } disabled:cursor-not-allowed`}
            >
              <span className="flex-1 font-bold">{opt}</span>
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-xs sm:text-sm text-slate-200 ml-2 shrink-0">
                {String.fromCharCode(65 + idx)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Hint Trigger Button (for Guided mode) */}
      {showHints && hintLevel < 2 && (
        <button
          onClick={onUseHint}
          disabled={disabled}
          className="text-xs sm:text-sm text-amber-300 hover:text-amber-200 font-extrabold flex items-center gap-1.5 underline cursor-pointer mt-0.5 shrink-0"
        >
          <span>💡 Need a hint? ({2 - hintLevel} remaining)</span>
        </button>
      )}
    </div>
  );
}
