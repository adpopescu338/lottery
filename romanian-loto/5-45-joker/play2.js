const buildArray = require('../../utils/buildArray');
const {readFileSync} = require('fs');
const generateCombinations = require('../../generateCombinations');
const { join } = require('path');

const estrazioni = JSON.parse(readFileSync(
    join(__dirname, './romanian-loto.json')
));

let combinazioni = [
    generateCombinations(buildArray(1, 22), 5, 3),
    generateCombinations(buildArray(23, 45), 5, 3),
].flat();
const jokers = buildArray(1, 20);

combinazioni = jokers.map(joker=>{
    return combinazioni.map(combinazione=>{
        return {
            numbers: combinazione,
            joker
        }
    })
}).flat();

console.log(combinazioni.length)

const play = () => {
    let budget = 100_000;

    let win = 0;

    estrazioni.forEach(estrazione => {

    });
}