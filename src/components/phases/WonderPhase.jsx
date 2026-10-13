import React, { useEffect } from 'react';
import { FloatingSymbols } from '../shared/FloatingSymbols.jsx';
import { AreaVisual } from '../shared/AreaVisual.jsx';
import { narrate, stopNarration } from '../../utils/audio.js';
import { wonderNarration } from '../../utils/narration.js';

export function WonderPhase({ muted, onNext }) {
  useEffect(() => {
    if (!muted) narrate(wonderNarration(), true);
    return () => stopNarration();
  }, [muted]);

  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      <div className="w-full max-w-4xl glass-panel-strong flex flex-col items-center text-center z-20 my-auto py-2.5 sm:py-3.5 px-3 sm:px-6 max-h-[calc(100dvh-var(--header-h)-16px)] justify-between overflow-hidden">
        {/* Phase Header */}
        <div className="flex items-center gap-2 mb-1 shrink-0">
          <span className="text-2xl sm:text-3xl">🌾</span>
          <span className="text-purple-300 font-display font-800 text-xs sm:text-sm tracking-wider uppercase">
            Phase 1: Wonder & Curiosity
          </span>
        </div>

        <h2 className="font-display font-900 text-2xl sm:text-3xl md:text-4xl text-amber-300 mb-1.5 sm:mb-2 max-w-2xl shrink-0 leading-tight">
          The Fence Dilemma
        </h2>

        {/* Feature Visual Box: Side-by-side plots */}
        <div className="w-full bg-[#1e143c]/90 border border-purple-400/30 rounded-2xl p-2.5 sm:p-3 mb-1.5 sm:mb-2 flex flex-col items-center shadow-xl shrink-0">
          <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-4 items-center justify-center mb-1.5">
            {/* Plot A: Hafiz */}
            <div className="bg-[#12082b]/80 border border-cyan-400/30 rounded-xl p-2 sm:p-2.5 flex flex-col items-center">
              <span className="text-xs sm:text-sm md:text-base font-black text-cyan-300 mb-1">
                Hafiz’s Plot: 25 m by 5 m
              </span>
              <div className="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center">
                <AreaVisual type="rect" data={{ l: 25, w: 5, unit: 'm', show: ['perimeter'] }} compact />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-extrabold text-slate-200 mt-1">
                Perimeter = 2×(25+5) = 60 m
              </span>
            </div>

            {/* Plot B: Mei Ling */}
            <div className="bg-[#12082b]/80 border border-amber-400/30 rounded-xl p-2 sm:p-2.5 flex flex-col items-center">
              <span className="text-xs sm:text-sm md:text-base font-black text-amber-300 mb-1">
                Mei Ling’s Plot: 15 m by 15 m
              </span>
              <div className="w-full h-20 sm:h-24 md:h-28 flex items-center justify-center">
                <AreaVisual type="rect" data={{ l: 15, w: 15, unit: 'm', show: ['perimeter'] }} compact />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-extrabold text-slate-200 mt-1">
                Perimeter = 4×15 = 60 m
              </span>
            </div>
          </div>

          <div className="text-amber-300 text-sm sm:text-base md:text-lg font-display font-900 mb-1 leading-snug">
            Both gardens use all 60 m of fence. Do they enclose the same amount of grass?
          </div>
          <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl leading-normal font-bold">
            Hafiz and Mei Ling both used the exact same 60 metres of fencing wire. Does equal boundary fence always guarantee equal surface space inside?
          </p>
        </div>

        {/* Mascot Thinking Bubble */}
        <div className="flex items-center gap-2.5 bg-[#14082c]/90 border border-purple-500/40 rounded-2xl sm:rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 mb-1.5 sm:mb-2 shrink-0 max-w-2xl">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold text-base sm:text-lg shrink-0">
            🦉
          </div>
          <p className="text-slate-100 text-xs sm:text-sm md:text-base font-bold text-left leading-snug">
            "Before ordering turf or paving: remember that perimeter and area measure two entirely different things!"
          </p>
        </div>

        <button
          onClick={onNext}
          className="gold-btn min-h-[42px] sm:min-h-[46px] text-sm sm:text-base px-7 py-2 sm:py-2.5 rounded-full flex items-center gap-2 cursor-pointer shrink-0 font-display font-900 shadow-lg hover:scale-105 transition"
        >
          <span>Unroll the Blueprints</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
