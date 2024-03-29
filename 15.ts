import * as fs from 'fs';

/**
 hash("HASH") //=> 52
*/
function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
    hash *= 17;
    hash %= 256;
  }
  return hash;
}

function sum(array: number[]): number {
  return array.reduce((a, b) => a+b)
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.slice(0, -1).split(","))
    .then(strs => strs.map(str => hash(str)))
    .then(sum)
    .then(console.log)
    .catch(console.error)
}
