import * as fs from 'fs';
import _ from 'lodash';

function countReflections(pattern: string[]): number {
  return findHorizontalReflection(flip(pattern)) + 100 * findHorizontalReflection(pattern)
}

/**
  findHorizontalReflection(["aaa", "aaa", "bbb"]) //=> 1
  findHorizontalReflection(["aaa", "bbb", "ccc", "ccc", "bbb"]) //=> 3
  findHorizontalReflection(["aaa", "bbb", "ccc"]) //=> 0
*/
function findHorizontalReflection(pattern: string[]): number {
  return _.range(1, pattern.length).find(i => doesReflect(pattern, i)) ?? 0
}

/**
  doesReflect(["aaa", "aaa", "bbb"], 1) //=> true
  doesReflect(["bbb", "aaa", "aaa", "bbb"], 2) //=> true
  doesReflect(["bbb", "aaa", "aaa"], 2) //=> true
  doesReflect(["bbb", "aaa", "aaa", "ccc"], 2) //=> false
*/
function doesReflect(pattern, point): boolean {
  return mirrorIndexes(pattern.length, point).every(([x, y]) => pattern[x] == pattern[y])
}

/**
  mirrorIndexes(2, 1) //=> [[0, 1]]
  mirrorIndexes(3, 1) //=> [[0, 1]]
  mirrorIndexes(3, 2) //=> [[1, 2]]
  mirrorIndexes(4, 2) //=> [[1, 2], [0, 3]]
  mirrorIndexes(4, 3) //=> [[2, 3]]
*/
function mirrorIndexes(length: number, point: number): [number, number][] {
  let maxDelta = Math.min(point, length - point);
  return _.range(0, maxDelta).map(delta => [point - delta - 1, point + delta])
}

function flip(pattern: string[]): string[] {
  let result = [];
  for (let i=0; i<pattern[0].length; i++) {
    result.push(pattern.map(line => line[i]).join(""))
  }
  return result
}

function sum(numbers: number[]): number {
  return numbers.reduce((a, b) => a + b)
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then(content => content.slice(0, -1).split("\n\n").map(block => block.split("\n")))
    .then(patterns => patterns.map(countReflections))
    .then(sum)
    .then(console.log)
    .catch(console.error)
}
