import * as fs from 'fs';

type Map = string[];
enum Dir {
  up = 1,
  right = 2,
  down = 4,
  left = 8,
};
type Ray = [number, number, Dir];
type Energized = Record<string, number>;

/**
  let rays: Ray[] = [[ -1, 1, 1 ], [ 1, 1, 2 ]];
  let map: Map = ["...", "..."]
  rays.filter((ray: Ray) => inBounds(ray, map)) //=> [[1, 1, 2]]
*/
function inBounds(ray: Ray, map: Map): boolean {
  let [y, x, _dir] = ray;
  return y >= 0 && y < map.length && x >= 0 && x < map[0].length
}

const reflects: {[k: string]: {[k: string]: Dir[]}} = {
  '/':  {[Dir.up]: [Dir.right], [Dir.right]: [Dir.up], [Dir.down]: [Dir.left], [Dir.left]: [Dir.down]},
  '\\': {[Dir.up]: [Dir.left], [Dir.right]: [Dir.down], [Dir.down]: [Dir.right], [Dir.left]: [Dir.up]},
  '-':  {[Dir.up]: [Dir.left, Dir.right], [Dir.down]: [Dir.left, Dir.right]},
  '|':  {[Dir.left]: [Dir.up, Dir.down], [Dir.right]: [Dir.up, Dir.down]}
}

function shift(ray: Ray): Ray {
  let [y, x, dir] = ray;
  switch(dir) {
    case Dir.up: return [y-1, x, dir];
    case Dir.right: return [y, x+1, dir];
    case Dir.down: return [y+1, x, dir];
    case Dir.left: return [y, x-1, dir];
  }
}

function step(ray: Ray, map: Map): Ray[] {
  let [y, x, dir] = ray;
  let char = map[y][x];
  return ( reflects[char]?.[dir] ?? [dir])
    .map((newDir: Dir) => [y, x, newDir] as Ray)
    .map((ray: Ray) => shift(ray))
    .filter(ray => inBounds(ray, map))
}


function passed(energized: Energized, ray: Ray): boolean {
  let [y, x, dir] = ray;
  let key = [y, x].toString();
  return (energized[key] & dir) != 0
}

function updateEnergized(energized: Energized, rays: Ray[]): void {
  rays.forEach(ray => {
    let [y, x, dir] = ray;
    let key = [y, x].toString();
    energized[key] |= dir;
  })
}

/**
 let energized: Energized = {}
 updateEnergized(energized, [[0,0, Dir.up], [0,1, Dir.up]])
 countEnergized(energized) //=> 2
*/
function countEnergized(energized: Energized): number {
  return Object.keys(energized).length
}

function iterate(map: Map): Energized {
  let energized: Energized = {};
  let rays: Ray[] = [[0, 0, Dir.right]];
  while (rays.length > 0) {
    rays = rays.filter(ray => !passed(energized, ray));
    updateEnergized(energized, rays);
    rays = rays.flatMap(ray => step(ray, map))
  }
  return energized
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.slice(0, -1).split("\n"))
    .then(iterate)
    .then(countEnergized)
    .then(console.log)
    .catch(console.error)
}
