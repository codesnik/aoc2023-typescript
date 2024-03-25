import * as fs from 'fs';
// import _ from 'lodash';

function arrangements(line: string): number {
  let [pattern, countStrs] = line.split(" ");
  let counts = countStrs.split(",").map(n => parseInt(n));
  return recurse(pattern, counts)
}

/**
  recurse("", [2], 2) //=> 1
  recurse("", [1], 0) //=> 0
  recurse("", [], 0) //=> 1
  recurse("#.#", [1, 1]) //=> 1
  recurse("#.#.", [1, 1]) //=> 1
  recurse(".#.?.", [1, 1]) //=> 1
  recurse(".#.??.", [1, 1]) //=> 2
  recurse("???.###", [1,1,3]) //=> 1
  recurse(".??..??...?##.", [1,1,3]) //=> 4
  recurse("?#?#?#?#?#?#?#?", [1,3,1,6]) //=> 1
  recurse("????.#...#...", [4,1,1]) //=> 1
  recurse("????.######..#####.", [1,6,5]) //=> 4
  recurse("?###????????", [3,2,1]) //=> 10
*/
function recurse(pattern: string, counts: number[], lastCount: number = 0): number {
  if (pattern == "") {
    if (counts.toString() == lastCount.toString()) return 1;
    if (counts.toString() == "" && lastCount == 0) return 1;
    return 0
  }
  let result = 0;
  let [char, rest] = [pattern[0], pattern.slice(1)];
  if ((char == "#" || char == "?") && counts.length > 0 && lastCount < counts[0]) {
    result += recurse(rest, counts, lastCount + 1)
  }
  if (char == "." || char == "?") {
    if (lastCount == 0)
      result += recurse(rest, counts, 0)
    else if (counts[0] == lastCount) {
      result += recurse(rest, counts.slice(1), 0)
    }
  }
  return result
}

function sum(array) {
  return array.reduce((a, b) => a+b)
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then(lines => lines.map(arrangements))
    .then(sum)
    .then(console.log)
    .catch(console.error)
}
