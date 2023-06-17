const fs = require('fs');
const { join } = require('path');
const { categories, updateRitardi, getRitardi, getStake, clearConsole } = require('./utils');

const PREMIO_PER_2_NUMBERI = 14;

const ritardi = getRitardi();
const estrazioni = JSON.parse(fs.readFileSync(join(__dirname, './loto.json')));
const WAIT_FOR = 50;
const INITIAL_BUDGET = 10_000;

let budget = INITIAL_BUDGET;


// build ritardi
for (let i = 0; i < WAIT_FOR; i++) {
  updateRitardi(estrazioni[i].numbers, ritardi);
}

const getNumbersToPlay = () => {
  const sorted =  Object.entries(ritardi).sort(([, ritardi], [, ritardi2]) => {
    // sort by ritardi

    return  ritardi2 - ritardi;
  })

  // return the first 2

  const [first, second] = sorted;

  const firstCategory = first[0];
  const secondCategory = second[0];

  return [
    firstCategory,
    secondCategory,
  ]
};

const updateBudgedOnBet = (currentPlay) => {
  console.log(
    `Gioca la categoria ${currentPlay.categoryName} con €${currentPlay.totalCategoryStake}: ${currentPlay.numbersToPlay}`
  );
  if (budget - currentPlay.totalCategoryStake < 0) {
    console.log('Hai finito i soldi. Hai perso.');
    process.exit(0);
  } else {
    budget -= currentPlay.totalCategoryStake;
    categories[currentPlay.categoryName].loss += currentPlay.totalCategoryStake;
  }
};

const processGame = (
  estrazioneNumbers,
  { categoryName, numbersToPlay, stake, shouldPlay, totalCategoryStake }
) => {
  const numbersMatched = numbersToPlay
    .filter((number) => estrazioneNumbers.includes(number))
    .sort();

  const winMessage = (p) =>
    `Hai scommesso €${totalCategoryStake} e vinto €${p} con la categoria ${categoryName}. I numeri che hai indovinato sono: ${numbersMatched}`;

  //console.log({ shouldPlay, categoryName, numbersToPlay, numbersMatched });
  if (numbersMatched.length === 4) {
    if (shouldPlay) {
      const premio = PREMIO_PER_4_NUMBERI * stake;
      budget += premio;
      categories[categoryName].perdite = 0;
      categories[categoryName].loss -= premio;
      console.log(winMessage(premio));
    }

    categories[categoryName].lastWon = 0;
  } else if (numbersMatched.length === 3) {
    if (shouldPlay) {
      const premio = PREMIO_PER_3_NUMBERI * stake;
      budget += premio;
      categories[categoryName].loss -= premio;
      if (categories[categoryName].loss < 0) {
        categories[categoryName].loss = 0;
      }
      categories[categoryName].perdite = 0;

      console.log(winMessage(premio));
    }

    categories[categoryName].lastWon = 0;
  } else if (numbersMatched.length === 2) {
    if (shouldPlay) {
      const premio = PREMIO_PER_2_NUMBERI * stake;
      budget += premio;
      categories[categoryName].loss -= premio;
      if (categories[categoryName].loss < 0) {
        categories[categoryName].loss = 0;
      }
      // don't reset perdite
      console.log(winMessage(premio));
    }
    categories[categoryName].lastWon = 0;
  } else {
    categories[categoryName].lastWon++;
    categories[categoryName].perdite++;
  }
};

// eliminate the estrazioni used to build ritardi
estrazioni.splice(0, WAIT_FOR);

const start = () => {
  clearConsole();
  estrazioni.forEach((estrazione) => {
    const currentPlay = getNumbersToPlay();
    console.log({
      currentPlay,
      ritardi
    })
return
    console.group(estrazione.date);
    const shouldPlay = currentPlay.some((p) => p.shouldPlay);
    if (shouldPlay) {
      // update the budget. because we just placed the bet
      console.group('Scommesse:');
      currentPlay.forEach((p) => p.shouldPlay && updateBudgedOnBet(p));
      console.groupEnd('Scommesse:');
      console.log('Soldi rimanenti dopo aver scommesso: €', budget);
    } else {
      console.log('Oggi non si gioca');
    }

    // ta-ta-ta.....
    const estrazioneNumbers = estrazione.numbers;

    // check if we won
    currentPlay.forEach((p) => processGame(estrazioneNumbers, p));

    if (shouldPlay) {
      console.log('Soldi rimanenti: €', budget);
    }
    console.groupEnd(estrazione.date);
    console.log('\n');

    updateRitardi(estrazione.numbers, ritardi);
  });
};

start();
