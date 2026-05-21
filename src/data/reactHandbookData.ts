export interface InterviewQuestion {
  question: string;
  answer: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface CommonMistake {
  title: string;
  wrongCode: string;
  correctedCode: string;
  explanation: string;
}

export interface HandbookTopic {
  id: string;
  title: string;
  category: string;
  description: string;
  definition: {
    what: string;
    why: string;
    when: string;
  };
  theory: {
    internalBehavior: string;
    coreConcepts: string;
  };
  syntax: {
    explanation: string;
    code: string;
  };
  examples: {
    beginner: {
      title: string;
      code: string;
      explanation: string;
    };
    intermediate: {
      title: string;
      code: string;
      explanation: string;
    };
    realWorld: {
      title: string;
      code: string;
      explanation: string;
    };
  };
  notes: {
    bestPractices: string[];
    performanceTips: string[];
    interviewPoints: string[];
  };
  commonMistakes: CommonMistake[];
  interviewQuestions: InterviewQuestion[];
}

export const reactHandbookData: HandbookTopic[] = [
  {
    id: 'react-intro',
    title: 'React Introduction',
    category: 'React Core Foundations',
    description: 'Understand SPA vs MPA, the Virtual DOM, Reconciliation, and React Fiber.',
    definition: {
      what: 'React is a component-based UI library developed by Meta for building highly interactive user interfaces. It uses a declarative programming paradigm to manage state and render UI.',
      why: 'Traditional DOM manipulation is slow and error-prone. React abstracts the DOM, providing a faster Virtual DOM, efficient UI updates (Reconciliation), and predictable component rendering.',
      when: 'Use React for building single-page applications (SPAs), complex web dashboards, and mobile apps (via React Native) where UI state changes frequently.'
    },
    theory: {
      internalBehavior: 'When state changes, React creates a new Virtual DOM tree and compares it with the old one (Diffing). The Reconciliation algorithm computes the minimal set of DOM changes. In React 16+, the Fiber reconciliation engine allows incremental rendering—breaking rendering work into small units and spreading them across frames to maintain a smooth 60fps UI.',
      coreConcepts: '• SPA vs MPA: Single-Page Apps load a single HTML page and update it dynamically without full page reloads. Multi-Page Apps load a new page from the server on every interaction.\n• Virtual DOM: A lightweight in-memory representation of the real DOM.\n• Reconciliation: The process of syncing the Virtual DOM with the real DOM.\n• React Fiber: The reimplemented core algorithm that enables concurrent rendering and scheduling prioritization.'
    },
    syntax: {
      explanation: 'Import React and mount a root component using the ReactDOM API.',
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    examples: {
      beginner: {
        title: 'Basic Hello World Component',
        code: `export default function HelloWorld() {
  return <h1>Hello, React!</h1>;
}`,
        explanation: 'A functional component returning a single JSX element.'
      },
      intermediate: {
        title: 'Introductory Counter with State',
        code: `import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border rounded">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
        Increment
      </button>
    </div>
  );
}`,
        explanation: 'Uses local state to trigger UI updates dynamically when clicked.'
      },
      realWorld: {
        title: 'App Entry Point with Layout Wrappers',
        code: `import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Developer Portal" />
        <main className="flex-1 overflow-y-auto p-6">
          <MainContent />
        </main>
      </div>
    </div>
  );
}`,
        explanation: 'A production-style layout structure utilizing modular layout components.'
      }
    },
    notes: {
      bestPractices: [
        'Keep components small and focused on a single responsibility.',
        'Use StrictMode in development to catch potential bugs and side effects.'
      ],
      performanceTips: [
        'Understand that rendering is not the same as screen painting. Minimize expensive calculations during render.'
      ],
      interviewPoints: [
        'Be ready to explain how Reconciliation works: O(n) heuristic diffing algorithm based on elements sharing types and keys.',
        'Contrast SPA with MPA and state the primary benefit of the Virtual DOM (batching and avoiding direct slow DOM mutations).'
      ]
    },
    commonMistakes: [
      {
        title: 'Directly Manipulating the DOM',
        wrongCode: `function BadComponent() {
  const handleClick = () => {
    document.getElementById('title')!.innerText = 'Hello!';
  };
  return <h1 id="title" onClick={handleClick}>Click Me</h1>;
}`,
        correctedCode: `import { useState } from 'react';

function GoodComponent() {
  const [title, setTitle] = useState('Click Me');
  return <h1 onClick={() => setTitle('Hello!')}>{title}</h1>;
}`,
        explanation: 'React manages UI declaratively. Bypassing React and writing directly to the DOM causes state synchronization mismatches.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the Virtual DOM and how does React use it to optimize updates?',
        answer: 'The Virtual DOM is an in-memory representation of the real DOM tree. When a component’s state changes, React generates a new Virtual DOM tree, performs a diffing process against the previous tree, and batches only the necessary changes to the real DOM (Reconciliation) to minimize reflows and repaints.',
        level: 'beginner'
      },
      {
        question: 'What is React Fiber and what problems does it solve?',
        answer: 'React Fiber is the rendering engine rewrite introduced in React 16. It enables concurrent rendering by breaking execution work into small units (Fibers) that can be paused, prioritized, aborted, or resumed. This solves the issue of thread blocking during deep tree reconciliation, keeping the page highly responsive.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'jsx',
    title: 'JSX Syntax',
    category: 'React Core Foundations',
    description: 'Learn JSX syntax rules, JS expressions embedding, fragments, and transpilation.',
    definition: {
      what: 'JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like structures directly inside JavaScript code.',
      why: 'It provides a highly readable, visual representation of the UI structure, keeping markup and component logic closely bound.',
      when: 'Always use JSX when declaring the user interface layout inside React components.'
    },
    theory: {
      internalBehavior: 'JSX is syntactic sugar. Browsers cannot execute JSX directly. Build tools (like Babel or SWC) compile JSX down to raw JavaScript calls—specifically, `React.createElement()` or the newer `jsx()` runtime functions. This outputs standard JavaScript objects representing DOM elements.',
      coreConcepts: '• Transpilation: Converting JSX markup into native JavaScript functions.\n• Expressions: Wrapping JavaScript inside curly braces `{}` to render dynamic data.\n• Fragments: Using `<></>` to group multiple adjacent elements without creating redundant DOM nodes.'
    },
    syntax: {
      explanation: 'Embed variables, call functions, and use conditional statements inside `{}`.',
      code: `const username = 'Sarah';
const element = <div className="user">Hello, {username.toUpperCase()}!</div>;`
    },
    examples: {
      beginner: {
        title: 'Rendering Variables & Fragments',
        code: `export default function FragmentExample() {
  const title = "React Handbook";
  return (
    <>
      <h1 className="text-xl font-bold">{title}</h1>
      <p>Welcome to the JSX syntax guide.</p>
    </>
  );
}`,
        explanation: 'Wraps adjacent elements in a React Fragment to avoid injecting unnecessary container divs into the HTML markup.'
      },
      intermediate: {
        title: 'Rendering Dynamic Lists and Inline Logic',
        code: `export default function DynamicGreeting({ isLoggedIn, items }) {
  return (
    <div className="card">
      <h2>{isLoggedIn ? 'Welcome Back!' : 'Please Log In'}</h2>
      {items.length > 0 && (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
        explanation: 'Utilizes ternary operators and logical AND (`&&`) operators to show conditional markup based on incoming variables.'
      },
      realWorld: {
        title: 'Config-driven Navigation Bar Component',
        code: `interface NavItem {
  label: string;
  href: string;
  isExternal: boolean;
}

interface NavbarProps {
  items: NavItem[];
}

export default function Navbar({ items }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between p-4 bg-zinc-900 text-white">
      <div className="font-bold text-lg">HandbookApp</div>
      <div className="flex gap-4">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            target={item.isExternal ? '_blank' : undefined}
            rel={item.isExternal ? 'noopener noreferrer' : undefined}
            className="hover:text-indigo-400 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}`,
        explanation: 'An enterprise-grade component generating dynamic HTML anchors from structured TypeScript configurations.'
      }
    },
    notes: {
      bestPractices: [
        'Always close tags, even self-closing ones like `<img />` or `<input />`.',
        'Use camelCase for HTML attributes (e.g., `className` instead of `class`, `onClick` instead of `onclick`).'
      ],
      performanceTips: [
        'Avoid making complex computations directly inside JSX curly braces. Calculate values beforehand and store them in variables.'
      ],
      interviewPoints: [
        'Babel transpiles `<div className="card">Hello</div>` into `React.createElement("div", { className: "card" }, "Hello")`.',
        'State why Fragments are valuable: they prevent markup bloat, which speeds up styling, layout rendering, and DOM query lookups.'
      ]
    },
    commonMistakes: [
      {
        title: 'Using class instead of className',
        wrongCode: `function BadCard() {
  return <div class="card-primary">Oops</div>;
}`,
        correctedCode: `function GoodCard() {
  return <div className="card-primary">Correct</div>;
}`,
        explanation: 'Because JSX is compiled to JavaScript, and `class` is a reserved keyword in JS, React mandates the use of `className` for CSS classes.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Does the browser execute JSX code directly?',
        answer: 'No, browsers cannot read JSX. It must be compiled to standard JavaScript (typically calling `React.createElement` or `jsx()`) by compilers like Babel, SWC, or TypeScript before execution in the browser.',
        level: 'beginner'
      },
      {
        question: 'Why must JSX tags always be wrapped in a single parent element or Fragment?',
        answer: 'JSX transpiles into JavaScript function calls. A JavaScript function cannot return multiple values simultaneously. Therefore, adjacent elements must be wrapped in a parent element or Fragment to compile into a single function call, e.g. returning one top-level object.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'components',
    title: 'Components',
    category: 'React Core Foundations',
    description: 'Learn functional vs class components, component composition, and purity.',
    definition: {
      what: 'Components are the building blocks of a React application. They are independent, reusable pieces of UI that combine markup, styles, and behavioral logic.',
      why: 'They allow code reusability, easy testing, modular development, and a clear separation of concerns in the application layout.',
      when: 'Whenever you need to render a UI element, wrap it in a functional component. Keep them modular.'
    },
    theory: {
      internalBehavior: 'React components must act as pure functions with respect to their props. Given the same inputs (props), they should return the exact same JSX output. Functional components are evaluated by simply calling the function. Class components instantiate an object, invoke lifecycle methods, and execute the `render()` method.',
      coreConcepts: '• Functional Components: JavaScript functions returning JSX. They use hooks for state and side effects.\n• Class Components: Older ES6 class-based components inheriting from `React.Component`.\n• Composition: Building complex components by nesting simpler, modular components instead of using inheritance.'
    },
    syntax: {
      explanation: 'Define components using regular function declarations or arrow functions.',
      code: `// Arrow Function Component
const Button = ({ label }) => {
  return <button>{label}</button>;
};`
    },
    examples: {
      beginner: {
        title: 'Basic Functional Component',
        code: `export default function UserBadge() {
  return (
    <div className="flex items-center gap-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-indigo-500" />
      <span className="font-semibold text-xs">Vicky</span>
    </div>
  );
}`,
        explanation: 'Declares a reusable user card UI using pure functional structure.'
      },
      intermediate: {
        title: 'Composition of Nested Components',
        code: `function Avatar({ name }) {
  return <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">{name[0]}</div>;
}

function UserInfo({ name, role }) {
  return (
    <div>
      <h3 className="font-bold text-sm">{name}</h3>
      <p className="text-xs text-zinc-500">{role}</p>
    </div>
  );
}

export default function ProfileCard({ name, role }) {
  return (
    <div className="flex gap-4 p-4 border rounded-xl shadow-sm bg-white dark:bg-zinc-950">
      <Avatar name={name} />
      <UserInfo name={name} role={role} />
    </div>
  );
}`,
        explanation: 'Demonstrates component composition where complex cards are assembled from smaller layout units.'
      },
      realWorld: {
        title: 'Re-usable Modal Dialog Component',
        code: `import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center pb-3 border-b dark:border-zinc-800 mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            &times;
          </button>
        </div>
        <div className="text-sm text-zinc-600 dark:text-zinc-300">{children}</div>
      </div>
    </div>
  );
}`,
        explanation: 'An enterprise Modal dialog featuring strict TypeScript definitions, dynamic slot content via `children`, and conditional mounting.'
      }
    },
    notes: {
      bestPractices: [
        'Keep components pure. Avoid side-effects directly in the component rendering path (use useEffect instead).',
        'Prefer Functional Components + Hooks over Class Components.'
      ],
      performanceTips: [
        'Do not declare components inside another component. This causes the nested component to be completely re-created on every render, destroying its state and DOM nodes.'
      ],
      interviewPoints: [
        'Why choose Composition over Inheritance? It provides maximum flexibility by decoupling parent-child structures and keeping props and layout highly modular.',
        'Contrast evaluate differences between Class components and Functional components.'
      ]
    },
    commonMistakes: [
      {
        title: 'Defining Components inside Components',
        wrongCode: `function ParentComponent() {
  // WRONG! This is re-created on every render, resetting its internal state
  function ChildComponent() {
    return <div>Child</div>;
  }
  return <ChildComponent />;
}`,
        correctedCode: `// CORRECT! Declared outside and reused
function ChildComponent() {
  return <div>Child</div>;
}

function ParentComponent() {
  return <ChildComponent />;
}`,
        explanation: 'Declaring a component inside another causes it to be recompiled on every render loop, resulting in performance issues and UI state loss.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the main difference between functional and class components?',
        answer: 'Functional components are simple JavaScript functions that accept props and return JSX, leveraging Hooks for state. Class components require ES6 classes, extend `React.Component`, manage state via `this.state` / `this.setState`, and use explicit lifecycle methods.',
        level: 'beginner'
      },
      {
        question: 'What does component purity mean, and why is it important in React?',
        answer: 'Component purity means that a component is a pure function: it does not modify external states, behaves predictably, and returns the exact same JSX when passed the same props. This allows React to safely optimize rendering performance through memoization and concurrent scheduling.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'props',
    title: 'Props',
    category: 'React Core Foundations',
    description: 'Learn unidirectional data flow, props destructuring, default props, and immutability.',
    definition: {
      what: 'Props (Properties) are read-only configuration inputs passed from parent components down to child components.',
      why: 'Props enable data sharing and dynamic component customization, allowing children to adjust their output based on values sent by parent elements.',
      when: 'Use props whenever you want to configure, pass data, or send callback trigger functions to a child component.'
    },
    theory: {
      internalBehavior: 'Props follow a strict unidirectional (one-way) data flow. Parents can pass props down, but children cannot modify them. Props are immutable. If a child needs to communicate back to the parent, the parent must pass down a callback function as a prop, which the child can execute.',
      coreConcepts: '• Immutability: Props cannot be modified by the child component.\n• Unidirectional Flow: Data flows strictly from parent to child.\n• Children Prop: A special prop (`children`) that allows nested elements to be injected directly into the layout.'
    },
    syntax: {
      explanation: 'Pass attributes in JSX and read them in the function parameters using destructuring.',
      code: `// Passing
<UserCard name="Alex" age={24} />

// Reading
function UserCard({ name, age }) {
  return <div>{name} ({age})</div>;
}`
    },
    examples: {
      beginner: {
        title: 'Simple Props Destructuring',
        code: `interface CardProps {
  title: string;
  description: string;
}

export default function InfoCard({ title, description }: CardProps) {
  return (
    <div className="p-4 border border-zinc-200 rounded shadow-sm">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-zinc-500 text-sm mt-1">{description}</p>
    </div>
  );
}`,
        explanation: 'Accepts standard string props using explicit TypeScript interface mapping.'
      },
      intermediate: {
        title: 'Passing Callback Functions',
        code: `interface SwitchProps {
  isActive: boolean;
  onToggle: () => void;
}

export default function ToggleSwitch({ isActive, onToggle }: SwitchProps) {
  return (
    <button
      onClick={onToggle}
      className={\`px-4 py-2 rounded font-semibold text-xs border transition-colors \${
        isActive ? 'bg-indigo-600 text-white border-indigo-700' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
      }\`}
    >
      {isActive ? 'ENABLED' : 'DISABLED'}
    </button>
  );
}`,
        explanation: 'Demonstrates downstream communication: executing a parent-level function trigger from the child element on click.'
      },
      realWorld: {
        title: 'Layout Wrapper Component using children',
        code: `import React from 'react';

interface CardLayoutProps {
  header: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function CardLayout({ header, footer, children }: CardLayoutProps) {
  return (
    <div className="flex flex-col border dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-lg">
      <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-b dark:border-zinc-800 font-semibold">
        {header}
      </div>
      <div className="p-6 flex-1 text-sm">
        {children}
      </div>
      {footer && (
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t dark:border-zinc-800 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
}`,
        explanation: 'An enterprise-grade layout wrapper utilizing advanced slot injection props alongside the main React `children` layout node.'
      }
    },
    notes: {
      bestPractices: [
        'Destructure props directly in the component signature for cleaner code.',
        'Provide fallback defaults using JS destructuring assignment, e.g., `{ theme = "dark" }`.'
      ],
      performanceTips: [
        'Avoid creating inline objects or arrow functions inside JSX props when passing them to memoized components, as this generates a new reference on every render.'
      ],
      interviewPoints: [
        'Explain that props are immutable to preserve component purity and maintain predictable rendering paths.',
        'Be ready to describe the "children" prop: it acts as a slot for inserting arbitrary DOM structures or nested components.'
      ]
    },
    commonMistakes: [
      {
        title: 'Mutating Props inside Child Component',
        wrongCode: `function BadBadge(props) {
  // WRONG! Mutating props directly throws errors in React
  props.title = props.title.toLowerCase(); 
  return <span>{props.title}</span>;
}`,
        correctedCode: `function GoodBadge({ title }) {
  // CORRECT! Work with local variables instead
  const formattedTitle = title.toLowerCase();
  return <span>{formattedTitle}</span>;
}`,
        explanation: 'React components are read-only with respect to props. Modifying them causes unexpected state inconsistency and errors.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Why are React props immutable?',
        answer: 'React props are kept immutable to enforce a single source of truth, ensure component purity, and prevent child components from altering the parent’s state behind the scenes, making data flow easily trackable.',
        level: 'intermediate'
      },
      {
        question: 'What is prop drilling and how can it be avoided?',
        answer: 'Prop drilling occurs when data needs to be passed down through several nested component layers just to reach a deep child. It can be avoided using React Context API, state management libraries (like Zustand or Redux), or by structuring components via composition.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'state',
    title: 'State',
    category: 'State & Events',
    description: 'Master useState, functional updates, state batching, and async updates.',
    definition: {
      what: 'State is a built-in React object used to store data that is local and private to a component. Unlike props, state is fully controlled by the component itself.',
      why: 'State allows components to keep track of changing data over time (like user input, toggle toggles, or data fetched from APIs) and re-render when it updates.',
      when: 'Use state whenever a value needs to change in response to user actions and that change should trigger a UI update.'
    },
    theory: {
      internalBehavior: 'State updates are asynchronous. React queues state changes and batches them together in a single re-render cycle for performance optimization. When you request a state update via `setState`, React schedules a new render. If you calculate the new state based on the previous state, always use a functional update function `setCount(prev => prev + 1)` to prevent race conditions.',
      coreConcepts: '• Async Updates: State does not update immediately after calling the update function.\n• State Batching: React groups multiple state updates inside event handlers to trigger only a single re-render.\n• Functional Updates: Passing a function to state setters to guarantee work is done on the latest, absolute state value.'
    },
    syntax: {
      explanation: 'Declare state using the `useState` hook, which returns the current state and a function to update it.',
      code: `import { useState } from 'react';

const [state, setState] = useState(initialValue);`
    },
    examples: {
      beginner: {
        title: 'Simple Counter State',
        code: `import { useState } from 'react';

export default function SimpleCounter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)} className="p-2 bg-zinc-200 rounded">
      Count: {count}
    </button>
  );
}`,
        explanation: 'Uses a simple useState setter to track and increment count numbers.'
      },
      intermediate: {
        title: 'Object State with Spread Operator',
        code: `import { useState } from 'react';

export default function UserProfileForm() {
  const [user, setUser] = useState({ name: '', email: '' });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser(prev => ({ ...prev, name: e.target.value }));
  };

  return (
    <div className="space-y-2">
      <input value={user.name} onChange={handleNameChange} className="border p-1" placeholder="Name" />
      <p>Current: {user.name} ({user.email})</p>
    </div>
  );
}`,
        explanation: 'Demonstrates maintaining objects in state. Since state setter calls overwrite rather than merge, you must spread the previous object.'
      },
      realWorld: {
        title: 'Multi-Step Checkout State Machine',
        code: `import { useState } from 'react';

type Step = 'cart' | 'shipping' | 'payment' | 'success';

interface CheckoutState {
  step: Step;
  shippingAddress: string;
  paymentDetails: string;
}

export default function CheckoutProcess() {
  const [checkout, setCheckout] = useState<CheckoutState>({
    step: 'cart',
    shippingAddress: '',
    paymentDetails: ''
  });

  const advanceStep = (next: Step) => {
    setCheckout(prev => ({
      ...prev,
      step: next
    }));
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-slate-900 border border-slate-800 text-white rounded-xl">
      <h2 className="font-bold text-lg">Checkout Progress: {checkout.step.toUpperCase()}</h2>
      {checkout.step === 'cart' && (
        <button onClick={() => advanceStep('shipping')} className="mt-4 bg-indigo-600 px-4 py-2 rounded">
          Proceed to Shipping
        </button>
      )}
      {checkout.step === 'shipping' && (
        <button onClick={() => advanceStep('payment')} className="mt-4 bg-indigo-600 px-4 py-2 rounded">
          Proceed to Payment
        </button>
      )}
    </div>
  );
}`,
        explanation: 'Enterprise checkout tracker utilizing a typed multi-field state object.'
      }
    },
    notes: {
      bestPractices: [
        'Keep state minimal. Derive values where possible rather than storing them in state.',
        'Use functional state updates if the new state depends on the previous state.'
      ],
      performanceTips: [
        'Avoid unnecessary state hoisting. Keep state close to where it is used to prevent the entire tree from re-rendering on minor changes.'
      ],
      interviewPoints: [
        'Explain React state batching behavior (how multiple setStates in a single synchronous stack trigger only one render).',
        'State why calling state setters does not change the variable value in the current closure line execution.'
      ]
    },
    commonMistakes: [
      {
        title: 'Expecting Immediate State Update',
        wrongCode: `const [count, setCount] = useState(0);

const handleAction = () => {
  setCount(count + 1);
  console.log(count); // Prints 0, not 1!
};`,
        correctedCode: `const [count, setCount] = useState(0);

const handleAction = () => {
  const nextCount = count + 1;
  setCount(nextCount);
  console.log(nextCount); // Safely prints the new count value
};`,
        explanation: 'State updates schedule renders asynchronously. Inside the current event execution execution path, the state variable holds the old value.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Why does React state update asynchronously?',
        answer: 'React updates state asynchronously to batch multiple state mutations from a single event handler together, avoiding multiple expensive render cycles and improving overall application performance.',
        level: 'intermediate'
      },
      {
        question: 'How do you update state that is an array or object?',
        answer: 'Since React state must be treated as immutable, you should not modify objects or arrays directly. Instead, create a new reference using spread operators (e.g. `[...oldArray, newItem]` or `{...oldObj, key: newValue}`) and pass it to the state update function.',
        level: 'beginner'
      }
    ]
  },
  {
    id: 'event-handling',
    title: 'Event Handling',
    category: 'State & Events',
    description: 'Learn React Synthetic Events, passing arguments, and event propagation control.',
    definition: {
      what: 'Event handling in React is the process of responding to user interactions (clicks, keyboard inputs, focus changes) on DOM elements.',
      why: 'It allows you to bind actions and behavior to the UI, enabling interactive functionality.',
      when: 'Any time you want the application to act in response to a user click, keypress, submission, or drag action.'
    },
    theory: {
      internalBehavior: 'React wraps native browser events in a cross-browser wrapper called `SyntheticEvent`. React delegates all events to the root DOM container (releasing event handlers from actual target nodes to save memory) and dispatches them through a centralized system. In React 17+, event delegation happens on the root container where React mounts.',
      coreConcepts: '• SyntheticEvent: Cross-browser standard events wrapper.\n• Event Delegation: Binds events to the root element instead of single nodes.\n• Event Modification: Using `e.preventDefault()` to stop defaults and `e.stopPropagation()` to stop bubbling.'
    },
    syntax: {
      explanation: 'Use camelCase attributes in JSX and pass the handler function name (not its execution call).',
      code: `const handleClick = (e) => {
  e.preventDefault();
  console.log('Clicked!');
};

<button onClick={handleClick}>Submit</button>`
    },
    examples: {
      beginner: {
        title: 'Simple Click Event Handler',
        code: `export default function AlertButton() {
  const handleAlert = () => {
    alert('Action triggered!');
  };

  return (
    <button onClick={handleAlert} className="bg-zinc-800 text-white px-3 py-1.5 rounded">
      Trigger Action
    </button>
  );
}`,
        explanation: 'Declares a pure event listener. Notice we pass reference of `handleAlert`, not executing it with `onClick={handleAlert()}`.'
      },
      intermediate: {
        title: 'Passing Custom Arguments to Handler',
        code: `import { useState } from 'react';

export default function ItemList() {
  const [selected, setSelected] = useState<string | null>(null);

  const selectItem = (name: string, e: React.MouseEvent) => {
    console.log('Event source:', e.target);
    setSelected(name);
  };

  return (
    <div className="flex gap-2">
      {['Item A', 'Item B'].map(item => (
        <button key={item} onClick={(e) => selectItem(item, e)} className="p-2 border">
          {item}
        </button>
      ))}
      <p>Selected: {selected}</p>
    </div>
  );
}`,
        explanation: 'Shows how to pass custom arguments inside an inline closure function wrapper, alongside the default Event parameter.'
      },
      realWorld: {
        title: 'Custom Event Handler with Delegation Prevention',
        code: `import React from 'react';

export default function FileBrowser() {
  const handleFolderClick = (id: string) => {
    console.log('Opened folder:', id);
  };

  const handleDeleteFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stops folder click from triggering
    console.log('Deleted file:', fileId);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => handleFolderClick('folder-1')}
        className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg flex justify-between items-center cursor-pointer"
      >
        <span>📁 Project Files</span>
        <button
          onClick={(e) => handleDeleteFile('file-99', e)}
          className="bg-rose-600 px-2 py-1 text-xs rounded hover:bg-rose-700 text-white"
        >
          Delete File
        </button>
      </div>
    </div>
  );
}`,
        explanation: 'Uses stopPropagation to prevent a nested button click event from bubbling up and triggering the parent folder’s handler.'
      }
    },
    notes: {
      bestPractices: [
        'Avoid running heavy computations directly inside JSX inline event arrow functions.',
        'Always return void or control propagation explicitly inside callback handlers.'
      ],
      performanceTips: [
        'Inline arrow functions in JSX cause recreation on every render. For performance-sensitive components, define handlers as class properties or memoized callbacks.'
      ],
      interviewPoints: [
        'Describe SyntheticEvents: React handles browser incompatibilities by wrapping native events in a cross-browser object.',
        'Explain how React delegates events to the root container node, improving memory usage by avoiding binding to individual nodes.'
      ]
    },
    commonMistakes: [
      {
        title: 'Executing Event Handler inside Render',
        wrongCode: `function BadComponent() {
  const handleClick = () => console.log('hi');
  // WRONG! This will run immediately during render, causing loop errors
  return <button onClick={handleClick()}>Click</button>;
}`,
        correctedCode: `function GoodComponent() {
  const handleClick = () => console.log('hi');
  // CORRECT! Pass the function reference
  return <button onClick={handleClick}>Click</button>;
}`,
        explanation: 'Passing parenthesis executes the function instantly during render. You must pass a reference to the handler instead.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is a SyntheticEvent in React?',
        answer: 'A SyntheticEvent is a cross-browser wrapper around the browser’s native event. It has the same interface as native events, including `stopPropagation()` and `preventDefault()`, but works identically across all modern browsers.',
        level: 'beginner'
      },
      {
        question: 'Why should you avoid executing event handlers immediately inside the onClick prop?',
        answer: 'Executing the handler directly during render (`onClick={handler()}`) causes it to run when the component mounts, which can trigger state updates and lead to infinite render loops.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'conditional-rendering',
    title: 'Conditional Rendering',
    category: 'State & Events',
    description: 'Learn logical && guards, ternary operators, and switch-case render branches.',
    definition: {
      what: 'Conditional rendering is the process of displaying different UI layout blocks based on specific conditions or state states.',
      why: 'It enables dynamic application behavior, letting you show or hide segments (e.g. login screens, loading states, modals) based on current state.',
      when: 'Any time you need to customize what gets drawn on screen depending on user status, data availability, or error responses.'
    },
    theory: {
      internalBehavior: 'React evaluates JSX elements as JavaScript values. If a condition evaluates to `true`, React includes the subsequent element in the Virtual DOM tree. If it evaluates to `false`, `null`, `undefined`, or `void`, React ignores it. Note: the number `0` is a falsy value but will be rendered as text by React. Always convert arrays/numbers to explicit booleans when using the logical AND (`&&`) operator.',
      coreConcepts: '• Ternary Operator: `condition ? JSX : alternateJSX` for if-else branches.\n• Logical AND: `condition && JSX` for simple if branches.\n• Early Returns: Returning JSX from function branches before the main render.'
    },
    syntax: {
      explanation: 'Use inline JavaScript operators inside curly braces to selectively render markup.',
      code: `{isPremium && <PremiumBadge />}
{isLoggedIn ? <LogoutButton /> : <LoginButton />}`
    },
    examples: {
      beginner: {
        title: 'Ternary Render Toggle',
        code: `export default function SimpleToggle({ isVisible }: { isVisible: boolean }) {
  return (
    <div>
      {isVisible ? (
        <p className="text-emerald-500">Content is active!</p>
      ) : (
        <p className="text-zinc-400">Content is hidden.</p>
      )}
    </div>
  );
}`,
        explanation: 'Implements an if-else layout condition inside JSX using a standard ternary operator.'
      },
      intermediate: {
        title: 'Logical AND Guard with Boolean Conversion',
        code: `export default function NotificationCount({ unreadCount }: { unreadCount: number }) {
  return (
    <div>
      {/* Explicitly cast to boolean to avoid rendering '0' */}
      {Boolean(unreadCount > 0) && (
        <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
          {unreadCount} New Notifications
        </span>
      )}
    </div>
  );
}`,
        explanation: 'Demonstrates safe logical AND guards, preventing the common bug where 0 shows up in the UI.'
      },
      realWorld: {
        title: 'Auth Status Component Switcher',
        code: `type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated';

interface AuthDashboardProps {
  status: AuthStatus;
  userName?: string;
  onLogin: () => void;
}

export default function AuthDashboard({ status, userName, onLogin }: AuthDashboardProps) {
  // Option 1: Early Return pattern
  if (status === 'loading') {
    return <div className="animate-pulse text-zinc-500">Checking auth token...</div>;
  }

  // Option 2: Complex inline branch evaluation
  return (
    <div className="p-4 border dark:border-zinc-800 rounded-lg">
      {status === 'authenticated' ? (
        <div>
          <h2 className="font-bold text-sm">Welcome back, {userName}!</h2>
          <p className="text-xs text-zinc-400">Access granted to repositories.</p>
        </div>
      ) : (
        <div>
          <h2 className="font-bold text-sm">Access Denied</h2>
          <button onClick={onLogin} className="mt-2 bg-indigo-600 text-white px-3 py-1.5 rounded text-xs">
            Authenticate
          </button>
        </div>
      )}
    </div>
  );
}`,
        explanation: 'A production component combining early return logic for loading states with ternary operators for layout choices.'
      }
    },
    notes: {
      bestPractices: [
        'Prefer early return statements for major layout state changes (like full-page loaders or permission blocks).',
        'Be extremely careful with the logical AND `&&` operator when evaluating number or string variables.'
      ],
      performanceTips: [
        'Ensure that conditional nodes have stable types. Changing tag wrappers dynamically (e.g. switching between `div` and `section`) forces React to tear down and rebuild the entire subtree.'
      ],
      interviewPoints: [
        'Why does a raw falsy number `0` render in React? Because React treats numbers as valid text nodes, rendering them instead of filtering them out like booleans.',
        'Explain how early returns help keep component render layouts readable and reduce nesting complexity.'
      ]
    },
    commonMistakes: [
      {
        title: 'Rendering Falsy Zero Bug',
        wrongCode: `function BadBadgeList({ items }) {
  // If items.length is 0, this outputs the text "0" on screen!
  return <div>{items.length && <span>Items available</span>}</div>;
}`,
        correctedCode: `function CorrectBadgeList({ items }) {
  // Explicitly check for length or cast to boolean
  return <div>{items.length > 0 && <span>Items available</span>}</div>;
}`,
        explanation: 'The logical AND operator (`&&`) returns the value of the evaluated expression. Since `0` is falsy, React receives `0` and draws it as text.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What values does React ignore when evaluating conditional rendering expressions?',
        answer: 'React ignores `false`, `null`, `undefined`, and empty strings. These will output nothing in the UI.',
        level: 'beginner'
      },
      {
        question: 'When should you use early returns instead of inline ternary expressions?',
        answer: 'Early returns are best when a component should render completely different layouts (such as loading states, empty lists, or unauthorized screens) to keep the code readable and avoid deep nesting inside JSX.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'lists-keys',
    title: 'Lists & Keys',
    category: 'State & Events',
    description: 'Understand key selection rules, Reconciliation diffing impact, and list updates.',
    definition: {
      what: 'Lists and Keys refers to rendering collections of elements using the array `.map()` method and passing unique `key` props to each child element.',
      why: 'Keys help React identify which items have changed, been added, or been removed. This enables high-performance DOM updates during reconciliation.',
      when: 'Every time you iterate over arrays or collections to generate multiple sibling elements in JSX.'
    },
    theory: {
      internalBehavior: 'React uses keys to track identities of sibling elements. During reconciliation, if elements have matching keys, React assumes they represent the same data node and simply updates their attributes. If keys change or are missing, React will tear down and rebuild the DOM nodes. Using the array index as a key is highly discouraged because if the list is re-sorted, filtered, or prepended, the indexes map to different data items, causing incorrect UI rendering and state corruption.',
      coreConcepts: '• Unique Identity: Keys must be unique among siblings.\n• Index Danger: Array indexes are bad keys for dynamic lists.\n• Diffing Efficiency: Stable keys optimize DOM updates.'
    },
    syntax: {
      explanation: 'Use the `key` prop on the top-level element returned inside the `.map()` loop.',
      code: `<ul>
  {items.map(item => (
    <li key={item.id}>{item.name}</li>
  ))}
</ul>`
    },
    examples: {
      beginner: {
        title: 'Stable Key List Rendering',
        code: `interface Task {
  id: string;
  name: string;
}

export default function SimpleTaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul className="space-y-1">
      {tasks.map(task => (
        <li key={task.id} className="p-2 bg-zinc-50 border rounded text-xs">
          {task.name}
        </li>
      ))}
    </ul>
  );
}`,
        explanation: 'Renders dynamic tasks using stable, unique database-style identifiers for the `key` prop.'
      },
      intermediate: {
        title: 'Sorting List with Stable Keys',
        code: `import { useState } from 'react';

interface Book {
  id: string;
  title: string;
}

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([
    { id: 'b1', title: 'React Handbook' },
    { id: 'b2', title: 'Thinking in React' }
  ]);

  const reverseList = () => {
    setBooks(prev => [...prev].reverse());
  };

  return (
    <div className="space-y-2">
      <button onClick={reverseList} className="bg-zinc-800 text-white px-2 py-1 text-xs rounded">
        Reverse Order
      </button>
      <ul>
        {books.map(book => (
          <li key={book.id} className="p-1 font-mono text-xs">{book.title}</li>
        ))}
      </ul>
    </div>
  );
}`,
        explanation: 'Demonstrates a reordering list. Because the keys are stable (`b1`, `b2`), React updates the DOM by simply reordering the nodes instead of recreating them.'
      },
      realWorld: {
        title: 'Optimized Task Manager with CRUD Actions',
        code: `import { useState } from 'react';

interface ToDo {
  id: string;
  text: string;
  isDone: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<ToDo[]>([
    { id: 'todo_1', text: 'Structure layout system', isDone: false },
    { id: 'todo_2', text: 'Write TypeScript types', isDone: true }
  ]);

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    ));
  };

  return (
    <div className="p-4 border dark:border-zinc-800 rounded-xl max-w-sm bg-white dark:bg-zinc-950">
      <h3 className="font-bold text-sm mb-2">Workspace Tasks</h3>
      <div className="space-y-1">
        {todos.map(todo => (
          <div
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className="flex items-center gap-2 p-2 border dark:border-zinc-900 rounded cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            <input type="checkbox" checked={todo.isDone} readOnly />
            <span className={todo.isDone ? 'line-through text-zinc-400' : ''}>{todo.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,
        explanation: 'A production Todo list rendering layout. Updates elements cleanly based on stable unique keys.'
      }
    },
    notes: {
      bestPractices: [
        'Never generate keys on the fly using random numbers (e.g. `key={Math.random()}`) inside the render loop. This forces React to recreate the DOM node on every render.',
        'Ensure keys are unique among sibling elements. Sibling elements cannot share the same key.'
      ],
      performanceTips: [
        'If a list is static and never changes position, filters, or lengths, using the array index as a fallback key is acceptable, but still discouraged.'
      ],
      interviewPoints: [
        'Explain the role of keys in Reconciliation: they allow React to match Virtual DOM elements with real DOM nodes to determine if elements can be reused or must be replaced.',
        'Understand what happens when keys change: React destroys the component instance and rebuilds the DOM element from scratch, discarding any local input state.'
      ]
    },
    commonMistakes: [
      {
        title: 'Using Math.random() as Key',
        wrongCode: `function BadList({ items }) {
  return (
    <ul>
      {items.map(item => (
        // WRONG! Generates a new key on every render
        <li key={Math.random()}>{item}</li>
      ))}
    </ul>
  );
}`,
        correctedCode: `function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        // CORRECT! Uses a stable, unique property from the data
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}`,
        explanation: 'Generating random keys on the fly forces React to discard the old DOM elements and completely recreate them on every render, severely degrading performance.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Why is using array index as key discouraged for dynamic lists?',
        answer: 'Using the index as a key can cause rendering bugs and state corruption if items are reordered, filtered, or inserted at the top. Since the indexes remain the same for new positions, React maps the old DOM state to the wrong data items.',
        level: 'intermediate'
      },
      {
        question: 'Can sibling components share the same key in React?',
        answer: 'No, sibling components must have unique keys to allow React’s reconciliation algorithm to distinguish between them. However, components in different subtrees can reuse the same keys.',
        level: 'beginner'
      }
    ]
  },
  {
    id: 'hooks',
    title: 'Hooks Overview',
    category: 'Hooks Deep Dive',
    description: 'Learn Hooks rules, hooks execution lifecycle, and standard hook catalogs.',
    definition: {
      what: 'Hooks are special built-in functions introduced in React 16.8 that allow you to use state and other React features inside functional components without writing classes.',
      why: 'They allow functional components to hook into state, side effects, context, refs, and custom reusable logic easily.',
      when: 'Always use hooks when building stateful or side-effect-driven logic inside React functional components.'
    },
    theory: {
      internalBehavior: 'React tracks hook calls by their execution order. Internally, React maintains a linked list of hook states for each component instance. On every render, React runs hooks in the exact same sequence. This is why you must never call hooks inside conditionals, loops, or nested functions—if the order of hook execution changes, React will map the wrong state storage to the corresponding hook.',
      coreConcepts: '• Rules of Hooks: Only call hooks at the top level. Only call hooks from React function components or custom hooks.\n• Hook States: React maps state memory arrays to hook invocations based on call order.'
    },
    syntax: {
      explanation: 'Always declare hooks at the very top level of functional components before any return statements.',
      code: `import { useState, useEffect } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);
  useEffect(() => { /* side-effect */ }, []);
  // ...
}`
    },
    examples: {
      beginner: {
        title: 'Basic Hooks Combination',
        code: `import { useState, useRef } from 'react';

export default function InputLogger() {
  const [text, setText] = useState('');
  const renderCount = useRef(0);

  renderCount.current += 1;

  return (
    <div className="p-4">
      <input value={text} onChange={e => setText(e.target.value)} className="border p-1" />
      <p>Render Count: {renderCount.current}</p>
    </div>
  );
}`,
        explanation: 'Combines useState and useRef to track rendering metrics without triggering extra rendering loops.'
      },
      intermediate: {
        title: 'Context and Reducer State Sync',
        code: `import { useReducer, useContext, createContext } from 'react';

type Action = { type: 'increment' } | { type: 'decrement' };
const CounterContext = createContext<{ state: number; dispatch: React.Dispatch<Action> } | null>(null);

function counterReducer(state: number, action: Action) {
  switch (action.type) {
    case 'increment': return state + 1;
    case 'decrement': return state - 1;
    default: return state;
  }
}

export default function ContextProviderComponent({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(counterReducer, 0);
  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
}`,
        explanation: 'Combines useReducer and useContext to create a structured local state provider.'
      },
      realWorld: {
        title: 'Encapsulated State Machine Hook',
        code: `import { useState, useCallback } from 'react';

export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }] as const;
}

export default function ActionModal() {
  const [isOpen, { toggle, setFalse }] = useBoolean(false);

  return (
    <div>
      <button onClick={toggle} className="bg-indigo-600 text-white px-2 py-1">Open</button>
      {isOpen && (
        <div className="p-4 border mt-2">
          Modal Content <button onClick={setFalse}>Close</button>
        </div>
      )}
    </div>
  );
}`,
        explanation: 'Creates a robust, reusable custom hook that bundles callbacks wrapped in `useCallback` for reference stability.'
      }
    },
    notes: {
      bestPractices: [
        'Strictly follow the Rules of Hooks: do not call them inside `if` statements or `for` loops.',
        'Use ESLint plugins like `eslint-plugin-react-hooks` to catch rule violations automatically.'
      ],
      performanceTips: [
        'Wrap handlers in `useCallback` when passing them as props to memoized components to prevent children from re-rendering unnecessarily.'
      ],
      interviewPoints: [
        'Why does React require hook calls to follow a strict order? React relies on the call order to map states correctly to each hook in its internal linked list.',
        'What is a custom hook? A helper function that encapsulates React hooks to share stateful logic.'
      ]
    },
    commonMistakes: [
      {
        title: 'Calling Hooks inside Conditionals',
        wrongCode: `function BadComponent({ condition }) {
  // WRONG! Hook order changes based on condition prop
  if (condition) {
    useEffect(() => {
      console.log('Syncing...');
    }, []);
  }
  return <div>Card</div>;
}`,
        correctedCode: `function GoodComponent({ condition }) {
  // CORRECT! Hook is called unconditionally, logic goes inside the hook
  useEffect(() => {
    if (condition) {
      console.log('Syncing...');
    }
  }, [condition]);
  
  return <div>Card</div>;
}`,
        explanation: 'Conditional hook execution breaks React’s internal index tracker, causing subsequent hooks to receive the wrong state values.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What are the two absolute rules of React Hooks?',
        answer: '1. Only call Hooks at the top level of your component (do not call them inside loops, conditionals, or nested functions). 2. Only call Hooks from React Function Components or Custom Hooks.',
        level: 'beginner'
      },
      {
        question: 'How does React maintain state across renders for functional components?',
        answer: 'React stores a linked list of hook states on the component’s Fiber node. It reads hooks sequentially in the order they are called during render, matching each call with its corresponding node in the linked list.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'useeffect-deep-dive',
    title: 'useEffect Deep Dive',
    category: 'Hooks Deep Dive',
    description: 'Master useEffect synchronization cycles, dependency arrays, and cleanup hooks.',
    definition: {
      what: '`useEffect` is a React Hook designed to synchronize a component’s state with external systems (such as API services, event listeners, timers, or direct DOM changes).',
      why: 'It acts as an escape hatch to perform side effects outside of the pure React render cycle.',
      when: 'Use it when you need to subscribe to events, fetch data, setup timers, or trigger secondary calculations in response to state changes.'
    },
    theory: {
      internalBehavior: '`useEffect` runs after the component renders and the DOM has been updated. During render, React registers the effect function. After mounting or when values in the dependency array change, React executes the cleanup function (if provided) of the previous render first, then runs the new effect. If the dependency array is empty `[]`, it runs only on mount and cleans up on unmount. If no dependency array is passed, it runs on every single render, which can lead to performance bottlenecks.',
      coreConcepts: '• Render Synchronization: Runs after paint. Contrast with `useLayoutEffect` which runs synchronously before paint.\n• Cleanup Function: Prevents memory leaks by cleaning up event listeners or timers.\n• Dependency Array: Triggers effect execution only when specified values change.'
    },
    syntax: {
      explanation: 'Pass an effect callback and an optional array of dependencies.',
      code: `useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup logic
  };
}, [dependency1, dependency2]);`
    },
    examples: {
      beginner: {
        title: 'Subscribing to Window Resize Events',
        code: `import { useState, useEffect } from 'react';

export default function ScreenWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    // Cleanup event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <p>Window width: {width}px</p>;
}`,
        explanation: 'Sets up a listener on mount and cleans it up on unmount to prevent memory leaks.'
      },
      intermediate: {
        title: 'Data Fetching with AbortController',
        code: `import { useState, useEffect } from 'react';

export default function UserFetcher({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const res = await fetch(\`https://api.github.com/users/\${userId}\`, {
          signal: controller.signal
        });
        const data = await res.json();
        setUser(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      }
    }

    loadData();

    // Aborts in-flight request if userId changes before fetch completes
    return () => controller.abort();
  }, [userId]);

  return <div>{user ? user.name : 'Loading...'}</div>;
}`,
        explanation: 'Uses an AbortController inside the cleanup callback to cancel pending requests if the user ID updates mid-flight.'
      },
      realWorld: {
        title: 'Document Title Sync and Logging Hub',
        code: `import { useEffect, useState } from 'react';

export default function ActiveSessionTracker() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    document.title = \`Active: \${seconds}s\`;
  }, [seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      console.log('Session tracker unmounted, timer cleared.');
    };
  }, []);

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg">
      <p className="text-xs font-mono">Time spent: {seconds} seconds</p>
    </div>
  );
}`,
        explanation: 'Implements two separate `useEffect` calls: one to sync the document title, and one to manage the timer subscription.'
      }
    },
    notes: {
      bestPractices: [
        'Include all variables referenced inside the effect in the dependency array, or use ESLint hooks rules to ensure accuracy.',
        'Always clean up subscriptions, timers, and event listeners in the cleanup return callback.'
      ],
      performanceTips: [
        'Do not use `useEffect` to derive state from props. Do it directly in the render function to avoid unnecessary state updates and renders.'
      ],
      interviewPoints: [
        'Explain when effect cleanups run: immediately before executing the next effect, and during component unmount.',
        'Contrast `useEffect` (asynchronous, runs after paint) with `useLayoutEffect` (synchronous, runs before paint, blocking DOM updates).'
      ]
    },
    commonMistakes: [
      {
        title: 'Creating an Infinite Render Loop',
        wrongCode: `import { useState, useEffect } from 'react';

function BadComponent() {
  const [data, setData] = useState(0);
  
  useEffect(() => {
    // WRONG! Updates state on every render, causing an infinite loop
    setData(data + 1);
  }); 
  return <div>{data}</div>;
}`,
        correctedCode: `import { useState, useEffect } from 'react';

function GoodComponent() {
  const [data, setData] = useState(0);
  
  useEffect(() => {
    // CORRECT! Added empty dependencies, runs only on mount
    setData(prev => prev + 1);
  }, []);
  
  return <div>{data}</div>;
}`,
        explanation: 'Omitting a dependency array causes the effect to run on every render. If the effect updates state, it triggers another render, resulting in an infinite loop.'
      }
    ],
    interviewQuestions: [
      {
        question: 'When does the cleanup function of a useEffect run?',
        answer: 'The cleanup function runs before the effect is executed again (on subsequent renders when dependencies change) and when the component unmounts.',
        level: 'intermediate'
      },
      {
        question: 'What is the difference between useEffect and useLayoutEffect?',
        answer: '`useEffect` runs asynchronously after the render paint cycle, avoiding UI blocking. `useLayoutEffect` runs synchronously after DOM mutations but before the browser paints the screen, making it ideal for measuring DOM nodes and preventing layout shift.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'forms',
    title: 'Forms',
    category: 'Dynamic UI & Networking',
    description: 'Master controlled vs uncontrolled components, validation patterns, and inputs.',
    definition: {
      what: 'Forms handling in React is the method of capturing and validating user inputs, managed either by React state (Controlled) or direct DOM nodes (Uncontrolled).',
      why: 'Controlled inputs offer dynamic validation and instant state updates, while uncontrolled inputs can improve performance by avoiding frequent re-renders.',
      when: 'Use controlled inputs for forms with complex validation or dynamic fields. Use uncontrolled inputs for simple form submittals where performance is critical.'
    },
    theory: {
      internalBehavior: 'In a controlled component, the React state acts as the "single source of truth". The input’s value is bound to a state variable, and state is updated on every keystroke via the `onChange` event. In an uncontrolled component, inputs behave like traditional HTML inputs; you extract their values when needed using a DOM reference via `useRef`.',
      coreConcepts: '• Controlled Components: Input value is managed by React state.\n• Uncontrolled Components: Input value is managed by the DOM, accessed via `useRef`.\n• Input Validation: Checking input values against rules before submission.'
    },
    syntax: {
      explanation: 'Controlled inputs bind the `value` and `onChange` attributes to state.',
      code: `const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />`
    },
    examples: {
      beginner: {
        title: 'Controlled Form Input',
        code: `import { useState } from 'react';

export default function SimpleForm() {
  const [text, setText] = useState('');

  return (
    <div className="space-y-2">
      <input 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        className="border p-2 rounded" 
        placeholder="Type here"
      />
      <p className="text-xs">Value: {text}</p>
    </div>
  );
}`,
        explanation: 'Binds a simple text input to a React state variable, ensuring the state stays in sync on every keystroke.'
      },
      intermediate: {
        title: 'Uncontrolled Form using Refs',
        code: `import { useRef } from 'react';

export default function UncontrolledForm() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Input value: ' + inputRef.current?.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input ref={inputRef} className="border p-2 rounded" placeholder="Reference input" />
      <button type="submit" className="bg-zinc-800 text-white px-3 py-1 text-xs">Submit</button>
    </form>
  );
}`,
        explanation: 'Uses a ref to read the input value only when the form is submitted, avoiding state updates on every keystroke.'
      },
      realWorld: {
        title: 'Enterprise Form Validator',
        code: `import { useState } from 'react';

interface ValidationError {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<ValidationError>({});

  const validate = () => {
    const tempErrors: ValidationError = {};
    if (!formData.email.includes('@')) tempErrors.email = 'Invalid email address';
    if (formData.password.length < 6) tempErrors.password = 'Password must be at least 6 characters';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Authenticated successfully:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm border p-6 rounded-xl bg-slate-900 text-white">
      <div>
        <label className="block text-xs font-bold mb-1">Email</label>
        <input 
          value={formData.email} 
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm"
        />
        {errors.email && <span className="text-xs text-rose-500">{errors.email}</span>}
      </div>
      <div>
        <label className="block text-xs font-bold mb-1">Password</label>
        <input 
          type="password"
          value={formData.password} 
          onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 p-2 rounded text-sm"
        />
        {errors.password && <span className="text-xs text-rose-500">{errors.password}</span>}
      </div>
      <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded text-sm font-bold">
        Login
      </button>
    </form>
  );
}`,
        explanation: 'Implements client-side validation for email and password fields inside a controlled form.'
      }
    },
    notes: {
      bestPractices: [
        'Prefer controlled inputs for complex form logic, dynamic validation, or dependent fields.',
        'Use uncontrolled inputs for simple forms or when optimizing performance to minimize re-renders.'
      ],
      performanceTips: [
        'To prevent performance issues in large forms with many controlled inputs, consider using libraries like React Hook Form to avoid re-rendering the entire form on every keystroke.'
      ],
      interviewPoints: [
        'Be ready to explain the trade-offs between controlled and uncontrolled components.',
        'Understand how `e.preventDefault()` prevents the default browser page reload behavior upon form submission.'
      ]
    },
    commonMistakes: [
      {
        title: 'Switching Controlled Input to Uncontrolled',
        wrongCode: `import { useState } from 'react';

function BadForm() {
  const [value, setValue] = useState<string | undefined>(undefined);
  // WRONG! Value starts as undefined (uncontrolled) and becomes a string (controlled)
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}`,
        correctedCode: `import { useState } from 'react';

function GoodForm() {
  const [value, setValue] = useState(''); // CORRECT! Initial state is a defined string
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}`,
        explanation: 'If the value of an input starts as `undefined` or `null`, React flags it as uncontrolled. Setting it to a string later triggers a console warning about changing component type.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the main difference between controlled and uncontrolled components?',
        answer: 'Controlled components have their value managed by React state, making it easy to validate inputs dynamically. Uncontrolled components store their values directly in the DOM, accessed via React refs when needed.',
        level: 'beginner'
      },
      {
        question: 'Why do you get a "changing an uncontrolled input to be controlled" warning, and how do you fix it?',
        answer: 'This warning occurs when you initialize state to `null` or `undefined` and bind it to an input’s value. To fix it, always initialize form state with fallback values (like an empty string `""` or `false`).',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'api-calls',
    title: 'API Calls',
    category: 'Dynamic UI & Networking',
    description: 'Learn fetch, axios, debouncing, JWT authentication headers, and network loading states.',
    definition: {
      what: 'API Calls refer to sending HTTP requests (GET, POST, etc.) to backend servers to fetch, update, or delete data.',
      why: 'This connects your static frontend application to databases, authentication services, and third-party APIs.',
      when: 'Whenever the component needs to load external data (e.g. user accounts, catalog details, server states) or submit user data.'
    },
    theory: {
      internalBehavior: 'API calls are asynchronous side-effects. They must be executed inside handlers or within a `useEffect` hook to prevent blocking the render cycle. When calling APIs inside `useEffect`, always clean up pending requests using an `AbortController` to prevent memory leaks and state updates on unmounted components (race conditions).',
      coreConcepts: '• Asynchronous Promises: Fetching data without blocking the UI thread.\n• Network States: Tracking loading, success, and error states to keep the user informed.\n• Debouncing: Delaying API requests until a user stops typing to avoid rate limits.'
    },
    syntax: {
      explanation: 'Use the `async/await` syntax inside event handlers or `useEffect` to fetch data.',
      code: `useEffect(() => {
  const loadData = async () => {
    const res = await fetch('/api/endpoint');
    const data = await res.json();
    setData(data);
  };
  loadData();
}, []);`
    },
    examples: {
      beginner: {
        title: 'Simple Fetch inside useEffect',
        code: `import { useState, useEffect } from 'react';

export default function SimpleFetch() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=3')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading data...</p>;
  return (
    <ul>
      {data.map((post: any) => <li key={post.id} className="text-xs">{post.title}</li>)}
    </ul>
  );
}`,
        explanation: 'Fetches a limited list of posts and displays a loading indicator while the request is in flight.'
      },
      intermediate: {
        title: 'Fetch with Axios and Error Handling',
        code: `import { useState, useEffect } from 'react';

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://api.escuelajs.co/api/v1/products?limit=5');
        if (!res.ok) throw new Error('API failed to respond');
        const data = await res.json();
        if (active) setProducts(data);
      } catch (err: any) {
        if (active) setError(err.message);
      }
    };
    fetchProducts();
    return () => { active = false; };
  }, []);

  if (error) return <p className="text-rose-500">Error: {error}</p>;
  return <div>Loaded {products.length} products.</div>;
}`,
        explanation: 'Uses a boolean flag (`active`) inside `useEffect` to prevent updating state if the component unmounts before the request completes.'
      },
      realWorld: {
        title: 'Auth-protected Fetch with Debounce Search',
        code: `import { useState, useEffect } from 'react';

// Custom hook to debounce values
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchEngine() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery) return;
    
    const searchApi = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch(\`https://api.github.com/search/repositories?q=\${debouncedQuery}\`, {
          headers: {
            'Authorization': \`Bearer \${token}\`
          }
        });
        const data = await res.json();
        setResults(data.items || []);
      } catch (err) {
        console.error('Fetch aborted or failed', err);
      }
    };

    searchApi();
  }, [debouncedQuery]);

  return (
    <div className="space-y-4">
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
        className="w-full border p-2 text-black" 
        placeholder="Type to search GitHub..."
      />
      <div className="text-xs space-y-1">
        {results.map((r: any) => <div key={r.id}>{r.full_name}</div>)}
      </div>
    </div>
  );
}`,
        explanation: 'Enterprise-grade search input combining value debouncing and custom authorization headers.'
      }
    },
    notes: {
      bestPractices: [
        'Always implement cleanups (like using AbortController) to cancel pending requests when a component unmounts.',
        'Handle loading and error states explicitly to build user-friendly interfaces.'
      ],
      performanceTips: [
        'Debounce search inputs to avoid triggering API requests on every keystroke, reducing server load and client-side processing.'
      ],
      interviewPoints: [
        'Explain how race conditions occur in API calls when a user rapidly changes search criteria, and how cleanups solve this.',
        'Understand the structure of JWT Authorization headers: `Bearer <token>`.'
      ]
    },
    commonMistakes: [
      {
        title: 'Ignoring Race Conditions in Search UI',
        wrongCode: `useEffect(() => {
  // If search changes rapidly, older requests might resolve AFTER newer ones, showing stale data
  fetch(\`/api/search?q=\${query}\`)
    .then(res => res.json())
    .then(data => setResults(data));
}, [query]);`,
        correctedCode: `useEffect(() => {
  let isCurrent = true;
  fetch(\`/api/search?q=\${query}\`)
    .then(res => res.json())
    .then(data => {
      if (isCurrent) setResults(data);
    });
  return () => { isCurrent = false; }; // Prevents stale state updates
}, [query]);`,
        explanation: 'Network requests resolve at variable times. Using an execution flag or aborting pending requests ensures only the latest request updates the state.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is a race condition in data fetching and how do you prevent it?',
        answer: 'A race condition occurs when multiple asynchronous network requests are fired in sequence, and a slower, older request resolves AFTER a faster, newer one, updating state with stale data. It can be prevented by canceling requests using `AbortController` or by using a boolean flag inside the effect.',
        level: 'intermediate'
      },
      {
        question: 'What is debouncing and why is it used for search inputs?',
        answer: 'Debouncing delays executing an API request until the user has stopped typing for a specified time (e.g. 400ms). This prevents spamming the server with requests on every keystroke.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'routing',
    title: 'Routing',
    category: 'Dynamic UI & Networking',
    description: 'Understand client-side routing, protected routes, nested routes, and route parameters.',
    definition: {
      what: 'Routing is the process of mapping URL paths to specific React components to allow page navigation without reloading the entire application.',
      why: 'It enables single-page applications to have multiple navigation states, sharing deep links, while retaining local state memory.',
      when: 'Whenever your application requires multiple pages (e.g. home, settings, dashboard, profiles) with distinct URLs.'
    },
    theory: {
      internalBehavior: 'Client-side routers use the browser’s History API (`pushState`, `replaceState`, and `popstate` events) to update the URL in the address bar without requesting a new document from the server. The router intercept clicks on layout anchors and renders matching components dynamically based on URL patterns.',
      coreConcepts: '• Client-Side Routing: Changing page views dynamically without reloading the document.\n• Protected Routes: Guards that redirect unauthorized users away from private paths.\n• Nested Routes: Rendering nested component layouts within parent templates.'
    },
    syntax: {
      explanation: 'Define paths and their corresponding component trees inside a router configuration.',
      code: `<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/profile/:id" element={<Profile />} />
</Routes>`
    },
    examples: {
      beginner: {
        title: 'Basic Navigation Anchors',
        code: `// Minimal Mock Link component implementation
export function Navigation() {
  return (
    <nav className="flex gap-4 p-2 bg-zinc-100">
      <a href="/" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/'); }}>Home</a>
      <a href="/about" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/about'); }}>About</a>
    </nav>
  );
}`,
        explanation: 'Demonstrates manual client-side routing using the browser’s History API and click interception.'
      },
      intermediate: {
        title: 'Nested Route Layout Rendering',
        code: `import React from 'react';

// Parent Layout Component
export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-1/4 bg-zinc-900 text-white p-4">Admin Sidebar</aside>
      <main className="w-3/4 p-6 bg-slate-50">
        {/* Child components render here */}
        {children}
      </main>
    </div>
  );
}`,
        explanation: 'Enables nested routing where child components inherit and render inside parent layout structures.'
      },
      realWorld: {
        title: 'Protected Route Wrapper Component',
        code: `import React from 'react';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  fallbackPath: string;
  children: React.ReactNode;
}

export default function ProtectedRoute({ isAuthenticated, fallbackPath, children }: ProtectedRouteProps) {
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      setRedirecting(true);
      // Simulate client routing redirect
      window.history.replaceState({}, '', fallbackPath);
    }
  }, [isAuthenticated, fallbackPath]);

  if (!isAuthenticated) {
    return <div className="p-4 text-xs text-zinc-500">Redirecting to authorization gateway...</div>;
  }

  return <>{children}</>;
}`,
        explanation: 'A route guard that checks authentication and redirects unauthorized users away from private sub-pages.'
      }
    },
    notes: {
      bestPractices: [
        'Use standard Link elements instead of native anchors (`<a>`) to prevent triggering full page reloads.',
        'Keep route parameters typed and validated.'
      ],
      performanceTips: [
        'Utilize dynamic imports (`React.lazy`) to code-split route components, reducing the size of the initial bundle.'
      ],
      interviewPoints: [
        'Be ready to explain how client-side routing works without triggering server-side document requests.',
        'Contrast `pushState` (creates a new history entry) with `replaceState` (overwrites the current history entry).'
      ]
    },
    commonMistakes: [
      {
        title: 'Using Native HTML Anchors',
        wrongCode: `function BadNavBar() {
  // WRONG! Triggers a full page reload, wiping out React state
  return <a href="/settings">Settings</a>;
}`,
        correctedCode: `// CORRECT! Intercepts clicks to keep navigation client-side
import { Link } from './MockRouter'; // representative

function GoodNavBar() {
  return <Link to="/settings">Settings</Link>;
}`,
        explanation: 'Native `<a>` tags with `href` force the browser to request a new page from the server, resetting all active React state.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How does client-side routing differ from server-side routing?',
        answer: 'Client-side routing updates the URL and renders matching components dynamically in JavaScript using the History API without reloading the page. Server-side routing sends a new request to the server, which returns a completely new HTML document.',
        level: 'beginner'
      },
      {
        question: 'What is a nested route and how does React Router support it?',
        answer: 'A nested route displays a child component inside a parent component’s layout (e.g. rendering a settings page inside a dashboard template). It is supported using the `<Outlet />` component, which acts as a placeholder for nested route elements.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'state-management',
    title: 'State Management',
    category: 'Advanced React & State',
    description: 'Learn prop drilling, Context API, Zustand/Redux concepts, and state scoping.',
    definition: {
      what: 'State Management is the practice of storing, updating, and distributing data across multiple components in a React application.',
      why: 'As apps grow, passing data down through props (Prop Drilling) becomes tedious and hard to maintain. Global state management provides a central database accessible to any component.',
      when: 'Use global state management for application-wide data (like auth user session, active UI themes, or shopping carts).'
    },
    theory: {
      internalBehavior: 'The React Context API acts as a dependency injection mechanism. It allows a provider to broadcast data to all consuming children down the tree. However, when the context value changes, ALL components that consume that context will re-render, even if they only use a field that did not change. External libraries like Zustand or Redux solve this by using selectors to subscribe components to specific, isolated pieces of state, avoiding unnecessary re-renders.',
      coreConcepts: '• Prop Drilling: Passing state through intermediate components that do not need it.\n• Context API: React’s built-in system to share state without prop drilling.\n• Selector Subscriptions: Subscribing to specific pieces of state to prevent unnecessary re-renders.'
    },
    syntax: {
      explanation: 'Create a Context, define a Provider, and consume the state using `useContext`.',
      code: `const ThemeContext = createContext('dark');
const theme = useContext(ThemeContext);`
    },
    examples: {
      beginner: {
        title: 'Minimal Context API Theme Provider',
        code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext<string>('dark');

export default function ThemePanel() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={theme}>
      <Card />
    </ThemeContext.Provider>
  );
}

function Card() {
  const theme = useContext(ThemeContext);
  return <div className={theme === 'dark' ? 'bg-black text-white' : 'bg-white'}>Content</div>;
}`,
        explanation: 'Shares a simple theme state down the component tree using React Context.'
      },
      intermediate: {
        title: 'Custom Hook Context Wrapper',
        code: `import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: string | null;
  login: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const login = (name: string) => setUser(name);

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}`,
        explanation: 'Enforces type safety and simplifies usage by wrapping Context consumption in a custom hook.'
      },
      realWorld: {
        title: 'Zustand Store Selector Pattern',
        code: `import { create } from 'zustand';

interface StoreState {
  cart: string[];
  addToCart: (item: string) => void;
  clearCart: () => void;
}

// Global store creation using Zustand
export const useCartStore = create<StoreState>((set) => ({
  cart: [],
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  clearCart: () => set({ cart: [] })
}));

export function CartCount() {
  // Selector pattern: only triggers re-renders when cart length changes
  const count = useCartStore(state => state.cart.length);
  return <span className="font-bold text-xs">{count} Items</span>;
}`,
        explanation: 'A production-style Zustand store utilizing selectors to subscribe components to specific, isolated pieces of state.'
      }
    },
    notes: {
      bestPractices: [
        'Use Context API for low-frequency updates (like theme or auth settings). Use external libraries (Zustand, Redux) for high-frequency updates.',
        'Expose context states through custom hooks (e.g. `useAuth()`) to provide clear error messages and type safety.'
      ],
      performanceTips: [
        'Avoid wrapping the entire application in a single massive Context Provider, as any change to the context value will trigger re-renders across all consumer components.'
      ],
      interviewPoints: [
        'Explain Context render behavior: any change to the provider’s value object triggers re-renders in all consuming descendants, bypassing memoization.',
        'Describe how libraries like Zustand prevent unnecessary renders using selector functions.'
      ]
    },
    commonMistakes: [
      {
        title: 'Passing Unmemoized Value Object to Provider',
        wrongCode: `function BadProvider({ children }) {
  const [user, setUser] = useState(null);
  // WRONG! Generates a new object reference on every render, triggering updates in all children
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}`,
        correctedCode: `import { useMemo, useState } from 'react';

function GoodProvider({ children }) {
  const [user, setUser] = useState(null);
  // CORRECT! Memoize the value object to retain reference stability
  const contextValue = useMemo(() => ({ user, setUser }), [user]);
  
  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}`,
        explanation: 'Passing inline objects directly to Providers generates a new reference on every render, triggering unnecessary re-renders in all consumer components.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Does React Context replace state management libraries like Redux or Zustand?',
        answer: 'No. React Context is a dependency injection tool, not a state manager. It lacks performance optimizations (like selectors) for high-frequency updates, which are standard in libraries like Redux or Zustand.',
        level: 'intermediate'
      },
      {
        question: 'Why should you memoize the value object passed to a Context Provider?',
        answer: 'If the provider’s value object is not memoized, it gets recreated on every render, triggering unnecessary re-renders in all consuming components even if the state values did not change.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    category: 'Advanced React & State',
    description: 'Learn memoization with useMemo, useCallback, React.memo, lazy loading, and Suspense.',
    definition: {
      what: 'Performance Optimization refers to techniques (like memoization, lazy loading, and code splitting) that reduce component render times and initial bundle sizes.',
      why: 'Unoptimized React apps can suffer from rendering lag, slow load times, and choppy animations due to redundant calculations and large bundle sizes.',
      when: 'Implement these techniques when dealing with complex rendering trees, expensive calculations, or large datasets.'
    },
    theory: {
      internalBehavior: 'When a component renders, React recursively re-renders all of its children. `React.memo` is a higher-order component that performs a shallow comparison of props, skipping re-renders if props did not change. `useMemo` caches the result of an expensive calculation between renders, while `useCallback` caches the function instance itself.',
      coreConcepts: '• Memoization: Caching computed values or components to prevent redundant renders.\n• Code Splitting: Splitting the app bundle into smaller chunks that load on demand.\n• Suspense: Showing placeholder UI (like loading spinners) while async assets are loaded.'
    },
    syntax: {
      explanation: 'Wrap values in `useMemo` or functions in `useCallback` with dependency arrays.',
      code: `const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a), [a]);`
    },
    examples: {
      beginner: {
        title: 'Caching Calculations with useMemo',
        code: `import { useState, useMemo } from 'react';

export default function ExpensiveMath() {
  const [num, setNum] = useState(1);
  const [count, setCount] = useState(0);

  // Expensive calculation cached using useMemo
  const factorial = useMemo(() => {
    console.log('Calculating factorial...');
    let result = 1;
    for (let i = 1; i <= num; i++) result *= i;
    return result;
  }, [num]);

  return (
    <div>
      <button onClick={() => setNum(n => n + 1)}>Increase Num</button>
      <button onClick={() => setCount(c => c + 1)}>Rerender ({count})</button>
      <p>Factorial: {factorial}</p>
    </div>
  );
}`,
        explanation: 'Ensures the expensive factorial calculation is only re-run when the `num` variable changes.'
      },
      intermediate: {
        title: 'Preventing Child Rerenders with React.memo',
        code: `import React, { useState, useCallback } from 'react';

// Memoized child component
const MemoButton = React.memo(({ onClick }: { onClick: () => void }) => {
  console.log('MemoButton rendered');
  return <button onClick={onClick}>Trigger Action</button>;
});

export default function ParentPanel() {
  const [state, setState] = useState(0);

  // Memoize callback to preserve reference stability
  const handleClick = useCallback(() => {
    console.log('Action triggered');
  }, []);

  return (
    <div className="space-y-4">
      <button onClick={() => setState(s => s + 1)}>Rerender Parent ({state})</button>
      <MemoButton onClick={handleClick} />
    </div>
  );
}`,
        explanation: 'Combines React.memo and useCallback to prevent the child button from re-rendering when the parent’s state changes.'
      },
      realWorld: {
        title: 'Lazy Loading Route Component with Suspense',
        code: `import React, { Suspense, lazy } from 'react';

// Lazy load the component
const HeavyChart = lazy(() => import('./HeavyChartComponent'));

export default function AnalyticsDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Analytics Panel</h1>
      <Suspense fallback={<div className="text-xs text-zinc-500">Loading charts...</div>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}`,
        explanation: 'Uses lazy loading to split a heavy chart component out of the main bundle, loading it only when the dashboard mounts.'
      }
    },
    notes: {
      bestPractices: [
        'Do not wrap every function in `useCallback` or every value in `useMemo`. Only use them for expensive operations or to preserve reference stability.',
        'Always combine `useCallback` with `React.memo` when passing callback functions to child components.'
      ],
      performanceTips: [
        'Use Chrome DevTools Profile tab or React Developer Tools Profiler to identify and fix rendering bottlenecks.'
      ],
      interviewPoints: [
        'Explain how `React.memo` performs shallow comparisons of props.',
        'Understand that memoization adds overhead; using it on cheap calculations can actually reduce performance.'
      ]
    },
    commonMistakes: [
      {
        title: 'Omitted Dependencies in useCallback',
        wrongCode: `import { useState, useCallback } from 'react';

function BadComponent() {
  const [value, setValue] = useState('');
  
  // WRONG! Empty dependencies array freezes value reference at its initial state
  const logValue = useCallback(() => {
    console.log('Current value:', value);
  }, []); 

  return <button onClick={logValue}>Log</button>;
}`,
        correctedCode: `import { useState, useCallback } from 'react';

function GoodComponent() {
  const [value, setValue] = useState('');
  
  // CORRECT! Added value to dependency array to track updates
  const logValue = useCallback(() => {
    console.log('Current value:', value);
  }, [value]);

  return <button onClick={logValue}>Log</button>;
}`,
        explanation: 'Omitting variables from the dependencies array freezes closures, causing hooks to read stale variables from older render cycles.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How do useMemo and useCallback differ?',
        answer: '`useMemo` caches the value returned by a function, while `useCallback` caches the function instance itself, preventing recreation on subsequent renders.',
        level: 'intermediate'
      },
      {
        question: 'Does React.memo prevent a component from re-rendering if its internal state changes?',
        answer: 'No. `React.memo` only checks if the component’s props have changed. If the component’s internal state or context changes, it will still re-render normally.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'react-internals',
    title: 'React Internals',
    category: 'Advanced React & State',
    description: 'Learn the Render vs Commit phase, Fiber nodes, and the diffing algorithm.',
    definition: {
      what: 'React Internals refer to the underlying architecture (such as the render/commit lifecycle, Fiber nodes, and diffing algorithm) that manages UI rendering.',
      why: 'Understanding how React works under the hood makes it easier to write high-performance code, debug complex layout states, and pass advanced interviews.',
      when: 'Study React internals when optimizing complex rendering pipelines or handling layout shift issues.'
    },
    theory: {
      internalBehavior: 'React split operations into two distinct phases: 1. **Render Phase**: React crawls the tree, evaluates component function calls, builds the Virtual DOM, and compares it with the old tree (diffing). This phase is asynchronous and can be paused or restarted by React Fiber. 2. **Commit Phase**: React applies the changes to the real DOM (via methods like `appendChild` or `removeChild`). This phase is synchronous and blocking to ensure the UI stays consistent.',
      coreConcepts: '• Render Phase: Computes diffs (asynchronous, interruptible).\n• Commit Phase: Mutates the DOM (synchronous, blocking).\n• Fiber Node: React’s internal data structure representing a component’s state and relationships.'
    },
    syntax: {
      explanation: 'React internals are abstracted away, but you can inspect Fiber nodes using React Developer Tools.',
      code: `// React Fiber node internal representation (simplified)
interface FiberNode {
  type: any;
  key: string | null;
  stateNode: any; // Reference to real DOM node or class instance
  child: FiberNode | null;
  sibling: FiberNode | null;
  return: FiberNode | null; // Link to parent
  memoizedState: any; // Cached state of hooks
}`
    },
    examples: {
      beginner: {
        title: 'Triggering Render vs Commit Phases',
        code: `import { useState, useEffect, useLayoutEffect } from 'react';

export default function RenderLogger() {
  const [count, setCount] = useState(0);

  // 1. Render Phase runs during evaluation
  console.log('Evaluating/Render Phase:', count);

  // 2. Commit Phase runs and updates the DOM
  useLayoutEffect(() => {
    console.log('DOM Mutated (Before Paint)');
  }, [count]);

  useEffect(() => {
    console.log('Render Painted (After Paint)');
  }, [count]);

  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}`,
        explanation: 'Logs the execution order of evaluation (Render phase) vs DOM mutation/painting (Commit phase).'
      },
      intermediate: {
        title: 'Inspecting Component Types for Reconciliation',
        code: `import { useState } from 'react';

function TextElement() {
  return <p>Active text node</p>;
}

function SpanElement() {
  return <span>Active text node</span>;
}

export default function TypeDiffTester() {
  const [isParagraph, setIsParagraph] = useState(true);

  return (
    <div>
      <button onClick={() => setIsParagraph(prev => !prev)}>Toggle Type</button>
      {/* 
        Toggling forces React to detect a type mismatch (p vs span), 
        tearing down and rebuilding the entire DOM node.
      */}
      {isParagraph ? <TextElement /> : <SpanElement />}
    </div>
  );
}`,
        explanation: 'Demonstrates React reconciliation. When element tags change, React destroys the previous tree nodes and rebuilds them.'
      },
      realWorld: {
        title: 'Simulating Batching and Fiber Scheduling Priorities',
        code: `import { useState, useTransition } from 'react';

export default function ConcurrentSearch() {
  const [query, setQuery] = useState('');
  const [list, setList] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // High priority: update input value instantly
    setQuery(val);

    // Low priority: defer rendering search results to keep input responsive
    startTransition(() => {
      const items = Array.from({ length: 5000 }, (_, i) => \`\${val} Result \${i}\`);
      setList(items);
    });
  };

  return (
    <div className="space-y-2">
      <input value={query} onChange={handleSearchChange} placeholder="Search database..." />
      {isPending && <p>Scheduling update...</p>}
      <ul>
        {list.slice(0, 5).map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>
    </div>
  );
}`,
        explanation: 'Uses `useTransition` to split state updates into high-priority (input typing) and low-priority (list filtering) tasks.'
      }
    },
    notes: {
      bestPractices: [
        'Avoid changing the element type at the root of a component conditionally, as this triggers full DOM rebuilds.',
        'Use `useTransition` or `useDeferredValue` for low-priority updates to keep the UI responsive.'
      ],
      performanceTips: [
        'Keep components lightweight. The render phase evaluates all active component functions in the tree; deep component trees increase render phase duration.'
      ],
      interviewPoints: [
        'State the main difference between Render and Commit phases: Render is asynchronous/interruptible, while Commit is synchronous/blocking.',
        'Be ready to explain the React diffing heuristics: 1. Two elements of different types will produce different trees. 2. Sibling elements can be matched across renders using keys.'
      ]
    },
    commonMistakes: [
      {
        title: 'Side Effects in the Render Path',
        wrongCode: `function BadComponent() {
  // WRONG! Side effects must not run during the evaluation (Render phase)
  localStorage.setItem('visited', 'true');
  
  return <div>Welcome</div>;
}`,
        correctedCode: `import { useEffect } from 'react';

function GoodComponent() {
  // CORRECT! Run side effects inside useEffect after the render phase completes
  useEffect(() => {
    localStorage.setItem('visited', 'true');
  }, []);

  return <div>Welcome</div>;
}`,
        explanation: 'React can run the Render phase multiple times before committing changes to the DOM. Running side effects inside the render path causes duplicate logs, state issues, and performance degradation.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between the Render Phase and the Commit Phase?',
        answer: 'The Render Phase runs asynchronously to evaluate components, build the Virtual DOM, and compute differences (diffs). The Commit Phase runs synchronously to apply those computed changes directly to the real DOM.',
        level: 'advanced'
      },
      {
        question: 'How does React’s Reconciliation algorithm optimize tree diffing?',
        answer: 'React uses O(n) heuristics: 1. If elements have different types, React completely tears down the old tree and builds a new one. 2. It matches list elements across renders using unique, stable `key` props.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'ssr-hydration',
    title: 'SSR & Hydration',
    category: 'Advanced React & State',
    description: 'Learn Server-Side Rendering (SSR) vs CSR, hydration, and React Server Components (RSC).',
    definition: {
      what: 'Server-Side Rendering (SSR) is the process of generating HTML on the server and sending it to the browser. Hydration is the process of attaching event listeners to that HTML to make it interactive.',
      why: 'SSR improves initial page load times and Search Engine Optimization (SEO) by delivering pre-rendered content directly to the browser.',
      when: 'Use SSR for public-facing websites, e-commerce stores, or content portals where SEO and page load performance are critical.'
    },
    theory: {
      internalBehavior: 'In Client-Side Rendering (CSR), the server returns an empty HTML shell, and JavaScript builds the entire page. In SSR, the server pre-renders components into static HTML. When JavaScript loads in the browser, it reconciles the DOM structure generated by the server with the React component tree (Hydration). If the server-rendered HTML and client-rendered tree do not match, React throws a "hydration mismatch" warning.',
      coreConcepts: '• SSR vs CSR: Server-rendered HTML vs client-side JavaScript rendering.\n• Hydration: Binding JavaScript event handlers to server-rendered static HTML.\n• Hydration Mismatch: Differences between server HTML and initial client render.'
    },
    syntax: {
      explanation: 'Render components on the server using `renderToString`, and hydrate them in the browser using `hydrateRoot`.',
      code: `// Browser (Client Entry)
import { hydrateRoot } from 'react-dom/client';
hydrateRoot(document.getElementById('root')!, <App />);`
    },
    examples: {
      beginner: {
        title: 'Checking Client Mounted Status',
        code: `import { useState, useEffect } from 'react';

export default function ClientOnlyBadge() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="placeholder">Loading badge...</div>;
  return <div className="badge">Active Client Content</div>;
}`,
        explanation: 'Uses a mounting flag inside `useEffect` to defer rendering client-only elements until hydration completes.'
      },
      intermediate: {
        title: 'Preventing Server Mismatch with window Check',
        code: `import { useState, useEffect } from 'react';

export default function WindowDimensions() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Avoid checking 'window' during server rendering to prevent mismatches
  const width = isClient ? window.innerWidth : 1024;

  return <div>Window Width: {width}px</div>;
}`,
        explanation: 'Safely fallbacks to a default value during server rendering, updating with window properties after mounting.'
      },
      realWorld: {
        title: 'Server Component vs Client Component Pattern',
        code: `// Theoretical Server Component (RSC)
// Runs only on the server, can fetch databases directly
export async function ServerCard() {
  // const data = await db.query('SELECT * FROM users');
  const user = { name: 'Sarah Server' };
  
  return (
    <div className="border p-4 bg-zinc-950 text-white">
      <h2>Server Component Content</h2>
      <p>Fetched from server database: {user.name}</p>
      {/* Client Component nested inside Server Component */}
      <ClientButton />
    </div>
  );
}

// Client Component
// 'use client';
import { useState } from 'react';

export function ClientButton() {
  const [active, setActive] = useState(false);
  return <button onClick={() => setActive(!active)}>{active ? 'ON' : 'OFF'}</button>;
}`,
        explanation: 'Demonstrates nesting a client component within a server-rendered layout (React Server Components pattern).'
      }
    },
    notes: {
      bestPractices: [
        'Avoid referencing client-only globals (like `window`, `document`, or `localStorage`) during initial render cycles.',
        'Use mounting flags inside `useEffect` to safely render client-only components after hydration.'
      ],
      performanceTips: [
        'Stream HTML from the server to allow the browser to start parsing the page before the entire document is generated.'
      ],
      interviewPoints: [
        'Understand hydration mismatches: they occur when content (like timestamps, language settings, or randomly generated text) differs between server and client rendering.',
        'Explain React Server Components (RSC): components that run exclusively on the server, reducing the JavaScript bundle size sent to the client.'
      ]
    },
    commonMistakes: [
      {
        title: 'Accessing window Directly in Render',
        wrongCode: `function BadWidth() {
  // WRONG! Throws "window is not defined" error during server rendering
  const width = window.innerWidth;
  return <div>Width: {width}</div>;
}`,
        correctedCode: `import { useState, useEffect } from 'react';

function GoodWidth() {
  const [width, setWidth] = useState(0);

  // CORRECT! Access browser globals inside useEffect after mounting
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  return <div>Width: {width || 'Loading...'}</div>;
}`,
        explanation: 'Server runtimes (like Node.js) lack browser-specific objects (like `window` or `document`), causing crashes if they are accessed during server rendering.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is hydration in React SSR?',
        answer: 'Hydration is the process where React runs in the browser to bind event listeners and attach client-side state to the static HTML received from the server, making the page interactive.',
        level: 'intermediate'
      },
      {
        question: 'What causes a hydration mismatch error and how do you resolve it?',
        answer: 'Hydration mismatches occur when the HTML pre-rendered on the server does not match the initial HTML rendered in the browser. It can be resolved by avoiding dynamic values (like random numbers or timestamps) during the initial render or by using mounting flags inside `useEffect`.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'advanced-patterns',
    title: 'Advanced Patterns',
    category: 'Production Engineering',
    description: 'Learn Higher-Order Components, Render Props, Compound Components, and Error Boundaries.',
    definition: {
      what: 'Advanced Patterns refer to design patterns (like Compound Components, HOCs, and Render Props) used to build reusable, clean, and flexible React components.',
      why: 'Standard patterns can lead to duplicate component logic, stiff configurations, or full app crashes due to unhandled JavaScript errors.',
      when: 'Use these patterns when building complex UI components (like dropdown lists, tabs, or modal forms) or creating reusable wrapper utilities.'
    },
    theory: {
      internalBehavior: 'Compound Components share state implicitly among children using React Context, allowing clean, flexible layout structures. Higher-Order Components (HOCs) wrap a component to inject extra props. Error Boundaries use the class component lifecycle method `componentDidCatch` to intercept rendering errors and display fallback UI instead of crashing the entire page.',
      coreConcepts: '• Compound Components: Multiple components working together with shared state.\n• Higher-Order Components (HOC): Functions that wrap a component to extend its functionality.\n• Error Boundary: A class component that catches rendering errors in its child tree.'
    },
    syntax: {
      explanation: 'Implement Compound Components using a shared React Context.',
      code: `const TabsContext = createContext(null);
export function Tabs({ children }) { ... }
export function Tab({ label }) { ... }`
    },
    examples: {
      beginner: {
        title: 'Higher-Order Component Pattern',
        code: `import React from 'react';

// HOC wrapping components to inject log triggers
export function withLogger<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function LoggedComponent(props: P) {
    React.useEffect(() => {
      console.log('Component mounted with props:', props);
    }, [props]);

    return <WrappedComponent {...props} />;
  };
}`,
        explanation: 'Creates a higher-order component that wraps any input component and logs its props on mount.'
      },
      intermediate: {
        title: 'Error Boundary Class Component',
        code: `import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; fallback: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}`,
        explanation: 'Implements a standard Error Boundary using class lifecycle methods to catch rendering crashes.'
      },
      realWorld: {
        title: 'Flexible Compound Select Component',
        code: `import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectContextType {
  activeValue: string;
  onSelect: (val: string) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

// Parent Component
export function CustomSelect({ children, defaultValue }: { children: ReactNode; defaultValue: string }) {
  const [activeValue, setActiveValue] = useState(defaultValue);
  return (
    <SelectContext.Provider value={{ activeValue, onSelect: setActiveValue }}>
      <div className="border border-zinc-700 rounded-lg p-2 bg-zinc-900">{children}</div>
    </SelectContext.Provider>
  );
}

// Child Component
export function SelectOption({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(SelectContext);
  if (!context) throw new Error('Option must be used within a CustomSelect');

  const isSelected = context.activeValue === value;
  return (
    <div
      onClick={() => context.onSelect(value)}
      className={\`p-2 rounded cursor-pointer text-xs transition-colors \${
        isSelected ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'
      }\`}
    >
      {children}
    </div>
  );
}`,
        explanation: 'A flexible Compound Select component that handles selection state internally, allowing clean nesting without manually drilling props to every option.'
      }
    },
    notes: {
      bestPractices: [
        'Use Compound Components to build clean, customizable UI elements.',
        'Always wrap application sections in Error Boundaries to prevent runtime rendering crashes from taking down the entire website.'
      ],
      performanceTips: [
        'Ensure context values inside compound components are memoized to avoid triggering re-renders in all option children on minor state changes.'
      ],
      interviewPoints: [
        'Explain why Error Boundaries must be class components: functional components do not support lifecycle hooks like `componentDidCatch` or `getDerivedStateFromError`.',
        'Contrast HOCs (functions wrapping components) with Render Props (components accepting a render function as a prop).'
      ]
    },
    commonMistakes: [
      {
        title: 'Throwing Errors inside Async Blocks in Error Boundary',
        wrongCode: `function BrokenComponent() {
  const loadData = () => {
    // WRONG! Error Boundaries cannot catch errors thrown inside asynchronous functions
    setTimeout(() => { throw new Error('Async error!'); }, 100);
  };
  return <button onClick={loadData}>Trigger Error</button>;
}`,
        correctedCode: `import { useState } from 'react';

function FixedComponent() {
  const [error, setError] = useState<Error | null>(null);

  if (error) throw error; // CORRECT! Throw in render path to catch inside ErrorBoundary

  const loadData = () => {
    setTimeout(() => {
      try {
        throw new Error('Async error!');
      } catch (err: any) {
        setError(err); // Force state update to trigger throw in render
      }
    }, 100);
  };

  return <button onClick={loadData}>Trigger Error</button>;
}`,
        explanation: 'Error Boundaries only catch errors thrown during React’s rendering phase. To catch asynchronous errors, update the component’s state and throw during the subsequent render loop.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Can you implement an Error Boundary using functional components?',
        answer: 'No, because functional components do not support lifecycle hooks like `componentDidCatch` or `getDerivedStateFromError`, which are required to capture errors in the render tree.',
        level: 'intermediate'
      },
      {
        question: 'What are the main advantages of using the Compound Component pattern?',
        answer: 'It encapsulates state management inside the parent component while offering flexible layout nesting. This allows users of the component to rearrange elements without drilling props manually to each child.',
        level: 'advanced'
      }
    ]
  },
  {
    id: 'typescript-react',
    title: 'TypeScript with React',
    category: 'Production Engineering',
    description: 'Learn typing component props, events, hooks, generics, and CSS styles.',
    definition: {
      what: 'TypeScript with React is the practice of adding static type definitions to React props, states, event handlers, and references.',
      why: 'It catches syntax and typing errors during development, provides autocompletion, and simplifies codebase maintenance.',
      when: 'Use TypeScript on all React projects to ensure type safety and build robust codebases.'
    },
    theory: {
      internalBehavior: 'TypeScript compiles code into clean JavaScript while verifying types during build time. React provides built-in types (like `React.FC`, `React.ReactNode`, `React.CSSProperties`, and event types like `React.ChangeEvent`) to simplify typing components, props, hooks, and event handlers.',
      coreConcepts: '• Static Typing: Catching errors during compilation instead of at runtime.\n• Generic Components: Creating components that accept dynamic types for flexible prop handling.'
    },
    syntax: {
      explanation: 'Define props structures using TypeScript interfaces or types.',
      code: `interface ButtonProps {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
export function Button({ label, onClick }: ButtonProps) { ... }`
    },
    examples: {
      beginner: {
        title: 'Typing Functional Props and Styles',
        code: `import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warn' | 'error';
  style?: React.CSSProperties;
}

export default function Badge({ label, variant = 'success', style }: BadgeProps) {
  const color = variant === 'success' ? 'bg-emerald-500' : 'bg-rose-500';
  return (
    <span style={style} className={\`px-2 py-0.5 text-xs rounded text-white \${color}\`}>
      {label}
    </span>
  );
}`,
        explanation: 'Declares prop structures, default values, and inline styling configurations using TypeScript.'
      },
      intermediate: {
        title: 'Typing HTML Inputs and Event Handlers',
        code: `import React, { useState } from 'react';

export default function TypedInput() {
  const [value, setValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') console.log('Submitted value:', value);
  };

  return (
    <input 
      value={value} 
      onChange={handleChange} 
      onKeyDown={handleKeyPress}
      className="border p-2" 
    />
  );
}`,
        explanation: 'Uses React’s built-in event types (`ChangeEvent` and `KeyboardEvent`) to handle input interactions safely.'
      },
      realWorld: {
        title: 'Enterprise Generic List Component',
        code: `import React from 'react';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

// Declaring a Generic Component using TypeScript
export default function GenericList<T>({ items, renderItem }: ListProps<T>) {
  return (
    <div className="divide-y divide-zinc-800">
      {items.map((item, idx) => (
        <div key={idx} className="py-2">
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
}

// Usage Example
export function App() {
  const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
  return (
    <GenericList 
      items={users} 
      renderItem={(user) => <p className="text-sm">{user.name}</p>} 
    />
  );
}`,
        explanation: 'Implements a reusable, type-safe List component using TypeScript generics to handle arbitrary item data structures.'
      }
    },
    notes: {
      bestPractices: [
        'Prefer explicitly typing parameters rather than relying on `any`.',
        'Avoid `React.FC` when declaring components; type props directly in the parameter signature instead to simplify generics usage.'
      ],
      performanceTips: [
        'TypeScript operates solely at build time. Clean code paths and proper typings do not add runtime performance overhead.'
      ],
      interviewPoints: [
        'Explain the difference between `React.ReactNode` (covers elements, strings, numbers, fragments, etc.) and `React.JSX.Element` (only covers JSX element objects).',
        'Describe how to write type-safe Custom Hooks.'
      ]
    },
    commonMistakes: [
      {
        title: 'Using loose types like React.FC with Generics',
        wrongCode: `import React from 'react';

// WRONG! React.FC makes using generics difficult and verbose
const GenericCard: React.FC<{ data: any }> = ({ data }) => {
  return <div>{data}</div>;
};`,
        correctedCode: `import React from 'react';

interface CardProps<T> {
  data: T;
  render: (val: T) => React.ReactNode;
}

// CORRECT! Type props directly, supporting cleaner generics
export default function GenericCard<T>({ data, render }: CardProps<T>) {
  return <div>{render(data)}</div>;
}`,
        explanation: 'Declaring components using `React.FC` restricts generics usage and complicates custom prop interfaces.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between React.ReactNode and React.JSX.Element?',
        answer: '`React.ReactNode` represents any renderable React node (such as strings, numbers, portals, components, or arrays). `React.JSX.Element` only represents a single instantiated JSX element object.',
        level: 'intermediate'
      },
      {
        question: 'How do you type event handlers in React with TypeScript?',
        answer: 'Use React’s built-in event generics, e.g. `React.MouseEvent<HTMLButtonElement>` for button clicks, or `React.ChangeEvent<HTMLInputElement>` for text input changes.',
        level: 'beginner'
      }
    ]
  }
];

// Add the other 13 topics to avoid truncation but still provide comprehensive context.
// Let's programmatically verify we export all 22 topics!
// Wait! Let's write definitions for the remaining 13 topics in the data array to complete all 22 requested topics!
// Topics remaining:
// 11. Forms, 12. API Calls, 13. Routing, 14. State Management, 15. Performance Optimization, 16. React Internals, 17. SSR & Hydration, 18. Advanced Patterns, 19. TypeScript with React, 20. Testing, 21. Security & Best Practices, 22. Company-Grade Architecture.
// Wait! The array above has 10 topics:
// - react-intro (React Introduction)
// - jsx (JSX Syntax)
// - components (Components)
// - props (Props)
// - state (State)
// - event-handling (Event Handling)
// - conditional-rendering (Conditional Rendering)
// - lists-keys (Lists & Keys)
// - hooks (Hooks Overview)
// - useeffect-deep-dive (useEffect Deep Dive)
// - forms (Forms)
// - api-calls (API Calls)
// - routing (Routing)
// - state-management (State Management)
// - performance-optimization (Performance Optimization)
// - react-internals (React Internals)
// - ssr-hydration (SSR & Hydration)
// - advanced-patterns (Advanced Patterns)
// - typescript-react (TypeScript with React)
// Let's add the remaining 3 topics: Testing, Security & Best Practices, and Company-Grade Architecture, to have all 22 topics perfectly fully detailed in this file!
// Let's append them directly to the array:

reactHandbookData.push(
  {
    id: 'testing',
    title: 'Testing',
    category: 'Production Engineering',
    description: 'Learn unit testing with Vitest, React Testing Library, and mock API calls.',
    definition: {
      what: 'Testing in React involves writing automated scripts to verify that components render correctly, handle interactions properly, and behave predictably.',
      why: 'Automated testing catches bugs early, speeds up development, and ensures that code changes do not break existing functionality.',
      when: 'Write tests during development to verify component behavior, test edge cases, and maintain code quality.'
    },
    theory: {
      internalBehavior: 'React Testing Library (RTL) tests components from the user’s perspective. It queries the DOM nodes rendered by the component, simulates user actions, and asserts that the UI updates correctly. Unlike older test frameworks, RTL discourages testing internal component states or implementation details, focusing instead on user-visible behavior.',
      coreConcepts: '• Unit Testing: Testing individual components in isolation.\n• Mocking: Replacing network requests or external dependencies with mock functions to keep tests fast and predictable.'
    },
    syntax: {
      explanation: 'Use test frameworks (like Vitest) to describe tests, render components, and run assertions.',
      code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

test('renders button with label', () => {
  render(<Button label="Submit" />);
  expect(screen.getByRole('button')).toHaveTextContent('Submit');
});`
    },
    examples: {
      beginner: {
        title: 'Testing Render UI Output',
        code: `import { render, screen } from '@testing-library/react';

function UserBadge({ username }: { username: string }) {
  return <div data-testid="badge">User: {username}</div>;
}

// Test Suite
import { expect, test } from 'vitest';

test('renders correct user name badge', () => {
  render(<UserBadge username="Alice" />);
  const badgeElement = screen.getByTestId('badge');
  expect(badgeElement).toHaveTextContent('User: Alice');
});`,
        explanation: 'Verifies that the component renders the expected text content and elements in the DOM.'
      },
      intermediate: {
        title: 'Testing Button Interactions',
        code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { expect, test } from 'vitest';

function ToggleSwitch() {
  const [isOn, setIsOn] = useState(false);
  return <button onClick={() => setIsOn(!isOn)}>{isOn ? 'ON' : 'OFF'}</button>;
}

test('toggles switch value on click event', async () => {
  render(<ToggleSwitch />);
  const button = screen.getByRole('button');
  expect(button).toHaveTextContent('OFF');

  await userEvent.click(button);
  expect(button).toHaveTextContent('ON');
});`,
        explanation: 'Simulates user interactions using `user-event` and asserts that the UI state updates correctly.'
      },
      realWorld: {
        title: 'Testing API Call Fetching state',
        code: `import { render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useEffect, useState } from 'react';

function UserProfile({ fetchApi }: { fetchApi: () => Promise<{ name: string }> }) {
  const [name, setName] = useState('');
  useEffect(() => {
    fetchApi().then(user => setName(user.name));
  }, [fetchApi]);

  return <div>{name ? \`User: \${name}\` : 'Loading...'}</div>;
}

test('mocks API response and updates state', async () => {
  // Mock API service call
  const mockFetch = vi.fn().mockResolvedValue({ name: 'Bob Mock' });
  render(<UserProfile fetchApi={mockFetch} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Wait for the asynchronous API state change to paint the screen
  await waitFor(() => {
    expect(screen.getByText('User: Bob Mock')).toBeInTheDocument();
  });
});`,
        explanation: 'Mocks asynchronous API calls to test loading states and successful resolutions.'
      }
    },
    notes: {
      bestPractices: [
        'Test user-visible behavior (like text content, clicks, and input submissions) instead of internal state values.',
        'Use `user-event` instead of `fireEvent` to simulate user actions, as it triggers all corresponding browser events.'
      ],
      performanceTips: [
        'Clean up mocks after each test using `vi.clearAllMocks()` or `afterEach` hooks to prevent memory leaks and state pollution.'
      ],
      interviewPoints: [
        'Explain why testing implementation details is discouraged: it makes tests brittle and prone to breaking when refactoring code.',
        'Describe how to mock asynchronous requests and use `waitFor` to assert on state changes.'
      ]
    },
    commonMistakes: [
      {
        title: 'Testing Component Internals Directly',
        wrongCode: `test('checks internal component count state', () => {
  const wrapper = render(<Counter />);
  // WRONG! Accessing component internals violates RTL best practices
  expect(wrapper.state('count')).toBe(0); 
});`,
        correctedCode: `test('verifies counter UI updates on click', async () => {
  render(<Counter />);
  // CORRECT! Test behavior by querying elements visible to the user
  const button = screen.getByRole('button', { name: /increment/i });
  expect(screen.getByText('Count: 0')).toBeInTheDocument();

  await userEvent.click(button);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});`,
        explanation: 'Testing internal implementation details makes tests brittle and prone to breaking during refactoring, even if the user-facing behavior remains unchanged.'
      }
    ],
    interviewQuestions: [
      {
        question: 'Why does React Testing Library prioritize querying by role (e.g. getByRole)?',
        answer: 'Querying by role encourages writing accessible markup and ensures tests mirror how users interact with the page (by finding buttons, headings, and input fields rather than arbitrary class names).',
        level: 'intermediate'
      },
      {
        question: 'How do you test asynchronous behaviors like API calls in React?',
        answer: 'Mock the network API calling utility, render the component, and use asynchronous helper utilities (like `waitFor` or `findByText`) to await the state changes and DOM updates.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'security-best-practices',
    title: 'Security & Best Practices',
    category: 'Production Engineering',
    description: 'Learn XSS prevention, HTML sanitization, dependency safety, and clean code paths.',
    definition: {
      what: 'Security & Best Practices refer to steps and coding standards (like preventing XSS attacks, sanitizing HTML, and securing API keys) used to build safe React apps.',
      why: 'Unsecured React apps can expose user sessions, leak private data, or allow malicious scripts to run in users’ browsers.',
      when: 'Apply security best practices on every project, especially when rendering user-generated content or handling sensitive data.'
    },
    theory: {
      internalBehavior: 'React automatically escapes strings printed in JSX to prevent Cross-Site Scripting (XSS) attacks. However, using properties like `dangerouslySetInnerHTML` bypasses this protection, directly injecting raw HTML into the page. If the injected HTML contains user-generated content, malicious scripts could run in the user’s browser. Always sanitize raw HTML using libraries like DOMPurify before injecting it.',
      coreConcepts: '• Cross-Site Scripting (XSS): Injecting malicious scripts into web pages viewed by users.\n• HTML Sanitization: Cleaning raw HTML to strip out script tags, onclick attributes, or inline scripts.'
    },
    syntax: {
      explanation: 'Avoid `dangerouslySetInnerHTML` when possible. If required, sanitize the input first.',
      code: `<div dangerouslySetInnerHTML={{ __html: sanitizedMarkup }} />`
    },
    examples: {
      beginner: {
        title: 'React Built-in Escaping',
        code: `export default function SafeMessage({ content }: { content: string }) {
  // React automatically escapes html string inputs, treating script tags as plain text
  return <div className="p-2 border">{content}</div>;
}`,
        explanation: 'Demonstrates React’s built-in XSS protection, which escapes strings printed in JSX to prevent scripts from executing.'
      },
      intermediate: {
        title: 'Sanitizing User HTML Injections',
        code: `// Simple representative mock sanitization function
function mockSanitize(dirtyHtml: string): string {
  // Strip script tags and alert triggers
  return dirtyHtml.replace(/<script[^>]*>([\\S\\s]*?)<\\/script>/gi, '')
                  .replace(/onload|onerror|onclick/gi, 'no-event');
}

export default function RenderHtml({ rawMarkup }: { rawMarkup: string }) {
  const cleanMarkup = mockSanitize(rawMarkup);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: cleanMarkup }} 
      className="p-4 border border-zinc-700 bg-zinc-900 rounded-lg text-xs" 
    />
  );
}`,
        explanation: 'Sanitizes raw HTML inputs to strip out script tags and malicious attributes before injecting it into the page.'
      },
      realWorld: {
        title: 'Environment Variables and API Guards',
        code: `interface ConfigType {
  apiUrl: string;
  enableLogs: boolean;
}

// Config environment parser with strict type checks
export const Config: ConfigType = {
  // Ensure sensitive API keys are not committed to source code
  apiUrl: import.meta.env.VITE_API_URL || 'https://api.handbook.dev',
  enableLogs: import.meta.env.MODE === 'development'
};

export default function ApiConfigView() {
  return (
    <div className="p-4 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded text-xs">
      <p>Target Endpoint: <span className="font-mono text-white">{Config.apiUrl}</span></p>
      <p>Environment: <span className="font-mono text-white">{import.meta.env.MODE}</span></p>
    </div>
  );
}`,
        explanation: 'Uses environment variables to keep sensitive configuration settings out of the codebase.'
      }
    },
    notes: {
      bestPractices: [
        'Do not commit API keys or client secrets to source code repository logs.',
        'Always sanitize user-generated HTML using DOMPurify before injecting it.'
      ],
      performanceTips: [
        'Keep environment variable parsing utility checks outside of render loops to avoid re-evaluating them on every frame.'
      ],
      interviewPoints: [
        'Explain how React protects against XSS: it converts values to string templates and escapes characters before rendering them.',
        'Understand the risks of using `dangerouslySetInnerHTML` without HTML sanitization.'
      ]
    },
    commonMistakes: [
      {
        title: 'Unescaped dangerouslySetInnerHTML Injection',
        wrongCode: `function BadRenderer({ userComment }) {
  // WRONG! Vulnerable to XSS: userComment could contain script tags that execute in the browser
  return <div dangerouslySetInnerHTML={{ __html: userComment }} />;
}`,
        correctedCode: `function GoodRenderer({ userComment }) {
  // CORRECT! Sanitize the input before injecting it, or render it as text
  return <div>{userComment}</div>;
}`,
        explanation: 'Using `dangerouslySetInnerHTML` bypasses React’s built-in escaping, making the application vulnerable to XSS if the input is not sanitized.'
      }
    ],
    interviewQuestions: [
      {
        question: 'How does React protect applications from Cross-Site Scripting (XSS)?',
        answer: 'React automatically escapes all variables rendered in JSX templates. Before painting the UI, it converts inputs into strings, ensuring script tags are displayed as text rather than executed as code.',
        level: 'beginner'
      },
      {
        question: 'What is the purpose of dangerouslySetInnerHTML and how do you use it securely?',
        answer: '`dangerouslySetInnerHTML` allows you to inject raw HTML directly into a component. To use it securely, always sanitize the input string first (using a library like DOMPurify) to remove script tags, attributes, or protocols.',
        level: 'intermediate'
      }
    ]
  },
  {
    id: 'company-grade-architecture',
    title: 'Company-Grade Architecture',
    category: 'Production Engineering',
    description: 'Learn clean code separation, absolute imports, custom hooks encapsulation, and API service layers.',
    definition: {
      what: 'Company-Grade Architecture is a structured directory layout, coding standard, and modular system designed to keep codebases scalable and maintainable.',
      why: 'Ad-hoc codebase layouts can become hard to navigate as the project grows, making it difficult to find components or debug state flows.',
      when: 'Use structured architectures on all production-grade React projects to keep files modular, testable, and organized.'
    },
    theory: {
      internalBehavior: 'Production architectures separate concerns by dividing code into logical layers: components (UI/view), hooks (state/business logic), services (network/API), and contexts (global state). This ensures that components focus exclusively on rendering, while business logic and API requests are encapsulated in reusable files.',
      coreConcepts: '• Separation of Concerns: Keeping UI rendering, business logic, and API calls separated.\n• Absolute Imports: Using alias imports (`@/components`) instead of relative paths (`../../../components`).\n• Encapsulation: Wrapping business logic in custom hooks to share code and simplify testing.'
    },
    syntax: {
      explanation: 'Use absolute import aliases in tsconfig to simplify paths.',
      code: `// Absolute imports instead of deep relative paths
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';`
    },
    examples: {
      beginner: {
        title: 'Absolute Import Mock Configuration',
        code: `// tsconfig.json alias mockup configuration
const tsconfigMock = {
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
};
console.log('Path aliases mapped to src folder:', tsconfigMock.compilerOptions.paths);`,
        explanation: 'Shows how path aliases are mapped to the src folder in tsconfig to simplify import statements.'
      },
      intermediate: {
        title: 'Abstracted API Service Layer',
        code: `// src/services/apiService.ts
export const ApiService = {
  async get<T>(endpoint: string): Promise<T> {
    const baseUrl = 'https://api.reacthandbook.dev';
    const res = await fetch(\`\${baseUrl}\${endpoint}\`);
    if (!res.ok) throw new Error('Network error');
    return res.json() as Promise<T>;
  }
};

// Usage inside a Component
import { useState, useEffect } from 'react';

export function ProductView() {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    ApiService.get('/products/1').then(setData);
  }, []);

  return <div>{data ? data.name : 'Loading...'}</div>;
}`,
        explanation: 'Separates network requests into an API service layer, keeping component files clean and easy to test.'
      },
      realWorld: {
        title: 'Encapsulated Business Logic Hook',
        code: `import { useState, useEffect } from 'react';

// src/hooks/useUserSession.ts
// Encapsulates authentication state, network calls, and localStorage sync
export function useUserSession() {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeUser = localStorage.getItem('session_user');
    if (activeUser) setUser(activeUser);
    setLoading(false);
  }, []);

  const login = (name: string) => {
    localStorage.setItem('session_user', name);
    setUser(name);
  };

  const logout = () => {
    localStorage.removeItem('session_user');
    setUser(null);
  };

  return { user, loading, login, logout };
}

// src/components/NavBar.tsx
export default function NavBar() {
  const { user, login, logout } = useUserSession();

  return (
    <div className="flex justify-between items-center p-4 bg-zinc-900 border-b border-zinc-800 text-white">
      <span>Portal: {user || 'Guest'}</span>
      {user ? (
        <button onClick={logout} className="text-xs bg-zinc-800 px-3 py-1 rounded">Sign Out</button>
      ) : (
        <button onClick={() => login('User 1')} className="text-xs bg-indigo-600 px-3 py-1 rounded">Sign In</button>
      )}
    </div>
  );
}`,
        explanation: 'A production-style implementation that wraps session state, event handlers, and localStorage sync in a single custom hook, keeping the navigation UI clean and focused on rendering.'
      }
    },
    notes: {
      bestPractices: [
        'Organize files by feature or technical layer to keep the codebase easy to navigate.',
        'Encapsulate API requests in a dedicated service layer, and extract business logic into custom hooks to simplify testing.'
      ],
      performanceTips: [
        'Keep components focused on rendering. Separating logic and layout makes it easier to optimize rendering performance.'
      ],
      interviewPoints: [
        'Explain the benefits of separating logic and layout: it improves code reusability, simplifies testing, and makes components easier to read.',
        'Describe how path aliases in tsconfig simplify imports.'
      ]
    },
    commonMistakes: [
      {
        title: 'Mixing Network Requests, State, and UI in one file',
        wrongCode: `import { useState, useEffect } from 'react';

function BadWidget() {
  const [data, setData] = useState<any>(null);

  // WRONG! API calls and business logic are mixed directly inside the component, making it hard to reuse or test
  useEffect(() => {
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}`,
        correctedCode: `// src/services/itemService.ts
export const ItemService = {
  fetchItems: () => fetch('https://api.example.com/items').then(res => res.json())
};

// src/hooks/useItems.ts
import { useState, useEffect } from 'react';

export function useItems() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    ItemService.fetchItems().then(setData);
  }, []);
  return data;
}

// src/components/GoodWidget.tsx
export default function GoodWidget() {
  // CORRECT! Component only renders UI; data and logic are encapsulated in hooks and services
  const data = useItems();
  return <div>{data?.title}</div>;
}`,
        explanation: 'Mixing network requests and business logic inside component files makes the codebase hard to maintain, test, or reuse. Extracting them into dedicated hooks and services keeps components clean and modular.'
      }
    ],
    interviewQuestions: [
      {
        question: 'What are the main benefits of separating business logic and component layouts in React?',
        answer: 'It improves code reusability (logic can be shared across multiple components), simplifies testing (logic can be tested in isolation without rendering UI), and makes components easier to read and maintain.',
        level: 'intermediate'
      },
      {
        question: 'How do path aliases in tsconfig benefit large-scale applications?',
        answer: 'They replace long, fragile relative paths (`../../../../components`) with clean, stable absolute paths (`@/components`), making it easier to move files and refactor the directory structure.',
        level: 'beginner'
      }
    ]
  }
);
