import * as fs from 'fs';
import _ from 'lodash';

function countReflections(pattern: string[]): number {
  return findHorizontalSmugedReflection(flip(pattern)) + 100 * findHorizontalSmugedReflection(pattern)
}

/**
  findHorizontalSmugedReflection(["aaa", "aaa", "bbb"]) //=> 0
  findHorizontalSmugedReflection(["aaa", "aab", "bbb"]) //=> 1
  findHorizontalSmugedReflection(["aaa", "abb", "ccc"]) //=> 0
  findHorizontalSmugedReflection(["aaa", "bbb", "ccc", "ccc", "bbb"]) //=> 0
  findHorizontalSmugedReflection(["aaa", "bbb", "ccc", "cca", "bbb"]) //=> 3
  findHorizontalSmugedReflection(["aaa", "bbb", "ccc", "cca", "bbc"]) //=> 0
*/
function findHorizontalSmugedReflection(pattern: string[]): number {
  return _.range(1, pattern.length).find(i => doesReflectWithSmudge(pattern, i)) ?? 0
}

/**
  doesReflectWithSmudge(["aaa", "aax", "bbb"], 1) //=> true
  doesReflectWithSmudge(["bbb", "aaa", "aax", "bbb"], 2) //=> true
  doesReflectWithSmudge(["bbb", "aaa", "aax"], 2) //=> true
  doesReflectWithSmudge(["bbb", "aaa", "aax", "ccc"], 2) //=> false
*/
function doesReflectWithSmudge(pattern, point): boolean {
  let count = 0;
  for (let [x, y] of mirrorIndexes(pattern.length, point)) {
    count += diffs(pattern[x], pattern[y]);
    if (count > 1) return false
  }
  return count == 1
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

/**
  diffs("aaa", "aaa") //=> 0
  diffs("aaa", "aba") //=> 1
  // 2 means just "too many"
  diffs("aaa", "bbb") //=> 2
*/

function diffs(str1: string, str2: string): number {
  if (str1 == str2) return 0;
  let count = 0;
  for (let i = 0; i < str1.length; i++) {
    if (str1[i] != str2[i]) count++;
    if (count > 1) return count;
  }
  return count
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
