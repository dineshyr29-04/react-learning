export interface LabTheory {
  title: string;
  subtitle: string;
  beginner: {
    overview: string;
    keyPoints: string[];
    howToUse: string;
  };
  intermediate: {
    overview: string;
    keyPoints: string[];
    howToUse: string;
  };
  advanced: {
    overview: string;
    keyPoints: string[];
    howToUse: string;
  };
  interview: {
    question: string;
    answer: string;
    mentalModel: string;
  };
}

export const theoryData: Record<string, LabTheory> = {
  'rendering-flow': {
    title: 'React Rendering Pipeline',
    subtitle: 'Mounting, Rerendering, and DOM Commits',
    beginner: {
      overview: 'React rendering is a 3-step process: Trigger (state updates), Render (calling components and comparing elements), and Commit (writing changes to the screen DOM).',
      keyPoints: [
        'Trigger: User clicks a button, changing state via useState.',
        'Render: React calls your component to see what JSX it returns.',
        'Commit: React updates the actual web page DOM only for what changed.'
      ],
      howToUse: 'Click the buttons inside the Interactive Simulator to trigger state updates. Observe the progress meter move from Trigger to Render, then Commit and Paint.'
    },
    intermediate: {
      overview: 'React separates the "Render" phase (which is asynchronous and can be paused) from the "Commit" phase (which is synchronous and fast). During rendering, React executes component functions to generate the virtual DOM structure.',
      keyPoints: [
        'Render: CPU-bound work. Component code is invoked, generating React elements.',
        'Reconciliation: Diffing the old tree and the new tree to find changes.',
        'Commit: DOM mutations are executed. This is synchronous to prevent layout shifts.'
      ],
      howToUse: 'Change the slider options in the editor and click "Run Code". Follow the animated arrows representing the Fiber work pipeline.'
    },
    advanced: {
      overview: 'Concurrent React split the rendering engine into interruptible slices of work. Rendering is no longer block-and-render. In the Render phase, scheduler prioritizes updates, performing work on Fiber trees. Only when complete does it pass layout updates to the Commit phase.',
      keyPoints: [
        'Scheduler: React prioritizes frames (e.g. user input > transitions).',
        'Interruptible Render: Fibers are processed iteratively. If higher priority tasks enter, React discards the current render and restarts.',
        'Effects: useEffect triggers post-commit asynchronously, while useLayoutEffect runs synchronously before browser paint.'
      ],
      howToUse: 'Speed up/slow down execution. Observe the step logs showing exactly how fibers are evaluated, paused, or flushed.'
    },
    interview: {
      question: 'What is the difference between rendering and painting in React?',
      answer: 'Rendering is the engine-internal computation where React calls components, performs VDOM diffing, and calculates changes (Render Phase). Painting is the browser mechanism that executes layout calculations and outputs pixels on the physical screen (happening after React commits mutations to the DOM). Rendering can occur without any changes committed if the diff results in a net-zero mutation.',
      mentalModel: 'Rendering is the architectural drawing; Committing is the physical construction update; Painting is turning on the lights so users can see the building.'
    }
  },
  'vdom-diff': {
    title: 'Virtual DOM Diffing',
    subtitle: 'The O(n) Heuristic Reconciliation Algorithm',
    beginner: {
      overview: 'React builds a lightweight copy of the web page in memory (Virtual DOM). When state changes, it builds a new one and diffs (compares) them to find the minimum edits required for the real web page.',
      keyPoints: [
        'VDOM is just JS objects representing HTML tags.',
        'React avoids updating everything, which makes the browser slow.',
        'It changes only the specific nodes that changed.'
      ],
      howToUse: 'Click nodes to change their state, text, or structure. Watch the Old VDOM vs New VDOM update and look at the highlighted red/green elements representing differences.'
    },
    intermediate: {
      overview: 'Full tree diffing is O(n³) computationally. React implements O(n) heuristics: 1) Two elements of different types produce different trees, 2) The developer can hint at persistent children across renders with a key prop.',
      keyPoints: [
        'Type checks: If a <div> changes to a <p>, React tears down the entire subtree and remounts it.',
        'Attribute updates: If only className or style changes, React modifies the node in place without dismantling it.',
        'List reconciliation: Keys tell React which elements remained stable, allowing elements to be reordered instead of recreated.'
      ],
      howToUse: 'Toggle the lists to add, remove, or shuffle elements. Check the DOM Operation List showing exact API executions (e.g. PATCH, REPLACE).'
    },
    advanced: {
      overview: 'React reconciler uses fiber objects to maintain component metadata. The diffing algorithm evaluates child nodes using their types, keys, and props. If a key matches, it reuses the fiber and applies updates. If not, it marks the old fiber for deletion and spawns a new one.',
      keyPoints: [
        'Fiber reuse: React looks up children using mapped keys to match old fibers to new elements.',
        'Deletion queue: Unmatched old fibers are stored in a deletion list and flushed during commit.',
        'Key index hazard: Using array index as keys causes mismatched internal states if items are inserted or reordered.'
      ],
      howToUse: 'Select the "Key Index Mismatch" preset in the panel to witness how elements are mistakenly re-rendered or retain input state.'
    },
    interview: {
      question: 'Why is using Math.random() as a key prop a major performance hazard?',
      answer: 'React uses keys to identify stable elements. If a key is randomly generated on every render, React will treat it as a brand-new component type. It will unmount (destroy) the existing DOM node, lose state (e.g. text inputs), run all cleanups, and remount a new node. This causes massive layout thrashing and renders reconciliation useless.',
      mentalModel: 'Imagine changing your house address randomly every morning. The mail carrier has to tear down the old house and rebuild a new one just to deliver mail.'
    }
  },
  'fiber-explorer': {
    title: 'React Fiber Architecture',
    subtitle: 'The Work Loop and Priority Scheduling',
    beginner: {
      overview: 'React Fiber is the rendering engine that lets React pause rendering to handle user input immediately, keeping the web page responsive.',
      keyPoints: [
        'Fibers are units of work for components.',
        'React processes one component at a time, checking if the browser is busy.',
        'It uses a linked-list tree structure (parent, child, sibling).'
      ],
      howToUse: 'Use the controls to start the Fiber Work Loop. Watch the scheduler progress down the node graph, traversing children and siblings.'
    },
    intermediate: {
      overview: 'Fiber nodes represent components and their state queues. Unlike standard JS execution stacks, Fiber represents a virtual stack frame where units of work are processed in a loop: `while (workInProgress !== null) { workInProgress = performUnitOfWork(workInProgress); }`.',
      keyPoints: [
        'Double Buffering: React has a current tree (on screen) and a workInProgress tree (in memory). Committing swaps the pointers.',
        'traversal: React walks down the tree to the child, then to siblings, then back to the parent. This is a depth-first search.',
        'Priority: Update triggers are queued with Lane priorities (Sync, Input, Transition, Idle).'
      ],
      howToUse: 'Click "Step" to walk through the Fiber loop. Watch how components compile state mutations and pass lanes to the scheduler.'
    },
    advanced: {
      overview: 'React Scheduler uses the browser API requestIdleCallback/MessageChannel to split rendering. The Work Loop executes individual fibers. After each fiber, it checks `shouldYield()` to see if the browser needs to paint or respond to a click, saving the pointer to resume later.',
      keyPoints: [
        'Concurrency: Yielding work lets browsers handle high-priority input frames (16ms budget).',
        'Lanes: A bitmask tracking priority layers, enabling suspension of low-priority renders.',
        'Fiber references: Child, Sibling, and Return pointers allow React to climb up, down, or across the tree at any step.'
      ],
      howToUse: 'Trigger a long render and click on the screen. Watch the visual scheduler yield, process the click action, and return to render.'
    },
    interview: {
      question: 'What is React Fiber and how does it solve the stack reconciler problem?',
      answer: 'React Fiber is a rewrite of Reacts core reconciliation algorithm, turning rendering from a synchronous call stack process into an interruptible loop. The old stack reconciler processed recursively, locking the main thread and causing input lag. Fiber represents components as independent stack frames (fibers) organized in a linked list. This allows React to pause, yield, prioritize, or discard rendering work.',
      mentalModel: 'Stack Reconciler is a waterfall you cannot stop once it starts. Fiber is a staircase where you can pause at any step, catch your breath, let someone pass, and continue.'
    }
  },
  'effect-timeline': {
    title: 'useEffect Timeline & Closures',
    subtitle: 'Mount, Rerender, Cleanups, and Dependency Arrays',
    beginner: {
      overview: 'useEffect runs code after your component mounts or updates. It is used to connect to systems outside React, like API fetches, intervals, or page events.',
      keyPoints: [
        'Mount: The effect runs once when the component appears.',
        'Rerender: The effect runs again if variables in the dependency array change.',
        'Cleanup: React runs a cleanup function before running the effect again, or when the component disappears.'
      ],
      howToUse: 'Click "Update State" or "Trigger Rerender" to trigger the effect pipeline. Watch the timeline animate through Render -> Commit -> Cleanup -> Effect.'
    },
    intermediate: {
      overview: 'Understanding effect synchronization. React compares dependency items using Object.is. If any dependency changes, the cleanup function of the prior effect runs with old closure values, followed by the new effect running with new closure values.',
      keyPoints: [
        'Stale Closures: If you omit dependencies, functions inside the effect will capture variable values from the render loop they were declared in.',
        'Empty Array []: Only mounts once, cleanups on unmount. Stale state triggers if it references changing variables.',
        'LayoutEffects: useLayoutEffect fires synchronously after DOM mutations but before paint. Good for measuring layouts.'
      ],
      howToUse: 'Change the dependencies in the interactive input. Add/remove items and trigger state changes to see if a stale closure warning flashes.'
    },
    advanced: {
      overview: 'Under the hood, effects are stored on the fiber object as a linked list (`updateQueue.lastEffect`). During render, React builds this queue. In the commit phase, it walks the queue to flush cleanups first (passive cleanups), then passive effect creators in a scheduler macro-task.',
      keyPoints: [
        'Passive Effects: run after paint so they do not block the browser layout cycle.',
        'Layout Effects: run synchronously in the mutation phase of commit, blocking screen update.',
        'Double-Invoke: In React 18 React StrictMode mounts, unmounts, and remounts components to enforce clean cleanups.'
      ],
      howToUse: 'Open the "Strict Mode Simulator". Watch the double-mount mount-unmount-mount flow and how it isolates memory leaks.'
    },
    interview: {
      question: 'Explain what a stale closure is in a React useEffect.',
      answer: 'A stale closure occurs when a function inside an effect captures (closes over) variables (props or state) from a specific render instance. If that effect has an empty dependency array (`[]`), it will never run again. Thus, the closed-over function remains bound to the initial render scope, reading old variables indefinitely, even as newer renders updated those state values.',
      mentalModel: 'Taking a picture of a whiteboard. Even if someone writes new notes on the physical board (state change), looking at the photograph (stale closure) will only show you the old notes.'
    }
  },
  'event-loop': {
    title: 'The JS Event Loop & Rendering',
    subtitle: 'Call Stack, Microtasks, Macrotasks, and Reflows',
    beginner: {
      overview: 'JavaScript can only do one thing at a time. The Event Loop coordinates executing your code, handling events (like clicks), and updating screen visuals.',
      keyPoints: [
        'Call Stack: Where code currently running is placed.',
        'Task Queues: Messages waiting to run (timers, events).',
        'Microtask Queue: High priority actions (Promises, async/await).'
      ],
      howToUse: 'Select a script and click "Run Step-by-Step". Watch code enter the stack, trigger Web APIs, enter queues, and block rendering.'
    },
    intermediate: {
      overview: 'JavaScript schedules execution using macrotasks (setTimeout, events) and microtasks (Promise.then, queueMicrotask). The event loop prioritizes the microtask queue, draining it completely before processing the next macrotask or performing layouts.',
      keyPoints: [
        'Microtask priority: Promises can starve the rendering thread if they constantly queue more microtasks.',
        'Render Phase: Browser aims to update at 60Hz (16.6ms). Layout, Style, and Paint occur between tasks if flags are dirty.',
        'Call Stack Block: Long-running code locks the main thread, freezing the UI and preventing user interactions.'
      ],
      howToUse: 'Run the "Microtask Starvation" example. Look at the call stack, queue sizes, and rendering loop block meter.'
    },
    advanced: {
      overview: 'Event loop ticks: 1) Pop stack until empty, 2) Run all microtasks until microtask queue is empty (even if new microtasks are added during execution), 3) Evaluate rendering update flag. If rendering frame is open, process animation callbacks (requestAnimationFrame), calculate Recalculate Style, Layout, and Paint. 4) Run the oldest macrotask.',
      keyPoints: [
        'requestAnimationFrame: Executes right before repaint, making it ideal for smooth animations.',
        'requestIdleCallback: Executes during the browser’s idle periods at the end of a frame.',
        'Worker threads: Offload intensive computations to Web Workers to prevent blocking event loop.'
      ],
      howToUse: 'Inspect the frame analyzer. Observe how long-running tasks cause dropped frames, visual lag, and high input latency.'
    },
    interview: {
      question: 'What is the execution order of Promises, setTimeouts, and requestAnimationFrames?',
      answer: 'When a call stack clears: 1) All pending microtasks (Promises) run immediately, draining the queue. 2) If a browser frame is active, requestAnimationFrame (rAF) callbacks execute. 3) The browser recalculates layout and paints. 4) Macrotasks (like setTimeout callbacks) run in a subsequent tick of the event loop.',
      mentalModel: 'Call stack is the active desk. Microtasks are high-priority post-it notes you must solve before leaving. Repaint is cleaning the room. Macrotasks are appointments scheduled for tomorrow.'
    }
  },
  'http-lifecycle': {
    title: 'API Pipeline & Optimization',
    subtitle: 'Debounce, Throttle, and Network Lifecycles',
    beginner: {
      overview: 'Networking is the pipeline connecting your app to a server. Managing requests properly stops your application from sending thousands of unnecessary queries.',
      keyPoints: [
        'Debounce: Waits for the user to stop typing before sending a search request.',
        'Throttle: Limits a continuous action (like scrolling) to run once every X milliseconds.',
        'CORS: Security mechanism stopping malicious websites from requesting your server data.'
      ],
      howToUse: 'Type into the input box to trigger search actions. Watch the API pipeline light up with debounce/throttle active.'
    },
    intermediate: {
      overview: 'Debounce groups multiple sequential events into a single execution, resetting the timer with each trigger. Throttle locks the event executor, allowing at most one call in a given window.',
      keyPoints: [
        'Debounce is ideal for search auto-completes and size resizing recalculations.',
        'Throttle is ideal for infinite scroll, scroll tracking, drag-and-drop, and throttle game triggers.',
        'CORS Preflight: Browser sends an OPTIONS request to check permissions before firing write actions.'
      ],
      howToUse: 'Toggle between Debounce and Throttle settings. Trigger rapid input keys and view the network logs indicating total API calls saved.'
    },
    advanced: {
      overview: 'Request race conditions: parallel API calls might arrive out of order, overriding current UI states with stale data. Solve this using cleanups in useEffect to toggle an active boolean, or cancel outstanding network requests using AbortController.',
      keyPoints: [
        'AbortController: Passes an abort signal to fetch, cancelling active TCP connections.',
        'Idempotency: GET operations should be safe to repeat. POST/PUT require validation to avoid duplication.',
        'CORS Headers: Access-Control-Allow-Origin checks origin, method, and headers requested.'
      ],
      howToUse: 'Select the "Race Condition Demo". Click fetch multiple times rapidly. Observe how the final rendering output changes to wrong states without AbortControllers.'
    },
    interview: {
      question: 'How do you prevent race conditions when fetching data in a useEffect?',
      answer: 'To prevent race conditions, use a local cleanup flag or an AbortController. By maintaining an `active` boolean inside the effect and setting it to `false` during the cleanup, you ensure that if a subsequent render fires a new request, the response of the prior request will be ignored when it resolves. Alternatively, call `controller.abort()` on an AbortController signal.',
      mentalModel: 'Ordering two packages online. When you cancel the first order, you throw away its contents when it arrives, preventing it from cluttering your shelf.'
    }
  },
  'rerender-heatmap': {
    title: 'Rerender Profiler & Optimization',
    subtitle: 'Memoization, React.memo, useMemo, and useCallback',
    beginner: {
      overview: 'When a component state changes, React updates that component and all children inside it. If you have many children, this can slow down your app.',
      keyPoints: [
        'Rerenders happen when props or state change, or parent rerenders.',
        'React.memo tells React to skip rendering a child if its props did not change.',
        'useMemo caches expensive math values.'
      ],
      howToUse: 'Click component nodes in the tree to trigger state updates. Check the heatmap overlay colors (red = heavy rerendering).'
    },
    intermediate: {
      overview: 'React triggers component renders cascades downwards. Even if a child component does not use changed props, it will render anyway unless optimized. Caching components is achieved with React.memo, which performs a shallow comparison of props.',
      keyPoints: [
        'Referential Equality: Passing functions `() => {}` or objects `{}` to child components breaks React.memo because they get fresh addresses on every render.',
        'useCallback: Caches the callback function reference itself.',
        'useMemo: Caches the calculated output of a function, updating only when dependencies change.'
      ],
      howToUse: 'Turn on the "Enable Memoization" switches for different sub-nodes. Rerun updates and watch parent updates get blocked at child levels.'
    },
    advanced: {
      overview: 'Shallow comparison details: React.memo compares old and new props with Object.is. Custom comparators can be passed. Over-using useMemo/useCallback adds memory allocation overhead and dependency array checks, which can be costlier than simple renders for cheap elements.',
      keyPoints: [
        'Context Re-renders: If a component consumes Context, it bypasses React.memo when the context value changes.',
        'Profiler metrics: Actual duration measures render time, base duration measures layout tree build costs.',
        'Optimization rule: First restructure JSX (e.g. lift state up or pass children as props) before applying memo hooks.'
      ],
      howToUse: 'Review the Profiler console output. Check Render Count and Base execution duration to identify bottlenecks.'
    },
    interview: {
      question: 'Does wrapping every function in useCallback always improve performance?',
      answer: 'No. Wrapping everything in useCallback can be counter-productive. A callback hook has execution costs: declaring dependencies, allocating hook array memory, and performing shallow comparison checks on every render. If the child receiving the function is not optimized with React.memo, it will rerender anyway, making the hook checks a useless overhead.',
      mentalModel: 'Paying a security team to inspect a document before showing it to a colleague, even though the colleague doesn’t care if it changed and will read it anyway.'
    }
  },
  'state-flow': {
    title: 'State Architecture Explorer',
    subtitle: 'Context API, Zustand, and Prop Drilling Simulations',
    beginner: {
      overview: 'State management is how components share data. Prop drilling passes data down multiple layers, while Context and Zustand act as central warehouses.',
      keyPoints: [
        'Prop Drilling: Passing data through components that do not need it.',
        'Context API: React built-in data broadcast.',
        'Zustand: A simple store that updates only components that read the data.'
      ],
      howToUse: 'Click "Increment Store" and observe how data propagates down the nodes. Highlighted lines indicate active rendering paths.'
    },
    intermediate: {
      overview: 'Context API is designed for low-frequency updates (themes, user auth). When a Context provider value changes, all consumers rerender, regardless of React.memo. Zustand uses selectors to subscribe to slice updates, bypassing React renders for unrelated nodes.',
      keyPoints: [
        'Drilling pain: Hard to maintain, changes require updating all intermediate levels.',
        'Context limitation: Lacks fine-grained selector mechanics out of the box.',
        'Zustand selectors: `const value = useStore(s => s.value)` avoids rendering if other store values change.'
      ],
      howToUse: 'Toggle between "Prop Drilling", "Context API", and "Zustand Store" views. Run update cycles and trace render paths.'
    },
    advanced: {
      overview: 'Zustand bypasses React state sync for state writes, managing a list of subscribers in vanilla JS. When state changes, it notifies only components subscribing to changed slices. Context updates are executed via Reacts fiber commit loop, traversing children for context consumers, which can trigger massive render trees.',
      keyPoints: [
        'Store selectors: React 18 uses `useSyncExternalStore` internally in Zustand to prevent tearing.',
        'State slicing: Returning objects from selectors without custom comparators can cause re-renders.',
        'Modular stores: Creating micro-stores vs one monolithic store. Zustand supports writing multiple clean stores.'
      ],
      howToUse: 'Open the store explorer. Mutate deep keys and inspect subscriber callbacks fired.'
    },
    interview: {
      question: 'Why is Context API not suitable as a high-performance state manager?',
      answer: 'Context API is not a state manager but a dependency injection mechanism. When a Context provider receives a new value, all components that consume the context are forced to re-render. There is no selector mechanism to subscribe to a slice of the value. If you store an object in Context, a component reading only `obj.a` will re-render when `obj.b` updates, causing massive performance problems in high-frequency update apps.',
      mentalModel: 'Context is a PA speaker system. If the manager makes an announcement, everyone in the building has to pause and listen, even if the announcement is only for one person. Zustand is a text message sent directly to that single person.'
    }
  }
};
