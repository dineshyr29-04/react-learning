export interface LevelData {
  overview: string;
  keyPoints: string[];
  howToUse: string;
  codeExample: string;
}

export interface LabTheory {
  title: string;
  subtitle: string;
  beginner: LevelData;
  intermediate: LevelData;
  advanced: LevelData;
  interview: {
    question: string;
    answer: string;
    mentalModel: string;
    codeExample: string;
  };
}

export const theoryData: Record<string, LabTheory> = {
  'intro': {
    title: '1. Introduction to React',
    subtitle: 'Declarative Programming & The Virtual DOM',
    beginner: {
      overview: 'React is a library for building user interfaces. Instead of manually updating elements on the screen (imperative programming like document.getElementById), you describe what you want the screen to look like (declarative programming) and React handles the updates.',
      keyPoints: [
        'Declarative: Describe WHAT the UI should look like, not HOW to change it.',
        'Component-Based: UIs are built from small, isolated, reusable pieces of code.',
        'Virtual DOM: React maintains a lightweight representation of the real DOM in memory.'
      ],
      howToUse: 'Click the buttons on the right to toggle between Declarative React code and Imperative Vanilla JS. Watch how the DOM updates visually.',
      codeExample: `// Declarative React
function Welcome() {
  return <h1>Hello World!</h1>;
}`
    },
    intermediate: {
      overview: 'The Virtual DOM (VDOM) is a programming concept where a virtual representation of a UI is kept in memory and synced with the "real" DOM by a library such as ReactDOM. This process is called reconciliation.',
      keyPoints: [
        'Efficiency: Changing the real DOM is slow; updating the Virtual DOM is extremely fast.',
        'Batching: React aggregates multiple updates together to minimize browser paint cycles.',
        'Reconciliation: The O(n) diffing algorithm that determines what parts of the DOM need to change.'
      ],
      howToUse: 'Edit the heading tag in the editor. Click "Run Code" and observe how React compares the old virtual node tree to the new tree, highlighting only the changed nodes.',
      codeExample: `// Virtual DOM Example
const element = (
  <div className="card">
    <h2>Reconciliation</h2>
    <p>React updates only this paragraph!</p>
  </div>
);`
    },
    advanced: {
      overview: 'React 18 introduces Concurrent Rendering. Instead of blocking the browser main thread during large updates, React can pause, yield, and resume rendering operations. This is supported by the Fiber engine which splits rendering work into smaller units.',
      keyPoints: [
        'Fiber Work Loop: An interruptible traversal of the component tree.',
        'Lanes: A bitmask representing update priorities (Sync, Transition, Idle).',
        'Time Slicing: Breaking rendering into 5ms slices to keep the browser responsive.'
      ],
      howToUse: 'Slow down the work loop speed to see how React processes fiber nodes one-by-one and yields back control to the browser.',
      codeExample: `// Concurrent Rendering demo
import { startTransition, useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  
  const handleChange = (e) => {
    // Keep input responsive by deferring search work
    startTransition(() => {
      setQuery(e.target.value);
    });
  };
}`
    },
    interview: {
      question: 'What is the Virtual DOM and how does React use it to optimize rendering?',
      answer: 'The Virtual DOM is a lightweight, in-memory copy of the actual DOM. When a component’s state changes, React creates a new Virtual DOM tree and compares it with the previous one (a process called "diffing"). React then calculates the minimum set of changes needed (reconciliation) and updates only those specific parts of the real DOM in a single batch (commit phase), preventing expensive full-page reflows.',
      mentalModel: 'The Virtual DOM is like a blue-print. It is much cheaper to make edits and draft changes on the blueprint paper than it is to tear down and rebuild a brick-and-mortar wall on every tiny design change.',
      codeExample: `// Virtual DOM updates behind the scenes:
// 1. Initial Render: React renders <button>Click (0)</button>
// 2. State click: React computes new element <button>Click (1)</button>
// 3. Diff: Only text inside button changed
// 4. Commit: element.textContent = "Click (1)"`
    }
  },
  'jsx': {
    title: '2. JSX Fundamentals',
    subtitle: 'JavaScript XML Syntax and Compilation',
    beginner: {
      overview: 'JSX stands for JavaScript XML. It is a syntax extension for JavaScript that allows you to write HTML-like markup directly inside your JavaScript files, making it much easier to write and read UI structures.',
      keyPoints: [
        'Embedding Expressions: Put any valid JavaScript inside curly braces { }.',
        'Single Root Element: Components must return a single parent element (or a Fragment <>...</>).',
        'Attributes: Use camelCase names (e.g., class becomes className, onclick becomes onClick).'
      ],
      howToUse: 'Modify the variables inside the code box. Watch how the values of dynamic text, classes, and styles are evaluated live in the output screen.',
      codeExample: `function UserProfile() {
  const name = "Alex";
  const active = true;
  
  return (
    <div className={active ? "active-user" : "inactive"}>
      <h2>Name: {name}</h2>
      <p>Status: {active ? "Online" : "Offline"}</p>
    </div>
  );
}`
    },
    intermediate: {
      overview: 'JSX is not valid JavaScript that browsers can run directly. Compilers (like Babel, SWC, or Vite) transform JSX into standard JavaScript function calls: `React.createElement()` or the new JSX runtime `jsx()` calls.',
      keyPoints: [
        'Compilation: <div className="btn">Hi</div> becomes React.createElement("div", { className: "btn" }, "Hi").',
        'Tree Structure: Children are passed as subsequent arguments or as a prop named children.',
        'Type Check: Capitalized elements (e.g., <MyButton />) compile to variable references, while lowercase elements (e.g., <button>) compile to strings.'
      ],
      howToUse: 'Change the markup tags in the editor. Observe the compiled JavaScript output section below the preview and notice how React nests element calls.',
      codeExample: `// Original JSX:
// <div id="container"><h1 color="red">Hello</h1></div>

// Transpiled JS:
import { jsx as _jsx } from "react/jsx-runtime";
const node = _jsx("div", { 
  id: "container", 
  children: _jsx("h1", { color: "red", children: "Hello" }) 
});`
    },
    advanced: {
      overview: 'Modern JSX runtimes do not require importing React in every file. Under the hood, the compiler imports functions from `react/jsx-runtime` to build the elements. React elements are immutable plain JavaScript objects describing the component tree.',
      keyPoints: [
        'Immutability: You cannot modify props or children of an element object after creation.',
        'Props Object: Frozen at creation time to prevent side effects during rendering.',
        'Children Array: Flat versus nested array representations depending on key properties.'
      ],
      howToUse: 'Inspect the React Element JSON log in the console. Note the $$typeof symbol, type, props, and key properties of the compiled object.',
      codeExample: `// Real React Element Object representation:
const elementObj = {
  $$typeof: Symbol.for('react.element'),
  type: 'div',
  props: {
    className: 'card',
    children: 'Hello content'
  },
  key: 'unique_card_key',
  ref: null
};`
    },
    interview: {
      question: 'Why do we need to return a single root element in a React component JSX?',
      answer: 'JSX compiles down to a single standard JavaScript function call (either React.createElement or a jsx runtime call). In JavaScript, a function can only return a single value (or object). Returning multiple adjacent elements would compile to multiple sibling function calls without a wrapping statement, which is syntactically invalid. Wrap sibling elements in a Fragment (<>...</>) to satisfy this rule without adding redundant DOM wrappers.',
      mentalModel: 'Think of returning values from a function. You cannot write "return 1, 2, 3;" and expect a function to return three separate values. You must wrap them in an array or object, which in JSX translates to a wrapping parent element.',
      codeExample: `// ❌ Syntax Error: Compiles to two returns
// return <Header />, <Content />;

//  Success: Compiles to a single function call
// return <React.Fragment children={[<Header />, <Content />]} />`
    }
  },
  'props': {
    title: '3. Components & Props',
    subtitle: 'Reusability, Unidirectional Data Flow, and Immutable Inputs',
    beginner: {
      overview: 'Components are the building blocks of React, like custom HTML elements. Props (short for properties) are inputs passed into components, letting you reuse the same component template with different data.',
      keyPoints: [
        'Reusability: Write a component once (e.g. UserCard), use it multiple times.',
        'Props: Passed like HTML attributes: <Card title="Hello" />.',
        'Read-Only: A component must never modify its own props (props are immutable).'
      ],
      howToUse: 'Change the prop values in the interactive controller panel on the right. See how the UserCard component automatically re-renders with the new values.',
      codeExample: `// Child component receiving props
function UserCard(props) {
  return (
    <div className="card">
      <h3>{props.name}</h3>
      <p>Role: {props.role}</p>
    </div>
  );
}

// Parent rendering child with different props
function App() {
  return (
    <>
      <UserCard name="Alice" role="Developer" />
      <UserCard name="Bob" role="Designer" />
    </>
  );
}`
    },
    intermediate: {
      overview: 'React uses unidirectional data flow: data always flows downwards from parent components to children. To send data back up, we pass callback functions as props, which child components can invoke when events happen.',
      keyPoints: [
        'Destructuring: Extract props directly in function parameters: function Card({ name, role }).',
        'Default Props: Use JavaScript default values to fallback if a prop is missing: function Card({ name = "Guest" }).',
        'Callback Props: Passing state updater functions downwards to allow child-to-parent communication.'
      ],
      howToUse: 'Edit the callback trigger code. Click the "Add Alert" button in the Card component and watch the alert count state increment in the Parent component.',
      codeExample: `// Child component with event callback prop
function DeleteButton({ onDelete }) {
  return <button onClick={onDelete}>Delete Item</button>;
}

// Parent holding the action state
function App() {
  const handleDelete = () => alert("Deleted item!");
  return <DeleteButton onDelete={handleDelete} />;
}`
    },
    advanced: {
      overview: 'Props are shallowly compared during component updates. If you pass an object or a function as a prop, they get new memory addresses on every parent render. This can cause unnecessary re-renders in children wrapped with React.memo unless optimized with useCallback/useMemo.',
      keyPoints: [
        'Referential Equality: Inline functions and objects create new references on every render cycle.',
        'React.memo: Skips re-rendering a component if its props have not changed.',
        'Children Prop: A special prop that passes nested elements: <Card><h1>Title</h1></Card>.'
      ],
      howToUse: 'Toggle the optimization mode. Observe how changing unrelated state in the Parent triggers a re-render in the Child Card, and how useCallback prevents this.',
      codeExample: `import { memo, useCallback, useState } from 'react';

// Memoized child component
const SimpleButton = memo(({ onClick }) => {
  return <button onClick={onClick}>Click me</button>;
});

function App() {
  const [count, setCount] = useState(0);
  // useCallback keeps the function reference stable
  const handleClick = useCallback(() => {
    console.log("Button clicked!");
  }, []);
  
  return <SimpleButton onClick={handleClick} />;
}`
    },
    interview: {
      question: 'What does it mean that "props are read-only" in React?',
      answer: 'React enforces unidirectional data flow. Props represent the input data passed down from a parent component. A component must never mutate its props directly. If you modify a prop object (e.g. props.name = "new"), React’s reconciliation engine will not detect the change, leading to inconsistent UI states and hard-to-track bugs. If a component needs to change its data over time, it must use its own local state or request a change from the parent by calling a callback function prop.',
      mentalModel: 'Props are like an invoice details sheet. A delivery person cannot scratch out the delivery address or price details on their own copy. If they need an adjustment, they must submit a request to headquarters to send a revised invoice.',
      codeExample: `// ❌ INCORRECT (Direct mutation)
function UserCard(props) {
  props.name = "Mutated Name"; // Crashes/breaks data flow
  return <div>{props.name}</div>;
}

//  CORRECT (Request change via callback)
function UserCard({ name, onNameChange }) {
  return (
    <input value={name} onChange={e => onNameChange(e.target.value)} />
  );
}`
    }
  },
  'state': {
    title: '4. State & Events (useState)',
    subtitle: 'Interactive Components, State Triggers, and Async Batching',
    beginner: {
      overview: 'State is a component\'s memory. Unlike props which are passed down and read-only, state is declared inside a component, allows storage of user inputs, and triggers a full UI update (re-render) whenever it changes.',
      keyPoints: [
        'useState Hook: Declares state variable. Returns [value, setValue].',
        'State Updates: Calling setValue tells React to re-render the component with the new value.',
        'Events: Connect state updates to user interactions using handlers (onClick, onChange).'
      ],
      howToUse: 'Click the increment/decrement buttons in the playground. Look at the state value change, and see how the console logs the component rendering on every click.',
      codeExample: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Add</button>
    </div>
  );
}`
    },
    intermediate: {
      overview: 'State updates in React are asynchronous and batched. If you call `setCount(count + 1)` three times in a row within a single event click, the count will only increment by 1. To resolve this, pass a functional updater callback `setCount(prev => prev + 1)`.',
      keyPoints: [
        'Batching: React groups state updates inside event handlers to prevent multiple rendering frames.',
        'Functional Updates: Always use state updater callbacks when your new state depends on the previous state.',
        'Event Objects: SyntheticEvent wrappers represent native events in a cross-browser way.'
      ],
      howToUse: 'Toggle between "Direct Update" and "Functional Update" modes. Click the "Add 3 Times" button and observe why count increases by 1 in direct mode vs 3 in functional mode.',
      codeExample: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const addThree = () => {
    // ❌ Direct: count is still 0 in this function scope
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1); // count becomes 1
    
    //  Functional: updates are queued sequentially
    // setCount(prev => prev + 1);
    // setCount(prev => prev + 1);
    // setCount(prev => prev + 1); // count becomes 3
  };
}`
    },
    advanced: {
      overview: 'React matches state to the component\'s location in the virtual tree structure. If you render the same component in the same position, React preserves its state. If you change its key, or render a different component, the state is completely destroyed.',
      keyPoints: [
        'State Resetting: Changing the key prop of a component forces React to reset its state.',
        'Bailout: If you set state to the exact same value (Object.is check), React skips rendering the children.',
        'Lazy Initialization: Pass a function to useState to run expensive setup logic once on mount: useState(() => computeInitialValue()).'
      ],
      howToUse: 'Click "Reset Component Key" in the playground. Note how the counter resets to its initial state because React sees it as a brand-new component instance.',
      codeExample: `import { useState } from 'react';

function App() {
  const [userId, setUserId] = useState(1);
  
  // Changing key resets counter state automatically for new users
  return <Counter key={userId} initial={0} />;
}`
    },
    interview: {
      question: 'Why does logging a state variable immediately after calling its setter function show the old value?',
      answer: 'State setters do not change the state variable in the currently executing JavaScript code block. Instead, they schedule a state update with React and request a new render. The state variable behaves like a snapshot; its value is fixed within a single render cycle execution. When the component function runs again (the next render snapshot), the state variable is populated with the updated value.',
      mentalModel: 'State is like ordering a new painting for your wall. Calling the setter function is ordering the painting online. Looking at your wall immediately after placing the order will still show the old painting, because it hasn’t arrived yet.',
      codeExample: `function Counter() {
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // Prints "0" instead of "1"!
  };
}`
    }
  },
  'effect': {
    title: '5. Side Effects (useEffect)',
    subtitle: 'Synchronizing with External Systems and Lifecycle Control',
    beginner: {
      overview: 'Side effects are operations that interact with systems outside of React, such as APIs, timers, or window events. The `useEffect` hook lets you run this side effect code *after* your component has rendered on the screen.',
      keyPoints: [
        'No Array: Runs on every render (mount and update).',
        'Empty Array []: Runs exactly once when the component mounts.',
        'Dependency Array [dep]: Runs on mount, and whenever the values inside dep change.'
      ],
      howToUse: 'Type in the box to fetch user profiles. Look at the console logs to see the lifecycle of the effect: Trigger Render -> Execute Cleanup -> Run Effect.',
      codeExample: `import { useState, useEffect } from 'react';

function UserLoader() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    fetch('https://api.example.com/user')
      .then(res => res.json())
      .then(data => setUser(data));
  }, []); // Run only on mount
}`
    },
    intermediate: {
      overview: 'Effects often require cleaning up resources (like canceling timers, unsubscribing from sockets, or removing event listeners) to prevent memory leaks. You do this by returning a cleanup function from your effect.',
      keyPoints: [
        'Cleanup Trigger: React runs the cleanup function *before* running the effect again, and when the component unmounts.',
        'Object.is Comparison: React compares dependency array items using strict equality to decide whether to re-run.',
        'Strict Mode: React 18 mounts, unmounts, and remounts components in development to ensure cleanups are robust.'
      ],
      howToUse: 'Click the "Toggle Mount" button to see the Timer component mount and unmount. Observe how the intervals are cleared properly, preventing timer overlap.',
      codeExample: `import { useState, useEffect } from 'react';

function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    // Cleanup: Stop timer when component disappears
    return () => clearInterval(id);
  }, []); 
}`
    },
    advanced: {
      overview: 'Avoid using useEffect to synchronize state derived from props or local variables. Calculating data during rendering is much faster and prevents extra rendering loops. Furthermore, use AbortControllers to cancel in-flight API requests to solve network race conditions.',
      keyPoints: [
        'Race Conditions: Rapid requests can resolve out of order. Cancel older requests using AbortController.',
        'Derived State: If a value can be computed from props/state, do not put it in state and sync with useEffect.',
        'Passive Effects: useEffect is deferred until after browser paint. useLayoutEffect fires synchronously before paint.'
      ],
      howToUse: 'Select the "Race Condition" preset. Click requests rapidly and observe how the AbortController automatically aborts older requests, avoiding incorrect UI rendering.',
      codeExample: `useEffect(() => {
  const controller = new AbortController();
  
  fetch(\`/api/user/\${id}\`, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data));
    
  return () => {
    // Abort request if id changes before fetch finishes
    controller.abort();
  };
}, [id]);`
    },
    interview: {
      question: 'What is a cleanup function in useEffect and why is it essential?',
      answer: 'A cleanup function is the function returned by the useEffect callback. It is used to dismantle side effects (like subscriptions, web sockets, intervals, or event listeners) set up during the effect. If not cleaned up, the listener remains in memory, continuing to execute and reference unmounted component scopes. This leads to memory leaks, state update warnings on unmounted components, and duplicate triggers.',
      mentalModel: 'If you rent a conference room and write notes on the whiteboard, you must erase the whiteboard (cleanup) before leaving, so that the next group doesn\'t read your notes or run out of workspace.',
      codeExample: `useEffect(() => {
  const handleScroll = () => console.log(window.scrollY);
  window.addEventListener('scroll', handleScroll);
  
  // Cleanup: clean up scroll listener before running next time
  return () => window.removeEventListener('scroll', handleScroll);
}, []);`
    }
  },
  'custom-hooks': {
    title: '6. Custom Hooks',
    subtitle: 'Reusability, Abstracting Logic, and State Isolation',
    beginner: {
      overview: 'Custom Hooks are regular JavaScript functions whose names start with "use". They let you extract component logic (like state variables and effects) into reusable functions that you can share across multiple components.',
      keyPoints: [
        'Naming Rule: Must start with "use" (e.g., useToggle, useFetch) so React can check Rules of Hooks.',
        'Reusability: Extract fetch logic or state configurations to keep components small and readable.',
        'Isolated State: Every time you call a custom hook, the state variables inside it are completely isolated.'
      ],
      howToUse: 'Toggle the switch buttons for Component A and Component B. Notice how they both use the same custom hook but toggle independently, proving that state is isolated.',
      codeExample: `import { useState } from 'react';

// Custom Hook definition
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
}

// Component using custom hook
function ToggleButton() {
  const [isOn, toggle] = useToggle();
  return <button onClick={toggle}>{isOn ? "ON" : "OFF"}</button>;
}`
    },
    intermediate: {
      overview: 'Custom Hooks are excellent for abstracting browser events, form handling, or API interactions. Inside a custom hook, you can call other standard hooks (like useState, useEffect, useRef) and return whatever data/functions your components need.',
      keyPoints: [
        'Composition: Custom hooks combine standard hooks to form a specialized tool.',
        'Return Value: Can return arrays, objects, values, or functions—whatever is most ergonomic.',
        'Encapsulation: Components consuming the hook do not need to know its internal state configurations.'
      ],
      howToUse: 'Type values into the fields. Look at how the form state custom hook updates values in real-time while abstracting event.target.value lookups.',
      codeExample: `import { useState } from 'react';

// Custom Hook to manage form inputs
function useFormFields(initialValues) {
  const [fields, setValues] = useState(initialValues);
  
  const handleChange = (event) => {
    setValues({
      ...fields,
      [event.target.name]: event.target.value
    });
  };
  
  return [fields, handleChange];
}`
    },
    advanced: {
      overview: 'Because custom hooks run on every render of the consuming component, return objects or arrays should be memoized if they are used as dependencies in useEffect or passed to memoized children. Wrap hook callbacks with useCallback and returned objects with useMemo.',
      keyPoints: [
        'Hook Chains: If a custom hook returns a callback, wrap it in useCallback so it remains reference-stable.',
        'Rules of Hooks: Custom hooks must follow the same rules: only call at the top level, only from React components or other hooks.',
        'State syncing: Bridging local hook state to global stores when scaling applications.'
      ],
      howToUse: 'Toggle the useCallback switch in the hook example. Watch how the downstream effect stops firing repeatedly on unrelated changes because the callback reference is stabilized.',
      codeExample: `import { useState, useCallback, useMemo } from 'react';

function useCounter(step = 1) {
  const [count, setCount] = useState(0);
  
  const increment = useCallback(() => {
    setCount(c => c + step);
  }, [step]);
  
  // Return memoized object to prevent reference changes
  return useMemo(() => ({ count, increment }), [count, increment]);
}`
    },
    interview: {
      question: 'If two components call the same custom hook, do they share the state variables created inside it?',
      answer: 'No. Calling a custom hook is equivalent to copy-pasting the state and effect declarations directly into that component. React creates entirely new, isolated hook memory slots for each component instance. To share state between components, you must lift the state up to a common parent component, use the Context API, or implement a global store like Zustand.',
      mentalModel: 'Custom hooks are like cake recipes. If two bakers use the same recipe, they both get separate cakes. Decorating or slicing the cake in kitchen A does not change the cake in kitchen B.',
      codeExample: `// Component A
const [valueA, toggleA] = useToggle();

// Component B
const [valueB, toggleB] = useToggle();
// Toggling valueA has zero effect on valueB.`
    }
  },
  'context': {
    title: '7. Context API',
    subtitle: 'Avoiding Prop Drilling and Managing App-Wide Theme/Auth Settings',
    beginner: {
      overview: 'Prop drilling occurs when you have to pass data through multiple layers of components just to reach a deeply nested child. The Context API solves this by allowing a parent component to broadcast data to *any* component below it directly, bypassing intermediate components.',
      keyPoints: [
        'Provider: Wraps child components and supplies the value: <Context.Provider value={data}>.',
        'Consumer: A nested child component consumes the data using the useContext hook.',
        'Bypassing: Intermediate components do not need to read, write, or pass the prop.'
      ],
      howToUse: 'Click the "Toggle Theme" button in the Profile card. Watch the background colors change, and observe that intermediate layout elements are not passed any theme props.',
      codeExample: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}

function Layout() {
  return <ProfileCard />; // No props drilled here!
}

function ProfileCard() {
  const theme = useContext(ThemeContext);
  return <div className={theme}>User Profile</div>;
}`
    },
    intermediate: {
      overview: 'You can pass state variables and update functions inside the Context Provider. This allows deeply nested components to trigger global updates, like changing the user language, logging out, or updating shopping carts.',
      keyPoints: [
        'Dynamic Value: Pass objects containing both state and setter functions: value={{ user, setUser }}.',
        'Decoupling: Child components trigger updates in parent scopes without layout dependencies.',
        'Custom Provider: Package Context declaration and provider component inside a single module file.'
      ],
      howToUse: 'Use the Language Selector inside the sub-profile widget. See how changing the language in the child updates the text displayed on the main header.',
      codeExample: `import { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (name) => setUser({ name });
  
  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
}`
    },
    advanced: {
      overview: 'Context is not suitable for high-frequency state updates. When a provider value updates, *all* components consuming that context are forced to re-render, even if they only read a slice of the value that did not change. Prevent this by breaking context into multiple small contexts or memoizing children.',
      keyPoints: [
        'Render Cascade: Context updates bypass React.memo checks on consumers, causing full rendering updates.',
        'Split Context: Separate state value and state updater functions into distinct providers: StateContext and DispatchContext.',
        'useMemo value: Always memoize Context provider objects to avoid re-renders caused by new object literals.'
      ],
      howToUse: 'Toggle between "Monolithic Context" and "Split Context" modes. Look at the re-render heatmap colors to see how Split Context blocks redundant renders.',
      codeExample: `import { createContext, useState, useMemo } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  
  // Memoize the value object so its reference remains stable
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}`
    },
    interview: {
      question: 'Why is the Context API not a replacement for full state management tools like Redux or Zustand?',
      answer: 'Context API is a dependency injection tool, not a state manager. It does not handle where state lives or how it changes; it merely transports state that already exists (e.g. from useState) down the tree. Crucially, Context lacks fine-grained updates: it does not support selectors. If a provider value is an object, any consumer component will re-render whenever *any* property of that object updates, causing performance issues in massive systems.',
      mentalModel: 'Context is like a shared public television in a lounge. If anyone changes the channel, everyone in the room is forced to watch the new channel. A state manager like Zustand is like handing everyone individual smartphones where they can subscribe to exactly the notifications they want.',
      codeExample: `// With Context, if user.age changes, components only reading user.name still re-render:
const { name } = useContext(UserContext); // Re-renders!

// With Zustand selectors, the component only re-renders if the selected name slice changes:
const name = useStore(state => state.user.name); // Skips re-render if only age changes!`
    }
  }
};
