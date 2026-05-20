export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
  description: string;
  instructions: string;
  bugBehavior: string;
  brokenCode: string;
  hint: string;
  verificationRegex: RegExp[]; // matching patterns that prove user fixed the bug
  successMessage: string;
}

export const challengesData: Challenge[] = [
  {
    id: 'infinite-loop',
    title: '1. The Infinite Render Loop',
    difficulty: 'Beginner',
    category: 'React Hook Basics',
    description: 'A component triggers an infinite re-render loop, causing browser lag and console flooding.',
    bugBehavior: 'The component state counter updates inside useEffect but has no dependency array specified, which causes the effect to run on every render, triggering another state update and another render infinitely.',
    instructions: 'Add a dependency array to the useEffect hook to limit execution. You can either pass an empty array `[]` (if you want it to run once on mount), or dependency values if needed.',
    brokenCode: `import React, { useState, useEffect } from 'react';

export default function InfiniteRender() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ⚠️ Bug: Triggers state update on every single render
    setCount(count + 1);
  });

  return (
    <div className="p-4 border rounded-xl bg-zinc-900">
      <h3 className="text-zinc-200">Total Render Cycles: {count}</h3>
    </div>
  );
}`,
    hint: 'Add an empty array [] or functional updater to limit when the effect fires.',
    verificationRegex: [
      /useEffect\(\s*\(\s*\)\s*=>\s*\{\s*(\/\/[^\n]*\n\s*)*setCount\(/, // validates hook exists
      /useEffect\(\s*\(\s*\)\s*=>\s*\{[\s\S]*?\}\s*,\s*\[\s*\]\s*\)/  // validates empty array is added or functional state dependency is resolved
    ],
    successMessage: 'Splendid! You added the dependency array `[]`. React now runs the effect only once when the component mounts, stopping the infinite render loop.'
  },
  {
    id: 'stale-closure',
    title: '2. Stale Closure in Interval',
    difficulty: 'Intermediate',
    category: 'React Hook Lifecycles',
    description: 'A countdown timer interval gets stuck and logs stale counter states.',
    bugBehavior: 'Inside the useEffect hook, `setInterval` schedules a callback that captures the `count` variable. Since the dependency array is `[]` (empty), the effect never runs again, and the timer callback remains closed over the initial count value of 0, repeating "Tick: 0" forever.',
    instructions: 'Modify the dependency array or use a functional state update inside the setter so that the timer always references the latest count value.',
    brokenCode: `import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // ⚠️ Bug: Closure captures count = 0 from mount render
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // Missing count dependency or functional update

  return (
    <div className="p-4 border border-zinc-800 rounded-xl">
      <h3 className="text-zinc-200">Timer Tick: {count}</h3>
    </div>
  );
}`,
    hint: 'Use the functional form of setState: setCount(prev => prev + 1) or add count to the dependency list.',
    verificationRegex: [
      /setCount\(\s*(prev|c)\s*=>\s*(prev|c)\s*\+\s*1\s*\)/
    ],
    successMessage: 'Great job! Using a functional state updater `setCount(prev => prev + 1)` allows React to read the latest state directly from its fiber update queue, rendering the dependency array update unnecessary.'
  },
  {
    id: 'race-condition',
    title: '3. Data Fetching Race Conditions',
    difficulty: 'Advanced',
    category: 'API & Networking',
    description: 'Rapid dropdown switching causes incorrect, outdated user data to render on the screen.',
    bugBehavior: 'When multiple fetches are triggered consecutively, they execute concurrently. If a prior fetch resolves *after* the latest fetch resolves, it overrides the screen state with outdated content.',
    instructions: 'Implement a boolean cleanup flag inside the useEffect hook. If the component re-renders or unmounts, set the active flag to false and ignore the fetch resolve.',
    brokenCode: `import React, { useState, useEffect } from 'react';

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ⚠️ Bug: Out-of-order responses override latest UI
    fetchUserData(userId).then(data => {
      setUser(data);
    });
  }, [userId]);

  return (
    <div>User Profile Details: {user?.name}</div>
  );
}`,
    hint: 'Declare a let active = true; inside effect. Toggle it to false in return cleanup, and check it before calling setUser.',
    verificationRegex: [
      /let\s+active\s*=\s*true/,
      /return\s*\(\s*\)\s*=>\s*\{\s*active\s*=\s*false/,
      /if\s*\(\s*active\s*\)/
    ],
    successMessage: 'Incredible! You solved the race condition by introducing an active cleanup flag. Out-of-order network responses are now safely discarded when they resolve.'
  },
  {
    id: 'memory-leak',
    title: '4. Window Resize Listener Leak',
    difficulty: 'Intermediate',
    category: 'Performance Engineering',
    description: 'Window resize event listeners are left active, consuming CPU and causing memory leaks.',
    bugBehavior: 'The component adds an event listener to the window object on mount, but fails to provide a cleanup function in the return statement. If the component unmounts and remounts, duplicate listeners pile up.',
    instructions: 'Add a return statement returning a cleanup function that calls removeEventListener.',
    brokenCode: `import React, { useState, useEffect } from 'react';

export default function ResizeWatcher() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    
    // ⚠️ Bug: Listener added, but never removed on unmount
    window.addEventListener('resize', handleResize);
  }, []);

  return <div>Width: {width}px</div>;
}`,
    hint: 'Return a function from your useEffect hook that calls window.removeEventListener("resize", handleResize).',
    verificationRegex: [
      /return\s*\(\s*\)\s*=>\s*(window\.)?removeEventListener\(\s*['"]resize['"]\s*,\s*handleResize\s*\)/
    ],
    successMessage: 'Spot on! Returning a cleanup function that detaches event listeners ensures memory leaks are blocked when components unmount.'
  },
  {
    id: 'state-mutation',
    title: '5. Direct State Mutation',
    difficulty: 'Beginner',
    category: 'React Fundamentals',
    description: 'Adding items to a list fails to trigger a re-render on screen.',
    bugBehavior: 'The list array state is updated by pushing directly into the existing list reference and setting it. Since the array address (reference) did not change, React shallow diffing thinks the state did not change, and skips rendering.',
    instructions: 'Create a copy of the array using spread syntax (`[...]`) or array methods before editing, then pass the copy to the state setter.',
    brokenCode: `import React, { useState } from 'react';

export default function ListManager() {
  const [list, setList] = useState(['Apple', 'Banana']);

  const handleAddItem = (item) => {
    // ⚠️ Bug: Mutating state directly does not trigger render
    list.push(item);
    setList(list);
  };

  return (
    <button onClick={() => handleAddItem('Cherry')}>Add Cherry</button>
  );
}`,
    hint: 'Use spread operator to copy array: setList([...list, item]) or list.concat(item).',
    verificationRegex: [
      /setList\(\s*\[\s*\.\.\.list\s*,\s*\w+\s*\]\s*\)/
    ],
    successMessage: 'Perfect! Creating a brand-new array reference using `[...list, item]` forces Reacts state comparer to detect the reference update, triggering reconciliation and painting the new item.'
  }
];
export type { Challenge as ChallengeType };
