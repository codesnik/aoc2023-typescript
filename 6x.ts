import * as fs from 'fs';

function parse(line) {
  return parseInt(line.split(/\s+/).slice(1).join(""));
}

function distance(time, push) {
  return push * (time-push)
}

// still the same naive solution
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
      let time = parse(lines[0]);
      let record = parse(lines[1]);

      return ways(time, record);
    })
    .then(console.log)
    .catch(console.error)
}
