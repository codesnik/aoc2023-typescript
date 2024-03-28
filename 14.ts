import * as fs from 'fs';
import _ from 'lodash';

function tilt(platform:string[]): number[] {
  return _.range(0, platform[0].length)
    .map(x => platform.map(line => line[x]))
    .map(row => tiltRow(row))
}

function tiltRow(row: string[]): number {
  let stop = 0;
  let load = 0;
  row.forEach((c, i) => {
    if (c == "#") {
      stop = i+1
    } else if (c == "O") {
      load += row.length - stop;
      stop += 1
    }
  })
  return load
}

function sum(array: number[]): number {
  return array.reduce((a, b) => a+b)
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then(tilt)
    .then(sum)
    .then(console.log)
    .catch(console.error)
}
