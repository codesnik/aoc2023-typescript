import * as fs from "fs";
import _ from "lodash";
import readline from "readline";

type Map = number[][];
enum Dir { u, r, d, l };
type Cruc = {y: number, x: number, dir: Dir, steps: number, temp: number};
type Visited = Record<string, number>;

/**
 let map = [[1,2,3,4,5,6,7,9,10,1,2], [11,12,13,14,15,16,17,18,19,20,21,22]];
 let cruc = {x:0, y:0, dir:Dir.r, steps: 0, temp: 0};
 step(cruc, map) //=> {x: 1, y:0, dir: Dir.r, temp: 2, steps: 1}
 let cruc2 = {x:0, y:0, dir:Dir.r, steps: 8, temp: 0};
 step(cruc2, map) //=> [{x: 1, y:0, dir: Dir.r, temp: 2, steps: 9}, {x: 0, y:1, dir: Dir.d, temp: 11, steps: 1}],
 */
function step(cruc: Cruc, map: Map): Cruc[] | Cruc {
  if (cruc.steps < 4) return shift(cruc, map) ?? [];
  return [cruc, turnLeft(cruc), turnRight(cruc)].map(c => shift(c, map)).filter(c => c !== undefined)
}

/**
 let map = [[1,2,3,4,5,6,7,9,10,1,2], [11,12,13,14,15,16,17,18,19,20,21,22]];
 shift({x:0, y:0, dir: Dir.r, steps: 0, temp: 0}, map) //=> {x: 1, y:0, dir: Dir.r, temp: 2, steps: 1}
 shift({x:0, y:0, dir: Dir.u, steps: 0, temp: 0}, map) //=> undefined
 */
function shift(cruc: Cruc, map: Map): Cruc | undefined {
  if (cruc.steps == 10) return;
  let newCruc = {...cruc};
  newCruc.steps += 1;

  switch (cruc.dir) {
    case Dir.u: newCruc.y -= 1; break;
    case Dir.r: newCruc.x += 1; break;
    case Dir.d: newCruc.y += 1; break;
    case Dir.l: newCruc.x -= 1; break;
  }

  if (newCruc.x < 0 || newCruc.y < 0 || newCruc.x >= map[0].length || newCruc.y >= map.length) return;
  newCruc.temp += map[newCruc.y][newCruc.x];

  return newCruc
}

function turnLeft(cruc: Cruc): Cruc {
  let newCruc = {...cruc, steps: 0};
  switch (cruc.dir) {
    case Dir.u: newCruc.dir = Dir.l; break;
    case Dir.r: newCruc.dir = Dir.u; break;
    case Dir.d: newCruc.dir = Dir.r; break;
    case Dir.l: newCruc.dir = Dir.d; break;
  }
  return newCruc;
}

function turnRight(cruc: Cruc): Cruc {
  let newCruc = {...cruc, steps: 0};
  switch (cruc.dir) {
    case Dir.u: newCruc.dir = Dir.r; break;
    case Dir.r: newCruc.dir = Dir.d; break;
    case Dir.d: newCruc.dir = Dir.l; break;
    case Dir.l: newCruc.dir = Dir.u; break;
  }
  return newCruc;
}

// updates visited inplace :()
function updateVisited(crucs: Cruc[], visited: Visited): Cruc[] {
  return crucs.filter(cruc => {
    let key = [cruc.y, cruc.x, cruc.dir, cruc.steps].toString()
    if (visited[key] && visited[key] <= cruc.temp) {
      return false
    }
    else {
      // _.range(cruc.steps, 4).forEach(step => {
      //   visited[ [cruc.y, cruc.x, cruc.dir, step].toString() ] = cruc.temp
      // })
      visited[key] = cruc.temp;
      return true
    }
  })
}

function removeFinished(crucs: Cruc[], map: Map, temp: number): [Cruc[], number] {
  let [finished, others] = _.partition(crucs, cruc => cruc.x == map[0].length-1 && cruc.y == map.length-1 && cruc.steps >= 4);
  let newTemp = Math.min(temp, ...finished.map(cruc => cruc.temp));
  others = others.filter(cruc => cruc.temp < newTemp);
  return [others, newTemp]
}

async function run(map: Map, verbose: boolean = false) {
  let crucs: Cruc[] = [
    {x: 0, y: 0, dir: Dir.r, steps: 0, temp: 0},
    {x: 0, y: 0, dir: Dir.d, steps: 0, temp: 0}
  ];

  let visited: Visited = {};

  let temp = Infinity;

  while (crucs.length > 1) {
    crucs = crucs.flatMap(cruc => step(cruc, map));
    [crucs, temp] = removeFinished(crucs, map, temp);
    crucs = updateVisited(crucs, visited)
    if (verbose) {
      console.log();
      console.log(temp, crucs.length);
      show(map, crucs, visited)
      await ask("next?")
    }
  }

  return temp
}

function show(map: Map, crucs: Cruc[], visited: Visited): void {
  let green = "\x1b[1;32m";
  let none = "\x1b[0m";
  let mapped = Object.fromEntries(
    Object.entries(
      _.groupBy(crucs, cruc => [cruc.y, cruc.x].toString())
    ).map(([key, crucs]) => [key, green + Math.min(...crucs.map(cruc => cruc.temp)).toString().padStart(4, " ") + none]));
  let mapVisited = Object.fromEntries(
    Object.entries(
      _.groupBy(Object.entries(visited), ([key, _temp]) => key.split(",").slice(0, 2).join(","))
    ).map(([key, pairs]) => [key, Math.min(...pairs.map(([_key, temp]) => temp)).toString().padStart(4, " ")])
  );
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[0].length; x++) {
      let key = [y, x].toString();
      line += mapped[key] ?? mapVisited[key] ?? "   .";
    }
    console.log(line)
  }
}

async function ask(query: string) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.slice(0, -1).split("\n"))
    .then((lines) => lines.map(line => line.split("").map(n => parseInt(n))))
    .then(map => run(map, process.argv[3] == "-v"))
    .then(console.log)
    .catch(console.error)
}
