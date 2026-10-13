import { speak, intToWords, numberToWords } from '../src/utils/speak.js';

console.log('🧪 Testing Audio Narration Parity & Spoken Translation Layer...');

const cases = [
  { in: 'A rectangular lawn is 12 m long and 7 m wide.', expectWord: 'metres' },
  { in: 'Find its area: 126 m².', expectWord: 'square metres' },
  { in: 'Convert 2 500 cm² into m².', expectWord: 'square centimetres' },
  { in: 'Use π = 22/7 to calculate circumference.', expectWord: 'pi' },
  { in: 'Safety railing costs $1 760.', expectWord: 'dollars' },
  { in: 'A tile of area 400 mm².', expectWord: 'square millimetres' },
  { in: 'Radius is 3.5 m.', expectWord: 'three point five' }
];

let errors = 0;
for (const c of cases) {
  const spoken = speak(c.in);
  if (!spoken.toLowerCase().includes(c.expectWord.toLowerCase())) {
    console.error(`❌ Expected spoken output to include "${c.expectWord}". Got: "${spoken}"`);
    errors++;
  } else {
    console.log(`✓ "${c.in}" → "${spoken}"`);
  }
}

if (errors === 0) {
  console.log('✅ All audio spoken translation tests passed with 100% parity!');
} else {
  console.error(`❌ ${errors} audio parity failures`);
  process.exit(1);
}
