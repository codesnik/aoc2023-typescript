import * as fs from 'fs';
import _ from 'lodash';

const cards: string[] = "A K Q J T 9 8 7 6 5 4 3 2".split(" ");
const cardRanks = Object.fromEntries(
  _.zip(
    cards,
    _.range(13, 0).map(n => n.toString().padStart(2, "0"))
  )
);

/**
  handOrder("AAKQ2") //=> "1313121101"
*/
function handOrder(hand: string): string {
  return hand.split("").map(c => cardRanks[c]).join("")
}

// hand types are actually lexigraphically ordered
// 5 41 32 311 221 2111 11111

/**
  handType("AAKQK") //=> "221"
  handType("A3276") //=> "11111"
*/
function handType(hand: string): string {
  let counts = {};
  hand.split("").forEach(card => { counts[card] ||= 0; counts[card]++ })
  return Object.values(counts).map(c => c.toString()).sort().reverse().join("")
}

/**
  parse("AAAAA 532") //=> ["AAAAA", 532]
*/
function parse(line: string): [string, number] {
  let [hand, bid] = line.split(/\s+/);
  return [hand, parseInt(bid)]
}

function preprocess(pair: [string, number]): [string, string, string, number] {
  const [hand, bid] = pair;
  return [handType(hand), handOrder(hand), hand, bid]
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let sum = 0;
      let rankedHands = lines.map(parse).map(preprocess).sort();
      rankedHands.map(l => l.at(-1)).forEach((bid: number, zeroBasedRank: number) =>
        sum += bid * (zeroBasedRank + 1)
      )
      return sum;
    })
    .then(console.log)
    .catch(console.error)
}
