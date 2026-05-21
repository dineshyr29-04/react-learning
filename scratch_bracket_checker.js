const fs = require('fs');

const content = fs.readFileSync('src/data/reactHandbookData.ts', 'utf8');

let round = 0; // ()
let square = 0; // []
let curly = 0; // {}
let inString = null; // ' or " or `
let isEscaped = false;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
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
    // skip to end of line
    while (i < content.length && content[i] !== '\n') {
      i++;
    }
    continue;
  }
  if (char === '/' && content[i+1] === '*') {
    // skip to end of block comment
    i += 2;
    while (i < content.length && !(content[i] === '*' && content[i+1] === '/')) {
      i++;
    }
    i++;
    continue;
  }

  if (char === '(') round++;
  if (char === ')') round--;
  if (char === '[') square++;
  if (char === ']') square--;
  if (char === '{') curly++;
  if (char === '}') curly--;

  if (round < 0 || square < 0 || curly < 0) {
    console.log(`Mismatch at index ${i}, line ${content.substring(0, i).split('\n').length}, char '${char}': round=${round}, square=${square}, curly=${curly}`);
    // Print local context
    console.log(content.substring(Math.max(0, i - 100), Math.min(content.length, i + 100)));
    process.exit(1);
  }
}

console.log(`Final counts: round=${round}, square=${square}, curly=${curly}`);
