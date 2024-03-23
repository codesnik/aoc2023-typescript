import * as fs from 'fs';
import _ from 'lodash';

type Star = [number, number];

/**
  getStars([".#.", "#.#"]) //=> [[1, 0], [0, 1], [2, 1]]
*/
function getStars(lines: string[]): Star[] {
  return lines.flatMap(
    (line, y) =>
      line.split("")
        .flatMap( (c, x) => c == "#" ? x : [])
        .map(x => [x, y] as Star)
  )
}

function flip(stars: Star[]): Star[] {
  return stars.map(([x, y]) => [y, x])
}

function dilateX(stars: Star[]): Star[] {
  const [min, max] = stars.reduce(
    (([min, max], [x, _]) => [Math.min(min, x), Math.max(max, x)]),
    [Infinity, -Infinity]
  );
  let starsByX = _.groupBy(stars, ([x, _]) => x);
  let dilation = 0;

  return _.range(min, max+1).flatMap(i => {
    let col = starsByX[i];
    if (col) {
      return col.map(([x, y]) => [x + dilation, y] as Star)
    }
    else {
      dilation += 1000000 - 1;
      return []
    }
  });
}

function permute(stars: Star[]): [Star, Star][] {
  return stars.flatMap((a, i) => (stars.slice(i+1).map(b => [a, b])));
}

/**
  distance([0, 0], [1, 0]) //=> 1
  distance([0, 0], [1, 1]) //=> 2
  distance([0, 0], [0, 5]) //=> 5
  distance([0, 4], [10, 9) //=> 15
**/
function distance(star1: Star, star2: Star): number {
  return Math.abs(star1[0] - star2[0]) + Math.abs(star1[1] - star2[1])
}

function countDistances(stars: Star[]): number {
  return permute(stars).map(([a, b]) => distance(a, b)).reduce((a, b) => a + b)
}

if (require.main === module) {
  fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then(getStars)
    .then(dilateX)
    .then(flip)
    .then(dilateX)
    //.then(flip)
    .then(countDistances)
    .then(console.log)
    .catch(console.error)
}
