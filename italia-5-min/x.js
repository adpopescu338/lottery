const fs = require('fs');
const { join } = require('path');
const estrazioni = JSON.parse(fs.readFileSync(join(__dirname, './italia-5-min.json')));
const generateCombinations = require('../generateCombinations');
const buildArray = require('../utils/buildArray');
const { get } = require('lodash');

// const combinations = generateCombinations(buildArray(1, 3), 2);
// console.log(combinations);

let loss = 0;
let maxLoss = 0;
/*
estrazioni.forEach((estrazione) => {
  const hasWin = combinations.some((numbers) => {
    const numbersMatched = numbers.filter((number) => estrazione.includes(number));

    return numbersMatched.length >= 2;
  });

  if (!hasWin) {
    loss++;
    if (loss > maxLoss) {
      maxLoss = loss;
    }
  } else {
    loss = 0;
  }
});
console.log(`Massima perdita: ${maxLoss}`);
*/
const getStake = (loss = 0) => {
  /**
     X * 14 = (X*3) + loss + 5 
      X * 14 = X*3 + loss + 5
      X*11 = loss + 5
      X = (loss + 5) / 11
     */
  if (loss === 0) {
    return 1;
  }

  let stake = (loss + 2) / 11;

  if (stake < 1) {
    stake = 1;
  }

  return Math.ceil(stake);
};

let i = 0;
let loss2 = 0;

while (i <= 300) {
  const stake = getStake(loss2) * 3;
  console.log({
    i,
    stake,
  });
  i++;
  loss2 += stake
}

