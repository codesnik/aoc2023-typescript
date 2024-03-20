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

/**
 getStartingPoints({AAA: ["BBB", "CCC"], BBB: ["DDD", "EEE"]} //=> ["AAA"]
 */
function getStartingPoints(map: Map): string[] {
  return Object.keys(map).filter(k => k[k.length-1] == "A")
}

function countMoves(map: Map, startingPoint: string, moves: string): number {
  let count = 0;
  let current = startingPoint;
  let [offset, cycle] = [0,1].map((i) => {
    do {
      let currentMove = (moves[count % moves.length] == "L") ? 0 : 1;
      current = map[current][currentMove];
      count++;
    } while (!(current[current.length-1] == "Z"));
    return count
  })
  cycle -= offset;
  if (cycle != offset)
    throw(`algorithm doesn't work if cycle length isn't constant. got cycle ${cycle} offset ${offset}`);
  return cycle;
}

/**
  gcd(10, 8) //=> 2
  gcd(12, 16) //=> 4
  gcd(12, 13) //=> 1
*/
function gcd(a, b) {
  while(a != 0 && b != 0) {
    if (a > b) {
      a = a % b
    } else {
      b = b % a
    }
  }
  return Math.max(a, b)
}

/**
  lcm(10, 8) //=> 40
  lcm(12, 16) //=> 48
  lcm(12, 13) //=> 156
*/
function lcm(a, b) {
  return a/gcd(a, b)*b
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let moves = lines.shift();
      lines.shift();
      let map = readMap(lines);
      let startingPoints = getStartingPoints(map);
      let cycles = startingPoints.map(startingPoint => countMoves(map, startingPoint, moves));
      return cycles.reduce(lcm)
    })
    .then(console.log)
    .catch(console.error)
}
