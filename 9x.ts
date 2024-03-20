import * as fs from 'fs';
import _ from 'lodash';

/**
 diffs([1, 5, 3]) //=> [4, -2]
 */
function diffs(sequence: number[]): number[] {
  let diffs = []
  for (let i=0; i < sequence.length-1; i++) {
    diffs.push(sequence[i+1] - sequence[i])
  }
  return diffs
}

function extrapolateBack(sequence: number[]): number {
  if (sequence.every(x => x == 0)) return 0;
  return sequence.at(0) - extrapolateBack(diffs(sequence))
}

/**
 readSequence("1 -20 30") //=> [1, -20, 30]
 */
function readSequence(line: string): number[] {
  return line.split(" ").map(n => parseInt(n));
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let sequences = lines.map(readSequence);
      let extrapolated = sequences.map(extrapolateBack);
      return extrapolated.reduce((a, b) => a + b)
    })
    .then(console.log)
    .catch(console.error)
}
