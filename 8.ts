import * as fs from 'fs';
import _ from 'lodash';

/**
 readMap(["AAA = (BBB, CCC)", "BBB = (DDD, EEE)"]) //=> {AAA: ["BBB", "CCC"], BBB: ["DDD", "EEE"]}
 */

type Map = {[k:string]: [string, string]};

function readMap(lines: string[]): Map {
  let map: Map = {};
  lines.forEach(line => {
    let [key, values] = line.split(" = ");
    values = values.slice(1, -1);
    let [l, r] = values.split(", ");
    map[key] = [l, r];
  })
  return map;
}

function countMoves(map: Map, moves: string): number {
  let count = 0;
  let current = "AAA";
  while (current != "ZZZ") {
    let currentMove = (moves[count % moves.length] == "L") ? 0 : 1;
    current = map[current][currentMove];
    count++;
  }
  return count
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let moves = lines.shift();
      lines.shift();
      let map = readMap(lines);
      return countMoves(map, moves)
    })
    .then(console.log)
    .catch(console.error)
}
