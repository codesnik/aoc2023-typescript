import * as fs from 'fs';
import * as readline from 'readline';

async function eachLine(filePath: string, callback: Function): Promise<void> {
    const input = fs.createReadStream(filePath);
    const rl = readline.createInterface({input});
    for await (const line of rl) {
        callback(line);
    }
}

const filePath = process.argv[2];
let sum = 0;
eachLine(
    filePath, (line: string) => {
        let digits: string[] = Array.from(line.matchAll(/\d/g)).map(match => match[0]);
        sum += parseInt(digits[0] + digits[digits.length - 1]);
    }
).catch(console.error)
.then(() => console.log(sum));
