export const BADGES = {
  first_correct: {
    id: 'first_correct',
    name: 'First Plot Solved 📐',
    description: 'Calculated your first area or perimeter question correctly!',
    icon: '📐'
  },
  streak_5: {
    id: 'streak_5',
    name: 'On a Surveying Roll 🔥',
    description: 'Achieved a streak of 5 correct answers in a row!',
    icon: '🔥'
  },
  streak_10: {
    id: 'streak_10',
    name: 'Master Planner Streak 🏗️',
    description: 'Achieved an amazing streak of 10 correct answers in a row!',
    icon: '🏗️'
  },
  sim_all: {
    id: 'sim_all',
    name: 'Certified Site Planner 🧰',
    description: 'Completed all 3 Simulation Sections in the Site Lab!',
    icon: '🧰'
  },
  world_3star: {
    id: 'world_3star',
    name: 'Blueprint Perfection ⭐⭐⭐',
    description: 'Earned 3 Stars in any Park Zone!',
    icon: '⭐⭐⭐'
  },
  boss_won: {
    id: 'boss_won',
    name: 'Zone Defended 🏆',
    description: 'Outsmarted a Boss in a Boss Battle!',
    icon: '🏆'
  },
  answered_20: {
    id: 'answered_20',
    name: 'Master Surveyor 📏',
    description: 'Answered 20 or more questions in Practice Mode!',
    icon: '📏'
  },
  journey_complete: {
    id: 'journey_complete',
    name: 'Chief Park Architect 🎖️',
    description: 'Completed the full 5-phase Sunrise Park journey!',
    icon: '🎖️'
  }
};

/**
 * Evaluates current state and returns an array of newly unlocked badge objects.
 * Called in reducer so all state changes (including sim, boss, stars, answers) are visible.
 */
export function checkBadges(state) {
  const currentBadges = new Set(state.badges || []);
  const newlyUnlocked = [];

  const trigger = (badgeId) => {
    if (!currentBadges.has(badgeId) && BADGES[badgeId]) {
      newlyUnlocked.push(BADGES[badgeId]);
      currentBadges.add(badgeId);
    }
  };

  // 1. First correct
  if ((state.totalCorrect || 0) >= 1) trigger('first_correct');

  // 2. Streaks
  if ((state.streak || 0) >= 5 || (state.bestStreak || 0) >= 5) trigger('streak_5');
  if ((state.streak || 0) >= 10 || (state.bestStreak || 0) >= 10) trigger('streak_10');

  // 3. All 3 Simulate stations complete (User requirement: 3 sections A, B, C)
  if (
    Array.isArray(state.simCompleted) &&
    state.simCompleted.length >= 3 &&
    state.simCompleted.slice(0, 3).every(Boolean)
  ) {
    trigger('sim_all');
  }

  // 4. Any world 3 stars
  if (Array.isArray(state.worldResults) && state.worldResults.some((r) => r === 3)) {
    trigger('world_3star');
  }

  // 5. Boss won
  if (state.bossesDefeated && state.bossesDefeated > 0) {
    trigger('boss_won');
  }

  // 6. Answered 20+
  if ((state.totalAnswered || 0) >= 20) {
    trigger('answered_20');
  }

  // 7. Journey complete
  if (state.journeyComplete) {
    trigger('journey_complete');
  }

  return newlyUnlocked;
}
