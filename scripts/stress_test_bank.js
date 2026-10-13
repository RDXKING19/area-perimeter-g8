import { generateBank, generateWorldSet } from '../src/data/questionBank.js';
import { createRNG } from '../src/utils/rng.js';

console.log('🧪 Starting AreaQuest Question Bank Stress Test...');

const bank = generateBank(42);
console.log(`Generated ${bank.length} questions across 10 worlds.`);

if (bank.length !== 100) {
  console.error(`❌ Expected 100 questions, got ${bank.length}`);
  process.exit(1);
}

let errors = 0;

for (let w = 0; w < 10; w++) {
  const worldQuestions = bank.filter((q) => q.districtId === w);
  if (worldQuestions.length !== 10) {
    console.error(`❌ World ${w} has ${worldQuestions.length} questions, expected 10`);
    errors++;
  }

  // Check unique question texts
  const texts = new Set();
  for (const q of worldQuestions) {
    if (texts.has(q.questionText)) {
      console.error(`❌ Duplicate questionText in World ${w}: "${q.questionText}"`);
      errors++;
    }
    texts.add(q.questionText);

    // Validate schema
    if (!q.questionText || typeof q.questionText !== 'string') {
      console.error(`❌ Missing or invalid questionText in World ${w}`);
      errors++;
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      console.error(`❌ Options must have length 4 in World ${w}, got ${q.options?.length}`);
      errors++;
    }
    const uniqueOptions = new Set(q.options);
    if (uniqueOptions.size !== 4) {
      console.error(`❌ Options are not distinct in World ${w}: ${JSON.stringify(q.options)}`);
      errors++;
    }
    if (!q.options.includes(q.correctAnswer)) {
      console.error(
        `❌ correctAnswer "${q.correctAnswer}" not in options: ${JSON.stringify(q.options)} in World ${w}`
      );
      errors++;
    }
    if (!q.explanation || typeof q.explanation !== 'string') {
      console.error(`❌ Missing explanation in World ${w}`);
      errors++;
    }
    if (!q.hint1 || !q.hint2) {
      console.error(`❌ Missing hints in World ${w}`);
      errors++;
    }
    if (!q.visual || !q.visualData) {
      console.error(`❌ Missing visual or visualData in World ${w}`);
      errors++;
    }
  }
}

// Randomized stress test with 50 distinct seeds
console.log('🔄 Running multi-seed randomized uniqueness check across 50 iterations...');
for (let s = 1; s <= 50; s++) {
  const rng = createRNG(s * 1000 + 7);
  for (let w = 0; w < 10; w++) {
    const set = generateWorldSet(w, 10, rng);
    const seen = new Set();
    for (const q of set) {
      if (seen.has(q.questionText)) {
        console.error(`❌ Seed ${s} World ${w}: duplicate question "${q.questionText}"`);
        errors++;
      }
      seen.add(q.questionText);
      if (!q.options.includes(q.correctAnswer)) {
        console.error(`❌ Seed ${s} World ${w}: correct answer not in options`);
        errors++;
      }
    }
  }
}

if (errors === 0) {
  console.log('✅ ALL 100 QUESTIONS PASSED ALL VALIDATION AND UNIQUENESS CHECKS!');
} else {
  console.error(`❌ Encountered ${errors} validation errors!`);
  process.exit(1);
}
