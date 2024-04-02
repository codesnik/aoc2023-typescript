import * as fs from "fs";
import _ from "lodash";
import readline from "readline";

type Map = number[][];
enum Dir { u, r, d, l };
type Cruc = {y: number, x: number, dir: Dir, steps: number, temp: number};
type Visited = Record<string, number>;

/**
 let map = [[1,2,3], [4,5,6]];
 let cruc = {x:0, y:0, dir:Dir.r, steps: 0, temp: 0};
 step(cruc, map) //=> [{x: 1, y:0, dir: Dir.r, temp: 2, steps: 1}, {x: 0, y:1, dir: Dir.d, temp: 4, steps: 1}]
 */
function step(cruc: Cruc, map: Map): Cruc[] {
  return [cruc, turnLeft(cruc), turnRight(cruc)].map(c => shift(c, map)).filter(c => c !== undefined)
}

/**
 let map = [[1,2,3], [4,5,6]];
 shift({x:0, y:0, dir: Dir.r, steps: 0, temp: 0}, map) //=> {x: 1, y:0, dir: Dir.r, temp: 2, steps: 1}
 shift({x:0, y:0, dir: Dir.u, steps: 0, temp: 0}, map) //=> undefined
 */
function shift(cruc: Cruc, map: Map): Cruc | undefined {
  let newCruc = {...cruc};
  newCruc.steps += 1;
  if (newCruc.steps == 4) return;

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
      visited[key] = cruc.temp;
      return true
    }
  })
}

function removeFinished(crucs: Cruc[], map: Map, temp: number): [Cruc[], number] {
  let [finished, others] = _.partition(crucs, cruc => cruc.x == map[0].length-1 && cruc.y == map.length-1);
  let newTemp = Math.min(temp, ...finished.map(cruc => cruc.temp));
  others = others.filter(cruc => cruc.temp < newTemp);
  return [others, newTemp]
}

async function run(map: Map) {
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
    //console.log();
    //console.log(temp, crucs.length);
    //show(map, crucs)
    //await ask("next?")
  }

  return temp
}

function show(map: Map, crucs: Cruc[]): void {
  const sym = {[Dir.u]: "^", [Dir.r]: ">", [Dir.d]: "v", [Dir.l]: "<" };
  crucs.forEach(cruc => { if (cruc.x == 0 && cruc.y == 0) console.log(cruc)});
  let mapped = Object.fromEntries(crucs.map(cruc => [[cruc.y, cruc.x].toString(), "\x1b[1;32m" + sym[cruc.dir]+ "\x1b[0m"]));
  for (let y = 0; y < map.length; y++) {
    let line = "";
    for (let x = 0; x < map[0].length; x++) {
      let cruc = mapped[[y, x].toString()];
      if (cruc) {
        line += cruc;
      }
      else {
        line += map[y][x]
      }
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
    .then(run)
    .then(console.log)
    .catch(console.error)
}
