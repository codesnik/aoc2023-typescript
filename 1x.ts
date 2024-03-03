import * as fs from 'fs';

function reverseString(str: string): string {
    return str.split('').reverse().join('');
}

const filePath = process.argv[2];

const numbers = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const reverseNumbers = numbers.map(reverseString);
const matcher = new RegExp("\\d|" + numbers.join("|"));
const reverseMatcher = new RegExp("\\d|" + reverseNumbers.join("|"));

const numbersMapping: Record<string, number> = numbers.reduce((obj: Record<string, number>, num, index) => {
    obj[num] = index;
    return obj;
}, {});

for (let i = 0; i <= 9; i++) { numbersMapping[i.toString()] = i }

let sum = 0;

function dbg(value:any) {
    console.log(value);
    return value
}

fs.promises.readFile(filePath, 'utf-8')
    .then((content) => content.split("\n").slice(0, -1))
    .then((lines) => lines.forEach((line: string) => {
        let firstDigit = numbersMapping[line.match(matcher)![0]];
        let lastDigit = numbersMapping[reverseString(reverseString(line).match(reverseMatcher)![0])];
        let inc = firstDigit * 10 + lastDigit;
        sum += inc
    }))
    .then(() => console.log(sum))
    .catch(console.error);
