import * as fs from 'fs';

type Bag = {[color: string]: number};
type Game = [id: number, rounds: Bag[]];

function parseSet(cubeStr: string): [string, number] {
  const [num, color] = cubeStr.split(" ")
  return [color, parseInt(num)]
}

function parseRound(roundStr: string): Bag {
  return Object.fromEntries(roundStr.split(", ").map(parseSet))
}

function parseGames(lines: string[]): Game[] {
  return lines.map((line) => {
    const [gameStr, roundsStr] = line.split(": ");
    const gameId = parseInt(gameStr.match(/Game (\d+)/)![1]);
    const rounds = roundsStr.split("; ").map(parseRound)
    return [gameId, rounds]
  })
}

function max(a:number|undefined, b:number|undefined): number {
  a = a || 0;
  b = b || 0;
  return (a > b) ? a : b
}

function minBag(bags: Bag[]): Bag {
  return bags.reduce((bagA, bagB) => ({red: max(bagA.red, bagB.red), blue: max(bagA.blue, bagB.blue), green: max(bagA.green, bagB.green)}))
}

function power(set: Bag): number {
  return (set.red||0)*(set.blue||0)*(set.green||0)
}

fs.promises.readFile(process.argv[2], 'utf-8')
  .then((content) => content.split("\n").slice(0, -1))
  .then(parseGames)
  .then((games: Game[]) =>
    games.map(([gameId, rounds]) => power(minBag(rounds)))
    .reduce((sum, n) => sum + n, 0)
  )
  .then(console.log)
  .catch(console.error);
