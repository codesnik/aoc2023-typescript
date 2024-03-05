import * as fs from 'fs';
import _ from 'lodash';

type Field = string[];
function isChar(field: Field, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= field[0].length || y >= field.length) return false;
  let char = field[y][x];
  if (char === "." || !isNaN(parseInt(char))) return false;
  return true
}
type NumberWithPos = [string, number, number];

function getNumbers(field: Field): NumberWithPos[] {
  const regex = /\d+/g;
  const numbers: NumberWithPos[] = [];

  field.forEach((line, y) => {
    let match: RegExpMatchArray | null;
    while ((match = regex.exec(line)) !== null) {
      numbers.push([match[0], match.index!, y]);
    }
  });
  return numbers
}

fs.promises.readFile(process.argv[2], 'utf-8')
  .then((content) => content.split("\n").slice(0, -1))
  .then((field: Field) =>
    getNumbers(field)
      .filter(([num, x, y]) =>
        isChar(field, x - 1, y)
        || isChar(field, x + num.length, y)
        || _.range(x - 1, x + num.length + 1).some(
          (x2) => isChar(field, x2, y - 1) || isChar(field, x2, y + 1)
        )
      )
      .map(([num]) => parseInt(num))
      .reduce((sum, n) => sum + n)
  )
  .then(console.log)
  .catch(console.error);
