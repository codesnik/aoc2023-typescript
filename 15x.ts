import * as fs from 'fs';

type Box = [string, number][];

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

function removeLens(box: Box, label:string): void {
  let idx = box.findIndex(cell => cell[0] == label);
  if (idx != -1) box.splice(idx, 1)
}

function addLens(box: Box, label:string, lens: number): void {
  let idx = box.findIndex(cell => cell[0] == label);
  if (idx != -1) {
    box[idx] = [label, lens];
  } else {
    box.push([label, lens]);
  }
}

function doCommand(boxes: Box[], command: string): void {
  let [_matched, label, op, lensStr] = command.match(/(\w+)([=-])(\d?)/);
  let boxIdx = hash(label);

  if (op == "-") {
    removeLens(boxes[boxIdx], label)
  }
  else {
    let lens = parseInt(lensStr);
    addLens(boxes[boxIdx], label, lens)
  }
}

function sum(array: number[]): number {
  return array.reduce((a, b) => a+b, 0)
}

/**
  let boxes = Array.from({length: 256}, () => []);
  boxes[0] = [["rn", 1], ["cm", 2]]; boxes[3] = [["ot", 7], ["ab", 5], ["pc", 6]]
  sumBoxes(boxes) //=> 145
*/
function sumBoxes(boxes: Box[]): number {
  return sum(boxes.map((box, boxIdx) => (boxIdx + 1) * sum(box.map((lens, lensIdx) => (lensIdx + 1) * lens[1]))))
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.slice(0, -1).split(","))
    .then(commands => {
     // create array fo 256 empty arrays
      let boxes: Box[] = Array.from({length: 256}, () => []);
      commands.forEach(command => doCommand(boxes, command))
      return boxes
    })
    .then(sumBoxes)
    .then(console.log)
    .catch(console.error)
}
