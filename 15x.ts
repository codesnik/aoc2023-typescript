import * as fs from 'fs';

type Box = Map<string, number>;

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

function doCommand(boxes: Box[], command: string): void {
  let [_matched, label, op, lensStr] = command.match(/(\w+)([=-])(\d?)/);
  let boxIdx = hash(label);

  if (op == "-") {
    boxes[boxIdx].delete(label)
  }
  else {
    let lens = parseInt(lensStr);
    boxes[boxIdx].set(label, lens);
  }
}

function sum(array: number[]): number {
  return array.reduce((a, b) => a+b, 0)
}

/**
  let boxes = Array.from({length: 256}, () => new Map());
  boxes[0] = new Map([["rn", 1], ["cm", 2]]); boxes[3] = new Map([["ot", 7], ["ab", 5], ["pc", 6]])
  sumBoxes(boxes) //=> 145
*/
function sumBoxes(boxes: Box[]): number {
  return sum(boxes.map(
    (box, boxIdx) =>
       (boxIdx + 1) * sum(Array.from(box.values()).map((lens, lensIdx) => (lensIdx + 1) * lens))))
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.slice(0, -1).split(","))
    .then(commands => {
     // create array fo 256 empty arrays
      let boxes: Box[] = Array.from({length: 256}, () => new Map() as Box);
      commands.forEach(command => doCommand(boxes, command))
      return boxes
    })
    .then(sumBoxes)
    .then(console.log)
    .catch(console.error)
}
