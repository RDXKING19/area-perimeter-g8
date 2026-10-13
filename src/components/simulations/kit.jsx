import React from 'react';

const TONES = {
  cyan: 'border-cyan-400 bg-cyan-950/80 text-cyan-100 shadow-[0_0_16px_rgba(56,189,248,0.45)]',
  amber: 'border-amber-400 bg-amber-950/80 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.45)]',
  emerald: 'border-emerald-400 bg-emerald-950/80 text-emerald-100 shadow-[0_0_16px_rgba(52,211,153,0.45)]',
  rose: 'border-rose-400 bg-rose-950/80 text-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.45)]',
  purple: 'border-purple-400 bg-purple-950/80 text-purple-100 shadow-[0_0_16px_rgba(168,85,247,0.45)]',
  ghost: 'border-white/20 border-dashed bg-white/5 text-white/40'
};

export function Panel({ children, className = '', noScroll = false }) {
  const scrollClass = noScroll ? 'overflow-hidden' : 'overflow-y-auto overflow-x-hidden custom-scrollbar';
  return (
    <div
      className={`flex flex-col items-center justify-between gap-1.5 sm:gap-2 bg-[#1e1342]/95 border-2 border-cyan-400/40 rounded-2xl p-1.5 sm:p-2.5 shadow-xl w-full h-full select-none ${scrollClass} ${className}`}
    >
      {children}
    </div>
  );
}

export function Node({ tone = 'cyan', children, w = 'w-24', className = '' }) {
  return (
    <div
      className={`${w} min-h-[40px] rounded-2xl border-2 font-display font-900 text-sm sm:text-base flex items-center justify-center text-center transition-all duration-300 ${
        TONES[tone] || TONES.cyan
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function Msg({ tone = 'emerald', children }) {
  const cls =
    {
      emerald: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/60 shadow-[0_0_14px_rgba(52,211,153,0.3)]',
      rose: 'bg-rose-950/90 text-rose-300 border-rose-400/60 shadow-[0_0_14px_rgba(244,63,94,0.3)]',
      amber: 'bg-amber-950/90 text-amber-200 border-amber-400/50 shadow-[0_0_14px_rgba(251,191,36,0.3)]',
      cyan: 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50 shadow-[0_0_14px_rgba(56,189,248,0.3)]'
    }[tone] || 'bg-cyan-950/90 text-cyan-200 border-cyan-400/50';

  return (
    <div className={`w-full px-3 py-1 rounded-xl border text-xs sm:text-sm font-black text-center shrink-0 ${cls}`}>
      {children}
    </div>
  );
}

export const GoldBtn = ({ children, onClick, disabled = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`gold-btn min-h-[36px] sm:min-h-[40px] text-xs sm:text-sm font-900 px-4 py-1.5 rounded-xl shadow-lg hover:scale-105 transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

export const GhostBtn = ({ children, onClick, disabled = false, active = false, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`font-display font-900 text-xs sm:text-sm min-h-[36px] px-3 sm:px-4 py-1 rounded-xl border transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
      active
        ? 'bg-cyan-400 text-slate-950 border-cyan-200 shadow-[0_0_14px_rgba(56,189,248,0.6)]'
        : 'bg-purple-900/80 hover:bg-purple-800 border-purple-400/50 text-purple-100'
    } ${className}`}
  >
    {children}
  </button>
);

/**
 * Accessible Step Slider with keyboard / touch buttons (- / +)
 */
export function StepSlider({
  value,
  min = 1,
  max = 20,
  step = 1,
  onChange,
  label = 'Value',
  unit = ''
}) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div className="w-full flex items-center gap-2 bg-[#13082b]/85 border border-white/15 px-2.5 py-1 rounded-xl shrink-0">
      <span className="font-display font-900 text-xs sm:text-sm text-slate-200 min-w-[75px] sm:min-w-[95px] shrink-0">
        {label}: <span className="text-amber-300 font-mono font-black text-sm sm:text-base">{value}{unit}</span>
      </span>

      <button
        onClick={dec}
        disabled={value <= min}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-sm sm:text-base flex items-center justify-center transition disabled:opacity-30 cursor-pointer shrink-0"
        title={`Decrease ${label}`}
      >
        −
      </button>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-amber-400 cursor-pointer h-2 py-0.5"
      />

      <button
        onClick={inc}
        disabled={value >= max}
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-black text-sm sm:text-base flex items-center justify-center transition disabled:opacity-30 cursor-pointer shrink-0"
        title={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}
