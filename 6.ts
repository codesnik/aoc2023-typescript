import * as fs from 'fs';
import _ from 'lodash';

function parse(line) {
  return line.split(/\s+/).slice(1).map(n => parseInt(n))
}

function distance(time, push) {
  return push * (time-push)
}

// naive solution
function ways(time, record) {
  let cnt = 0
  for (let push = 1; push < time; push++) {
    if (distance(time, push) > record) cnt++;
  }
  return cnt
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
