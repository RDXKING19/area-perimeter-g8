// Exact arithmetic & geometry layer for AreaQuest (Grade 8)

export const PI = {
  frac: { num: 22, den: 7, label: '22/7' },
  dec: { num: 314, den: 100, label: '3.14' }
};

export const piFor = (r) => (r % 7 === 0 ? PI.frac : PI.dec);

export const toH = (x) => Math.round(x * 100);

export function exact2dp(numerator, denominator) {
  const h = (numerator * 100) / denominator;
  if (!Number.isInteger(h)) {
    throw new Error(`Inexact value: ${numerator}/${denominator}`);
  }
  return h;
}

export function fmtNum(h) {
  const val = h / 100;
  if (Number.isInteger(val)) {
    return val.toLocaleString('en-US');
  }
  const str = val.toFixed(2);
  const trimmed = str.endsWith('0') ? str.slice(0, -1) : str;
  const [intPart, decPart] = trimmed.split('.');
  const formattedInt = Number(intPart).toLocaleString('en-US');
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

// ---- Formulas (all return hundredths) -----------------------------------
export const rectArea = (l, w) => toH(l * w);
export const rectPerimeter = (l, w) => toH(2 * (l + w));
export const triangleArea = (b, h) => exact2dp(b * h, 2);
export const parallelogramArea = (b, h) => toH(b * h);
export const trapeziumArea = (a, b, h) => exact2dp((a + b) * h, 2);
export const kiteArea = (d1, d2) => exact2dp(d1 * d2, 2);
export const circumference = (r, pi) => exact2dp(2 * pi.num * r, pi.den);
export const circleArea = (r, pi) => exact2dp(pi.num * r * r, pi.den);
export const arcLength = (r, theta, pi) => exact2dp(theta * 2 * pi.num * r, 360 * pi.den);
export const sectorArea = (r, theta, pi) => exact2dp(theta * pi.num * r * r, 360 * pi.den);

export const SECTOR_ANGLES = [90, 180, 270];

export const TRIPLES = [
  [3, 4, 5],
  [6, 8, 10],
  [5, 12, 13],
  [9, 12, 15],
  [8, 15, 17],
  [12, 16, 20],
  [15, 20, 25],
  [7, 24, 25]
];

export const UNIT = {
  m_cm: 100,
  m2_cm2: 10000,
  cm2_mm2: 100
};

export const REASONS = {
  perimeterVsArea: 'Perimeter is the distance around the boundary, while area is the space enclosed inside.',
  perpHeight: 'Perpendicular height meets the base at a right angle (90°); the slanted side is never the height.',
  half: 'A triangle or kite occupies half the bounding rectangle or diagonal product.',
  diameter: 'Radius is half of diameter (r = d / 2); circle formulas use radius.',
  arcPlusDiameter: 'A semicircle’s perimeter consists of its curved arc PLUS its straight diameter boundary.',
  outerEdges: 'Perimeter counts only the outside perimeter fence; internal or shared dividing lines must not be added.',
  unitSquare: 'Square units scale by the square of linear units: 1 m² = (100 cm)² = 10 000 cm².'
};

// ---- Geometric generators (seeded RNG) ---------------------------------
export function genParallelogram(rng) {
  const triple = rng.choice(TRIPLES);
  // triple = [offset, h, slant] or [h, offset, slant]
  const [offset, h, slant] = triple;
  const b = rng.int(Math.max(offset + 3, 6), 24);
  return { b, h, slant, offset, unit: 'cm' };
}

export function genTrapezium(rng, { needLegs = false } = {}) {
  const triple = rng.choice(TRIPLES);
  const [offset, h, slant] = triple;
  const a = rng.int(4, 16);
  const b = a + offset * (needLegs ? 2 : 1);
  return {
    a,
    b,
    h,
    legs: needLegs ? [slant, slant] : [slant],
    unit: 'cm'
  };
}

export function genKite(rng) {
  let d1 = rng.int(4, 20);
  let d2 = rng.int(4, 20);
  if ((d1 * d2) % 2 !== 0) d1 += 1;
  return { d1, d2, unit: 'cm' };
}

export function genRhombus(rng) {
  const triple = rng.choice(TRIPLES);
  const [half1, half2, side] = triple;
  const d1 = half1 * 2;
  const d2 = half2 * 2;
  return { d1, d2, side, unit: 'cm' };
}

export function genRectilinear(rng) {
  // L-shape with bounding box L × W cut by a notch
  const L = rng.int(8, 20);
  const W = rng.int(6, 16);
  const cutL = rng.int(2, L - 3);
  const cutW = rng.int(2, W - 3);
  const remainingL = L - cutL;
  const remainingW = W - cutW;

  const edges = [
    { id: 'bottom', len: L, label: `${L} m`, outer: true },
    { id: 'right', len: remainingW, label: `${remainingW} m`, outer: true },
    { id: 'step-in', len: cutL, label: `${cutL} m`, outer: true },
    { id: 'step-up', len: cutW, label: `${cutW} m`, outer: true },
    { id: 'top', len: remainingL, label: `${remainingL} m`, outer: true },
    { id: 'left', len: W, label: `${W} m`, outer: true }
  ];

  const totalArea = toH(L * W - cutL * cutW);
  const perimeter = toH(2 * (L + W));

  return { L, W, cutL, cutW, edges, totalArea, perimeter, unit: 'm' };
}

export function genComposite(rng, kind = 'rect+semi') {
  if (kind === 'rect+semi') {
    // Rectangle with attached semicircle on one side
    const r = rng.choice([3, 4, 5, 6, 7, 10, 14]);
    const pi = piFor(r);
    const d = r * 2;
    const l = rng.int(d + 4, d + 12);
    const rectA = rectArea(l, d);
    const semiA = exact2dp(pi.num * r * r, 2 * pi.den);
    const semiArc = exact2dp(pi.num * r, pi.den);

    return {
      kind,
      l,
      w: d,
      r,
      pi,
      unit: 'm',
      components: [
        { id: 'rect', name: 'Main Lawn', area: rectA, op: 'add', label: `${l}m × ${d}m` },
        { id: 'semi', name: 'Semicircular Patio', area: semiA, op: 'add', label: `r = ${r}m` }
      ],
      edges: [
        { id: 'top', len: toH(l), outer: true, label: `${l} m` },
        { id: 'bottom', len: toH(l), outer: true, label: `${l} m` },
        { id: 'left', len: toH(d), outer: true, label: `${d} m` },
        { id: 'shared', len: toH(d), outer: false, label: `${d} m (Internal Divider)` },
        { id: 'arc', len: semiArc, outer: true, label: `Arc ${fmtNum(semiArc)} m` }
      ],
      totalArea: rectA + semiA,
      perimeter: toH(2 * l + d) - toH(d) + semiArc // 2l + left + arc
    };
  }

  if (kind === 'rect-triangle') {
    // Rectangle with triangular cut-out corner
    const l = rng.int(10, 20);
    const w = rng.int(8, 16);
    let tb = rng.int(3, Math.floor(l / 2));
    const th = rng.int(3, Math.floor(w / 2));
    if ((tb * th) % 2 !== 0) tb += 1;
    const rectA = rectArea(l, w);
    const triA = triangleArea(tb, th);
    // hypotenuse
    const hyp = Math.round(Math.sqrt(tb * tb + th * th) * 10) / 10;
    const hypH = toH(hyp);

    return {
      kind,
      l,
      w,
      tb,
      th,
      hyp,
      unit: 'm',
      components: [
        { id: 'rect', name: 'Base Pavilion', area: rectA, op: 'add', label: `${l}m × ${w}m` },
        { id: 'cut', name: 'Triangular Alcove', area: triA, op: 'sub', label: `${tb}m × ${th}m` }
      ],
      edges: [
        { id: 'bottom', len: toH(l), outer: true, label: `${l} m` },
        { id: 'left', len: toH(w), outer: true, label: `${w} m` },
        { id: 'top-rem', len: toH(l - tb), outer: true, label: `${l - tb} m` },
        { id: 'right-rem', len: toH(w - th), outer: true, label: `${w - th} m` },
        { id: 'hyp', len: hypH, outer: true, label: `${hyp} m` },
        { id: 'inner1', len: toH(tb), outer: false, label: `${tb} m (Inside)` },
        { id: 'inner2', len: toH(th), outer: false, label: `${th} m (Inside)` }
      ],
      totalArea: rectA - triA,
      perimeter: toH(l + w + (l - tb) + (w - th)) + hypH
    };
  }

  // Default to L-shaped composite
  return genRectilinear(rng);
}

function formatValueWithUnit(valH, unit) {
  const numStr = fmtNum(valH);
  if (!unit) return numStr;
  if (unit === '$') return `$${numStr}`;
  return `${numStr} ${unit}`;
}

// Distractor generator: produces distinct options formatted cleanly
export function makeDistractors(correctH, foilHList, rng, count = 3, unit = '') {
  const correctStr = formatValueWithUnit(correctH, unit);
  const seen = new Set([correctStr]);
  const foils = [];

  for (const h of foilHList) {
    if (h > 0 && !isNaN(h)) {
      const str = formatValueWithUnit(h, unit);
      if (!seen.has(str)) {
        seen.add(str);
        foils.push(str);
        if (foils.length === count) break;
      }
    }
  }

  // If we still need foils, create believable variations
  let factor = 1.2;
  while (foils.length < count) {
    const candidate = Math.round(correctH * factor);
    const str = formatValueWithUnit(candidate, unit);
    if (candidate > 0 && !seen.has(str)) {
      seen.add(str);
      foils.push(str);
    }
    factor += 0.3;
  }

  return rng.shuffle([correctStr, ...foils.slice(0, count)]);
}

// ---- Validators --------------------------------------------------------
export function validateParallelogram(p) {
  return p.slant * p.slant === p.h * p.h + p.offset * p.offset;
}

export function validateTrapezium(t) {
  if (!t.legs) return true;
  return t.legs.every((slant) => slant > t.h);
}

export function validateComposite(c) {
  if (c.kind === 'rect+semi' || c.kind === 'rect-triangle') {
    let computedArea = 0;
    for (const comp of c.components) {
      if (comp.op === 'add') computedArea += comp.area;
      else computedArea -= comp.area;
    }
    return computedArea === c.totalArea;
  }
  return true;
}

export function validateUnits(quantityType, unitStr) {
  if (quantityType === 'area') {
    return unitStr.includes('²') || unitStr.includes('sq');
  }
  if (quantityType === 'length' || quantityType === 'perimeter') {
    return !unitStr.includes('²') && !unitStr.includes('sq');
  }
  return true;
}
