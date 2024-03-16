import * as fs from 'fs';
import _ from 'lodash';

function parse(line) {
  return line.split(/\s+/).slice(1).map(n => parseInt(n))
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
      let times = parse(lines[0]);
      let records = parse(lines[1]);

      let result = _.zip(times, records).map(([time, record]) => ways(time, record))
      return result.reduce((a, b) => a * b)
    })
    .then(console.log)
    .catch(console.error)
}
