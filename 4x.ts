import * as fs from 'fs';
import _ from 'lodash';

/**
    parseLine("Card 34:  1 12 35 | 1 5 6") // => [34, 1]
*/
function parseLine(line: string): [number, number] {
  const [card, rest] = line.split(":");
  const cardNum = parseInt(card.split(/\s+/)[1]);
  const [winning, gotten] = rest.split(" | ").map(str => str.trim().split(/\s+/).map(n => parseInt(n)));
  const wins = gotten.filter(num => winning.includes(num)).length;
  return [cardNum, wins]
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let cardWins: number[] = [];
      lines.map(parseLine).forEach(([cardNum, wins]) => cardWins[cardNum - 1] = wins);
      let cardCounts: number[] = Array(cardWins.length).fill(1);
      for (let i = 0; i < cardWins.length; i++) {
        for (let j = i+1; j <= i + cardWins[i]; j++ ) {
          cardCounts[j] += cardCounts[i]
        }
      }
      return cardCounts.reduce((sum, n) => sum + n)
    })
    .then(console.log)
    .catch(console.error)
}
