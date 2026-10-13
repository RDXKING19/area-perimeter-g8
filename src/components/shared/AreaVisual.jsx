import React from 'react';

/**
 * Pure SVG diagram renderer for Grade 8 Area and Perimeter plane figures.
 * Complies strictly with TRD §6.6:
 * - High visual clarity, dark glassmorphism aesthetic
 * - Every length carries a clear text label with its unit
 * - Perpendicular heights are drawn dashed with a right-angle square marker
 * - Internal/hidden edges are dashed and marked
 * - Scales smoothly via SVG viewBox
 */
export function AreaVisual({ type = 'rect', data = {}, compact = false }) {
  const strokeWidth = compact ? 2 : 2.5;
  const labelClass = 'text-sm sm:text-base font-black fill-slate-100 select-none';
  const heightClass = 'text-sm sm:text-base font-black fill-amber-300 select-none';
  const badgeClass = 'text-xs sm:text-sm font-black fill-cyan-300 select-none';

  switch (type) {
    case 'rect': {
      const l = data.l || 15;
      const w = data.w || 10;
      const unit = data.unit || 'm';
      const isSquare = l === w;
      return (
        <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="rectGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Main Rectangle */}
          <rect
            x="70"
            y="40"
            width="240"
            height={isSquare ? "120" : "110"}
            rx="8"
            fill="url(#rectGrad)"
            stroke="#38bdf8"
            strokeWidth={strokeWidth}
          />
          {/* Right Angle Marker (bottom-left) */}
          <path d="M 70 135 L 85 135 L 85 150" fill="none" stroke="#facc15" strokeWidth="1.5" />

          {/* Top Label: Length */}
          <rect x="145" y="14" width="90" height="24" rx="5" fill="#14082c" fillOpacity="0.9" stroke="#ffffff35" strokeWidth="1" />
          <text x="190" y="31" textAnchor="middle" className={labelClass}>
            {data.unknown === 'length' ? 'length = ?' : `${l} ${unit}`}
          </text>

          {/* Left Label: Width */}
          <rect x="6" y="83" width="60" height="24" rx="5" fill="#14082c" fillOpacity="0.9" stroke="#ffffff35" strokeWidth="1" />
          <text x="36" y="100" textAnchor="middle" className={labelClass}>
            {data.unknown === 'width' || data.unknown === 'side' ? '? ' + unit : `${w} ${unit}`}
          </text>

          {/* Center Callout if provided */}
          {data.area && (
            <text x="190" y="100" textAnchor="middle" className="text-sm font-black fill-amber-300">
              Area = {data.area} {unit}²
            </text>
          )}
          {data.perimeter && (
            <text x="190" y={data.area ? "120" : "105"} textAnchor="middle" className="text-xs font-bold fill-emerald-300">
              Perimeter = {data.perimeter} {unit}
            </text>
          )}
        </svg>
      );
    }

    case 'rectilinear': {
      // Stepped L-shape outline
      const L = data.L || 14;
      const W = data.W || 10;
      const unit = data.unit || 'm';
      return (
        <svg viewBox="0 0 380 220" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="lGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* L Polygon: (60,40) -> (180,40) -> (180,100) -> (310,100) -> (310,180) -> (60,180) */}
          <polygon
            points="60,40 200,40 200,110 320,110 320,190 60,190"
            fill="url(#lGrad)"
            stroke="#22d3ee"
            strokeWidth={strokeWidth}
          />
          {/* Dimension Labels */}
          {/* Top Edge */}
          <rect x="105" y="18" width="50" height="20" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="130" y="32" textAnchor="middle" className={labelClass}>{`${data.L ? data.L - (data.cutL || 4) : 8} ${unit}`}</text>
          {/* Bottom Edge (full L) */}
          <rect x="160" y="194" width="60" height="20" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="190" y="208" textAnchor="middle" className={labelClass}>{`${L} ${unit}`}</text>
          {/* Left Edge (full W) */}
          <rect x="8" y="105" width="48" height="20" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="32" y="119" textAnchor="middle" className={labelClass}>{`${W} ${unit}`}</text>
          {/* Stepped notch labels */}
          <text x="210" y="80" className={badgeClass}>{`${data.cutW || 4} ${unit}`}</text>
          <text x="250" y="102" className={badgeClass}>{`${data.cutL || 6} ${unit}`}</text>
        </svg>
      );
    }

    case 'triangle': {
      const b = data.b || 12;
      const h = data.h || 8;
      const unit = data.unit || 'cm';
      const kind = data.kind || 'acute';

      if (kind === 'right') {
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="triGradR" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            {/* Right Triangle: (80,160) to (300,160) to (80,40) */}
            <polygon points="80,160 300,160 80,40" fill="url(#triGradR)" stroke="#fbbf24" strokeWidth={strokeWidth} />
            {/* Right angle marker at (80, 160) */}
            <path d="M 80 144 L 96 144 L 96 160" fill="none" stroke="#facc15" strokeWidth="1.5" />
            {/* Base label */}
            <rect x="160" y="165" width="60" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
            <text x="190" y="181" textAnchor="middle" className={labelClass}>
              {data.unknown === 'base' ? 'base = ?' : `base = ${b} ${unit}`}
            </text>
            {/* Height label */}
            <rect x="10" y="90" width="65" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
            <text x="42" y="106" textAnchor="middle" className={heightClass}>
              {data.unknown === 'height' ? 'h = ?' : `h = ${h} ${unit}`}
            </text>
            {data.area && (
              <text x="160" y="120" className="text-xs font-bold fill-amber-300">
                Area = {data.area} {unit}²
              </text>
            )}
          </svg>
        );
      }

      if (kind === 'obtuse') {
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="triGradO" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            {/* Triangle base from (120, 160) to (280, 160), apex at (70, 50) */}
            <polygon points="120,160 280,160 70,50" fill="url(#triGradO)" stroke="#fbbf24" strokeWidth={strokeWidth} />
            {/* Perpendicular height dropped outside from apex (70,50) to foot (70,160) */}
            <line x1="70" y1="50" x2="70" y2="160" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" />
            {/* Extended base guide from (70,160) to (120,160) */}
            <line x1="70" y1="160" x2="120" y2="160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Right angle marker at (70, 160) */}
            <path d="M 70 146 L 84 146 L 84 160" fill="none" stroke="#facc15" strokeWidth="1.5" />

            {/* Base label */}
            <rect x="170" y="165" width="60" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
            <text x="200" y="181" textAnchor="middle" className={labelClass}>
              {`base = ${b} ${unit}`}
            </text>
            {/* Height label on dashed line */}
            <rect x="10" y="95" width="55" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
            <text x="37" y="111" textAnchor="middle" className={heightClass}>
              {`h = ${h} ${unit}`}
            </text>
            <text x="145" y="100" className="text-xs font-bold fill-slate-300">
              Height outside base
            </text>
          </svg>
        );
      }

      // Default: Acute triangle
      return (
        <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="triGradA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <polygon points="70,160 310,160 190,45" fill="url(#triGradA)" stroke="#fbbf24" strokeWidth={strokeWidth} />
          {/* Perpendicular height inside from (190,45) to (190,160) */}
          <line x1="190" y1="45" x2="190" y2="160" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M 190 146 L 204 146 L 204 160" fill="none" stroke="#facc15" strokeWidth="1.5" />

          {/* Base label */}
          <rect x="160" y="166" width="60" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="190" y="182" textAnchor="middle" className={labelClass}>{`base = ${b} ${unit}`}</text>

          {/* Height label */}
          <rect x="200" y="95" width="60" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="230" y="111" textAnchor="middle" className={heightClass}>
            {data.unknown === 'height' ? 'h = ?' : `h = ${h} ${unit}`}
          </text>
          {data.slant && (
            <text x="100" y="95" className={badgeClass}>{`slant = ${data.slant} ${unit}`}</text>
          )}
        </svg>
      );
    }

    case 'parallelogram': {
      const b = data.b || 12;
      const h = data.h || 8;
      const slant = data.slant || 10;
      const unit = data.unit || 'cm';
      return (
        <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="paraGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* Parallelogram vertices: (60,160) -> (260,160) -> (310,50) -> (110,50) */}
          <polygon points="60,160 260,160 310,50 110,50" fill="url(#paraGrad)" stroke="#4ade80" strokeWidth={strokeWidth} />

          {/* Dashed perpendicular height: dropped from (110,50) to (110,160) */}
          <line x1="110" y1="50" x2="110" y2="160" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M 110 146 L 124 146 L 124 160" fill="none" stroke="#facc15" strokeWidth="1.5" />

          {/* Base label */}
          <rect x="130" y="166" width="60" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="160" y="182" textAnchor="middle" className={labelClass}>
            {data.unknown === 'base' ? 'base = ?' : `base = ${b} ${unit}`}
          </text>

          {/* Slant side label */}
          <rect x="290" y="95" width="65" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="322" y="111" textAnchor="middle" className={labelClass}>
            {data.unknown === 'slant' ? 'slant = ?' : `${slant} ${unit}`}
          </text>

          {/* Height label */}
          <rect x="115" y="95" width="65" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="147" y="111" textAnchor="middle" className={heightClass}>
            {data.unknown === 'height' ? 'h = ?' : `h = ${h} ${unit}`}
          </text>
        </svg>
      );
    }

    case 'trapezium': {
      const a = data.a || 8;
      const b = data.b || 14;
      const h = data.h || 6;
      const unit = data.unit || 'cm';
      return (
        <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="trapGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* Trapezium: top base (120,50) to (240,50); bottom base (60,160) to (300,160) */}
          <polygon points="60,160 300,160 250,50 110,50" fill="url(#trapGrad)" stroke="#38bdf8" strokeWidth={strokeWidth} />

          {/* Dashed perpendicular height from (110,50) to (110,160) */}
          <line x1="110" y1="50" x2="110" y2="160" stroke="#facc15" strokeWidth="2" strokeDasharray="4,4" />
          <path d="M 110 146 L 124 146 L 124 160" fill="none" stroke="#facc15" strokeWidth="1.5" />

          {/* Top parallel side */}
          <rect x="150" y="24" width="60" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="180" y="40" textAnchor="middle" className={labelClass}>{`a = ${a} ${unit}`}</text>

          {/* Bottom parallel side */}
          <rect x="150" y="166" width="60" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="180" y="182" textAnchor="middle" className={labelClass}>
            {data.unknown === 'side_b' ? 'b = ?' : `b = ${b} ${unit}`}
          </text>

          {/* Height label */}
          <rect x="115" y="95" width="55" height="22" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
          <text x="142" y="111" textAnchor="middle" className={heightClass}>{`h = ${h} ${unit}`}</text>

          {data.legs && (
            <text x="45" y="100" className={badgeClass}>{`${data.legs[0]} ${unit}`}</text>
          )}
        </svg>
      );
    }

    case 'kite':
    case 'rhombus': {
      const d1 = data.d1 || 12;
      const d2 = data.d2 || 10;
      const unit = data.unit || 'cm';
      const isRhombus = type === 'rhombus';
      return (
        <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="kiteGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* Diamond / Kite polygon */}
          <polygon points="190,30 290,105 190,180 90,105" fill="url(#kiteGrad)" stroke="#c084fc" strokeWidth={strokeWidth} />
          {/* Diagonals */}
          <line x1="190" y1="30" x2="190" y2="180" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3,3" />
          <line x1="90" y1="105" x2="290" y2="105" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
          {/* Center right angle marker */}
          <path d="M 190 95 L 200 95 L 200 105" fill="none" stroke="#facc15" strokeWidth="1" />

          {/* Diagonal labels */}
          <text x="200" y="60" className="text-xs font-bold fill-amber-300">
            {`d₁ = ${d1} ${unit}`}
          </text>
          <text x="220" y="125" className="text-xs font-bold fill-sky-300">
            {data.unknown === 'd2' ? 'd₂ = ?' : `d₂ = ${d2} ${unit}`}
          </text>
          {isRhombus && data.side && (
            <text x="120" y="60" className={labelClass}>{`side = ${data.side} ${unit}`}</text>
          )}
        </svg>
      );
    }

    case 'circle': {
      const r = data.r || 7;
      const unit = data.unit || 'm';
      const piLabel = data.pi ? data.pi.label : '22/7';
      return (
        <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="circGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3730a3" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="190" cy="100" r="75" fill="url(#circGrad)" stroke="#818cf8" strokeWidth={strokeWidth} />
          {/* Center dot */}
          <circle cx="190" cy="100" r="3" fill="#facc15" />

          {data.d ? (
            // Full diameter line
            <>
              <line x1="115" y1="100" x2="265" y2="100" stroke="#facc15" strokeWidth="2" />
              <rect x="155" y="75" width="70" height="20" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
              <text x="190" y="89" textAnchor="middle" className={labelClass}>{`d = ${data.d} ${unit}`}</text>
            </>
          ) : (
            // Radius line
            <>
              <line x1="190" y1="100" x2="265" y2="100" stroke="#facc15" strokeWidth="2" />
              <rect x="200" y="75" width="60" height="20" rx="4" fill="#14082c" fillOpacity="0.85" stroke="#ffffff25" />
              <text x="230" y="89" textAnchor="middle" className={labelClass}>
                {data.unknown === 'radius' ? 'r = ?' : `r = ${r} ${unit}`}
              </text>
            </>
          )}

          {/* Stated pi badge */}
          <rect x="20" y="20" width="85" height="22" rx="6" fill="#1e143c" stroke="#facc15" strokeWidth="1" />
          <text x="62" y="35" textAnchor="middle" className="text-xs font-black fill-amber-300">
            π = {piLabel}
          </text>
        </svg>
      );
    }

    case 'semicircle':
    case 'quadrant':
    case 'sector': {
      const r = data.r || 7;
      const unit = data.unit || 'm';
      const piLabel = data.pi ? data.pi.label : '22/7';
      const theta = data.theta || 180;

      if (theta === 90) {
        // Quadrant: wedge in bottom-left
        return (
          <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="quadGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.12" />
              </linearGradient>
            </defs>
            {/* Quadrant path: (150, 160) -> (260, 160) -> arc up to (150, 50) -> close */}
            <path d="M 150 160 L 260 160 A 110 110 0 0 0 150 50 Z" fill="url(#quadGrad)" stroke="#c084fc" strokeWidth={strokeWidth} />
            <path d="M 150 144 L 166 144 L 166 160" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <text x="200" y="180" className={labelClass}>{`r = ${r} ${unit}`}</text>
            <text x="110" y="110" className={labelClass}>{`r = ${r} ${unit}`}</text>
            <text x="235" y="80" className="text-xs font-black fill-cyan-300">Arc</text>
            <rect x="20" y="20" width="85" height="22" rx="6" fill="#1e143c" stroke="#facc15" strokeWidth="1" />
            <text x="62" y="35" textAnchor="middle" className="text-xs font-black fill-amber-300">π = {piLabel}</text>
          </svg>
        );
      }

      // Semicircle
      return (
        <svg viewBox="0 0 380 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="semiGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          {/* Semicircle: straight line (80, 160) to (300, 160), arc upward */}
          <path d="M 80 160 A 110 110 0 0 1 300 160 Z" fill="url(#semiGrad)" stroke="#c084fc" strokeWidth={strokeWidth} />
          {/* Center mark */}
          <circle cx="190" cy="160" r="3" fill="#facc15" />
          <line x1="190" y1="160" x2="300" y2="160" stroke="#facc15" strokeWidth="2" />
          <text x="245" y="152" className={labelClass}>{`r = ${r} ${unit}`}</text>
          <text x="190" y="42" textAnchor="middle" className="text-xs font-black fill-cyan-300">
            Curved Arc
          </text>
          <rect x="20" y="20" width="85" height="22" rx="6" fill="#1e143c" stroke="#facc15" strokeWidth="1" />
          <text x="62" y="35" textAnchor="middle" className="text-xs font-black fill-amber-300">π = {piLabel}</text>
        </svg>
      );
    }

    case 'composite': {
      // Composite layout: rectangle + semicircle
      const l = data.l || 14;
      const w = data.w || 10;
      const unit = data.unit || 'm';
      return (
        <svg viewBox="0 0 380 210" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="compRect" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="compSemi" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {/* Rectangle base: (60, 50) to (230, 160) */}
          <rect x="60" y="50" width="170" height="110" rx="4" fill="url(#compRect)" stroke="#38bdf8" strokeWidth={strokeWidth} />
          {/* Semicircle attached to right side: diameter is vertical height (y 50 to 160) */}
          <path d="M 230 50 A 55 55 0 0 1 230 160 Z" fill="url(#compSemi)" stroke="#fb923c" strokeWidth={strokeWidth} />

          {/* Internal shared divider line (DASHED, NOT OUTER) */}
          <line x1="230" y1="50" x2="230" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
          <text x="238" y="105" className="text-[10px] font-black fill-slate-400 rotate-90 origin-top-left">
            [Inside Divider]
          </text>

          {/* Dimension labels */}
          <text x="145" y="42" textAnchor="middle" className={labelClass}>{`${l} ${unit}`}</text>
          <text x="25" y="110" className={labelClass}>{`${w} ${unit}`}</text>
          <text x="300" y="110" className="text-xs font-bold fill-orange-300">Arc</text>
        </svg>
      );
    }

    default:
      return null;
  }
}
