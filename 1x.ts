import * as fs from 'fs';

const digits: string[] = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

const digitsMapping: Record<string, number> = {}

Object.entries(digits).forEach(([index, digit]) => digitsMapping[digit] = parseInt(index) + 1 );
for (let i = 1; i <= 9; i++) { digitsMapping[i.toString()] = i }

function firstDigit(line: string): number {
    return Object.entries(digitsMapping)
        .map(([substr, value]) => [line.indexOf(substr), value])
        .filter(([index, value]) => index !== -1)
        .reduce((min, [index, value]) => (index < min[0] ? [index, value] : min))[1];
}

function lastDigit(line: string): number {
    return Object.entries(digitsMapping)
        .map(([substr, value]) => [line.lastIndexOf(substr), value])
        .filter(([index, value]) => index !== -1)
        .reduce((max, [index, value]) => (index > max[0] ? [index, value] : max))[1];
}

let sum = 0;

fs.promises.readFile(process.argv[2], 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => lines.forEach((line: string) => {
        sum += firstDigit(line) * 10 + lastDigit(line);
    }))
    .then(() => console.log(sum))
    .catch(console.error);
