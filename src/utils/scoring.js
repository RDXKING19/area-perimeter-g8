/**
 * Scoring and XP formulas for AreaQuest (Grade 8)
 * Implements TRD §1.2 D9: star thresholds scaled to a /10 basis.
 */

export function calcStars(correctCount, totalCount = 10) {
  const scaled = totalCount > 0 ? Math.round((10 * correctCount) / totalCount) : correctCount;
  if (scaled >= 9) return 3;
  if (scaled >= 7) return 2;
  if (scaled >= 5) return 1;
  return 0;
}

export function calcXP({ attempts = 1, hintsUsed = 0, streak = 0 } = {}) {
  // Base 10, penalty for multiple attempts and hints, minimum base 2
  const attemptPenalty = Math.max(0, (attempts - 1) * 3);
  const hintPenalty = hintsUsed * 2;
  const baseXP = Math.max(2, 10 - attemptPenalty - hintPenalty);

  // Streak bonus: +2 for each streak step above 2, capped at +10
  const streakBonus = streak >= 3 ? Math.min(10, (streak - 2) * 2) : 0;

  return baseXP + streakBonus;
}
