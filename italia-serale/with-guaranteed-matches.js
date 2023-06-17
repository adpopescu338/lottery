const generateCombinations = require('../generateCombinations');
const { readFileSync } = require('fs');
const { join } = require('path');
const { buildArray, clearConsole } = require('./utils');
const { fixedPremi } = require('./constants');
const getLogger = require('../utils/getLogger');

const logger = getLogger(join(__dirname, './loto.log.json'), false);

const playingNumbers = 3;
const guaranteedMatches = 2;

const combinations = [
  generateCombinations(buildArray(1, 16), playingNumbers, guaranteedMatches),
  //generateCombinations(buildArray(16, 30), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(21, 30), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(31, 40), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(41, 50), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(51, 60), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(61, 70), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(71, 80), playingNumbers, guaranteedMatches),
  //generateCombinations(buildArray(41, 60), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(21, 30), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(31, 40), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(41, 50), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(51, 60), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(61, 70), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(71, 80), playingNumbers, guaranteedMatches),
  // generateCombinations(buildArray(81, 90), playingNumbers, guaranteedMatches),
].flat();

//clearConsole();
console.log('Combinations', combinations.length);

const estrazioni = JSON.parse(readFileSync(join(__dirname, './loto.json')));

const getStake = (loss, budget) => {
  /*
  X*390 = X+loss
  X*390 - X = loss
  X(390 - 1) = loss
  X = loss / 389
  */
  if (loss === 0) {
    return 1;
  }

  let stake = Math.abs(loss) / 389;

  if (stake * combinations.length > budget) {
    stake = budget / combinations.length;
  }

  return Math.ceil(stake);
};

const play = () => {
  let loss = 0;
  let budget = 1_000;

  for (const estrazione of estrazioni) {
    let stake = getStake(loss, budget);
    logger.log(`${estrazione.date}  -- ${stake * combinations.length}`);
    //  console.log({ stake });
    budget -= combinations.length * stake;
    loss += combinations.length * stake;
    let win = 0;
    console.group();
    combinations.forEach((combination) => {
      const numbersMatched = combination.filter((number) => estrazione.numbers.includes(number));
      const premio = fixedPremi[playingNumbers][numbersMatched.length] * stake;

      if (premio) {
        logger.log(`Matched ${numbersMatched.length}: ${numbersMatched}. Premio: ${premio}`);
        win += premio;
        loss -= premio;
        if (loss < 0) {
          loss = 0;
        }
      }
    });
    console.groupEnd();
    if (win - combinations.length * stake > 0) {
      logger.log(`Won ${win} for this extraction.`);
    }
    budget += win;

    logger.log(`Budget: ${budget}`);
    if (budget <= 0) {
      logger.log('No more money');
      break;
    }
  }

  logger.log({ budget });
  console.log({ budget });
  logger.save();
};

play();
