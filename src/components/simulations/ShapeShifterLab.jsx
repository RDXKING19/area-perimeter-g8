import React, { useState } from 'react';
import { Panel, Msg, GoldBtn, StepSlider } from './kit.jsx';
import { playClickSound } from '../../utils/audio.js';

export function ShapeShifterLab({ onComplete }) {
  const [shear, setShear] = useState(0); // 0 to 6
  
  // MCQ state
  const [selectedOption, setSelectedOption] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const base = 8;
  const height = 5;
  const slant = Math.round(Math.sqrt(height * height + shear * shear) * 10) / 10;

  const handleOptionSelect = (idx) => {
    playClickSound();
    setSelectedOption(idx);
    setIsChecked(false);
  };

  const handleCheckAnswer = () => {
    playClickSound();
    if (selectedOption === null) {
      setIsChecked(true);
      return;
    }
    setIsChecked(true);
    if (selectedOption === 0) {
      setIsSolved(true);
      setShowHint(false);
    }
  };

  const handleFinish = () => {
    playClickSound();
    setCompleted(true);
    if (onComplete) onComplete();
  };

  const options = [
    {
      id: 0,
      text: 'No! Base (8 m) and 90° Height (5 m) stay the same, so Area remains 40 m².',
      isCorrect: true
    },
    {
      id: 1,
      text: 'Yes! Because the slanted side grew longer, the area must become larger.',
      isCorrect: false
    }
  ];

  return (
    <Panel noScroll className="w-full h-full justify-between select-none overflow-hidden p-1.5 sm:p-2">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl">📐</span>
          <span className="font-display font-900 text-sm sm:text-base md:text-lg text-white">
            Section A: Shape Shifter Lab — Parallelogram Shear
          </span>
        </div>
        <div className="bg-cyan-500/25 border border-cyan-400/60 rounded-full px-3 py-0.5 text-xs sm:text-sm font-black text-cyan-300 whitespace-nowrap shrink-0">
          Fixed Area: 40 m²
        </div>
      </div>

      {/* Interactive Visual Blueprint Canvas */}
      <div className="w-full h-[110px] sm:h-[120px] md:h-[130px] bg-[#120726]/90 border border-purple-400/30 rounded-xl p-1 flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg">
        <svg viewBox="0 0 420 160" className="w-full h-full" style={{ touchAction: 'none' }}>
          {/* Ghost original reference rectangle */}
          <rect x="70" y="24" width="190" height="96" rx="5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="4,4" />

          {/* Dynamic Sheared Parallelogram */}
          <polygon
            points={`70,120 260,120 ${260 + shear * 16},24 ${70 + shear * 16},24`}
            fill="rgba(74,222,128,0.28)"
            stroke="#4ade80"
            strokeWidth="3.5"
          />

          {/* Cut-and-move triangle representation if sheared */}
          {shear > 0 && (
            <polygon
              points={`70,120 70,24 ${70 + shear * 16},24`}
              fill="rgba(250,204,21,0.25)"
              stroke="#facc15"
              strokeWidth="2.5"
              strokeDasharray="3,3"
            />
          )}

          {/* Perpendicular Height 90° dashed line */}
          <line x1={70 + shear * 16} y1="24" x2={70 + shear * 16} y2="120" stroke="#facc15" strokeWidth="2.5" strokeDasharray="4,4" />
          {/* Right Angle 90° square marker */}
          <path
            d={`M ${70 + shear * 16} 104 L ${70 + shear * 16 + 16} 104 L ${70 + shear * 16 + 16} 120`}
            fill="none"
            stroke="#facc15"
            strokeWidth="2"
          />

          {/* Dimension line for base */}
          <line x1="70" y1="128" x2="260" y2="128" stroke="#ffffff" strokeWidth="2" />
          <line x1="70" y1="124" x2="70" y2="132" stroke="#ffffff" strokeWidth="2" />
          <line x1="260" y1="124" x2="260" y2="132" stroke="#ffffff" strokeWidth="2" />

          {/* Enlarged High-Visibility Markings */}
          <text x="165" y="146" textAnchor="middle" fontSize="16" fontWeight="900" fill="#ffffff">
            Base = 8 m (Fixed)
          </text>

          {/* Height Marking Pill Badge */}
          <rect x={70 + shear * 16 + 10} y="48" width="118" height="26" rx="5" fill="rgba(18,7,38,0.9)" stroke="#facc15" strokeWidth="1.5" />
          <text x={70 + shear * 16 + 16} y="66" fontSize="14" fontWeight="900" fill="#facc15">
            Height = 5 m (90°)
          </text>

          {/* Slant Marking Pill Badge */}
          <rect x={260 + shear * 16 + 10} y="48" width="102" height="26" rx="5" fill="rgba(18,7,38,0.9)" stroke="#38bdf8" strokeWidth="1.5" />
          <text x={260 + shear * 16 + 16} y="66" fontSize="14" fontWeight="900" fill="#38bdf8">
            Slant = {slant} m
          </text>

          {/* Center Area Pill Badge */}
          <rect x={165 + shear * 8 - 85} y="76" width="170" height="28" rx="6" fill="rgba(6,78,59,0.9)" stroke="#34d399" strokeWidth="1.5" />
          <text x={165 + shear * 8} y="95" textAnchor="middle" fontSize="15" fontWeight="900" fill="#6ee7b7">
            Area = 8 × 5 = 40 m²
          </text>
        </svg>
      </div>

      {/* Live Readouts Bar */}
      <div className="w-full grid grid-cols-3 gap-2 text-center shrink-0">
        <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
          <span className="text-xs sm:text-sm text-slate-200 block font-bold leading-tight">Base</span>
          <span className="text-base sm:text-lg md:text-xl font-black text-amber-300">8 m</span>
        </div>
        <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
          <span className="text-xs sm:text-sm text-slate-200 block font-bold leading-tight">90° Height</span>
          <span className="text-base sm:text-lg md:text-xl font-black text-amber-300">5 m</span>
        </div>
        <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
          <span className="text-xs sm:text-sm text-slate-200 block font-bold leading-tight">Grass Area</span>
          <span className="text-base sm:text-lg md:text-xl font-black text-emerald-400">40 m² (Fixed!)</span>
        </div>
      </div>

      {/* Interactive Control: Step Slider */}
      <div className="w-full shrink-0">
        <StepSlider
          value={shear}
          min={0}
          max={6}
          step={1}
          onChange={(val) => {
            playClickSound();
            setShear(val);
          }}
          label="Shear Offset"
          unit=" m"
        />
      </div>

      {/* Interactive Challenge & Verification Box */}
      <div className="w-full bg-[#180a36] border border-cyan-400/40 rounded-xl p-2 sm:p-2.5 flex flex-col gap-1.5 shrink-0 shadow-lg">
        <span className="font-display font-900 text-xs sm:text-sm md:text-base text-amber-300 leading-snug">
          Architect Tally's Challenge: When you shear the garden plot, does its grass area change?
        </span>

        {/* Clear Options */}
        <div className="grid grid-cols-1 gap-1.5 w-full">
          {options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            let btnStyle = 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10';

            if (isSelected) {
              if (isChecked) {
                btnStyle = opt.isCorrect
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                  : 'bg-rose-950/90 border-rose-400 text-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.4)]';
              } else {
                btnStyle = 'bg-cyan-950/90 border-cyan-400 text-cyan-100 shadow-[0_0_10px_rgba(56,189,248,0.3)]';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleOptionSelect(opt.id)}
                className={`min-h-[34px] px-3 py-1 rounded-xl border text-xs sm:text-sm md:text-base font-bold text-left transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
              >
                <span>{opt.text}</span>
                {isSelected && (
                  <span className="shrink-0 text-xs font-black">
                    {isChecked ? (opt.isCorrect ? '✓ Correct!' : '✗ Try again') : '● Selected'}
                  </span>
                )}
              </button>
            );
          })}
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

          {!isSolved ? (
            <button
              onClick={handleCheckAnswer}
              className="gold-btn min-h-[34px] text-xs sm:text-sm font-black px-4 py-1.5 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Check Answer ✓
            </button>
          ) : (
            <GoldBtn onClick={handleFinish} className="min-h-[34px] text-xs sm:text-sm py-1.5 px-4 shrink-0">
              {completed ? 'Section A Completed ✓' : 'Complete Section A ✓'}
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
              <span>
                Look at the 90° yellow line: Base (8 m) and Height (5 m) stay fixed! Area = 8 × 5 = 40 m² always. Tilting only increases the slant and outer fence perimeter.
              </span>
            </div>
          </div>
        )}

        {/* Feedback Message */}
        {isChecked && selectedOption === null && (
          <Msg tone="amber">
            ⚠️ Please select an answer option above before checking!
          </Msg>
        )}

        {isChecked && selectedOption !== null && (
          <Msg tone={isSolved ? 'emerald' : 'rose'}>
            {isSolved
              ? '🎉 You have chosen and solved it correctly! Area strictly depends on 90° height, not slant!'
              : '✗ Not quite! Slant grows, but 90° height stays 5 m (Area = 40 m²). Click "Show Hint" to explore!'}
          </Msg>
        )}

        {completed && (
          <Msg tone="emerald">
            Section A Completed! Shape Shifter Lab verified by Architect Tally.
          </Msg>
        )}
      </div>
    </Panel>
  );
}
