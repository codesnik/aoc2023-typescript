// @ts-check
import * as fs from 'fs';

type Bag = {[color: string]: number};
type Game = [id: number, rounds: Bag[]]

const bag: Bag = { red: 12, green: 13, blue: 14 };

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

fs.promises.readFile(process.argv[2], 'utf-8')
  .then((content) => content.split("\n").slice(0, -1))
  .then(parseGames)
  .then((games: Game[]) =>
    games.filter(
      ([gameId, rounds]) => rounds.every(
        (round) => Object.entries(round).every(([color, cubes]) => cubes <= bag[color])
      )
    )
    .map(([gameId, _rounds]) => gameId)
    .reduce((sum, n) => sum + n, 0)
  )
  .then(console.log)
  .catch(console.error);
