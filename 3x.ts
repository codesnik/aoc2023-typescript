import * as fs from 'fs';
import _ from 'lodash';

type Field = string[];
type NumberWithX = [string, number];
type Coords = [number, number];

function getNumbers(field: Field): NumberWithX[][] {
  const regex = /\d+/g;

  return field.map((line) => {
    let match: RegExpMatchArray | null;
    const numbers: NumberWithX[] = [];
    while ((match = regex.exec(line)) !== null) {
      numbers.push([match[0], match.index!]);
    }
    return numbers
  });
}

function getStars(field: Field): Coords[] {
  return field.flatMap((line, y) =>
    _.range(0, line.length)
      .filter(x => line[x] == "*")
      .map((x): Coords => [x, y])
  )
}

function isOverlap(a1: number, a2: number, b1: number, b2: number): boolean {
  return a1 <= b1 && b1 <= a2 || b1 <= a1 && a1 <= b2
}

function overlappingNumbers(numbers: NumberWithX[][], [x, y]: Coords): number[] {
  return [...(numbers[y - 1] || []), ...numbers[y], ...(numbers[y + 1] || [])]
    .filter(([num, numX]) => isOverlap(numX, numX + num.length - 1, x - 1, x + 1))
    .map(([num]) => parseInt(num))
}

fs.promises.readFile(process.argv[2], 'utf-8')
  .then((content) => content.split("\n").slice(0, -1))
  .then((field: Field) => {
    const numbers = getNumbers(field);
    return getStars(field).map((star) => {
      const touching = overlappingNumbers(numbers, star);
      return touching.length == 2 ? (touching[0] * touching[1]) : 0
    })
      .reduce((sum, n) => sum + n)
  })
  .then(console.log)
  .catch(console.error);
