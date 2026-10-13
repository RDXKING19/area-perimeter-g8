import { WORLDS } from '../config/worlds.config.js';
import { createRNG } from '../utils/rng.js';
import {
  PI,
  piFor,
  toH,
  fmtNum,
  exact2dp,
  rectArea,
  rectPerimeter,
  triangleArea,
  parallelogramArea,
  trapeziumArea,
  kiteArea,
  circumference,
  circleArea,
  arcLength,
  sectorArea,
  genParallelogram,
  genTrapezium,
  genKite,
  genRhombus,
  genRectilinear,
  genComposite,
  makeDistractors,
  REASONS,
  TRIPLES
} from '../utils/areaMath.js';

export const DISTRICTS = WORLDS.map((w) => ({
  id: w.id,
  name: w.name,
  icon: w.emoji,
  accent: w.accent,
  conceptFocus: w.conceptFocus,
  description: w.description,
  boss: w.boss
}));

// World 0: Fenceline Fields — Perimeter Basics
function genWorld0Question(pos, rng) {
  const templates = [
    // 0: Rect perimeter standard
    () => {
      const l = rng.int(10, 25);
      const w = rng.int(4, 9);
      const p = rectPerimeter(l, w);
      const a = rectArea(l, w);
      const halfP = toH(l + w);
      const missedOne = toH(2 * l + w);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l, w, unit: 'm', show: ['perimeter'] },
        questionText: `A rectangular lawn in Sunrise Park is ${l} m long and ${w} m wide. Calculate the total length of fencing needed to enclose its perimeter.`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [a, halfP, missedOne], rng, 3, 'm'),
        explanation: `Perimeter is the distance around the boundary: 2 × (length + width) = 2 × (${l} + ${w}) = ${fmtNum(p)} m. ${REASONS.perimeterVsArea}`,
        hint1: 'Add all four sides around the lawn: 2 × (length + width).',
        hint2: `Compute 2 × (${l} + ${w}) = 2 × ${l + w} = ${fmtNum(p)} m.`
      };
    },
    // 1: Square perimeter
    () => {
      const s = rng.int(7, 20);
      const p = toH(4 * s);
      const a = toH(s * s);
      const halfP = toH(2 * s);
      const threeS = toH(3 * s);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l: s, w: s, unit: 'm', show: ['perimeter'] },
        questionText: `A square flower terrace has sides of length ${s} m. Find its perimeter.`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [a, halfP, threeS], rng, 3, 'm'),
        explanation: `A square has 4 equal sides. Perimeter = 4 × side = 4 × ${s} = ${fmtNum(p)} m.`,
        hint1: 'A square has 4 sides of equal length.',
        hint2: `Multiply 4 × ${s} to get ${fmtNum(p)} m.`
      };
    },
    // 2: Missing side from perimeter
    () => {
      const l = rng.int(12, 28);
      const w = rng.int(5, 11);
      const p = 2 * (l + w);
      const pH = toH(p);
      const wH = toH(w);
      const lH = toH(l);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l: null, w, perimeter: p, unit: 'm', unknown: 'length' },
        questionText: `A rectangular playground has a perimeter of ${p} m and a width of ${w} m. What is its length?`,
        correctAnswer: `${fmtNum(lH)} m`,
        options: makeDistractors(lH, [toH(p - w), toH(p / 2), toH(l + 4)], rng, 3, 'm'),
        explanation: `Half the perimeter is length + width = ${p} ÷ 2 = ${p / 2} m. Subtracting the width ${w} m leaves the length = ${l} m.`,
        hint1: 'Half of the perimeter equals length plus width.',
        hint2: `Calculate (${p} ÷ 2) - ${w} = ${p / 2} - ${w} = ${l} m.`
      };
    },
    // 3: Rectilinear L-shape perimeter
    () => {
      const data = genRectilinear(rng);
      const wrong1 = toH(data.L + data.W);
      const wrong2 = data.totalArea;
      const wrong3 = toH(data.perimeter / 100 - 4);
      return {
        category: 'perimeter-basics',
        visual: 'rectilinear',
        visualData: data,
        questionText: `An L-shaped seating patio has outer boundary dimensions as shown. Find its total perimeter.`,
        correctAnswer: `${fmtNum(data.perimeter)} m`,
        options: makeDistractors(data.perimeter, [wrong1, wrong2, wrong3], rng, 3, 'm'),
        explanation: `Stepping in and stepping out creates the same perimeter as the bounding rectangle 2 × (${data.L} + ${data.W}) = ${fmtNum(data.perimeter)} m.`,
        hint1: 'Notice the inner notch steps match the overall width and length.',
        hint2: `Perimeter = 2 × (${data.L} + ${data.W}) = ${fmtNum(data.perimeter)} m.`
      };
    },
    // 4: Square side from perimeter
    () => {
      const s = rng.int(6, 18);
      const p = 4 * s;
      const sH = toH(s);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l: s, w: s, perimeter: p, unit: 'm', unknown: 'side' },
        questionText: `A square fountain plaza has a perimeter of exactly ${p} m. Find the length of each side.`,
        correctAnswer: `${fmtNum(sH)} m`,
        options: makeDistractors(sH, [toH(p / 2), toH(p * 2), toH(s + 3)], rng, 3, 'm'),
        explanation: `Each of the 4 equal sides is Perimeter ÷ 4 = ${p} ÷ 4 = ${s} m.`,
        hint1: 'Divide the total perimeter equally among the 4 sides.',
        hint2: `${p} ÷ 4 = ${s} m.`
      };
    },
    // 5: Rect perimeter with decimeter / ratio context
    () => {
      const w = rng.int(6, 12);
      const l = w * 2;
      const p = rectPerimeter(l, w);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l, w, unit: 'm', show: ['perimeter'] },
        questionText: `A boardwalk path is twice as long as it is wide. If its width is ${w} m, what is its perimeter?`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [toH(l * w), toH(l + w), toH(3 * w)], rng, 3, 'm'),
        explanation: `Length is 2 × ${w} = ${l} m. Perimeter = 2 × (${l} + ${w}) = 2 × ${l + w} = ${fmtNum(p)} m.`,
        hint1: `First find length: 2 × ${w} = ${l} m.`,
        hint2: `Then calculate 2 × (${l} + ${w}) = ${fmtNum(p)} m.`
      };
    },
    // 6: Comparing perimeters of two plots
    () => {
      const l1 = 20;
      const w1 = 5;
      const p1 = 2 * (l1 + w1); // 50
      const s2 = 12;
      const p2 = 4 * s2; // 48
      const diff = toH(p1 - p2);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l: l1, w: w1, unit: 'm', show: ['perimeter'] },
        questionText: `Lawn A is 20 m by 5 m. Lawn B is a square of side 12 m. By how many metres does Lawn A’s perimeter exceed Lawn B’s perimeter?`,
        correctAnswer: `${fmtNum(diff)} m`,
        options: makeDistractors(diff, [toH(4), toH(8), toH(12)], rng, 3, 'm'),
        explanation: `Lawn A perimeter = 2 × (20 + 5) = 50 m. Lawn B perimeter = 4 × 12 = 48 m. Difference = 50 - 48 = 2 m.`,
        hint1: 'Calculate both perimeters first.',
        hint2: '50 m - 48 m = 2 m.'
      };
    },
    // 7: Rect perimeter with pathway margin
    () => {
      const l = rng.int(14, 22);
      const w = rng.int(8, 14);
      const p = rectPerimeter(l, w);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l, w, unit: 'm' },
        questionText: `A community herb garden measures ${l} m by ${w} m. A decorative edging wire wraps around the full garden. What is the wire length?`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [rectArea(l, w), toH(l + w), toH(p / 2)], rng, 3, 'm'),
        explanation: `The wire follows the perimeter: 2 × (${l} + ${w}) = ${fmtNum(p)} m.`,
        hint1: 'Wire around the garden is the perimeter.',
        hint2: `2 × (${l} + ${w}) = ${fmtNum(p)} m.`
      };
    },
    // 8: Perimeter of multi-step rectilinear step shape
    () => {
      const L = rng.int(12, 18);
      const W = rng.int(8, 12);
      const p = toH(2 * (L + W));
      return {
        category: 'perimeter-basics',
        visual: 'rectilinear',
        visualData: { L, W, cutL: 4, cutW: 3, unit: 'm' },
        questionText: `A stepped pavilion deck has an overall length of ${L} m and overall width of ${W} m with an internal corner cut. Calculate its outer perimeter fence.`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [toH(L * W), toH(L + W), toH(p / 100 - 6)], rng, 3, 'm'),
        explanation: `Any orthogonal cut maintains the bounding perimeter: 2 × (${L} + ${W}) = ${fmtNum(p)} m.`,
        hint1: 'The sum of the horizontal and vertical stepped edges equals the bounding box.',
        hint2: `2 × (${L} + ${W}) = ${fmtNum(p)} m.`
      };
    },
    // 9: Perimeter word challenge
    () => {
      const l = rng.int(16, 30);
      const w = rng.int(10, 15);
      const p = rectPerimeter(l, w);
      return {
        category: 'perimeter-basics',
        visual: 'rect',
        visualData: { l, w, unit: 'm' },
        questionText: `Park Planner Hafiz runs around the perimeter of a ${l} m by ${w} m sports pitch once. How far does he run?`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [rectArea(l, w), toH(l + w), toH(p / 2)], rng, 3, 'm'),
        explanation: `One complete lap around the outer boundary equals the perimeter: 2 × (${l} + ${w}) = ${fmtNum(p)} m.`,
        hint1: 'One lap around the boundary is the perimeter.',
        hint2: `2 × (${l} + ${w}) = ${fmtNum(p)} m.`
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 1: Tile Terrace — Area of Rectangles & Units
function genWorld1Question(pos, rng) {
  const templates = [
    // 0: Rect Area
    () => {
      const l = rng.int(8, 18);
      const w = rng.int(5, 12);
      const a = rectArea(l, w);
      const p = rectPerimeter(l, w);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l, w, unit: 'm', show: ['area'] },
        questionText: `A rectangular terrace is ${l} m long and ${w} m wide. Calculate its surface area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [p, toH(l + w), toH(2 * l * w)], rng, 3, 'm²'),
        explanation: `Area of a rectangle = length × width = ${l} × ${w} = ${fmtNum(a)} m². ${REASONS.perimeterVsArea}`,
        hint1: 'Multiply the length by the width.',
        hint2: `${l} × ${w} = ${fmtNum(a)} m².`
      };
    },
    // 1: Square Area
    () => {
      const s = rng.int(6, 15);
      const a = toH(s * s);
      const p = toH(4 * s);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: s, w: s, unit: 'm', show: ['area'] },
        questionText: `A square picnic zone has sides measuring ${s} m. Find its area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [p, toH(2 * s), toH(s * (s + 2))], rng, 3, 'm²'),
        explanation: `Area of a square = side × side = ${s} × ${s} = ${fmtNum(a)} m².`,
        hint1: 'Area of a square is side squared.',
        hint2: `${s} × ${s} = ${fmtNum(a)} m².`
      };
    },
    // 2: m² to cm² conversion
    () => {
      const m2 = rng.choice([2, 3, 5, 8]);
      const cm2 = toH(m2 * 10000);
      const wrongSlip = toH(m2 * 100);
      const wrongSlip2 = toH(m2 * 1000);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: m2, w: 1, unit: 'm' },
        questionText: `Convert ${m2} m² into square centimetres (cm²).`,
        correctAnswer: `${fmtNum(cm2)} cm²`,
        options: makeDistractors(cm2, [wrongSlip, wrongSlip2, toH(m2 * 10)], rng, 3, 'cm²'),
        explanation: `Because 1 m = 100 cm, 1 m² = 100 cm × 100 cm = 10 000 cm². Therefore ${m2} m² = ${m2} × 10 000 = ${fmtNum(cm2)} cm². ${REASONS.unitSquare}`,
        hint1: '1 m² = (100 cm)² = 10 000 cm².',
        hint2: `Multiply ${m2} by 10 000.`
      };
    },
    // 3: Missing width from area
    () => {
      const l = rng.int(10, 20);
      const w = rng.int(4, 9);
      const a = l * w;
      const wH = toH(w);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l, w: null, area: a, unit: 'm', unknown: 'width' },
        questionText: `A paved walkway has an area of ${a} m² and a length of ${l} m. Find its width.`,
        correctAnswer: `${fmtNum(wH)} m`,
        options: makeDistractors(wH, [toH(w + 3), toH(w - 2), toH(a - l)], rng, 3, 'm'),
        explanation: `Width = Area ÷ Length = ${a} ÷ ${l} = ${w} m.`,
        hint1: 'Divide the area by the known length.',
        hint2: `${a} ÷ ${l} = ${w} m.`
      };
    },
    // 4: cm² to m² conversion
    () => {
      const cm2 = rng.choice([20000, 35000, 50000, 80000]);
      const m2H = toH(cm2 / 10000);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: 1, w: 1, unit: 'cm' },
        questionText: `Convert ${cm2.toLocaleString('en-US')} cm² into square metres (m²).`,
        correctAnswer: `${fmtNum(m2H)} m²`,
        options: makeDistractors(m2H, [toH(cm2 / 100), toH(cm2 / 1000), toH(m2H / 100 + 5)], rng, 3, 'm²'),
        explanation: `Divide by 10 000 because 1 m² = 10 000 cm²: ${cm2} ÷ 10 000 = ${fmtNum(m2H)} m².`,
        hint1: 'Divide the number of square centimetres by 10 000.',
        hint2: `${cm2} ÷ 10 000 = ${fmtNum(m2H)} m².`
      };
    },
    // 5: Number of tiles needed
    () => {
      const floorL = 6;
      const floorW = 4;
      const floorArea = floorL * floorW; // 24 m²
      const tileSideCm = 50; // 0.5 m, tile area = 0.25 m²
      const tileAreaM2 = 0.25;
      const count = toH(floorArea / tileAreaM2); // 96
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: floorL, w: floorW, unit: 'm' },
        questionText: `A gazebo patio measures ${floorL} m by ${floorW} m. Square tiles of size 50 cm by 50 cm are used. How many tiles are required to pave the patio?`,
        correctAnswer: `${fmtNum(count)}`,
        options: makeDistractors(count, [toH(48), toH(24), toH(120)], rng, 3),
        explanation: `Patio area = ${floorL} × ${floorW} = 24 m² = 240 000 cm². Each tile = 50 × 50 = 2 500 cm². Number of tiles = 240 000 ÷ 2 500 = 96 tiles.`,
        hint1: 'Convert patio area into cm², then divide by one tile’s area.',
        hint2: '240 000 cm² ÷ 2 500 cm² = 96.'
      };
    },
    // 6: Area of square from perimeter
    () => {
      const s = rng.int(5, 12);
      const p = 4 * s;
      const a = toH(s * s);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: s, w: s, unit: 'm' },
        questionText: `A square flowerbed has a perimeter of ${p} m. What is its surface area?`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(p), toH(s * 2), toH(a / 100 + 10)], rng, 3, 'm²'),
        explanation: `Side = ${p} ÷ 4 = ${s} m. Area = side² = ${s} × ${s} = ${fmtNum(a)} m².`,
        hint1: 'First find the side length by dividing perimeter by 4.',
        hint2: `${p} ÷ 4 = ${s} m, then ${s} × ${s} = ${fmtNum(a)} m².'`
      };
    },
    // 7: mm² to cm² conversion
    () => {
      const mm2 = rng.choice([400, 700, 1200, 2500]);
      const cm2 = toH(mm2 / 100);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: 1, w: 1, unit: 'mm' },
        questionText: `A metal architectural bracket has an area of ${mm2} mm². Convert this area into square centimetres (cm²).`,
        correctAnswer: `${fmtNum(cm2)} cm²`,
        options: makeDistractors(cm2, [toH(mm2 / 10), toH(mm2), toH(cm2 / 100 + 3)], rng, 3, 'cm²'),
        explanation: `1 cm = 10 mm, so 1 cm² = 10 mm × 10 mm = 100 mm². Divide by 100: ${mm2} ÷ 100 = ${fmtNum(cm2)} cm².`,
        hint1: '1 cm² equals 100 mm².',
        hint2: `${mm2} ÷ 100 = ${fmtNum(cm2)} cm².`
      };
    },
    // 8: Area comparison between two garden plots
    () => {
      const l1 = 12;
      const w1 = 8;
      const a1 = l1 * w1; // 96
      const l2 = 15;
      const w2 = 6;
      const a2 = l2 * w2; // 90
      const diff = toH(a1 - a2);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: l1, w: w1, unit: 'm' },
        questionText: `Plot A is 12 m by 8 m. Plot B is 15 m by 6 m. How much more area does Plot A cover than Plot B?`,
        correctAnswer: `${fmtNum(diff)} m²`,
        options: makeDistractors(diff, [toH(12), toH(16), toH(2)], rng, 3, 'm²'),
        explanation: `Area A = 12 × 8 = 96 m². Area B = 15 × 6 = 90 m². Difference = 96 - 90 = 6 m².`,
        hint1: 'Calculate both areas and subtract.',
        hint2: '96 m² - 90 m² = 6 m².'
      };
    },
    // 9: Missing length from area with decimals
    () => {
      const w = 5;
      const l = 14;
      const a = l * w;
      const lH = toH(l);
      return {
        category: 'area-rect-units',
        visual: 'rect',
        visualData: { l: null, w, area: a, unit: 'm', unknown: 'length' },
        questionText: `An outdoor amphitheatre seating section has an area of ${a} m² and a width of ${w} m. What is its length?`,
        correctAnswer: `${fmtNum(lH)} m`,
        options: makeDistractors(lH, [toH(l - 3), toH(l + 4), toH(a - w)], rng, 3, 'm'),
        explanation: `Length = Area ÷ Width = ${a} ÷ ${w} = ${l} m.`,
        hint1: 'Divide total area by width.',
        hint2: `${a} ÷ ${w} = ${l} m.`
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 2: Triangle Trail — Area of Triangles
function genWorld2Question(pos, rng) {
  const templates = [
    // 0: Standard triangle area
    () => {
      const b = rng.choice([10, 12, 14, 16, 18]);
      const h = rng.int(5, 11);
      const a = triangleArea(b, h);
      const noHalf = toH(b * h);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h, kind: 'acute', unit: 'cm' },
        questionText: `A triangular flowerbed has a base of ${b} cm and a perpendicular height of ${h} cm. Calculate its area.`,
        correctAnswer: `${fmtNum(a)} cm²`,
        options: makeDistractors(a, [noHalf, toH(b + h), toH(a / 100 + 6)], rng, 3, 'cm²'),
        explanation: `Area of a triangle = ½ × base × perpendicular height = ½ × ${b} × ${h} = ${fmtNum(a)} cm². ${REASONS.half}`,
        hint1: 'Remember the formula: ½ × base × perpendicular height.',
        hint2: `½ × ${b} × ${h} = ${fmtNum(a)} cm².'`
      };
    },
    // 1: Right-angled triangle
    () => {
      const b = rng.choice([6, 8, 10, 12]);
      const h = rng.choice([7, 9, 11, 13]);
      const a = triangleArea(b, h);
      const noHalf = toH(b * h);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h, kind: 'right', unit: 'm' },
        questionText: `A right-angled triangular turf section has perpendicular legs of ${b} m and ${h} m. Find its area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [noHalf, toH(b + h), toH(2 * (b + h))], rng, 3, 'm²'),
        explanation: `In a right triangle, the two perpendicular legs act as base and height: ½ × ${b} × ${h} = ${fmtNum(a)} m².`,
        hint1: 'The two sides meeting at the right angle are the base and height.',
        hint2: `½ × ${b} × ${h} = ${fmtNum(a)} m².'`
      };
    },
    // 2: Obtuse triangle (height outside base)
    () => {
      const b = rng.choice([8, 12, 14, 16]);
      const h = rng.int(6, 12);
      const a = triangleArea(b, h);
      const slant = h + 2;
      const wrongWithSlant = triangleArea(b, slant);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h, kind: 'obtuse', unit: 'cm' },
        questionText: `An obtuse triangular design has a base of ${b} cm. Its perpendicular height falls outside the base and measures ${h} cm. What is its area?`,
        correctAnswer: `${fmtNum(a)} cm²`,
        options: makeDistractors(a, [toH(b * h), wrongWithSlant, toH(a / 100 + 10)], rng, 3, 'cm²'),
        explanation: `Even when the height falls outside the base, area = ½ × base × perpendicular height = ½ × ${b} × ${h} = ${fmtNum(a)} cm². ${REASONS.perpHeight}`,
        hint1: 'Use the base and the perpendicular height, even if height is outside.',
        hint2: `½ × ${b} × ${h} = ${fmtNum(a)} cm².'`
      };
    },
    // 3: Missing height from triangle area
    () => {
      const b = rng.choice([8, 10, 12, 16]);
      const h = rng.int(5, 12);
      const a = (b * h) / 2;
      const hH = toH(h);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h: null, area: a, kind: 'acute', unit: 'm', unknown: 'height' },
        questionText: `A triangular banner has an area of ${a} m² and a base of ${b} m. Find its perpendicular height.`,
        correctAnswer: `${fmtNum(hH)} m`,
        options: makeDistractors(hH, [toH(h / 2), toH(h * 2), toH(a / b)], rng, 3, 'm'),
        explanation: `Double the area first: 2 × ${a} = ${2 * a}. Then divide by the base: ${2 * a} ÷ ${b} = ${h} m.`,
        hint1: 'Height = (2 × Area) ÷ Base.',
        hint2: `(2 × ${a}) ÷ ${b} = ${2 * a} ÷ ${b} = ${h} m.`
      };
    },
    // 4: Missing base from triangle area
    () => {
      const h = rng.choice([6, 8, 10, 14]);
      const b = rng.int(7, 15);
      const a = (b * h) / 2;
      const bH = toH(b);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b: null, h, area: a, kind: 'right', unit: 'cm', unknown: 'base' },
        questionText: `A triangular stone slab has an area of ${a} cm² and a perpendicular height of ${h} cm. What is its base?`,
        correctAnswer: `${fmtNum(bH)} cm`,
        options: makeDistractors(bH, [toH(b + 3), toH(a / h), toH(b * 2)], rng, 3, 'cm'),
        explanation: `Base = (2 × Area) ÷ Height = (2 × ${a}) ÷ ${h} = ${2 * a} ÷ ${h} = ${b} cm.`,
        hint1: 'Double the area, then divide by height.',
        hint2: `${2 * a} ÷ ${h} = ${b} cm.`
      };
    },
    // 5: Triangle with slant distractor
    () => {
      const b = 10;
      const h = 8;
      const slant = 10;
      const a = triangleArea(b, h);
      const wrongSlant = triangleArea(b, slant);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h, slant, kind: 'acute', unit: 'm' },
        questionText: `A triangular lawn plot has base 10 m, slanted side 10 m, and perpendicular height 8 m. Calculate its area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [wrongSlant, toH(b * h), toH(28)], rng, 3, 'm²'),
        explanation: `Always multiply base by perpendicular height (8 m), not the slanted side (10 m): ½ × 10 × 8 = 40 m².`,
        hint1: 'Do not use the slanted side! Use the perpendicular height.',
        hint2: '½ × 10 × 8 = 40 m².'
      };
    },
    // 6: Triangle area in composite lawn
    () => {
      const b = 14;
      const h = 6;
      const a = triangleArea(b, h);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h, kind: 'acute', unit: 'm' },
        questionText: `An ornamental triangle at the park entrance has a base of 14 m and a perpendicular height of 6 m. Find the area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(b * h), toH(b + h), toH(a / 100 + 8)], rng, 3, 'm²'),
        explanation: `½ × 14 × 6 = 42 m².`,
        hint1: '½ × base × perpendicular height.',
        hint2: '½ × 14 × 6 = 42 m².'
      };
    },
    // 7: Splitting a rectangle into two triangles
    () => {
      const l = 16;
      const w = 10;
      const rectA = l * w;
      const triA = toH(rectA / 2);
      return {
        category: 'area-triangle',
        visual: 'rect',
        visualData: { l, w, unit: 'm' },
        questionText: `A rectangular courtyard measuring 16 m by 10 m is divided along its diagonal into two equal triangular garden plots. What is the area of one triangular plot?`,
        correctAnswer: `${fmtNum(triA)} m²`,
        options: makeDistractors(triA, [toH(rectA), toH(2 * (l + w)), toH(triA / 100 + 15)], rng, 3, 'm²'),
        explanation: `Each triangle is exactly half of the rectangle: ½ × 16 × 10 = 80 m².`,
        hint1: 'A diagonal cuts a rectangle into two equal triangles.',
        hint2: '½ × 160 = 80 m².'
      };
    },
    // 8: Obtuse triangle with large offset
    () => {
      const b = 12;
      const h = 7;
      const a = triangleArea(b, h);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h, kind: 'obtuse', unit: 'cm' },
        questionText: `A decorative triangular paver has a base of 12 cm and a perpendicular height extending outside the triangle of 7 cm. Find its area.`,
        correctAnswer: `${fmtNum(a)} cm²`,
        options: makeDistractors(a, [toH(12 * 7), toH(19), toH(a / 100 + 6)], rng, 3, 'cm²'),
        explanation: `½ × 12 × 7 = 42 cm².`,
        hint1: '½ × base × height.',
        hint2: '½ × 12 × 7 = 42 cm².'
      };
    },
    // 9: Triangle multi-step
    () => {
      const b = 18;
      const h = 8;
      const a = triangleArea(b, h);
      return {
        category: 'area-triangle',
        visual: 'triangle',
        visualData: { b, h, kind: 'acute', unit: 'm' },
        questionText: `A triangular roof shelter has base 18 m and perpendicular height 8 m. What is the area of turf beneath it?`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(18 * 8), toH(26), toH(a / 100 + 12)], rng, 3, 'm²'),
        explanation: `½ × 18 × 8 = 72 m².`,
        hint1: '½ × 18 × 8.',
        hint2: '9 × 8 = 72 m².'
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 3: Slant Plaza — Area & Perimeter of Parallelograms
function genWorld3Question(pos, rng) {
  const templates = [
    // 0: Parallelogram area with slant distractor
    () => {
      const p = genParallelogram(rng);
      const a = parallelogramArea(p.b, p.h);
      const wrongSlant = toH(p.b * p.slant);
      const wrongPerimeter = toH(2 * (p.b + p.slant));
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: p,
        questionText: `A parallelogram flowerbed has base ${p.b} cm, slanted side ${p.slant} cm, and perpendicular height ${p.h} cm. Calculate its area.`,
        correctAnswer: `${fmtNum(a)} cm²`,
        options: makeDistractors(a, [wrongSlant, wrongPerimeter, toH(p.b + p.h)], rng, 3, 'cm²'),
        explanation: `Area of a parallelogram = base × perpendicular height = ${p.b} × ${p.h} = ${fmtNum(a)} cm². ${REASONS.perpHeight}`,
        hint1: 'Use base × perpendicular height. Do NOT multiply by the slanted side!',
        hint2: `${p.b} × ${p.h} = ${fmtNum(a)} cm².'`
      };
    },
    // 1: Parallelogram perimeter
    () => {
      const p = genParallelogram(rng);
      const perim = toH(2 * (p.b + p.slant));
      const wrongArea = toH(p.b * p.h);
      const wrongPerimWithH = toH(2 * (p.b + p.h));
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: p,
        questionText: `A parallelogram plot has base ${p.b} cm and slanted side ${p.slant} cm (perpendicular height ${p.h} cm). Find its perimeter.`,
        correctAnswer: `${fmtNum(perim)} cm`,
        options: makeDistractors(perim, [wrongArea, wrongPerimWithH, toH(p.b + p.slant)], rng, 3, 'cm'),
        explanation: `Perimeter is the distance around the outside: 2 × (base + slanted side) = 2 × (${p.b} + ${p.slant}) = ${fmtNum(perim)} cm. Height is inside and not part of the perimeter!`,
        hint1: 'Perimeter adds the 4 outer sides: 2 × (base + slanted side).',
        hint2: `2 × (${p.b} + ${p.slant}) = ${fmtNum(perim)} cm.`
      };
    },
    // 2: Missing height from parallelogram area
    () => {
      const b = rng.choice([10, 12, 15, 20]);
      const h = rng.int(6, 12);
      const a = b * h;
      const hH = toH(h);
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b, h: null, area: a, slant: h + 3, offset: 4, unit: 'm', unknown: 'height' },
        questionText: `A parallelogram terrace has an area of ${a} m² and a base of ${b} m. What is its perpendicular height?`,
        correctAnswer: `${fmtNum(hH)} m`,
        options: makeDistractors(hH, [toH(h + 2), toH(h - 2), toH(a - b)], rng, 3, 'm'),
        explanation: `Perpendicular height = Area ÷ Base = ${a} ÷ ${b} = ${h} m.`,
        hint1: 'Divide the area by the base.',
        hint2: `${a} ÷ ${b} = ${h} m.`
      };
    },
    // 3: Missing base from area
    () => {
      const h = rng.choice([5, 8, 10, 12]);
      const b = rng.int(8, 18);
      const a = b * h;
      const bH = toH(b);
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b: null, h, area: a, slant: h + 2, offset: 3, unit: 'cm', unknown: 'base' },
        questionText: `A parallelogram tile has an area of ${a} cm² and a perpendicular height of ${h} cm. What is its base?`,
        correctAnswer: `${fmtNum(bH)} cm`,
        options: makeDistractors(bH, [toH(b + 3), toH(b - 2), toH(a / 2)], rng, 3, 'cm'),
        explanation: `Base = Area ÷ Height = ${a} ÷ ${h} = ${b} cm.`,
        hint1: 'Base = Area ÷ Height.',
        hint2: `${a} ÷ ${h} = ${b} cm.`
      };
    },
    // 4: Comparing parallelogram vs rectangle area
    () => {
      const b = 12;
      const h = 8;
      const slant = 10;
      const a = toH(b * h);
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b, h, slant, offset: 6, unit: 'm' },
        questionText: `A rectangular plot of 12 m by 8 m is sheared into a parallelogram of base 12 m and perpendicular height 8 m. What is the parallelogram’s area?`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(b * slant), toH(2 * (b + slant)), toH(a / 100 + 12)], rng, 3, 'm²'),
        explanation: `Because the base and perpendicular height are unchanged, the area is identical: 12 × 8 = 96 m².`,
        hint1: 'Area depends strictly on base and perpendicular height.',
        hint2: '12 × 8 = 96 m².'
      };
    },
    // 5: Parallelogram with integer triple values
    () => {
      const b = 14;
      const h = 12;
      const slant = 13;
      const a = toH(b * h);
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b, h, slant, offset: 5, unit: 'm' },
        questionText: `A parallelogram plaza section has base 14 m, slant edge 13 m, and height 12 m. Find its area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(b * slant), toH(2 * (b + slant)), toH(14 + 12)], rng, 3, 'm²'),
        explanation: `Base × height = 14 × 12 = 168 m². Slant edge 13 m is a distractor.`,
        hint1: 'Multiply base 14 by perpendicular height 12.',
        hint2: '14 × 12 = 168 m².'
      };
    },
    // 6: Parallelogram perimeter with given sides
    () => {
      const b = 18;
      const slant = 12;
      const h = 9;
      const p = toH(2 * (b + slant));
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b, h, slant, offset: 4, unit: 'm' },
        questionText: `Find the perimeter of a parallelogram garden plot with sides 18 m and 12 m, and height 9 m.`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [toH(b * h), toH(2 * (b + h)), toH(b + slant)], rng, 3, 'm'),
        explanation: `Perimeter = 2 × (18 + 12) = 2 × 30 = 60 m.`,
        hint1: 'Perimeter adds the outer boundary sides: 2 × (18 + 12).',
        hint2: '2 × 30 = 60 m.'
      };
    },
    // 7: Finding slant side from perimeter
    () => {
      const b = 15;
      const slant = 10;
      const p = 2 * (b + slant);
      const slantH = toH(slant);
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b, slant: null, perimeter: p, h: 8, offset: 6, unit: 'm', unknown: 'slant' },
        questionText: `A parallelogram has a perimeter of ${p} m and a base of ${b} m. Find the length of its slanted side.`,
        correctAnswer: `${fmtNum(slantH)} m`,
        options: makeDistractors(slantH, [toH(slant + 3), toH(slant - 2), toH(p / 4)], rng, 3, 'm'),
        explanation: `Half perimeter = ${p} ÷ 2 = ${p / 2} m. Slanted side = ${p / 2} - ${b} = ${slant} m.`,
        hint1: 'Subtract the base from half of the perimeter.',
        hint2: `${p / 2} - ${b} = ${slant} m.`
      };
    },
    // 8: Parallelogram tile count
    () => {
      const b = 10;
      const h = 6;
      const a = toH(b * h);
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b, h, slant: 8, offset: 4, unit: 'm' },
        questionText: `A shaded canopy in Slant Plaza is in the shape of a parallelogram with base 10 m and perpendicular height 6 m. What is its area?`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(10 * 8), toH(2 * (10 + 8)), toH(16)], rng, 3, 'm²'),
        explanation: `Base × perpendicular height = 10 × 6 = 60 m².`,
        hint1: '10 × 6 = 60 m².',
        hint2: 'Base × height = 60 m².'
      };
    },
    // 9: Parallelogram multi-step
    () => {
      const b = 16;
      const h = 7;
      const a = toH(b * h);
      return {
        category: 'area-parallelogram',
        visual: 'parallelogram',
        visualData: { b, h, slant: 9, offset: 4, unit: 'm' },
        questionText: `A decorative lawn bed is shaped as a parallelogram with base 16 m and height 7 m. Find the total area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(16 * 9), toH(23), toH(a / 100 + 10)], rng, 3, 'm²'),
        explanation: `16 × 7 = 112 m².`,
        hint1: '16 × 7.',
        hint2: '112 m².'
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 4: Trapezium Terrace — Trapezia, Kites & Rhombuses
function genWorld4Question(pos, rng) {
  const templates = [
    // 0: Trapezium standard area
    () => {
      const a = rng.choice([6, 8, 10]);
      const b = a + rng.choice([4, 6, 8]);
      const h = rng.choice([4, 6, 8]);
      const area = trapeziumArea(a, b, h);
      const forgotHalf = toH((a + b) * h);
      return {
        category: 'area-trapezium-kite',
        visual: 'trapezium',
        visualData: { a, b, h, unit: 'cm' },
        questionText: `A stepped terrace is shaped as a trapezium with parallel sides of ${a} cm and ${b} cm, and a perpendicular height of ${h} cm. Find its area.`,
        correctAnswer: `${fmtNum(area)} cm²`,
        options: makeDistractors(area, [forgotHalf, toH(a * b), toH(area / 100 + 10)], rng, 3, 'cm²'),
        explanation: `Area of a trapezium = ½ × (sum of parallel sides) × height = ½ × (${a} + ${b}) × ${h} = ½ × ${a + b} × ${h} = ${fmtNum(area)} cm².`,
        hint1: 'Add the two parallel sides, multiply by the height, then divide by 2.',
        hint2: `½ × (${a} + ${b}) × ${h} = ${fmtNum(area)} cm².'`
      };
    },
    // 1: Kite area from diagonals
    () => {
      const d1 = rng.choice([8, 10, 12, 14]);
      const d2 = rng.choice([6, 8, 10, 12]);
      const area = kiteArea(d1, d2);
      const noHalf = toH(d1 * d2);
      return {
        category: 'area-trapezium-kite',
        visual: 'kite',
        visualData: { d1, d2, unit: 'cm' },
        questionText: `A kite-shaped paving flag has perpendicular diagonals measuring ${d1} cm and ${d2} cm. Find its surface area.`,
        correctAnswer: `${fmtNum(area)} cm²`,
        options: makeDistractors(area, [noHalf, toH(2 * (d1 + d2)), toH(d1 + d2)], rng, 3, 'cm²'),
        explanation: `Area of a kite = ½ × d₁ × d₂ = ½ × ${d1} × ${d2} = ${fmtNum(area)} cm².`,
        hint1: 'Area of a kite is half the product of its diagonals.',
        hint2: `½ × ${d1} × ${d2} = ${fmtNum(area)} cm².'`
      };
    },
    // 2: Rhombus area from diagonals
    () => {
      const d1 = rng.choice([10, 12, 16]);
      const d2 = rng.choice([8, 14, 18]);
      const area = kiteArea(d1, d2);
      const noHalf = toH(d1 * d2);
      return {
        category: 'area-trapezium-kite',
        visual: 'rhombus',
        visualData: { d1, d2, unit: 'm' },
        questionText: `A rhombus-shaped park courtyard has diagonals of ${d1} m and ${d2} m. Calculate its area.`,
        correctAnswer: `${fmtNum(area)} m²`,
        options: makeDistractors(area, [noHalf, toH(d1 + d2), toH(area / 100 + 12)], rng, 3, 'm²'),
        explanation: `A rhombus has perpendicular diagonals: Area = ½ × d₁ × d₂ = ½ × ${d1} × ${d2} = ${fmtNum(area)} m².`,
        hint1: 'Multiply the two diagonals together and halve the result.',
        hint2: `½ × ${d1} × ${d2} = ${fmtNum(area)} m².'`
      };
    },
    // 3: Missing parallel side of trapezium
    () => {
      const a = 8;
      const b = 14;
      const h = 6;
      const area = ((a + b) * h) / 2; // 66
      const bH = toH(b);
      return {
        category: 'area-trapezium-kite',
        visual: 'trapezium',
        visualData: { a, b: null, h, area, unit: 'cm', unknown: 'side_b' },
        questionText: `A trapezium has an area of ${area} cm², height of ${h} cm, and one parallel side of ${a} cm. Find the length of the other parallel side.`,
        correctAnswer: `${fmtNum(bH)} cm`,
        options: makeDistractors(bH, [toH(10), toH(12), toH(16)], rng, 3, 'cm'),
        explanation: `Sum of parallel sides = (2 × Area) ÷ height = (2 × ${area}) ÷ ${h} = 132 ÷ 6 = 22 cm. Missing side = 22 - ${a} = ${b} cm.`,
        hint1: 'First find the sum of parallel sides: (2 × Area) ÷ height.',
        hint2: `(2 × ${area}) ÷ ${h} = 22, then 22 - ${a} = ${b} cm.`
      };
    },
    // 4: Rhombus perimeter
    () => {
      const side = rng.int(7, 15);
      const perim = toH(4 * side);
      return {
        category: 'area-trapezium-kite',
        visual: 'rhombus',
        visualData: { side, d1: 12, d2: 16, unit: 'm' },
        questionText: `A rhombus flower bed has sides of length ${side} m. Find its perimeter.`,
        correctAnswer: `${fmtNum(perim)} m`,
        options: makeDistractors(perim, [toH(side * side), toH(2 * side), toH(perim / 100 + 8)], rng, 3, 'm'),
        explanation: `A rhombus has 4 equal sides: Perimeter = 4 × side = 4 × ${side} = ${fmtNum(perim)} m.`,
        hint1: 'All 4 sides of a rhombus are equal.',
        hint2: `4 × ${side} = ${fmtNum(perim)} m.`
      };
    },
    // 5: Trapezium with legs for perimeter
    () => {
      const a = 10;
      const b = 18;
      const leg = 5;
      const p = toH(a + b + 2 * leg);
      return {
        category: 'area-trapezium-kite',
        visual: 'trapezium',
        visualData: { a, b, h: 4, legs: [leg, leg], unit: 'm' },
        questionText: `A garden terrace shaped as an isosceles trapezium has parallel sides 10 m and 18 m, and slanted legs of 5 m each. What is its perimeter?`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [toH(a + b + leg), toH(56), toH(p / 100 - 4)], rng, 3, 'm'),
        explanation: `Perimeter = sum of all 4 outer sides: 10 + 18 + 5 + 5 = 38 m.`,
        hint1: 'Add all four outer sides around the trapezium.',
        hint2: '10 + 18 + 5 + 5 = 38 m.'
      };
    },
    // 6: Missing diagonal from kite area
    () => {
      const d1 = 12;
      const d2 = 10;
      const area = (d1 * d2) / 2; // 60
      const d2H = toH(d2);
      return {
        category: 'area-trapezium-kite',
        visual: 'kite',
        visualData: { d1, d2: null, area, unit: 'cm', unknown: 'd2' },
        questionText: `A kite emblem has an area of ${area} cm² and one diagonal of ${d1} cm. Find the length of the other diagonal.`,
        correctAnswer: `${fmtNum(d2H)} cm`,
        options: makeDistractors(d2H, [toH(8), toH(12), toH(15)], rng, 3, 'cm'),
        explanation: `Diagonal = (2 × Area) ÷ d₁ = (2 × ${area}) ÷ ${d1} = 120 ÷ 12 = 10 cm.`,
        hint1: 'Multiply area by 2 and divide by the known diagonal.',
        hint2: `(2 × ${area}) ÷ ${d1} = ${d2} cm.`
      };
    },
    // 7: Trapezium lawn turf calculation
    () => {
      const a = 12;
      const b = 20;
      const h = 8;
      const area = trapeziumArea(a, b, h);
      return {
        category: 'area-trapezium-kite',
        visual: 'trapezium',
        visualData: { a, b, h, unit: 'm' },
        questionText: `A community amphitheatre lawn is a trapezium with parallel sides 12 m and 20 m, and height 8 m. Calculate its area.`,
        correctAnswer: `${fmtNum(area)} m²`,
        options: makeDistractors(area, [toH((a + b) * h), toH(a * b), toH(area / 100 + 16)], rng, 3, 'm²'),
        explanation: `½ × (12 + 20) × 8 = ½ × 32 × 8 = 128 m².`,
        hint1: '½ × (12 + 20) × 8.',
        hint2: '16 × 8 = 128 m².'
      };
    },
    // 8: Rhombus area with decimals
    () => {
      const d1 = 15;
      const d2 = 8;
      const area = kiteArea(d1, d2);
      return {
        category: 'area-trapezium-kite',
        visual: 'rhombus',
        visualData: { d1, d2, unit: 'm' },
        questionText: `Find the area of a rhombus terrace whose diagonals are 15 m and 8 m.`,
        correctAnswer: `${fmtNum(area)} m²`,
        options: makeDistractors(area, [toH(d1 * d2), toH(23), toH(area / 100 + 10)], rng, 3, 'm²'),
        explanation: `½ × 15 × 8 = 60 m².`,
        hint1: '½ × 15 × 8.',
        hint2: '60 m².'
      };
    },
    // 9: Trapezium multi-step
    () => {
      const a = 14;
      const b = 22;
      const h = 10;
      const area = trapeziumArea(a, b, h);
      return {
        category: 'area-trapezium-kite',
        visual: 'trapezium',
        visualData: { a, b, h, unit: 'm' },
        questionText: `A terraced planting bed has parallel edges 14 m and 22 m with perpendicular width 10 m. What is its surface area?`,
        correctAnswer: `${fmtNum(area)} m²`,
        options: makeDistractors(area, [toH((a + b) * h), toH(180), toH(area / 100 + 20)], rng, 3, 'm²'),
        explanation: `½ × (14 + 22) × 10 = ½ × 36 × 10 = 180 m².`,
        hint1: '½ × (14 + 22) × 10.',
        hint2: '18 × 10 = 180 m².'
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 5: Pond Plaza — Circles (Circumference & Area)
function genWorld5Question(pos, rng) {
  const templates = [
    // 0: Circumference with pi = 22/7
    () => {
      const r = rng.choice([7, 14, 21, 28]);
      const pi = PI.frac;
      const c = circumference(r, pi);
      const a = circleArea(r, pi);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r, pi, unit: 'm', show: ['circumference'] },
        questionText: `A circular lily pond has a radius of ${r} m. Use π = 22/7. Calculate the circumference of fencing required around the pond.`,
        correctAnswer: `${fmtNum(c)} m`,
        options: makeDistractors(c, [a, toH(c / 2), toH(2 * r)], rng, 3, 'm'),
        explanation: `Circumference = 2 × π × r = 2 × (22/7) × ${r} = ${fmtNum(c)} m.`,
        hint1: 'Use Circumference = 2 × π × radius.',
        hint2: `2 × (22/7) × ${r} = ${fmtNum(c)} m.`
      };
    },
    // 1: Area of circle with pi = 22/7
    () => {
      const r = rng.choice([7, 14, 21]);
      const pi = PI.frac;
      const a = circleArea(r, pi);
      const c = circumference(r, pi);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r, pi, unit: 'm', show: ['area'] },
        questionText: `A circular fountain basin has a radius of ${r} m. Use π = 22/7. Find its water surface area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [c, toH(pi.num * r), toH(a / 100 + 40)], rng, 3, 'm²'),
        explanation: `Area of a circle = π × r² = (22/7) × ${r}² = ${fmtNum(a)} m².`,
        hint1: 'Area = π × radius².',
        hint2: `(22/7) × ${r} × ${r} = ${fmtNum(a)} m².'`
      };
    },
    // 2: Circumference with pi = 3.14
    () => {
      const r = rng.choice([5, 10, 15, 20]);
      const pi = PI.dec;
      const c = circumference(r, pi);
      const a = circleArea(r, pi);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r, pi, unit: 'm', show: ['circumference'] },
        questionText: `A circular flower roundabout has radius ${r} m. Use π = 3.14. Calculate its circumference.`,
        correctAnswer: `${fmtNum(c)} m`,
        options: makeDistractors(c, [a, toH(c / 2), toH(3.14 * r)], rng, 3, 'm'),
        explanation: `Circumference = 2 × 3.14 × ${r} = ${fmtNum(c)} m.`,
        hint1: 'Circumference = 2 × π × r.',
        hint2: `2 × 3.14 × ${r} = ${fmtNum(c)} m.`
      };
    },
    // 3: Area with pi = 3.14
    () => {
      const r = rng.choice([4, 6, 8, 10]);
      const pi = PI.dec;
      const a = circleArea(r, pi);
      const c = circumference(r, pi);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r, pi, unit: 'm', show: ['area'] },
        questionText: `A circular stone patio has radius ${r} m. Use π = 3.14. Find its area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [c, toH(2 * 3.14 * r * r), toH(a / 100 + 25)], rng, 3, 'm²'),
        explanation: `Area = π × r² = 3.14 × ${r}² = ${fmtNum(a)} m².`,
        hint1: 'Area = 3.14 × r × r.',
        hint2: `3.14 × ${r * r} = ${fmtNum(a)} m².'`
      };
    },
    // 4: Given diameter, find circumference (pi = 22/7)
    () => {
      const d = rng.choice([14, 28, 42]);
      const r = d / 2;
      const pi = PI.frac;
      const c = circumference(r, pi);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { d, r, pi, unit: 'm', show: ['circumference'] },
        questionText: `A circular reflecting pool has a diameter of ${d} m. Use π = 22/7. Find its circumference.`,
        correctAnswer: `${fmtNum(c)} m`,
        options: makeDistractors(c, [toH(2 * c), toH(c / 2), toH(d * 2)], rng, 3, 'm'),
        explanation: `Circumference = π × diameter = (22/7) × ${d} = ${fmtNum(c)} m. (Or 2 × π × ${r} = ${fmtNum(c)} m).`,
        hint1: 'Circumference = π × d or 2 × π × r.',
        hint2: `(22/7) × ${d} = ${fmtNum(c)} m.`
      };
    },
    // 5: Given diameter, find area (pi = 3.14)
    () => {
      const d = rng.choice([10, 20]);
      const r = d / 2;
      const pi = PI.dec;
      const a = circleArea(r, pi);
      const wrongWithD = toH(3.14 * d * d);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { d, r, pi, unit: 'm', show: ['area'] },
        questionText: `A circular turf mound has a diameter of ${d} m. Use π = 3.14. Find its area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [wrongWithD, circumference(r, pi), toH(a / 100 + 30)], rng, 3, 'm²'),
        explanation: `First find radius: r = ${d} ÷ 2 = ${r} m. Area = π × r² = 3.14 × ${r}² = ${fmtNum(a)} m². ${REASONS.diameter}`,
        hint1: 'Halve the diameter to get the radius before using πr².',
        hint2: `r = ${r} m, Area = 3.14 × ${r * r} = ${fmtNum(a)} m².'`
      };
    },
    // 6: Radius from circumference (pi = 22/7)
    () => {
      const r = 7;
      const pi = PI.frac;
      const c = 44; // 2 * 22/7 * 7 = 44
      const rH = toH(r);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r: null, c, pi, unit: 'm', unknown: 'radius' },
        questionText: `A circular walking track has a circumference of 44 m. Use π = 22/7. Find its radius.`,
        correctAnswer: `${fmtNum(rH)} m`,
        options: makeDistractors(rH, [toH(14), toH(22), toH(3.5)], rng, 3, 'm'),
        explanation: `Radius = Circumference ÷ (2 × π) = 44 ÷ (44/7) = 44 × (7/44) = 7 m.`,
        hint1: 'r = C ÷ (2π).',
        hint2: '44 ÷ (44/7) = 7 m.'
      };
    },
    // 7: Radius from area (pi = 3.14)
    () => {
      const r = 10;
      const pi = PI.dec;
      const a = 314;
      const rH = toH(r);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r: null, a, pi, unit: 'm', unknown: 'radius' },
        questionText: `A circular plaza has an area of 314 m². Use π = 3.14. What is the radius of the plaza?`,
        correctAnswer: `${fmtNum(rH)} m`,
        options: makeDistractors(rH, [toH(20), toH(100), toH(5)], rng, 3, 'm'),
        explanation: `r² = Area ÷ π = 314 ÷ 3.14 = 100. Taking the square root gives r = 10 m.`,
        hint1: 'r² = Area ÷ 3.14.',
        hint2: '314 ÷ 3.14 = 100, and √100 = 10 m.'
      };
    },
    // 8: Circumference of tree enclosure
    () => {
      const r = 3.5;
      const pi = PI.frac;
      const c = toH(2 * (22 / 7) * r); // 22
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r: 3.5, pi, unit: 'm' },
        questionText: `A heritage banyan tree is surrounded by a circular fence of radius 3.5 m. Use π = 22/7. What is the length of fence?`,
        correctAnswer: `${fmtNum(c)} m`,
        options: makeDistractors(c, [toH(44), toH(38.5), toH(11)], rng, 3, 'm'),
        explanation: `Circumference = 2 × (22/7) × 3.5 = 2 × 11 = 22 m.`,
        hint1: '2 × (22/7) × 3.5.',
        hint2: '22 m.'
      };
    },
    // 9: Circle multi-step
    () => {
      const r = 14;
      const pi = PI.frac;
      const c = circumference(r, pi);
      return {
        category: 'circle-basics',
        visual: 'circle',
        visualData: { r, pi, unit: 'm' },
        questionText: `A bicycle path loops around a circular pond of radius 14 m. Use π = 22/7. How far does a cyclist ride in one lap?`,
        correctAnswer: `${fmtNum(c)} m`,
        options: makeDistractors(c, [circleArea(r, pi), toH(44), toH(176)], rng, 3, 'm'),
        explanation: `One lap is the circumference: 2 × (22/7) × 14 = 88 m.`,
        hint1: '2 × (22/7) × 14.',
        hint2: '88 m.'
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 6: Sector Garden — Semicircles, Quadrants & Sectors
function genWorld6Question(pos, rng) {
  const templates = [
    // 0: Semicircle perimeter (arc + diameter!)
    () => {
      const r = rng.choice([7, 14, 21]);
      const pi = PI.frac;
      const arc = exact2dp(pi.num * r, pi.den);
      const d = toH(2 * r);
      const perim = arc + d;
      return {
        category: 'arcs-sectors',
        visual: 'semicircle',
        visualData: { r, pi, theta: 180, unit: 'm', show: ['perimeter'] },
        questionText: `A semicircular flowerbed has radius ${r} m. Use π = 22/7. Find its total perimeter including the straight boundary edge.`,
        correctAnswer: `${fmtNum(perim)} m`,
        options: makeDistractors(perim, [arc, toH(2 * (arc / 100)), toH(perim / 100 + 8)], rng, 3, 'm'),
        explanation: `Curved arc = π × r = (22/7) × ${r} = ${fmtNum(arc)} m. Straight diameter = 2 × ${r} = ${2 * r} m. Total perimeter = ${fmtNum(arc)} + ${2 * r} = ${fmtNum(perim)} m. ${REASONS.arcPlusDiameter}`,
        hint1: 'A semicircle perimeter includes BOTH the curved arc AND the straight diameter!',
        hint2: `Arc (${fmtNum(arc)} m) + Diameter (${2 * r} m) = ${fmtNum(perim)} m.`
      };
    },
    // 1: Semicircle area
    () => {
      const r = rng.choice([7, 14]);
      const pi = PI.frac;
      const fullA = circleArea(r, pi);
      const semiA = toH(fullA / 200);
      return {
        category: 'arcs-sectors',
        visual: 'semicircle',
        visualData: { r, pi, theta: 180, unit: 'm', show: ['area'] },
        questionText: `A semicircular patio has a radius of ${r} m. Use π = 22/7. Find its area.`,
        correctAnswer: `${fmtNum(semiA)} m²`,
        options: makeDistractors(semiA, [fullA, toH(semiA / 100 + 30), toH(semiA / 200)], rng, 3, 'm²'),
        explanation: `Area of a semicircle = ½ × π × r² = ½ × (22/7) × ${r}² = ${fmtNum(semiA)} m².`,
        hint1: 'Halve the area of a full circle: ½ × π × r².',
        hint2: `½ × (22/7) × ${r * r} = ${fmtNum(semiA)} m².'`
      };
    },
    // 2: Quadrant perimeter (arc + 2 radii!)
    () => {
      const r = rng.choice([7, 14]);
      const pi = PI.frac;
      const arc = exact2dp(pi.num * r, 2 * pi.den);
      const twoR = toH(2 * r);
      const perim = arc + twoR;
      return {
        category: 'arcs-sectors',
        visual: 'quadrant',
        visualData: { r, pi, theta: 90, unit: 'm', show: ['perimeter'] },
        questionText: `A garden lawn is shaped as a quadrant (one quarter of a circle) with radius ${r} m. Use π = 22/7. Find its perimeter.`,
        correctAnswer: `${fmtNum(perim)} m`,
        options: makeDistractors(perim, [arc, toH(arc + toH(r)), toH(perim / 100 + 10)], rng, 3, 'm'),
        explanation: `Arc length = ¼ × (2 × π × r) = ${fmtNum(arc)} m. Two straight radii = 2 × ${r} = ${2 * r} m. Total perimeter = ${fmtNum(arc)} + ${2 * r} = ${fmtNum(perim)} m.`,
        hint1: 'A quadrant’s perimeter is its curved arc plus two straight radius edges.',
        hint2: `Arc ${fmtNum(arc)} m + 2 × ${r} m = ${fmtNum(perim)} m.`
      };
    },
    // 3: Quadrant area (pi = 3.14)
    () => {
      const r = rng.choice([10, 20]);
      const pi = PI.dec;
      const fullA = circleArea(r, pi);
      const quadA = toH(fullA / 400);
      return {
        category: 'arcs-sectors',
        visual: 'quadrant',
        visualData: { r, pi, theta: 90, unit: 'm', show: ['area'] },
        questionText: `A quadrant seating area has radius ${r} m. Use π = 3.14. Calculate its area.`,
        correctAnswer: `${fmtNum(quadA)} m²`,
        options: makeDistractors(quadA, [fullA, toH(fullA / 200), toH(quadA / 100 + 20)], rng, 3, 'm²'),
        explanation: `Area of a quadrant = ¼ × π × r² = ¼ × 3.14 × ${r}² = ${fmtNum(quadA)} m².`,
        hint1: 'Divide the full circle area by 4.',
        hint2: `(3.14 × ${r * r}) ÷ 4 = ${fmtNum(quadA)} m².'`
      };
    },
    // 4: Arc length of 90° sector (pi = 22/7)
    () => {
      const r = 14;
      const pi = PI.frac;
      const arc = arcLength(r, 90, pi);
      return {
        category: 'arcs-sectors',
        visual: 'quadrant',
        visualData: { r, pi, theta: 90, unit: 'm', show: ['arc'] },
        questionText: `What is the curved arc length of a 90° circular sector with radius 14 m? Use π = 22/7.`,
        correctAnswer: `${fmtNum(arc)} m`,
        options: makeDistractors(arc, [toH(arc / 100 + 28), toH(2 * (arc / 100)), toH(88)], rng, 3, 'm'),
        explanation: `Arc length = (90/360) × 2 × π × r = ¼ × (2 × (22/7) × 14) = ¼ × 88 = 22 m.`,
        hint1: 'Arc length = (θ/360) × 2 × π × r.',
        hint2: '¼ × 88 = 22 m.'
      };
    },
    // 5: Sector area with 270° angle (pi = 22/7)
    () => {
      const r = 14;
      const pi = PI.frac;
      const fullA = circleArea(r, pi); // 616
      const sA = sectorArea(r, 270, pi); // 462
      return {
        category: 'arcs-sectors',
        visual: 'sector',
        visualData: { r, pi, theta: 270, unit: 'm', show: ['area'] },
        questionText: `A major sector garden has an angle of 270° and radius 14 m. Use π = 22/7. Calculate its area.`,
        correctAnswer: `${fmtNum(sA)} m²`,
        options: makeDistractors(sA, [fullA, toH(154), toH(sA / 100 + 30)], rng, 3, 'm²'),
        explanation: `Area = (270/360) × π × r² = ¾ × (22/7) × 14² = ¾ × 616 = 462 m².`,
        hint1: '270° is ¾ of a full circle.',
        hint2: '¾ × 616 = 462 m².'
      };
    },
    // 6: Semicircle perimeter with pi = 3.14
    () => {
      const r = 10;
      const pi = PI.dec;
      const arc = exact2dp(pi.num * r, pi.den); // 31.4
      const d = 20;
      const perim = arc + toH(d); // 51.4
      return {
        category: 'arcs-sectors',
        visual: 'semicircle',
        visualData: { r, pi, theta: 180, unit: 'm' },
        questionText: `A semicircular courtyard has radius 10 m. Use π = 3.14. Find its perimeter.`,
        correctAnswer: `${fmtNum(perim)} m`,
        options: makeDistractors(perim, [arc, toH(62.8), toH(31.4)], rng, 3, 'm'),
        explanation: `Arc = 3.14 × 10 = 31.4 m. Diameter = 20 m. Perimeter = 31.4 + 20 = 51.4 m.`,
        hint1: 'Add the curved arc and the diameter.',
        hint2: '31.4 m + 20 m = 51.4 m.'
      };
    },
    // 7: Sector arc length with 180°
    () => {
      const r = 7;
      const pi = PI.frac;
      const arc = exact2dp(pi.num * r, pi.den); // 22
      return {
        category: 'arcs-sectors',
        visual: 'semicircle',
        visualData: { r, pi, theta: 180, unit: 'm' },
        questionText: `What is the curved arc length (curved boundary only) of a semicircle with radius 7 m? Use π = 22/7.`,
        correctAnswer: `${fmtNum(arc)} m`,
        options: makeDistractors(arc, [toH(44), toH(36), toH(14)], rng, 3, 'm'),
        explanation: `Curved arc only = π × r = (22/7) × 7 = 22 m.`,
        hint1: 'Only the curved arc is requested, not the straight edge.',
        hint2: '(22/7) × 7 = 22 m.'
      };
    },
    // 8: Quadrant lawn area with pi = 22/7
    () => {
      const r = 14;
      const pi = PI.frac;
      const a = exact2dp(pi.num * r * r, 4 * pi.den); // 154
      return {
        category: 'arcs-sectors',
        visual: 'quadrant',
        visualData: { r, pi, theta: 90, unit: 'm' },
        questionText: `A corner flowerbed is shaped as a 90° quadrant of radius 14 m. Use π = 22/7. Find its area.`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(616), toH(308), toH(77)], rng, 3, 'm²'),
        explanation: `Area = ¼ × (22/7) × 14² = ¼ × 616 = 154 m².`,
        hint1: '¼ of a full circle.',
        hint2: '616 ÷ 4 = 154 m².'
      };
    },
    // 9: Semicircle lawn turf
    () => {
      const r = 21;
      const pi = PI.frac;
      const a = exact2dp(pi.num * r * r, 2 * pi.den); // 693
      return {
        category: 'arcs-sectors',
        visual: 'semicircle',
        visualData: { r, pi, theta: 180, unit: 'm' },
        questionText: `A semicircular park lawn has radius 21 m. Use π = 22/7. What is its surface area?`,
        correctAnswer: `${fmtNum(a)} m²`,
        options: makeDistractors(a, [toH(1386), toH(346.5), toH(a / 100 + 40)], rng, 3, 'm²'),
        explanation: `½ × (22/7) × 21² = ½ × 1386 = 693 m².`,
        hint1: '½ × π × r².',
        hint2: '½ × 1386 = 693 m².'
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 7: Composite Courtyard — Area & Perimeter of Composite Figures
function genWorld7Question(pos, rng) {
  const templates = [
    // 0: Rect + semicircle area
    () => {
      const c = genComposite(rng, 'rect+semi');
      const wrongInternal = toH(c.totalArea / 100 + 20);
      return {
        category: 'composite-figures',
        visual: 'composite',
        visualData: c,
        questionText: `A park courtyard consists of a rectangular lawn (${c.l} m by ${c.w} m) with an attached semicircular patio of radius ${c.r} m (π = ${c.pi.label}). Calculate its total area.`,
        correctAnswer: `${fmtNum(c.totalArea)} m²`,
        options: makeDistractors(c.totalArea, [c.components[0].area, wrongInternal, toH(c.totalArea / 100 - 30)], rng, 3, 'm²'),
        explanation: `Total area = Rectangle area + Semicircle area = ${fmtNum(c.components[0].area)} + ${fmtNum(c.components[1].area)} = ${fmtNum(c.totalArea)} m².`,
        hint1: 'Add the area of the rectangle and the area of the semicircle.',
        hint2: `${fmtNum(c.components[0].area)} + ${fmtNum(c.components[1].area)} = ${fmtNum(c.totalArea)} m².'`
      };
    },
    // 1: Rect + semicircle perimeter (ignore shared divider!)
    () => {
      const c = genComposite(rng, 'rect+semi');
      const wrongCountedDivider = toH(c.perimeter / 100 + c.w);
      return {
        category: 'composite-figures',
        visual: 'composite',
        visualData: c,
        questionText: `Find the outer perimeter fence needed around the composite lawn and patio (${c.l} m by ${c.w} m plus semicircle of radius ${c.r} m, π = ${c.pi.label}).`,
        correctAnswer: `${fmtNum(c.perimeter)} m`,
        options: makeDistractors(c.perimeter, [wrongCountedDivider, toH(2 * c.l + 2 * c.w), toH(c.perimeter / 100 - 10)], rng, 3, 'm'),
        explanation: `Perimeter counts only the outside boundary fence: top + bottom + left side + curved arc = ${fmtNum(c.perimeter)} m. The internal divider (${c.w} m) is INSIDE and must NOT be added! ${REASONS.outerEdges}`,
        hint1: 'Do NOT add the internal shared divider line! Count only the outside fence.',
        hint2: `Outer edges: ${c.l} + ${c.l} + ${c.w} + arc = ${fmtNum(c.perimeter)} m.`
      };
    },
    // 2: Rect with triangular corner cut-out (subtract area!)
    () => {
      const c = genComposite(rng, 'rect-triangle');
      const wrongAdded = toH(c.components[0].area / 100 + c.components[1].area / 100);
      return {
        category: 'composite-figures',
        visual: 'composite',
        visualData: c,
        questionText: `A pavilion platform is ${c.l} m by ${c.w} m, but has a triangular corner cut-out with perpendicular legs of ${c.tb} m and ${c.th} m. Find the remaining floor area.`,
        correctAnswer: `${fmtNum(c.totalArea)} m²`,
        options: makeDistractors(c.totalArea, [c.components[0].area, wrongAdded, toH(c.totalArea / 100 - 15)], rng, 3, 'm²'),
        explanation: `Base rectangle area = ${c.l} × ${c.w} = ${fmtNum(c.components[0].area)} m². Cut-out triangle = ½ × ${c.tb} × ${c.th} = ${fmtNum(c.components[1].area)} m². Remaining area = ${fmtNum(c.components[0].area)} - ${fmtNum(c.components[1].area)} = ${fmtNum(c.totalArea)} m².`,
        hint1: 'Subtract the triangular cut-out area from the base rectangle area.',
        hint2: `${fmtNum(c.components[0].area)} - ${fmtNum(c.components[1].area)} = ${fmtNum(c.totalArea)} m².'`
      };
    },
    // 3: L-shaped composite area
    () => {
      const L = 14;
      const W = 10;
      const cutL = 6;
      const cutW = 4;
      const totalA = toH(L * W - cutL * cutW); // 140 - 24 = 116
      return {
        category: 'composite-figures',
        visual: 'rectilinear',
        visualData: { L, W, cutL, cutW, unit: 'm' },
        questionText: `An L-shaped lawn has bounding dimensions 14 m by 10 m with a missing corner notch of 6 m by 4 m. Find its total surface area.`,
        correctAnswer: `${fmtNum(totalA)} m²`,
        options: makeDistractors(totalA, [toH(L * W), toH(L * W + cutL * cutW), toH(totalA / 100 + 12)], rng, 3, 'm²'),
        explanation: `Bounding rectangle = 14 × 10 = 140 m². Missing corner = 6 × 4 = 24 m². Remaining area = 140 - 24 = 116 m².`,
        hint1: 'Subtract the notch rectangle from the bounding rectangle.',
        hint2: '140 m² - 24 m² = 116 m².'
      };
    },
    // 4: Composite figure: square with semicircle attached
    () => {
      const s = 14;
      const r = 7;
      const pi = PI.frac;
      const sqA = toH(s * s); // 196
      const semiA = exact2dp(pi.num * r * r, 2 * pi.den); // 77
      const totalA = sqA + semiA; // 273
      return {
        category: 'composite-figures',
        visual: 'composite',
        visualData: {
          kind: 'rect+semi',
          l: s,
          w: s,
          r,
          pi,
          unit: 'm',
          components: [
            { id: 'sq', name: 'Square Plaza', area: sqA, op: 'add' },
            { id: 'semi', name: 'Semicircle Stage', area: semiA, op: 'add' }
          ]
        },
        questionText: `A stage consists of a square of side 14 m and an attached semicircle of diameter 14 m (r = 7 m, π = 22/7). What is the total area?`,
        correctAnswer: `${fmtNum(totalA)} m²`,
        options: makeDistractors(totalA, [sqA, toH(totalA / 100 + 20), toH(196 + 154)], rng, 3, 'm²'),
        explanation: `Square area = 14 × 14 = 196 m². Semicircle area = ½ × (22/7) × 7² = 77 m². Total area = 196 + 77 = 273 m².`,
        hint1: 'Add the square area and the semicircle area.',
        hint2: '196 + 77 = 273 m².'
      };
    },
    // 5: Composite figure: rectangle minus circular pond
    () => {
      const l = 20;
      const w = 15;
      const rectA = toH(l * w); // 300
      const r = 7;
      const pi = PI.frac;
      const circleA = exact2dp(pi.num * r * r, pi.den); // 154
      const grassA = rectA - circleA; // 146
      return {
        category: 'composite-figures',
        visual: 'composite',
        visualData: { kind: 'rect-circle', l, w, r, pi, unit: 'm' },
        questionText: `A park lawn is 20 m by 15 m. A circular fountain of radius 7 m (π = 22/7) is built inside it. What is the remaining grass area around the fountain?`,
        correctAnswer: `${fmtNum(grassA)} m²`,
        options: makeDistractors(grassA, [rectA, toH(rectA / 100 + circleA / 100), toH(grassA / 100 + 24)], rng, 3, 'm²'),
        explanation: `Lawn area = 20 × 15 = 300 m². Fountain area = (22/7) × 7² = 154 m². Remaining grass = 300 - 154 = 146 m².`,
        hint1: 'Subtract the circle’s area from the rectangle’s area.',
        hint2: '300 m² - 154 m² = 146 m².'
      };
    },
    // 6: Perimeter of composite with outer arc only
    () => {
      const s = 14;
      const r = 7;
      const pi = PI.frac;
      const arc = exact2dp(pi.num * r, pi.den); // 22
      const threeSides = toH(3 * s); // 42
      const perim = threeSides + arc; // 64
      return {
        category: 'composite-figures',
        visual: 'composite',
        visualData: { kind: 'square+semi', s, r, pi, unit: 'm' },
        questionText: `A garden border wraps around 3 outer sides of a 14 m square plus the curved arc of a 7 m radius semicircle. What is the total border length?`,
        correctAnswer: `${fmtNum(perim)} m`,
        options: makeDistractors(perim, [toH(4 * s + arc / 100), toH(56), toH(perim / 100 - 12)], rng, 3, 'm'),
        explanation: `3 straight sides = 3 × 14 = 42 m. Curved arc = (22/7) × 7 = 22 m. Total boundary = 42 + 22 = 64 m.`,
        hint1: 'Add the 3 straight outer sides and the curved arc.',
        hint2: '42 m + 22 m = 64 m.'
      };
    },
    // 7: T-shaped or stepped rectilinear
    () => {
      const L = 16;
      const W = 12;
      const p = toH(2 * (L + W));
      return {
        category: 'composite-figures',
        visual: 'rectilinear',
        visualData: { L, W, cutL: 5, cutW: 4, unit: 'm' },
        questionText: `An L-shaped terrace has an overall bounding box of 16 m by 12 m. What is its outer perimeter?`,
        correctAnswer: `${fmtNum(p)} m`,
        options: makeDistractors(p, [toH(L * W), toH(L + W), toH(p / 100 - 8)], rng, 3, 'm'),
        explanation: `The stepped indentation matches the bounding box: 2 × (16 + 12) = 56 m.`,
        hint1: 'Perimeter of an L-shape matches its bounding rectangle.',
        hint2: '2 × (16 + 12) = 56 m.'
      };
    },
    // 8: Composite area of two rectangles
    () => {
      const a1 = 10 * 8; // 80
      const a2 = 6 * 4;  // 24
      const total = toH(a1 + a2); // 104
      return {
        category: 'composite-figures',
        visual: 'rectilinear',
        visualData: { l1: 10, w1: 8, l2: 6, w2: 4, unit: 'm' },
        questionText: `A composite walkway consists of two adjoining rectangular sections: 10 m by 8 m, and 6 m by 4 m. What is the total area?`,
        correctAnswer: `${fmtNum(total)} m²`,
        options: makeDistractors(total, [toH(a1), toH(total / 100 + 16), toH(80)], rng, 3, 'm²'),
        explanation: `Section 1 = 10 × 8 = 80 m². Section 2 = 6 × 4 = 24 m². Total = 80 + 24 = 104 m².`,
        hint1: 'Add the two rectangular areas.',
        hint2: '80 + 24 = 104 m².'
      };
    },
    // 9: Composite courtyard grand total
    () => {
      const c = genComposite(rng, 'rect+semi');
      return {
        category: 'composite-figures',
        visual: 'composite',
        visualData: c,
        questionText: `Master Planner Mei Ling reviews Sunrise Park Courtyard (${c.l} m by ${c.w} m rectangle with semicircle r = ${c.r} m). Calculate the total area.`,
        correctAnswer: `${fmtNum(c.totalArea)} m²`,
        options: makeDistractors(c.totalArea, [c.components[0].area, toH(c.totalArea / 100 + 25), toH(c.totalArea / 100 - 20)], rng, 3, 'm²'),
        explanation: `Sum of the two component areas = ${fmtNum(c.totalArea)} m².`,
        hint1: 'Sum the rectangle and semicircle areas.',
        hint2: `Total area = ${fmtNum(c.totalArea)} m².'`
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 8: Project Planner's Office — Cost, Tiling & Algebraic "Find x"
function genWorld8Question(pos, rng) {
  const templates = [
    // 0: Cost of fencing (perimeter × rate)
    () => {
      const l = rng.int(15, 25);
      const w = rng.int(8, 14);
      const rate = 15;
      const p = 2 * (l + w);
      const cost = toH(p * rate);
      const wrongAreaCost = toH(l * w * rate);
      return {
        category: 'real-world-algebra',
        visual: 'rect',
        visualData: { l, w, unit: 'm', show: ['perimeter'] },
        questionText: `A garden is ${l} m by ${w} m. Decorative timber fencing costs $${rate} per metre. How much does it cost to fence the full perimeter?`,
        correctAnswer: `$${fmtNum(cost)}`,
        options: makeDistractors(cost, [wrongAreaCost, toH((l + w) * rate), toH(cost / 100 + 150)], rng, 3, '$'),
        explanation: `Perimeter = 2 × (${l} + ${w}) = ${p} m. Total cost = ${p} m × $${rate} = $${fmtNum(cost)}. (Area is not fenced!)`,
        hint1: 'Find the perimeter first, then multiply by the cost per metre.',
        hint2: `Perimeter is ${p} m. ${p} × $${rate} = $${fmtNum(cost)}.`
      };
    },
    // 1: Cost of turfing (area × rate)
    () => {
      const l = 12;
      const w = 8;
      const rate = 10;
      const a = l * w; // 96
      const cost = toH(a * rate); // 960
      const wrongPerimCost = toH(2 * (l + w) * rate); // 400
      return {
        category: 'real-world-algebra',
        visual: 'rect',
        visualData: { l, w, unit: 'm', show: ['area'] },
        questionText: `A rectangular lawn measuring 12 m by 8 m is covered with instant turf grass at $10 per square metre. Find the total turfing cost.`,
        correctAnswer: `$${fmtNum(cost)}`,
        options: makeDistractors(cost, [wrongPerimCost, toH(a * 5), toH(cost / 100 + 120)], rng, 3, '$'),
        explanation: `Turfing covers the surface area: Area = 12 × 8 = 96 m². Cost = 96 × $10 = $960.`,
        hint1: 'Multiply the surface area in m² by $10.',
        hint2: '96 m² × $10 = $960.'
      };
    },
    // 2: Algebraic "find x" from perimeter
    () => {
      const x = rng.int(5, 12);
      const w = 8;
      const p = 2 * (x + 4 + w); // length = x + 4
      const xH = toH(x);
      return {
        category: 'real-world-algebra',
        visual: 'rect',
        visualData: { l: 'x + 4', w, perimeter: p, unit: 'm' },
        questionText: `A rectangle has width ${w} m and length (x + 4) m. Its perimeter is ${p} m. Solve for x.`,
        correctAnswer: `${x}`,
        options: makeDistractors(xH, [toH(x + 2), toH(x - 2), toH(x + 4)], rng, 3),
        explanation: `Perimeter = 2 × ((x + 4) + ${w}) = 2 × (x + ${w + 4}) = 2x + ${2 * (w + 4)} = ${p}. Solving: 2x = ${p - 2 * (w + 4)} → x = ${x}.`,
        hint1: 'Set up 2 × (length + width) = perimeter.',
        hint2: `2 × (x + ${w + 4}) = ${p} → x = ${x}.`
      };
    },
    // 3: Algebraic "find x" from area
    () => {
      const x = rng.int(6, 14);
      const w = 5;
      const a = (x + 2) * w;
      const xH = toH(x);
      return {
        category: 'real-world-algebra',
        visual: 'rect',
        visualData: { l: 'x + 2', w, area: a, unit: 'm' },
        questionText: `A rectangular plot has width 5 m and length (x + 2) m. Its area is ${a} m². Find the value of x.`,
        correctAnswer: `${x}`,
        options: makeDistractors(xH, [toH(x + 2), toH(x - 3), toH(x + 5)], rng, 3),
        explanation: `Area = width × length → 5(x + 2) = ${a} → x + 2 = ${a / 5} → x = ${x}.`,
        hint1: 'Divide the area by 5, then subtract 2.',
        hint2: `${a} ÷ 5 = ${a / 5}, then ${a / 5} - 2 = ${x}.`
      };
    },
    // 4: Number of tiles with unit conversion
    () => {
      const floorL = 8;
      const floorW = 5;
      const floorArea = floorL * floorW; // 40 m² = 400 000 cm²
      const tileSide = 40; // 40 cm × 40 cm = 1600 cm²
      const tileArea = 1600;
      const count = toH(400000 / tileArea); // 250
      return {
        category: 'real-world-algebra',
        visual: 'rect',
        visualData: { l: floorL, w: floorW, unit: 'm' },
        questionText: `A plaza measuring ${floorL} m by ${floorW} m is paved with square stone tiles of side 40 cm. How many tiles are needed?`,
        correctAnswer: `${fmtNum(count)}`,
        options: makeDistractors(count, [toH(100), toH(400), toH(500)], rng, 3),
        explanation: `Plaza area = ${floorL} × ${floorW} = 40 m² = 400 000 cm². Each tile = 40 × 40 = 1 600 cm². Number of tiles = 400 000 ÷ 1 600 = 250 tiles.`,
        hint1: 'Convert 40 m² into cm² (multiply by 10 000), then divide by 1 600 cm².',
        hint2: '400 000 ÷ 1 600 = 250.'
      };
    },
    // 5: Cost of gravel for triangular bed
    () => {
      const b = 10;
      const h = 6;
      const area = (b * h) / 2; // 30 m²
      const rate = 12;
      const cost = toH(area * rate); // 360
      return {
        category: 'real-world-algebra',
        visual: 'triangle',
        visualData: { b, h, unit: 'm' },
        questionText: `A triangular flowerbed (base 10 m, perpendicular height 6 m) is filled with river gravel costing $12 per square metre. Calculate the total cost.`,
        correctAnswer: `$${fmtNum(cost)}`,
        options: makeDistractors(cost, [toH(b * h * rate), toH(area * 10), toH(cost / 100 + 48)], rng, 3, '$'),
        explanation: `Triangle area = ½ × 10 × 6 = 30 m². Total cost = 30 m² × $12 = $360.`,
        hint1: 'Find triangle area first (½ × 10 × 6), then multiply by $12.',
        hint2: '30 × $12 = $360.'
      };
    },
    // 6: Fence cost with circular pond
    () => {
      const r = 14;
      const pi = PI.frac;
      const c = 88; // 2 * 22/7 * 14
      const rate = 20;
      const cost = toH(c * rate); // 1760
      return {
        category: 'real-world-algebra',
        visual: 'circle',
        visualData: { r, pi, unit: 'm' },
        questionText: `Safety railing around a circular pond of radius 14 m (π = 22/7) costs $20 per metre. What is the total railing cost?`,
        correctAnswer: `$${fmtNum(cost)}`,
        options: makeDistractors(cost, [toH(c * 10), toH(616 * 20), toH(cost / 100 + 200)], rng, 3, '$'),
        explanation: `Circumference = 2 × (22/7) × 14 = 88 m. Cost = 88 × $20 = $1 760.`,
        hint1: 'Circumference = 88 m. Multiply by $20.',
        hint2: '88 × $20 = $1 760.'
      };
    },
    // 7: Algebraic "find x" in triangle
    () => {
      const x = 8;
      const b = 12;
      const a = (b * x) / 2; // 48
      const xH = toH(x);
      return {
        category: 'real-world-algebra',
        visual: 'triangle',
        visualData: { b, h: 'x', area: a, unit: 'm' },
        questionText: `A triangle has base 12 m, perpendicular height x m, and area ${a} m². Solve for x.`,
        correctAnswer: `${x}`,
        options: makeDistractors(xH, [toH(4), toH(6), toH(10)], rng, 3),
        explanation: `½ × 12 × x = ${a} → 6x = ${a} → x = 8.`,
        hint1: '½ × base × height = area.',
        hint2: `6x = ${a} → x = 8.`
      };
    },
    // 8: Budget comparison
    () => {
      const l = 15;
      const w = 10;
      const p = 2 * (l + w); // 50 m
      const rate = 8;
      const total = toH(p * rate); // 400
      return {
        category: 'real-world-algebra',
        visual: 'rect',
        visualData: { l, w, unit: 'm' },
        questionText: `Planner Hafiz has a budget of $500 for fencing a 15 m by 10 m plot at $8 per metre. How much money will remain in his budget?`,
        correctAnswer: '$100',
        options: makeDistractors(toH(100), [toH(50), toH(150), toH(200)], rng, 3, '$'),
        explanation: `Perimeter = 2 × (15 + 10) = 50 m. Fencing cost = 50 × $8 = $400. Remaining budget = $500 - $400 = $100.`,
        hint1: 'Perimeter is 50 m. Total cost is $400.',
        hint2: '$500 - $400 = $100.'
      };
    },
    // 9: Maximum area for given fence
    () => {
      return {
        category: 'real-world-algebra',
        visual: 'rect',
        visualData: { perimeter: 60, unit: 'm' },
        questionText: `Architect Tally has 60 m of fence to enclose a rectangular garden. Which shape encloses the maximum possible grass area?`,
        correctAnswer: 'A 15 m by 15 m square',
        options: rng.shuffle([
          'A 15 m by 15 m square',
          'A 25 m by 5 m rectangle',
          'A 20 m by 10 m rectangle',
          'A 28 m by 2 m rectangle'
        ]),
        explanation: `For any fixed perimeter, a square encloses the greatest area: 15 × 15 = 225 m², compared to 25 × 5 = 125 m² or 20 × 10 = 200 m².`,
        hint1: 'Recall Mei Ling’s square in Story Panel 1!',
        hint2: 'A square always maximizes area for a fixed perimeter.'
      };
    }
  ];

  return templates[pos % templates.length]();
}

// World 9: Grand Park Finale — Mixed Review & Synthesis
function genWorld9Question(pos, rng) {
  const worldGenerators = [
    genWorld0Question,
    genWorld1Question,
    genWorld2Question,
    genWorld3Question,
    genWorld4Question,
    genWorld5Question,
    genWorld6Question,
    genWorld7Question,
    genWorld8Question
  ];

  // Specific high-level synthesis questions for the Grand Finale
  const finaleQuestions = [
    () => {
      // Synthesis 1: Parallelogram vs triangle area comparison
      const b = 12;
      const h = 6;
      const pArea = b * h; // 72
      const tArea = (b * h) / 2; // 36
      const diff = toH(pArea - tArea);
      return {
        category: 'mixed-review',
        visual: 'parallelogram',
        visualData: { b, h, slant: 8, offset: 4, unit: 'm' },
        questionText: `A parallelogram terrace and a triangular garden both have base 12 m and perpendicular height 6 m. By how many m² does the parallelogram’s area exceed the triangle’s area?`,
        correctAnswer: `${fmtNum(diff)} m²`,
        options: makeDistractors(diff, [toH(72), toH(18), toH(diff / 100 + 12)], rng, 3, 'm²'),
        explanation: `Parallelogram = 12 × 6 = 72 m². Triangle = ½ × 12 × 6 = 36 m². Difference = 72 - 36 = 36 m².`,
        hint1: 'Parallelogram is base × height; triangle is ½ × base × height.',
        hint2: '72 m² - 36 m² = 36 m².'
      };
    },
    () => {
      // Synthesis 2: Semicircle vs square area
      const s = 14;
      const r = 7;
      const pi = PI.frac;
      const sqA = 14 * 14; // 196
      const semiA = 77; // 1/2 * 22/7 * 49
      const diff = toH(sqA - semiA); // 119
      return {
        category: 'mixed-review',
        visual: 'composite',
        visualData: { kind: 'square-semi', s, r, pi, unit: 'm' },
        questionText: `A 14 m square courtyard contains an internal semicircular patio of diameter 14 m (r = 7 m, π = 22/7). What is the area of the courtyard outside the patio?`,
        correctAnswer: `${fmtNum(diff)} m²`,
        options: makeDistractors(diff, [toH(sqA), toH(semiA), toH(diff / 100 + 20)], rng, 3, 'm²'),
        explanation: `Square area = 14 × 14 = 196 m². Semicircle area = 77 m². Remaining area = 196 - 77 = 119 m².`,
        hint1: 'Subtract the semicircle area (77 m²) from the square area (196 m²).',
        hint2: '196 - 77 = 119 m².'
      };
    }
  ];

  if (pos === 8 || pos === 9) {
    return finaleQuestions[pos - 8]();
  }

  // Draw from a distinct earlier world corresponding to position
  const generator = worldGenerators[pos % worldGenerators.length];
  const q = generator(rng.int(0, 9), rng);
  return {
    ...q,
    category: 'mixed-review'
  };
}

export function generateQuestion(worldIdx, ladderPos, rng = createRNG()) {
  switch (worldIdx) {
    case 0:
      return genWorld0Question(ladderPos, rng);
    case 1:
      return genWorld1Question(ladderPos, rng);
    case 2:
      return genWorld2Question(ladderPos, rng);
    case 3:
      return genWorld3Question(ladderPos, rng);
    case 4:
      return genWorld4Question(ladderPos, rng);
    case 5:
      return genWorld5Question(ladderPos, rng);
    case 6:
      return genWorld6Question(ladderPos, rng);
    case 7:
      return genWorld7Question(ladderPos, rng);
    case 8:
      return genWorld8Question(ladderPos, rng);
    case 9:
    default:
      return genWorld9Question(ladderPos, rng);
  }
}

/**
 * Generates a full practice question set for a specific world.
 * Guarantees all questions are completely distinct (no duplicate question texts).
 */
export function generateWorldSet(worldIdx, countOrPositions, rng = createRNG()) {
  const positions = Array.isArray(countOrPositions)
    ? countOrPositions
    : Array.from({ length: countOrPositions }, (_, i) => i);

  const seenQuestions = new Set();
  const result = [];

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    let candidate = generateQuestion(worldIdx, pos, rng);
    let attempts = 0;

    while (seenQuestions.has(candidate.questionText) && attempts < 10) {
      // Re-roll with an offset to guarantee uniqueness
      candidate = generateQuestion(worldIdx, (pos + attempts + 1) % 10, rng);
      attempts++;
    }

    seenQuestions.add(candidate.questionText);
    result.push({
      id: `w${worldIdx}_q${i}_${candidate.category}`,
      districtId: worldIdx,
      ...candidate
    });
  }

  return result;
}

export function generateBank(seed = 12345) {
  const rng = createRNG(seed);
  const bank = [];
  for (let w = 0; w < 10; w++) {
    const worldSet = generateWorldSet(w, 10, rng);
    bank.push(...worldSet);
  }
  return bank;
}
