export const WORLDS = [
  {
    id: 0,
    name: 'Fenceline Fields',
    emoji: '🌾',
    accent: '#f472b6',
    conceptFocus: 'perimeter-basics',
    description: 'Perimeter of rectangles, squares and rectilinear shapes; missing sides.',
    boss: {
      name: 'The Fence Fiddler',
      emoji: '🪵',
      reward: 'Perimeter Pro'
    }
  },
  {
    id: 1,
    name: 'Tile Terrace',
    emoji: '🧱',
    accent: '#fb923c',
    conceptFocus: 'area-rect-units',
    description: 'Area of rectangles and squares; cm² ↔ m²; missing side from area.',
    boss: {
      name: 'The Tile Trickster',
      emoji: '🎲',
      reward: 'Tile Titan'
    }
  },
  {
    id: 2,
    name: 'Triangle Trail',
    emoji: '🔺',
    accent: '#fbbf24',
    conceptFocus: 'area-triangle',
    description: 'Triangle area with any base/height pair, obtuse triangles, missing height.',
    boss: {
      name: 'The Half-Forgetter',
      emoji: '➗',
      reward: 'Triangle Tamer'
    }
  },
  {
    id: 3,
    name: 'Slant Plaza',
    emoji: '🏘️',
    accent: '#4ade80',
    conceptFocus: 'area-parallelogram',
    description: 'Parallelogram area and perimeter; perpendicular height vs. slanted side.',
    boss: {
      name: 'Slant Sam',
      emoji: '📏',
      reward: 'Height Hero'
    }
  },
  {
    id: 4,
    name: 'Trapezium Terrace',
    emoji: '🪜',
    accent: '#38bdf8',
    conceptFocus: 'area-trapezium-kite',
    description: 'Trapezium area and missing parallel side; kite and rhombus from diagonals.',
    boss: {
      name: 'The Terrace Twister',
      emoji: '🌀',
      reward: 'Terrace Master'
    }
  },
  {
    id: 5,
    name: 'Pond Plaza',
    emoji: '⭕',
    accent: '#818cf8',
    conceptFocus: 'circle-basics',
    description: 'Circumference and area of circles with a stated π; radius vs. diameter.',
    boss: {
      name: 'The Pi Pirate',
      emoji: '🏴‍☠️',
      reward: 'Pi Pilot'
    }
  },
  {
    id: 6,
    name: 'Sector Garden',
    emoji: '🥧',
    accent: '#c084fc',
    conceptFocus: 'arcs-sectors',
    description: 'Semicircles, quadrants, arc length and sector area.',
    boss: {
      name: 'The Slice Swiper',
      emoji: '🍕',
      reward: 'Sector Specialist'
    }
  },
  {
    id: 7,
    name: 'Composite Courtyard',
    emoji: '🧩',
    accent: '#22d3ee',
    conceptFocus: 'composite-figures',
    description: 'Area and perimeter of composite figures; shared and hidden edges.',
    boss: {
      name: 'The Hidden-Edge Hacker',
      emoji: '✂️',
      reward: 'Composite Champion'
    }
  },
  {
    id: 8,
    name: "Project Planner's Office",
    emoji: '💰',
    accent: '#facc15',
    conceptFocus: 'real-world-algebra',
    description: "Cost, tiling and 'find x' problems with area or perimeter given.",
    boss: {
      name: 'The Budget Buster',
      emoji: '💸',
      reward: 'Project Pro'
    }
  },
  {
    id: 9,
    name: 'Grand Park Finale',
    emoji: '🏆',
    accent: '#f43f5e',
    conceptFocus: 'mixed-review',
    description: 'Hardest boss; mixes every question type from worlds 0–8.',
    boss: {
      name: 'The Grand Demolisher',
      emoji: '🏚️',
      reward: 'Sunrise Park Opened!'
    }
  }
];

export function isWorldUnlocked(idx, worldResults) {
  if (idx === 0) return true;
  if (!worldResults || !Array.isArray(worldResults)) return false;
  const prevResult = worldResults[idx - 1];
  return prevResult !== null && prevResult >= 1;
}
