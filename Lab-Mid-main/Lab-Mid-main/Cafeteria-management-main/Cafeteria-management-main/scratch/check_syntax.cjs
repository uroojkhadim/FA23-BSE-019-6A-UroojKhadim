const fs = require('fs');
const file = 'd:/GitHub/FA23-BSE-019-6A-UroojKhadim/Lab-Mid-main/Lab-Mid-main/Cafeteria-management-main/Cafeteria-management-main/src/components/pages/AdminPage.tsx';
const content = fs.readFileSync(file, 'utf8');

let braceCount = 0;
let parenCount = 0;
let bracketCount = 0;

for (let i = 0; i < content.length; i++) {
  if (content[i] === '{') braceCount++;
  if (content[i] === '}') braceCount--;
  if (content[i] === '(') parenCount++;
  if (content[i] === ')') parenCount--;
  if (content[i] === '[') bracketCount++;
  if (content[i] === ']') bracketCount--;
}

console.log(`Brace balance: ${braceCount}`);
console.log(`Paren balance: ${parenCount}`);
console.log(`Bracket balance: ${bracketCount}`);
