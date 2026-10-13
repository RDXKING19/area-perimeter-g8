import React from 'react';
import { FloatingSymbols } from './shared/FloatingSymbols.jsx';

export function IntroScreen({ onBegin }) {
  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-5 relative overflow-hidden select-none z-10">
      <FloatingSymbols />

      {/* Main Intro Content Card */}
      <div className="relative w-full max-w-4xl flex flex-col items-center text-center z-20 my-auto justify-between overflow-hidden py-1">
        {/* Curriculum Pill Badge */}
        <div className="bg-[#1c0d38] border-2 border-amber-400/50 text-amber-300 text-xs sm:text-sm font-900 px-5 py-1 rounded-full shadow-lg mb-2 tracking-wide shrink-0">
          ✨ Grade 8 · Measurement & Plane Figures
        </div>

        {/* Title */}
        <h1 className="font-display font-900 text-3xl sm:text-5xl md:text-6xl text-white text-center leading-tight tracking-tight mb-2 shrink-0">
          Area & Perimeter
          <span className="text-[#facc15] font-900 block drop-shadow-[0_0_24px_rgba(250,204,21,0.65)]">
            Sunrise Park Planning Studio
          </span>
        </h1>

        {/* Mascot Avatar & Speech Pill */}
        <div className="flex items-center gap-2 mb-2 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#facc15] p-0.5 shadow-[0_0_20px_rgba(250,204,21,0.7)] flex items-center justify-center text-lg sm:text-xl shrink-0">
            🦉
          </div>
          <div className="bg-white rounded-full px-5 py-1 text-[#0c031d] font-display font-900 text-xs sm:text-sm md:text-base shadow-lg">
            Ready to design Sunrise Park with Architect Tally? 📐
          </div>
        </div>

        {/* Subtitle text */}
        <p className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl text-center leading-relaxed mb-3 font-bold drop-shadow-sm shrink-0">
          Join junior planners Hafiz and Mei Ling to master perimeter around boundaries and area inside shapes across rectangles, triangles, parallelograms, trapezia, circles, and composite park grounds!
        </p>

        {/* YOUR LEARNING JOURNEY Flow Card */}
        <div className="w-full max-w-3xl bg-[#14082c]/95 border-2 border-purple-400/40 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md flex flex-col items-center mb-3 shrink-0">
          <p className="text-[#facc15] text-xs sm:text-sm font-display font-900 tracking-wider text-center mb-2 uppercase">
            YOUR 5-PHASE LEARNING JOURNEY
          </p>

          {/* Top Row: Wonder -> Story -> Simulate */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 w-full mb-2">
            {/* Wonder */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-purple-400 bg-purple-950/90 text-purple-200 flex items-center justify-center text-sm shadow-[0_0_14px_rgba(192,132,252,0.6)] mb-0.5">
                🌾
              </div>
              <p className="font-display font-900 text-white text-xs leading-tight">Wonder</p>
              <p className="text-slate-300 text-[10px] font-semibold">The Fence Dilemma</p>
            </div>
            <span className="text-amber-400 font-black text-xs mb-2">→</span>

            {/* Story */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-amber-400 bg-amber-950/90 text-amber-200 flex items-center justify-center text-sm shadow-[0_0_14px_rgba(251,191,36,0.6)] mb-0.5">
                📖
              </div>
              <p className="font-display font-900 text-white text-xs leading-tight">Story</p>
              <p className="text-slate-300 text-[10px] font-semibold">4 Plan Sheets</p>
            </div>
            <span className="text-amber-400 font-black text-xs mb-2">→</span>

            {/* Simulate */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-teal-400 bg-teal-950/90 text-teal-200 flex items-center justify-center text-sm shadow-[0_0_14px_rgba(45,212,191,0.6)] mb-0.5">
                🧪
              </div>
              <p className="font-display font-900 text-white text-xs leading-tight">Simulate</p>
              <p className="text-slate-300 text-[10px] font-semibold">3 Site Lab Sections</p>
            </div>
          </div>

          {/* Bottom Row: Practice -> Reflect */}
          <div className="flex items-center justify-center gap-5 sm:gap-10 w-full">
            {/* Practice */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-400 bg-emerald-950/90 text-emerald-200 flex items-center justify-center text-sm shadow-[0_0_14px_rgba(52,211,153,0.6)] mb-0.5">
                🎮
              </div>
              <p className="font-display font-900 text-white text-xs leading-tight">Practice</p>
              <p className="text-slate-300 text-[10px] font-semibold">10 Park Zones</p>
            </div>
            <span className="text-amber-400 font-black text-xs mb-2">→</span>

            {/* Reflect */}
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-indigo-400 bg-indigo-950/90 text-indigo-200 flex items-center justify-center text-sm shadow-[0_0_14px_rgba(129,140,248,0.6)] mb-0.5">
                📝
              </div>
              <p className="font-display font-900 text-white text-xs leading-tight">Reflect</p>
              <p className="text-slate-300 text-[10px] font-semibold">Scorecard & Review</p>
            </div>
          </div>
        </div>

        {/* Begin Button */}
        <button
          onClick={onBegin}
          className="gold-btn min-h-[48px] font-display font-900 text-base sm:text-lg px-8 sm:px-12 py-3 rounded-full shadow-[0_0_28px_rgba(250,204,21,0.65)] hover:scale-105 transition-all cursor-pointer shrink-0"
        >
          <span>Enter Planning Studio</span>
          <span className="ml-2">→</span>
        </button>
      </div>
    </div>
  );
}
