import React from 'react';

export function FloatingSymbols() {
  const symbols = [
    { text: 'A = l × w', top: '8%', left: '6%', size: '32px' },
    { text: 'P = 2(l + w)', top: '22%', left: '85%', size: '36px' },
    { text: '½ × b × h', top: '74%', left: '8%', size: '34px' },
    { text: 'A = πr²', top: '80%', left: '82%', size: '38px' },
    { text: 'C = 2πr', top: '44%', left: '92%', size: '32px' },
    { text: '1 m² = 10 000 cm²', top: '14%', left: '46%', size: '26px' },
    { text: '½(a + b)h', top: '64%', left: '50%', size: '30px' },
    { text: 'b × h', top: '88%', left: '34%', size: '34px' }
  ];

  return (
    <div className="floating-bg-container pointer-events-none fixed inset-0 overflow-hidden z-0">
      {symbols.map((s, idx) => (
        <span
          key={idx}
          className="floating-bg-item absolute text-white/5 font-display font-black select-none"
          style={{
            top: s.top,
            left: s.left,
            fontSize: s.size,
            animationDelay: `${idx * 2.2}s`
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  );
}
