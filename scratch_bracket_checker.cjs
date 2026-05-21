const fs = require('fs');

const content = fs.readFileSync('src/data/reactHandbookData.ts', 'utf8');

let roundStack = []; // stores { index, line, char }
let squareStack = [];
let curlyStack = [];
let inString = null;
let isEscaped = false;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const line = content.substring(0, i).split('\n').length;
  if (isEscaped) {
    isEscaped = false;
    continue;
  }
  if (char === '\\') {
    isEscaped = true;
    continue;
  }

  if (inString) {
    if (char === inString) {
      inString = null;
    }
    continue;
  }

  if (char === "'" || char === '"' || char === '`') {
    inString = char;
    continue;
  }

  // Ignore comments
  if (char === '/' && content[i+1] === '/') {
    while (i < content.length && content[i] !== '\n') {
      i++;
    }
    continue;
  }
  if (char === '/' && content[i+1] === '*') {
    i += 2;
    while (i < content.length && !(content[i] === '*' && content[i+1] === '/')) {
      i++;
    }
    i++;
    continue;
  }

  if (char === '(') roundStack.push({ index: i, line });
  if (char === ')') {
    if (roundStack.length === 0) {
      console.log(`Unmatched ')' at line ${line}`);
    } else {
      roundStack.pop();
    }
  }
  if (char === '[') squareStack.push({ index: i, line });
  if (char === ']') {
    if (squareStack.length === 0) {
      console.log(`Unmatched ']' at line ${line}`);
    } else {
      squareStack.pop();
    }
  }
  if (char === '{') curlyStack.push({ index: i, line });
  if (char === '}') {
    if (curlyStack.length === 0) {
      console.log(`Unmatched '}' at line ${line}`);
    } else {
      curlyStack.pop();
    }
  }
}

console.log("Unmatched '(':", roundStack);
console.log("Unmatched '[':", squareStack);
console.log("Unmatched '{':", curlyStack);

