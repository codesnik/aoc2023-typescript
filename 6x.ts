import * as fs from 'fs';

function parse(line) {
  return parseInt(line.split(/\s+/).slice(1).join(""));
}

/**
  ways(7, 9) //=> 4
  ways(71530, 940200) //=> 71503
  ways(48989083, 390110311121360) //=> 28973936
*/
function ways(time, record) {
  // push*push - time*push + record < 0
  let d = Math.sqrt(time*time - 4*record);
  let root1 = (time - d)/2;
  let root2 = (time + d)/2;
  return Math.min(time, Math.floor(root2)) - Math.max(0, Math.ceil(root1)) + 1
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let time = parse(lines[0]);
      let record = parse(lines[1]);

      return ways(time, record);
    })
    .then(console.log)
    .catch(console.error)
}
