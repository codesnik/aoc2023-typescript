import * as fs from 'fs';
import _ from 'lodash';

type RC = [number, number];

// surrounding directions, clockwise from the top
const dirs: RC[] = [[-1,0], [0,1], [1,0], [0,-1]];

// connecting directions
const pipes: {[k: string]: number[]} = {
  '|': [0,2],
  '-': [3,1],
  'F': [2,1],
  'J': [0,3],
  'L': [0,1],
  '7': [3,2],
  'S': [0,1,2,3]
};

/**
  findAnimal(["....", "..S."]) //=> [1, 2]
 */
function findAnimal(map: string[]): RC {
  const r = map.findIndex(l => l.indexOf("S") != -1);
  const c = map[r].indexOf("S");
  return [r, c]
}

function same(rc1: RC, rc2: RC): boolean {
  return rc1[0] == rc2[0] && rc1[1] == rc2[1]
}

/**
  step([".S7..", "..L.."], [0, 1], [0, 2]) //=> [[0, 2], [1, 2]]
 */
function step(map: string[], from: RC, current: RC): [RC, RC] {
  let [rc1, rc2] = findConnected(map, current);
  return same(from, rc1) ? [current, rc2] : [current, rc1]
}

/**
  findConnected(["..7..", "....."], [0, 2]) //=> [[0, 1], [1, 2]]
 */
function findConnected(map: string[], current: RC): RC[] {
  let pipe = map[current[0]]?.[current[1]];
  let shifts = pipes[pipe];
  if (shifts === undefined) return [];
  return shifts.map(shift => shiftRC(current, shift));
}

function shiftRC(current: RC, shift: number): RC {
  return [current[0] + dirs[shift][0], current[1] + dirs[shift][1]];
}
/**
  findConnectedToStart([".|S-.", "..L.."], [0, 2]) //=> [[0, 3], [1, 2]]
 */
function findConnectedToStart(map: string[], current: RC): [RC, RC] {
  let surrounding = findConnected(map, current);
  let [rc1, rc2] = surrounding.filter(rc => findConnected(map, rc).some(drc => same(current, drc)))
  return [rc1, rc2]
}

/**
  countSteps([".S-7", ".L-J"]) //=> 3
 */
function countSteps(map: string[]): number {
  let current = findAnimal(map);
  let count = 1;
  let [s1, s2] = findConnectedToStart(map, current);
  let from1 = current;
  let from2 = current;
  while (!same(s1, s2)) {
    [from1, s1] = step(map, from1, s1);
    [from2, s2] = step(map, from2, s2);
    count++;
  }
  return count
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then(countSteps)
    .then(console.log)
    .catch(console.error)
}
