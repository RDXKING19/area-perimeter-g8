import React, { useState } from 'react';
import { Panel, Msg, GoldBtn, StepSlider } from './kit.jsx';
import { playClickSound } from '../../utils/audio.js';

export function FenceAndFill({ onComplete }) {
  const [round, setRound] = useState(0); // 0: fixed perimeter, 1: fixed area, 2: circular pond
  const [sliderVal, setSliderVal] = useState(4);
  const [successCount, setSuccessCount] = useState(0);
  const [isRoundSolved, setIsRoundSolved] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const isRound0 = round === 0;
  const isRound1 = round === 1;
  const isRound2 = round === 2;

  let currentVal = 0;
  let targetVal = 0;
  let isExact = false;
  let isClose = false;

  let lengthVal = 0;
  let widthVal = sliderVal;

  if (isRound0) {
    const P = 36;
    lengthVal = P / 2 - widthVal;
    currentVal = Math.max(0, widthVal * lengthVal);
    targetVal = 80;
    isExact = currentVal === 80;
    isClose = Math.abs(currentVal - targetVal) <= 12;
  } else if (isRound1) {
    const A = 48;
    lengthVal = Math.round(A / widthVal);
    currentVal = 2 * (widthVal + lengthVal);
    targetVal = 32;
    isExact = widthVal === 4 || widthVal === 12;
    isClose = Math.abs(currentVal - targetVal) <= 4;
  } else {
    // Circle
    currentVal = Math.round(3.14 * widthVal * widthVal * 100) / 100;
    targetVal = 314;
    isExact = widthVal === 10;
    isClose = Math.abs(currentVal - targetVal) <= 40;
  }

  const handleSliderChange = (val) => {
    playClickSound();
    setSliderVal(val);
    setIsChecked(false);
    setIsRoundSolved(false);
  };

  const handleCheckAnswer = () => {
    playClickSound();
    setIsChecked(true);
    if (isExact) {
      setIsRoundSolved(true);
      setShowHint(false);
    }
  };

  const handleNextRound = () => {
    playClickSound();
    if (round < 2) {
      setRound((r) => r + 1);
      setSuccessCount((c) => c + 1);
      setIsRoundSolved(false);
      setIsChecked(false);
      setShowHint(false);
      if (round === 0) setSliderVal(2);
      if (round === 1) setSliderVal(5);
    } else {
      setSuccessCount(3);
      setCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const getHintText = () => {
    if (isRound0) {
      return 'For a 36 m fence, Length = 18 - Width. Set Width to 8 m or 10 m to get Area = 8 × 10 = 80 m²!';
    }
    if (isRound1) {
      return 'Fixed Area = 48 m². To get Perimeter = 32 m, Width + Length = 16 m. Set Width to 4 m or 12 m!';
    }
    return 'Fountain Area = π × r² ≈ 3.14 × r². For Area = 314 m², r² = 100 → Set Radius to 10 m!';
  };

  // Dimensions for centered SVG visualization
  const boxW = Math.max(60, Math.min(280, lengthVal * 17.5));
  const boxH = Math.max(36, Math.min(100, isRound0 ? widthVal * 9.5 : widthVal * 12));
  const boxX = 210 - boxW / 2;
  const boxY = 82 - boxH / 2;

  // Target box reference dimensions
  const targetBoxW = isRound0 ? 10 * 17.5 : 12 * 17.5; // 175 or 210
  const targetBoxH = isRound0 ? 8 * 9.5 : 4 * 12;   // 76 or 48
  const targetBoxX = 210 - targetBoxW / 2;
  const targetBoxY = 82 - targetBoxH / 2;

  // Circle active radius
  const activeRadius = Math.min(70, Math.max(22, widthVal * 5.8));

  return (
    <Panel noScroll className="w-full h-full justify-between select-none overflow-hidden p-1.5 sm:p-2">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl">🎯</span>
          <span className="font-display font-900 text-sm sm:text-base md:text-lg text-white">
            {isRound0 && 'Section B: Round 1 — Fixed Fence (36 m) → Target 80 m²'}
            {isRound1 && 'Section B: Round 2 — Fixed Area (48 m²) → Target 32 m'}
            {isRound2 && 'Section B: Round 3 — Circular Fountain → Target 314 m²'}
          </span>
        </div>
        <div className="bg-amber-400/25 border border-amber-400/60 rounded-full px-3 py-0.5 text-xs sm:text-sm font-black text-amber-300 whitespace-nowrap shrink-0">
          Target: {successCount} / 3 Solved
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="w-full h-[110px] sm:h-[120px] md:h-[130px] bg-[#120726]/90 border border-purple-400/30 rounded-xl p-1 flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg">
        {!isRound2 ? (
          <svg viewBox="0 0 420 160" className="w-full h-full">
            {/* Target Outline (Ghost reference ring) */}
            <rect
              x={targetBoxX}
              y={targetBoxY}
              width={targetBoxW}
              height={targetBoxH}
              rx="8"
              fill="none"
              stroke={isExact ? '#4ade80' : isClose ? '#facc15' : 'rgba(255,255,255,0.25)'}
              strokeWidth={isExact ? '3.5' : '2'}
              strokeDasharray={isExact ? 'none' : '5,5'}
            />
            {/* Target Label Pill */}
            <rect x="105" y="5" width="210" height="24" rx="6" fill="rgba(18,7,38,0.92)" stroke="#facc15" strokeWidth="1.5" />
            <text x={210} y="21" textAnchor="middle" fontSize="14" fontWeight="900" fill="#facc15">
              Target Boundary: {targetVal} {isRound1 ? 'm' : 'm²'}
            </text>

            {/* Active Sized Rectangle */}
            <rect
              x={boxX}
              y={boxY}
              width={boxW}
              height={boxH}
              rx="8"
              fill={isExact ? 'rgba(74,222,128,0.35)' : 'rgba(56,189,248,0.25)'}
              stroke={isExact ? '#4ade80' : '#38bdf8'}
              strokeWidth="3.5"
            />

            {/* Enlarged External Markings: Length (Bottom) & Width (Left) */}
            <text x={boxX + boxW / 2} y={Math.min(154, boxY + boxH + 19)} textAnchor="middle" fontSize="16" fontWeight="900" fill="#ffffff">
              Length = {lengthVal} m
            </text>
            <text x={Math.max(16, boxX - 10)} y={boxY + boxH / 2 + 6} textAnchor="end" fontSize="16" fontWeight="900" fill="#38bdf8">
              Width = {widthVal} m
            </text>

            {/* Center Area Pill Badge inside active box */}
            <rect x={boxX + boxW / 2 - 85} y={boxY + boxH / 2 - 16} width="170" height="32" rx="7" fill="rgba(18,7,38,0.95)" stroke={isExact ? '#4ade80' : '#38bdf8'} strokeWidth="2" />
            <text x={boxX + boxW / 2} y={boxY + boxH / 2 + 5} textAnchor="middle" fontSize="16" fontWeight="900" fill={isExact ? '#4ade80' : '#facc15'}>
              {isRound0 ? `Area: ${currentVal} m²` : `Perimeter: ${currentVal} m`}
            </text>
          </svg>
        ) : (
          <svg viewBox="0 0 420 160" className="w-full h-full">
            {/* Target Reference Circle */}
            <circle
              cx="210"
              cy="76"
              r="58"
              fill="none"
              stroke={isExact ? '#4ade80' : '#facc15'}
              strokeWidth="2.5"
              strokeDasharray={isExact ? 'none' : '5,5'}
            />
            {/* Target Label Pill */}
            <rect x="85" y="5" width="250" height="24" rx="6" fill="rgba(18,7,38,0.92)" stroke="#facc15" strokeWidth="1.5" />
            <text x="210" y="21" textAnchor="middle" fontSize="14" fontWeight="900" fill="#facc15">
              Target Water Area: 314 m² (r = 10 m)
            </text>

            {/* Active Circle Pond */}
            <circle
              cx="210"
              cy="76"
              r={activeRadius}
              fill={isExact ? 'rgba(74,222,128,0.35)' : 'rgba(56,189,248,0.25)'}
              stroke={isExact ? '#4ade80' : '#38bdf8'}
              strokeWidth="3.5"
            />
            <line x1="210" y1="76" x2={210 + activeRadius} y2="76" stroke="#facc15" strokeWidth="3" />
            <text x={210 + activeRadius / 2} y="68" textAnchor="middle" fontSize="16" fontWeight="900" fill="#facc15">
              r = {widthVal} m
            </text>
            <rect x="95" y="128" width="230" height="26" rx="6" fill="rgba(18,7,38,0.95)" stroke={isExact ? '#4ade80' : '#38bdf8'} strokeWidth="1.5" />
            <text x="210" y="146" textAnchor="middle" fontSize="14" fontWeight="900" fill={isExact ? '#4ade80' : '#6ee7b7'}>
              Area = 3.14 × {widthVal}² = {currentVal} m²
            </text>
          </svg>
        )}
      </div>

      {/* Target Status Meter */}
      <div className="w-full grid grid-cols-3 gap-2 text-center shrink-0">
        <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
          <span className="text-xs sm:text-sm text-slate-200 block font-bold leading-tight">Target Value</span>
          <span className="text-base sm:text-lg md:text-xl font-black text-amber-300">
            {targetVal} {isRound1 ? 'm' : 'm²'}
          </span>
        </div>
        <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
          <span className="text-xs sm:text-sm text-slate-200 block font-bold leading-tight">Current Value</span>
          <span className={`text-base sm:text-lg md:text-xl font-black ${isExact ? 'text-emerald-400' : 'text-cyan-300'}`}>
            {currentVal} {isRound1 ? 'm' : 'm²'}
          </span>
        </div>
        <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
          <span className="text-xs sm:text-sm text-slate-200 block font-bold leading-tight">Match Status</span>
          <span className={`text-xs sm:text-sm md:text-base font-black ${isExact ? 'text-emerald-400' : isClose ? 'text-amber-300' : 'text-slate-400'}`}>
            {isExact ? '✓ EXACT MATCH!' : isClose ? '⚠️ ALMOST THERE!' : 'Adjust slider'}
          </span>
        </div>
      </div>

      {/* Slider Control */}
      <div className="w-full shrink-0">
        {isRound0 && (
          <StepSlider
            value={sliderVal}
            min={1}
            max={17}
            step={1}
            onChange={handleSliderChange}
            label="Plot Width (w)"
            unit=" m"
          />
        )}
        {isRound1 && (
          <StepSlider
            value={sliderVal}
            min={1}
            max={16}
            step={1}
            onChange={handleSliderChange}
            label="Plot Width (w)"
            unit=" m"
          />
        )}
        {isRound2 && (
          <StepSlider
            value={sliderVal}
            min={1}
            max={15}
            step={1}
            onChange={handleSliderChange}
            label="Pond Radius (r)"
            unit=" m"
          />
        )}
      </div>

      {/* Interactive Mission & Verification Card */}
      <div className="w-full bg-[#180a36] border border-cyan-400/40 rounded-xl p-2 sm:p-2.5 flex flex-col gap-1.5 shrink-0 shadow-lg">
        <span className="font-display font-900 text-xs sm:text-sm md:text-base text-amber-300 leading-snug">
          {isRound0 && 'Architect Tally’s Mission: Adjust width slider to reshape 36 m fence until lawn area reaches 80 m²!'}
          {isRound1 && 'Architect Tally’s Mission: Adjust width slider for fixed 48 m² garden to minimize fence to 32 m!'}
          {isRound2 && 'Architect Tally’s Mission: Adjust radius slider to size circular fountain until water area reaches 314 m²!'}
        </span>

        {/* 2 Interactive Formula & Live Dimension Rows */}
        <div className="grid grid-cols-1 gap-1.5 w-full">
          <div
            className={`min-h-[34px] px-3 py-1 rounded-xl border text-xs sm:text-sm md:text-base font-bold flex items-center justify-between transition ${
              isExact
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                : isClose
                ? 'bg-amber-950/80 border-amber-400/70 text-amber-100'
                : 'bg-white/5 border-white/10 text-slate-200'
            }`}
          >
            <span>
              {isRound0 && `📏 Dimensions: Width = ${widthVal} m | Length = ${lengthVal} m (Fence: 36 m)`}
              {isRound1 && `📏 Dimensions: Width = ${widthVal} m | Length = ${lengthVal} m (Area: 48 m²)`}
              {isRound2 && `📏 Dimensions: Radius (r) = ${widthVal} m | Diameter = ${widthVal * 2} m`}
            </span>
            <span className="shrink-0 text-xs font-black">
              {isExact ? '✓ Correct Sizing' : isClose ? '⚡ Almost' : '● In Progress'}
            </span>
          </div>

          <div
            className={`min-h-[34px] px-3 py-1 rounded-xl border text-xs sm:text-sm md:text-base font-bold flex items-center justify-between transition ${
              isExact
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                : isClose
                ? 'bg-amber-950/80 border-amber-400/70 text-amber-100'
                : 'bg-white/5 border-white/10 text-slate-200'
            }`}
          >
            <span>
              {isRound0 && `📐 Live Calculation: Area = ${widthVal} × ${lengthVal} = ${currentVal} m² (Target: 80 m²)`}
              {isRound1 && `📐 Live Calculation: Perimeter = 2 × (${widthVal} + ${lengthVal}) = ${currentVal} m (Target: 32 m)`}
              {isRound2 && `📐 Live Calculation: Area = 3.14 × ${widthVal}² = ${currentVal} m² (Target: 314 m²)`}
            </span>
            <span className="shrink-0 text-xs font-black">
              {isExact ? '🎯 Target Matched!' : isClose ? '⚠️ Very Close!' : '● Adjust Slider'}
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="w-full flex items-center justify-between gap-2 pt-1 border-t border-white/10">
          <button
            onClick={() => {
              playClickSound();
              setShowHint(!showHint);
            }}
            className="text-xs sm:text-sm font-black text-purple-200 hover:text-white bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer min-h-[34px]"
          >
            <span>💡</span>
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          {!isRoundSolved ? (
            <button
              onClick={handleCheckAnswer}
              className="gold-btn min-h-[34px] text-xs sm:text-sm font-black px-4 py-1.5 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Check Answer ✓
            </button>
          ) : (
            <GoldBtn onClick={handleNextRound} className="min-h-[34px] text-xs sm:text-sm py-1.5 px-4 shrink-0">
              {round < 2 ? 'Next Target Plot →' : 'Complete Section B ✓'}
            </GoldBtn>
          )}
        </div>

        {/* Expandable Hint Box */}
        {showHint && (
          <div className="w-full bg-gradient-to-r from-purple-950/95 via-[#230f47]/95 to-purple-950/95 border border-amber-400/60 rounded-xl p-2 text-xs sm:text-sm text-purple-100 font-bold flex items-start gap-2 shadow-[0_0_14px_rgba(250,204,21,0.2)] shrink-0">
            <span className="text-lg shrink-0">💡</span>
            <div className="leading-snug">
              <span className="font-display font-900 text-amber-300 mr-1.5">
                Architect Tally’s Hint:
              </span>
              <span>{getHintText()}</span>
            </div>
          </div>
        )}

        {/* Result Feedback when checked */}
        {isChecked && (
          <Msg tone={isRoundSolved ? 'emerald' : 'rose'}>
            {isRoundSolved
              ? `🎉 You have chosen and solved it correctly! Target value ${targetVal} ${isRound1 ? 'm' : 'm²'} matched perfectly!`
              : `✗ Not quite! Current value is ${currentVal} ${isRound1 ? 'm' : 'm²'}, but target is ${targetVal} ${isRound1 ? 'm' : 'm²'}. Adjust slider or click "Show Hint"!`}
          </Msg>
        )}

        {completed && (
          <Msg tone="emerald">
            Section B Completed! Fence & Fill certified by Architect Tally.
          </Msg>
        )}
      </div>
    </Panel>
  );
}
