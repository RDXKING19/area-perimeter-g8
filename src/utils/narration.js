import { say, ask, cheer, emphasize, instruct, celebrate } from './audio.js';
import { speak } from './speak.js';
import { STORY_PANELS } from '../data/storyContent.js';

/* ------------------------------------------------------------ 01 · WONDER */
export function wonderNarration() {
  return [
    say(
      speak(
        'Hafiz and Mei Ling received exactly 60 m of fencing to build a new lawn. Hafiz sketches a long 25 m by 5 m plot, while Mei Ling proposes a 15 m by 15 m square.'
      )
    ),
    ask(
      speak(
        'Both plots use all 60 m of fence. But do they hold the same amount of grass?'
      )
    )
  ];
}

/* ------------------------------------------------------------- 02 · STORY */
export function storyNarration(panelIdx) {
  const p = STORY_PANELS[panelIdx] || STORY_PANELS[0];
  const list = [];
  if (p.text) {
    list.push(say(speak(p.text)));
  }
  if (p.highlight) {
    list.push(emphasize(speak(p.highlight)));
  }
  if (p.bubble) {
    list.push(instruct(speak(p.bubble)));
  }
  return list;
}

/* ---------------------------------------------------------- 03 · SIMULATE */
export function simStationIntro(stationIdx) {
  switch (stationIdx) {
    case 0:
      return [
        instruct(
          speak(
            'Welcome to Section A, The Shape Shifter Lab! Drag the shear slider to shear the garden plot. Notice how the base and perpendicular height stay fixed, so the area remains completely unchanged!'
          )
        )
      ];
    case 1:
      return [
        instruct(
          speak(
            'Welcome to Section B, Fence and Fill! Use the width slider to size the park plot and match the target value. Watch the target ring turn green when you hit the exact target!'
          )
        )
      ];
    case 2:
      return [
        instruct(
          speak(
            'Welcome to Section C, Park Plan Builder! Tap each composite ground zone to add or subtract areas, then select only the outer boundary fence edges for the perimeter!'
          )
        )
      ];
    default:
      return [instruct(speak('Explore the Site Lab and master the shape principles!'))];
  }
}

/* ---------------------------------------------------------- 04 · PRACTICE */
export function questionNarration(q) {
  if (!q || !q.questionText) return [];
  return [ask(speak(q.questionText))];
}

export function playCorrectNarration(count = 1) {
  const cheers = [
    'Superb calculation! That plan is approved!',
    'Spot on! That measurement is exact!',
    'Brilliant work, Planner! Another zone solved!',
    'Excellent geometry! You are mastering area and perimeter!'
  ];
  return [cheer(cheers[(count - 1) % cheers.length])];
}

export function playWrongNarration() {
  const encouragements = [
    'Not quite! Remember to check whether the question asks for perimeter around or area inside.',
    'Let’s recheck the formula. Make sure perpendicular height is used, not the slanted side!',
    'Close try! Remember to include units and verify each step carefully.'
  ];
  return [say(encouragements[Math.floor(Math.random() * encouragements.length)])];
}

export function playHint1Narration(hintText) {
  return [instruct(speak(`Here is a hint from Architect Tally: ${hintText}`))];
}

export function playHint2Narration(hintText) {
  return [instruct(speak(`Second hint: ${hintText}`))];
}

export function districtCompleteNarration(worldName, stars = 3) {
  return [
    celebrate(
      speak(
        `Outstanding achievement! You completed ${worldName} and earned ${stars} stars! The park blueprints are taking shape!`
      )
    )
  ];
}

export function bossStartNarration(bossName) {
  return [
    emphasize(
      speak(
        `Site Boss alert! ${bossName} has challenged your park measurements! Answer 5 questions with 3 lives to defend this zone!`
      )
    )
  ];
}

export function bossWinNarration(bossName) {
  return [
    celebrate(
      speak(
        `Victory! You outsmarted ${bossName} and proved your mastery as a Certified Park Planner!`
      )
    )
  ];
}

/* ----------------------------------------------------------- 05 · REFLECT */
export function reflectNarration() {
  return [
    say(
      speak(
        'Congratulations on your survey across Sunrise Park! Let’s review the key conceptual principles and summarize your scorecard.'
      )
    )
  ];
}

export function reflectCompleteNarration() {
  return [
    celebrate(
      speak(
        'Sunrise Park is officially open! You are now a Chief Park Architect!'
      )
    )
  ];
}

/**
 * Returns a deduplicated array of all static narration phrases across all phases.
 * Used by scripts/generate_audio.js to pre-generate ElevenLabs MP3 files.
 */
export function getAllNarration() {
  const all = [];

  // Wonder
  all.push(...wonderNarration());

  // Story panels (0..3)
  for (let i = 0; i < STORY_PANELS.length; i++) {
    all.push(...storyNarration(i));
  }

  // Simulate stations (0..2)
  for (let s = 0; s < 3; s++) {
    all.push(...simStationIntro(s));
  }

  // Reflect
  all.push(...reflectNarration());
  all.push(...reflectCompleteNarration());

  // Cheers and common messages
  all.push(...playCorrectNarration(1));
  all.push(...playCorrectNarration(2));
  all.push(...playCorrectNarration(3));
  all.push(...playCorrectNarration(4));

  all.push(...playWrongNarration());

  all.push(...bossStartNarration('The Master Surveyor'));
  all.push(...bossWinNarration('The Master Surveyor'));

  // Filter out any duplicates based on text
  const seen = new Set();
  return all.filter(item => {
    if (!item || !item.text) return false;
    if (seen.has(item.text)) return false;
    seen.add(item.text);
    return true;
  });
}

