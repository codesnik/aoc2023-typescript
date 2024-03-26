import * as fs from 'fs';

type Row = string[];
type Platform = Row[];

function tilt(platform: Platform): Platform {
  return platform.map(x => tiltRow(x));
}

// tilts row to the left just because it's easier
// also edits it inplace
function tiltRow(row: Row): Row {
  let stop = 0;
  for (let i = 0; i < row.length; i++) {
    if (row[i] == "#") {
      stop = i + 1;
    } else if (row[i] == "O") {
      row[i] = ".";
      row[stop] = "O";
      stop += 1;
    }
  }
  return row
}

function countLoadRow(row: Row): number {
  let load = 0;
  row.forEach((c, i) => {
    if (c == "O") { load += row.length - i }
  });
  return load
}

function sum(array) {
  return array.reduce((a, b) => a+b)
}

function countLoad(platform: Platform): number {
  return sum(platform.map(row => countLoadRow(row)))
}

function cycle(platform: Platform): Platform {
  return rotate(tilt(rotate(tilt(rotate(tilt(rotate(tilt(platform))))))))
}

function cycleUntilStable(platform: Platform): Platform {
  let cnt = 0;
  let seen = {};
  let snap = makeSnap(platform);
  while ( !seen[snap] ) {
    seen[snap] = cnt;
    platform = cycle(platform);
    cnt++;
    snap = makeSnap(platform);
  }
  let iters = cheat(seen[snap], cnt, 1000000000);
  for (let i = 0; i < iters; i++) platform = cycle(platform);
  return platform;
}

/**
 // how many more iterations are needed
 cheat(2, 8, 10) //=> 2
 cheat(2, 5, 10) //=> 2
*/
function cheat(loopStart: number, loopEnd: number, desired: number) {
  return (desired - loopEnd) % (loopEnd - loopStart)
}

function makeSnap(platform: Platform): string {
  return platform.map(row => row.join("")).join("\n")
}

function dumpSnap(platform:Platform): Platform {
  console.log(makeSnap(platform));
  console.log();
  return platform
}
/**
  // rotates clockwise
  rotate([['a','b','c'], ['c','d','e'], ['f','g','h']])
  //=> [['f','c','a'], ['g','d','b'], ['h','e','c']]
*/
function rotate(platform: Platform): Platform {
  let result = [];
  let reversed = platform.reverse();
  for (let i=0; i<platform[0].length; i++) {
    result.push(reversed.map(row => row[i]))
  }
  return result
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then(lines => lines.map(line => line.split("")))
    .then(rotate)
    .then(rotate)
    .then(rotate)
    //.then(dumpSnap)
    .then(cycleUntilStable)
    .then(countLoad)
    .then(console.log)
    .catch(console.error)
}
