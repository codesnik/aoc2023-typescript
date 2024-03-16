import * as fs from 'fs';
import _ from 'lodash';

type Range = {start: number, end: number, shift: number};

function readSeeds(line: string): Range[] {
  let nums: number[] = line.split(" ").slice(1).map(n => parseInt(n));
  return _.chunk(nums, 2)
    .map(([start, len]) => ({start, end: start + len, shift: 0}))
}

/**
  // in range start is included, end is excluded
  readRange("50 98 2") => {start: 98, end: 100, shift: -48}
*/
function readRange(line: string): Range {
  let [dest, start, len] = line.split(" ").map(n => parseInt(n));
  let shift = dest - start;
  let end = start + len;
  return {start, end, shift}
}

/**
  splitRange({start:1, end:4, shift:9}, 4)
  //=> [{start:1, end:4, shift:9}]

  splitRange({start:1, end:4, shift:9}, 3)
  //=> [{start:1, end:3, shift:9}, {start:3, end:4, shift:9}]
*/
function splitRange(range: Range, cut: number): Range[] {
  let {start, end, shift} = range;
  if (start < cut && cut < end) {
    return [{start, end: cut, shift}, {start: cut, end, shift}]
  } else {
    return [range];
  }
}

/*
  mapRange({start:1, end:10, shift:0}, {start:5, end:8, shift:3})
  //=> [{start:1, end:5, shift:0}, {start:5, end:8, shift:3}, {start:8, end:9, shift:0}]
*/
function mapRange(range: Range, mapping: Range): Range[] {
  let first = splitRange(range, mapping.start);
  let middle = first.pop();
  let [newMiddle, ...last] = splitRange(middle, mapping.end);
  if (newMiddle.start >= mapping.start && newMiddle.end <= mapping.end) {
    newMiddle.shift = mapping.shift;
  }
  return [...first, newMiddle, ...last]
}

/**
  shiftRange({start:1, end:11, shift:9})
  //=> {start:10, end:20, shift:0}
*/
function shiftRange(range: Range): Range {
  range.start += range.shift;
  range.end += range.shift;
  range.shift = 0;
  return range
}

function dumpSeeds(ranges: Range[]) {
  console.log(
    ranges.map((range) =>
      _.range(range.start, range.end)
        .map(n => n.toString().padStart(2, ' '))
        .join(" ")
    ).join(" ")
  )
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let seeds = readSeeds(lines.shift()!);

      while (lines.length > 0) {
        let line = lines.shift();
        if (line == "") {
          lines.shift();
          seeds.forEach(shiftRange);
          // dumpSeeds(seeds);
        } else {
          let mapping = readRange(line);
          seeds = seeds.flatMap((seed) => mapRange(seed, mapping));
        }
      }
      seeds.forEach(shiftRange);
      // dumpSeeds(seeds);
      return seeds.map(n => n.start).reduce((a, b) => Math.min(a, b));
    })
    .then(console.log)
    .catch(console.error)
}
