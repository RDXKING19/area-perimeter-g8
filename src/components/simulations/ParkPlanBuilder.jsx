import React, { useState } from 'react';
import { Panel, Msg, GoldBtn } from './kit.jsx';
import { playClickSound } from '../../utils/audio.js';

export function ParkPlanBuilder({ onComplete }) {
  const [blueprint, setBlueprint] = useState(0); // 0: Additive (Lawn + Patio), 1: Subtractive (Plaza - Fountain)
  const [activeMode, setActiveMode] = useState('area'); // 'area' | 'perimeter'

  // Answer states
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);

  const isBlueprint0 = blueprint === 0;

  const handleModeChange = (mode) => {
    playClickSound();
    setActiveMode(mode);
    setSelectedOpt(null);
    setIsChecked(false);
    setIsSolved(false);
    setShowHint(false);
  };

  const handleSelectOpt = (idx) => {
    playClickSound();
    setSelectedOpt(idx);
    setIsChecked(false);
  };

  const handleCheckAnswer = () => {
    playClickSound();
    if (selectedOpt === null) {
      setIsChecked(true);
      return;
    }
    setIsChecked(true);
    if (selectedOpt === 0) {
      setIsSolved(true);
    }
  };

  const handleAdvance = () => {
    playClickSound();
    if (blueprint === 0) {
      setBlueprint(1);
      setActiveMode('area');
      setSelectedOpt(null);
      setIsChecked(false);
      setIsSolved(false);
      setShowHint(false);
    } else {
      setCompleted(true);
      if (onComplete) onComplete();
    }
  };

  const currentChallenge = isBlueprint0
    ? activeMode === 'area'
      ? {
          question: 'Architect Tally’s Question: How do we calculate the total surface area of this combined park ground?',
          options: [
            { id: 0, text: 'Add the separate region areas together: 80 m² + 25 m² = 105 m².', isCorrect: true },
            { id: 1, text: 'Subtract the patio from the lawn: 80 m² - 25 m² = 55 m².', isCorrect: false }
          ],
          hint: 'When two sub-regions are joined together into one park, calculate each region separately and add them together: Lawn (80 m²) + Patio (25 m²) = 105 m².'
        }
      : {
          question: 'Architect Tally’s Question: When measuring the fence perimeter around the park, do we count the inside dividing wall?',
          options: [
            { id: 0, text: 'No! Perimeter measures ONLY the outer outside boundary fence (skip inside dividers)!', isCorrect: true },
            { id: 1, text: 'Yes! We must build a fence on all lines, including lines inside the park.', isCorrect: false }
          ],
          hint: 'Perimeter is strictly the outside fence enclosing the property. Interior dividing walls or paths inside the park do NOT count toward outer perimeter!'
        }
    : activeMode === 'area'
    ? {
        question: 'Architect Tally’s Question: For this plaza with a corner cut-out fountain, how do we find the usable stone area?',
        options: [
          { id: 0, text: 'Subtract the cut-out fountain area: 120 m² - 20 m² = 100 m².', isCorrect: true },
          { id: 1, text: 'Add the cut-out fountain to the plaza: 120 m² + 20 m² = 140 m².', isCorrect: false }
        ],
        hint: 'When a shape has an opening or cut-out removed from it, subtract the removed shape: Total Plaza (120 m²) - Cut-out Fountain (20 m²) = 100 m².'
      }
    : {
        question: 'Architect Tally’s Question: When fencing this cut-out plaza, which edges form the boundary perimeter?',
        options: [
          { id: 0, text: 'Only the continuous outer boundary edges surrounding the entire shape.', isCorrect: true },
          { id: 1, text: 'Only the straight rectangular edges, ignoring the new cut-out edges.', isCorrect: false }
        ],
        hint: 'Cutting out a corner creates new boundary edges on the outside. Every outer fence edge that touches the outside world is part of the perimeter!'
      };

  return (
    <Panel className="w-full h-full justify-between select-none overflow-hidden p-1.5 sm:p-2">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-1 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl">🧩</span>
          <span className="font-display font-900 text-sm sm:text-base text-white">
            {isBlueprint0
              ? 'Section C: Plan 1 — Lawn + Patio (Additive Composite)'
              : 'Section C: Plan 2 — Plaza with Fountain Cut-Out (Subtractive Composite)'}
          </span>
        </div>
        <div className="bg-amber-400/25 border border-amber-400/60 rounded-full px-3 py-1 text-xs font-black text-amber-300 whitespace-nowrap shrink-0">
          Blueprint {blueprint + 1} of 2
        </div>
      </div>

      {/* Interactive Visual Blueprint Canvas: Enlarged, High-Visibility Diagram & Markings */}
      <div className="w-full h-[105px] sm:h-[115px] bg-[#120726]/90 border border-purple-400/30 rounded-xl p-1 flex items-center justify-center relative overflow-hidden shrink-0">
        {isBlueprint0 ? (
          <svg viewBox="0 0 380 135" className="w-full h-full">
            {/* Lawn Rectangle */}
            <rect x="60" y="24" width="140" height="80" rx="4" fill="rgba(56,189,248,0.25)" stroke="#38bdf8" strokeWidth="3" />
            
            {/* Patio Semicircle */}
            <path d="M 200 24 A 40 40 0 0 1 200 104 Z" fill="rgba(251,146,60,0.25)" stroke="#fb923c" strokeWidth="3" />
            
            {/* Dashed Shared Inside Divider */}
            <line x1="200" y1="24" x2="200" y2="104" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4,4" />

            {/* Enlarged Separated Markings */}
            <text x="130" y="18" textAnchor="middle" fontSize="14" fontWeight="900" fill="#ffffff">
              Length = 10 m
            </text>
            <text x="48" y="68" textAnchor="end" fontSize="14" fontWeight="900" fill="#38bdf8">
              Width = 8 m
            </text>

            {/* Lawn Area Pill Badge */}
            <rect x="75" y="54" width="110" height="24" rx="5" fill="rgba(18,7,38,0.85)" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="130" y="70" textAnchor="middle" fontSize="13" fontWeight="900" fill="#7dd3fc">
              Lawn: 80 m²
            </text>

            {/* Patio Area Pill Badge */}
            <rect x="208" y="54" width="70" height="24" rx="5" fill="rgba(18,7,38,0.85)" stroke="#fb923c" strokeWidth="1.5" />
            <text x="243" y="70" textAnchor="middle" fontSize="13" fontWeight="900" fill="#facc15">
              Patio: 25 m²
            </text>

            {/* Inside Divider Pill Badge */}
            <rect x="85" y="108" width="230" height="20" rx="4" fill="rgba(18,7,38,0.85)" stroke="#94a3b8" strokeWidth="1" />
            <text x="200" y="122" textAnchor="middle" fontSize="11" fontWeight="900" fill="#cbd5e1">
              Inside Divider: 8 m (No outer fence!)
            </text>
          </svg>
        ) : (
          <svg viewBox="0 0 380 135" className="w-full h-full">
            {/* Main Plaza Polygon with Corner Cut */}
            <polygon
              points="60,24 210,24 260,64 260,108 60,108"
              fill="rgba(56,189,248,0.25)"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            {/* Cut-Out Fountain Ghost */}
            <polygon
              points="210,24 260,24 260,64"
              fill="rgba(244,63,94,0.2)"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="3,3"
            />

            {/* Net Plaza Pill Badge */}
            <rect x="65" y="58" width="170" height="24" rx="5" fill="rgba(6,78,59,0.85)" stroke="#34d399" strokeWidth="1.5" />
            <text x="150" y="74" textAnchor="middle" fontSize="13" fontWeight="900" fill="#6ee7b7">
              Net Ground = 120 - 20 = 100 m²
            </text>

            {/* Cut-out Fountain Pill Badge */}
            <rect x="205" y="32" width="75" height="20" rx="4" fill="rgba(76,5,25,0.85)" stroke="#f43f5e" strokeWidth="1" />
            <text x="242" y="46" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fca5a5">
              Cut: 20 m²
            </text>

            <text x="160" y="124" textAnchor="middle" fontSize="12" fontWeight="900" fill="#cbd5e1">
              Fountain opening is subtracted from total area
            </text>
          </svg>
        )}
      </div>

      {/* Live Readouts Bar: Enlarged font sizes */}
      <div className="w-full grid grid-cols-3 gap-2 text-center shrink-0">
        {isBlueprint0 ? (
          <>
            <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
              <span className="text-xs sm:text-sm text-slate-200 block font-extrabold leading-tight">Main Lawn</span>
              <span className="text-sm sm:text-base font-black text-cyan-300">80 m²</span>
            </div>
            <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
              <span className="text-xs sm:text-sm text-slate-200 block font-extrabold leading-tight">Flower Patio</span>
              <span className="text-sm sm:text-base font-black text-amber-300">25 m²</span>
            </div>
            <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
              <span className="text-xs sm:text-sm text-slate-200 block font-extrabold leading-tight">Combined Area</span>
              <span className="text-sm sm:text-base font-black text-emerald-400">105 m²</span>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
              <span className="text-xs sm:text-sm text-slate-200 block font-extrabold leading-tight">Plaza Area</span>
              <span className="text-sm sm:text-base font-black text-cyan-300">120 m²</span>
            </div>
            <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
              <span className="text-xs sm:text-sm text-slate-200 block font-extrabold leading-tight">Fountain Cut</span>
              <span className="text-sm sm:text-base font-black text-rose-300">- 20 m²</span>
            </div>
            <div className="bg-[#12082b]/80 border border-white/10 rounded-xl py-1 px-2">
              <span className="text-xs sm:text-sm text-slate-200 block font-extrabold leading-tight">Net Usable Area</span>
              <span className="text-sm sm:text-base font-black text-emerald-400">100 m²</span>
            </div>
          </>
        )}
      </div>

      {/* Interactive Control: Mode Selector Bar */}
      <div className="w-full flex items-center justify-center gap-2 bg-[#13082b]/85 border border-white/15 px-2 py-1 rounded-xl shrink-0">
        <button
          onClick={() => handleModeChange('area')}
          className={`flex-1 min-h-[32px] rounded-lg text-xs sm:text-sm font-black transition cursor-pointer ${
            activeMode === 'area'
              ? 'bg-cyan-400 text-slate-950 shadow-md'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          🟦 1. Area Principle (Inside Space)
        </button>
        <button
          onClick={() => handleModeChange('perimeter')}
          className={`flex-1 min-h-[32px] rounded-lg text-xs sm:text-sm font-black transition cursor-pointer ${
            activeMode === 'perimeter'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          🟨 2. Perimeter Fence (Outer Boundary)
        </button>
      </div>

      {/* Interactive Challenge & Verification Box */}
      <div className="w-full bg-[#180a36] border border-cyan-400/40 rounded-xl p-2.5 flex flex-col gap-2 shrink-0">
        <span className="font-display font-900 text-xs sm:text-sm text-amber-300 leading-tight">
          {currentChallenge.question}
        </span>

        {/* Clear Option Buttons */}
        <div className="grid grid-cols-1 gap-1.5 w-full">
          {currentChallenge.options.map((opt) => {
            const isSelected = selectedOpt === opt.id;
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
                onClick={() => handleSelectOpt(opt.id)}
                className={`min-h-[34px] px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold text-left transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
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
            className="text-xs sm:text-sm font-black text-purple-200 hover:text-white bg-purple-900/60 hover:bg-purple-800/80 border border-purple-400/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>💡</span>
            <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
          </button>

          {!isSolved ? (
            <button
              onClick={handleCheckAnswer}
              className="gold-btn min-h-[36px] text-xs sm:text-sm font-black px-4 py-1.5 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Check Answer ✓
            </button>
          ) : (
            <GoldBtn onClick={handleAdvance} className="min-h-[36px] text-xs sm:text-sm py-1.5 px-4 shrink-0">
              {blueprint === 0 ? 'Next Blueprint →' : 'Complete Section C ✓'}
            </GoldBtn>
          )}
        </div>

        {/* Expandable Hint Box */}
        {showHint && (
          <div className="w-full bg-purple-950/95 border border-purple-400/50 rounded-xl p-2 text-xs sm:text-sm text-purple-100 font-bold flex items-start gap-2">
            <span className="text-base shrink-0">💡</span>
            <div>
              <span className="font-black text-amber-300 mr-1">Architect Tally’s Hint:</span>
              {currentChallenge.hint}
            </div>
          </div>
        )}

        {/* Feedback Message */}
        {isChecked && selectedOpt === null && (
          <Msg tone="amber">
            ⚠️ Please select an answer option above before checking!
          </Msg>
        )}

        {isChecked && selectedOpt !== null && (
          <Msg tone={isSolved ? 'emerald' : 'rose'}>
            {isSolved
              ? isBlueprint0
                ? activeMode === 'area'
                  ? '🎉 You have chosen and solved it correctly! For composite figures, separate region areas are added together (105 m²)!'
                  : '🎉 You have chosen and solved it correctly! Perimeter fences ONLY the outer boundary, skipping interior dividers!'
                : activeMode === 'area'
                ? '🎉 You have chosen and solved it correctly! Subtractive cut-outs are subtracted from the total area (100 m²)!'
                : '🎉 You have chosen and solved it correctly! Perimeter includes all outer boundaries surrounding the net figure!'
              : '✗ Not quite! Review the blueprint diagram or click "Show Hint" to explore why!'}
          </Msg>
        )}
      </div>

      {completed && (
        <Msg tone="emerald">
          Section C Completed! Park Plan Builder certified by Architect Tally.
        </Msg>
      )}
    </Panel>
  );
}
