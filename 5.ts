import * as fs from 'fs';
import _ from 'lodash';

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => {
      let seeds: number[] = lines.shift()!.split(" ").slice(1).map(n => parseInt(n));
      let source: number[] = [];
      let dest: number[] = seeds;

      while (lines.length > 0) {
        let line = lines.shift();
        if (line == "") {
          lines.shift();
          source = [...dest];
        } else {
          let [destStart, sourceStart, len] = line!.split(" ").map(n => parseInt(n));
          source.forEach((n, i) => {
            if ((sourceStart <= n) && (n < sourceStart + len)) {
              dest[i] = n - sourceStart + destStart
            }
          })
        }
      }

      return Math.min(...dest)
    })
    .then(console.log)
    .catch(console.error)
}
