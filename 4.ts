import * as fs from 'fs';
import _ from 'lodash';

/**
    parseLine("Card 34:  1 12 35 | 1 5 6") // => [34, [1, 12, 35], [1, 5, 6]]
*/
function parseLine(line: string): [number, number[], number[]] {
  const [card, rest] = line.split(":");
  const cardNum = parseInt(card.split(/\s+/)[1]);
  const [winning, gotten] = rest.split(" | ").map(str => str.trim().split(/\s+/).map(n => parseInt(n)));
  return [cardNum, winning, gotten]
}

/**
    points(0) // => 0
    points(1) // => 1
    points(3) // => 4
*/
function points(count: number): number {
  if (count==0) {
    return 0;
  }
  let score = 1;
  for (let i=count; i > 1; i--) {
    score = score * 2
  }
  return score
}

function linePoints(line: string): number {
  const [cardNum, winning, gotten] = parseLine(line);
  const count = gotten.filter(num => winning.includes(num)).length;
  return points(count)
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) =>
      lines.map(linePoints).reduce((sum, n) => sum + n, 0)
    )
    .then(console.log)
    .catch(console.error)
}
