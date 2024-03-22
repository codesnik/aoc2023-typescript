import * as fs from 'fs';
import _ from 'lodash';

type RC = [number, number];
type Set = Record<string, boolean>;

// surrounding directions, clockwise from the top
const dirs: RC[] = [[-1,0], [0,1], [1,0], [0,-1]];

// connecting directions
const pipes: {[k: string]: {conn: number[], lefts: number[], rights: number[]}} = {
  '|': {conn: [0,2], lefts: [1], rights: [3]},
  '-': {conn: [3,1], lefts: [0], rights: [2]},
  'F': {conn: [2,1], lefts: [3,0], rights: []},
  'J': {conn: [0,3], lefts: [1,2], rights: []},
  'L': {conn: [0,1], lefts: [], rights: [2, 3]},
  '7': {conn: [3,2], lefts: [0, 1], rights: []}
};

/**
  findAnimal(["....", "..S."]) //=> [1, 2]
 */
function findAnimal(map: string[]): RC {
  const r = map.findIndex(l => l.indexOf("S") != -1);
  const c = map[r].indexOf("S");
  return [r, c]
}

/**
  //  sadly, modifies visited as well.
  let visited = {"0,1": true};
  let lefts = []
  let rights = []
  step([".S7..", "..L.."], visited, lefts, rights, [0, 2]) //=> [1, 2]
  visited //=> {"0,1": true, "0,2": true}
  lefts //=> [[-1, 2], [0, 3]]
  rights //=> []
 */
function step(map: string[], visited: Set, lefts: RC[], rights: RC[], current: RC): RC | null {
  visited[current.toString()] = true;
  let pipe = pipes[map[current[0]][current[1]]];
  let [start, end] = shiftsRC(current, pipe.conn);
  let newLefts = shiftsRC(current, pipe.lefts);
  let newRights = shiftsRC(current, pipe.rights);

  if (!visited[end.toString()]) {
    lefts.push(...newLefts);
    rights.push(...newRights);
    return end
  } else if (!visited[start.toString()]) {
    // pipe goes in a reverse direction
    lefts.push(...newRights);
    rights.push(...newLefts);
    return start
  } else {
    // end of pipe
    return
  }
}

function shiftRC(rc: RC, shift: number): RC {
  return [rc[0] + dirs[shift][0], rc[1] + dirs[shift][1]];
}

function shiftsRC(rc: RC, shifts: number[]): RC[] {
  return shifts.map(shift => shiftRC(rc, shift))
}

function allShiftsRC(rc: RC): RC[] {
  return shiftsRC(rc, [0,1,2,3])
}

/**
  findConnected(["..7..", "....."], [0, 2]) //=> [[0, 1], [1, 2]]
 */
function findConnected(map: string[], current: RC): RC[] {
  let pipe = map[current[0]]?.[current[1]];
  let shifts = pipes[pipe]?.conn;
  if (shifts === undefined) return [];
  return shifts.map(shift => shiftRC(current, shift));
}

function same(rc1: RC, rc2: RC): boolean {
  return rc1[0] == rc2[0] && rc1[1] == rc2[1]
}

/**
  findConnectedToStart([".|S-.", "..L.."], [0, 2]) //=> [[0, 3], [1, 2]]
 */
function findConnectedToStart(map: string[], current: RC): RC[] {
  let surrounding = allShiftsRC(current);
  return surrounding.filter(rc => findConnected(map, rc).some(drc => same(current, drc)))
}


function cleanEnclosed(visited: Set, enclosed: RC[]): RC[] {
  return _.uniqBy(enclosed.filter(cell => !visited[cell.toString()]), (el => el.toString()))
}

function addToVisited(visited: Set, rcs: RC[]) {
  rcs.forEach(rc => visited[rc.toString()] = true);
}

function fillCount(visited: Set, gen: RC[]): number {
  gen = cleanEnclosed(visited, gen);
  let count = 0
  while (gen.length > 0) {
    count += gen.length
    addToVisited(visited, gen)
    gen = cleanEnclosed(visited, gen.flatMap(allShiftsRC))
  }
  return count
}

/**
  countFilledByPipe([".S-7", ".L-J"]) //=> 0
 */
function countFilledByPipe(map: string[]): number {
  let start = findAnimal(map);
  let current = findConnectedToStart(map, start)[0];

  let visited: Set = {}
  let lefts: RC[] = [];
  let rights: RC[] = [];
  visited[start.toString()] = true;

  while (current) {
    current = step(map, visited, lefts, rights, current);
  }
  let enclosed = (lefts.length < rights.length) ? lefts : rights;

  return fillCount(visited, enclosed);
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then(countFilledByPipe)
    .then(console.log)
    .catch(console.error)
}
