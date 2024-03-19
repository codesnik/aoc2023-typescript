import * as fs from 'fs';
import _ from 'lodash';

function parse(line) {
  return line.split(/\s+/).slice(1).map(n => parseInt(n))
}

/**
  ways(7, 9) //=> 4
  ways(15, 40) //=> 8
  ways(30, 200) // => 9
  ways(71530, 940200) //=> 71503
  ways(48989083, 390110311121360) //=> 28973936
*/
function ways(time, record) {
  let d = Math.sqrt(time*time - 4*record);
  let root1 = (time - d)/2;
  let root2 = (time + d)/2;
  // we shouldn't include root if it's integer
  let rounded_root1 = Math.max(1, Math.floor(root1) + 1)
  let rounded_root2 = Math.min(time-1, Math.ceil(root2) - 1)
  return rounded_root2 - rounded_root1 + 1
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let times = parse(lines[0]);
      let records = parse(lines[1]);

      let result = _.zip(times, records).map(([time, record]) => ways(time, record))
      return result.reduce((a, b) => a * b)
    })
    .then(console.log)
    .catch(console.error)
}
