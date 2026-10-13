import React, { useReducer, useState, useEffect } from 'react';
import { setMuted, playClickSound } from './utils/audio.js';
import { TopNav } from './components/TopNav.jsx';
import { IntroScreen } from './components/IntroScreen.jsx';
import { WonderPhase } from './components/phases/WonderPhase.jsx';
import { StoryPhase } from './components/phases/StoryPhase.jsx';
import { SimulatePhase } from './components/phases/SimulatePhase.jsx';
import { PlayPhase } from './components/phases/PlayPhase.jsx';
import { ReflectPhase, CelebrationScreen } from './components/phases/ReflectPhase.jsx';
import { checkBadges } from './utils/badgeEngine.js';

const INITIAL_STATE = {
  phase: 'intro', // 'intro' | 'wonder' | 'story' | 'simulate' | 'practice' | 'reflect'
  simCompleted: [false, false, false], // User constraint: 3 sections A, B, C
  worldResults: Array(10).fill(null),
  xp: 0,
  streak: 0,
  bestStreak: 0,
  badges: [],
  toastBadges: [],
  totalCorrect: 0,
  totalAnswered: 0,
  bossesDefeated: 0,
  audioEnabled: true,
  journeyComplete: false
};

function baseReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.payload };

    case 'COMPLETE_SIM_STATION': {
      const idx = action.payload;
      const updated = [...state.simCompleted];
      updated[idx] = true;
      return { ...state, simCompleted: updated };
    }

    case 'ANSWER_CORRECT': {
      const nextStreak = state.streak + 1;
      const nextBest = Math.max(state.bestStreak, nextStreak);
      const earnedXP = action.payload?.xpDelta || 10;

      return {
        ...state,
        xp: state.xp + earnedXP,
        streak: nextStreak,
        bestStreak: nextBest,
        totalCorrect: state.totalCorrect + 1,
        totalAnswered: state.totalAnswered + 1
      };
    }

    case 'ANSWER_INCORRECT':
      return {
        ...state,
        streak: 0,
        totalAnswered: state.totalAnswered + 1
      };

    case 'UPDATE_WORLD_RESULT': {
      const { worldIdx, stars, bossWon } = action.payload;
      const newResults = [...state.worldResults];
      if (stars !== undefined && worldIdx !== undefined) {
        newResults[worldIdx] = Math.max(newResults[worldIdx] || 0, stars);
      }
      return {
        ...state,
        worldResults: newResults,
        bossesDefeated: bossWon ? state.bossesDefeated + 1 : state.bossesDefeated
      };
    }

    case 'UNLOCK_BADGE': {
      const badgeId = action.payload;
      if (state.badges.includes(badgeId)) return state;
      return { ...state, badges: [...state.badges, badgeId] };
    }

    case 'CLEAR_BADGE_TOAST':
      return {
        ...state,
        toastBadges: state.toastBadges.slice(1)
      };

    case 'COMPLETE_PHASE': {
      if (action.payload === 'practice') {
        return { ...state, phase: 'reflect' };
      }
      if (action.payload === 'reflect') {
        return {
          ...state,
          journeyComplete: true,
          badges: Array.from(new Set([...state.badges, 'journey_complete']))
        };
      }
      return state;
    }

    case 'TOGGLE_AUDIO':
      return { ...state, audioEnabled: !state.audioEnabled };

    case 'RESET_SESSION':
      return { ...INITIAL_STATE, audioEnabled: state.audioEnabled };

    default:
      return state;
  }
}

// Higher-order reducer evaluating badges on real full next state (Fixes D2)
function appReducer(state, action) {
  const next = baseReducer(state, action);
  const fresh = checkBadges(next);
  if (fresh.length > 0) {
    return {
      ...next,
      badges: Array.from(new Set([...next.badges, ...fresh.map((b) => b.id)])),
      toastBadges: [...next.toastBadges, ...fresh]
    };
  }
  return next;
}

export function App() {
  const [state, dispatch] = useReducer(appReducer, INITIAL_STATE);
  const [storySlideInfo, setStorySlideInfo] = useState(null);

  // Synchronize audio mute state cleanly with useEffect (Fixes D13)
  useEffect(() => {
    setMuted(!state.audioEnabled);
  }, [state.audioEnabled]);

  const completed = {
    wonder: state.phase !== 'intro' && state.phase !== 'wonder',
    story: !['intro', 'wonder', 'story'].includes(state.phase),
    simulate: !['intro', 'wonder', 'story', 'simulate'].includes(state.phase),
    practice: state.worldResults.some((r) => r != null && r > 0),
    reflect: state.journeyComplete
  };

  const hasProgress =
    state.xp > 0 || state.worldResults.some((r) => r != null && r > 0) || state.badges.length > 0;

  // Single global click sound listener across all phases (Fixes D8)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest(
        'button, [role="button"], [role="option"], [role="radio"], [role="checkbox"], input[type="radio"], input[type="checkbox"], input[type="range"], select, option, .cursor-pointer, svg .cursor-pointer'
      );
      if (target) {
        playClickSound();
      }
    };
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_AUDIO' });
  };

  const goPhase = (key) => {
    if (key !== 'story') setStorySlideInfo(null);
    dispatch({ type: 'SET_PHASE', payload: key });
  };

  const handleUpdateScore = (payload) => {
    if (payload.isCorrect !== undefined) {
      if (payload.isCorrect) {
        dispatch({ type: 'ANSWER_CORRECT', payload });
      } else {
        dispatch({ type: 'ANSWER_INCORRECT', payload });
      }
    }
    if (payload.worldIdx !== undefined) {
      dispatch({ type: 'UPDATE_WORLD_RESULT', payload });
    }
  };

  return (
    <div className="app-container w-full h-[100dvh]">
      {/* Top Navbar (Hidden on Intro Phase) */}
      {state.phase !== 'intro' && (
        <TopNav
          phase={state.phase}
          completed={completed}
          muted={!state.audioEnabled}
          onToggleMute={toggleMute}
          onHome={() => dispatch({ type: 'RESET_SESSION' })}
          onGoPhase={goPhase}
          slideInfo={state.phase === 'story' ? storySlideInfo : null}
          hasProgress={hasProgress}
        />
      )}

      {/* Main Viewport Content Area */}
      <main
        className={`flex-1 min-h-0 flex flex-col relative overflow-hidden ${
          state.phase !== 'intro' ? 'app-main' : ''
        }`}
      >
        {state.phase === 'intro' && (
          <IntroScreen onBegin={() => dispatch({ type: 'SET_PHASE', payload: 'wonder' })} />
        )}

        {state.phase === 'wonder' && (
          <WonderPhase
            muted={!state.audioEnabled}
            onNext={() => dispatch({ type: 'SET_PHASE', payload: 'story' })}
          />
        )}

        {state.phase === 'story' && (
          <StoryPhase
            muted={!state.audioEnabled}
            onSlideChange={(current, total) => setStorySlideInfo({ current, total })}
            onDone={() => {
              setStorySlideInfo(null);
              dispatch({ type: 'SET_PHASE', payload: 'simulate' });
            }}
          />
        )}

        {state.phase === 'simulate' && (
          <SimulatePhase
            muted={!state.audioEnabled}
            simCompleted={state.simCompleted}
            onCompleteStation={(idx) => dispatch({ type: 'COMPLETE_SIM_STATION', payload: idx })}
            onNext={() => dispatch({ type: 'SET_PHASE', payload: 'practice' })}
          />
        )}

        {state.phase === 'practice' && !state.journeyComplete && (
          <PlayPhase
            muted={!state.audioEnabled}
            xp={state.xp}
            streak={state.streak}
            bestStreak={state.bestStreak}
            badges={state.badges}
            toastBadge={state.toastBadges[0] || null}
            onClearToastBadge={() => dispatch({ type: 'CLEAR_BADGE_TOAST' })}
            worldResults={state.worldResults}
            onUpdateScore={handleUpdateScore}
            onGoReflect={() => dispatch({ type: 'SET_PHASE', payload: 'reflect' })}
          />
        )}

        {state.phase === 'reflect' && !state.journeyComplete && (
          <ReflectPhase
            xp={state.xp}
            stars={state.worldResults.reduce((a, b) => a + (b || 0), 0)}
            bestStreak={state.bestStreak}
            badges={state.badges}
            worldResults={state.worldResults}
            muted={!state.audioEnabled}
            onComplete={() => dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' })}
          />
        )}

        {state.journeyComplete && (
          <CelebrationScreen
            xp={state.xp}
            stars={state.worldResults.reduce((a, b) => a + (b || 0), 0)}
            bestStreak={state.bestStreak}
            onRestart={() => dispatch({ type: 'RESET_SESSION' })}
          />
        )}
      </main>
    </div>
  );
}

export default App;
