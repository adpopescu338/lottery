const fs = require("fs");
const {
  categories,
  updateRitardi,
  getRitardi,
  getStake,
  clearConsole,
} = require("./utils");
const {
  PREMIO_PER_2_NUMBERI,
  PREMIO_PER_3_NUMBERI,
  PREMIO_PER_4_NUMBERI,
  MAX_STAKE,
} = require("./constants");

const ritardi = getRitardi();
const estrazioni = JSON.parse(fs.readFileSync("./loto.json"));
const WAIT_FOR = 50;
const MIN_CATEGORY_RITARDI = 3;
const INITIAL_BUDGET = 10000;

let budget = INITIAL_BUDGET;

const updateCategoryLastWon = (estrazioni) => {
  Object.entries(categories).forEach(([categoryName, { numbers }]) => {
    const numbersMatched = numbers.filter((number) =>
      estrazioni.includes(number)
    );

    if (numbersMatched.length > 2) {
      categories[categoryName].lastWon = 0;
    } else {
      categories[categoryName].lastWon++;
    }
  });
};

// build ritardi
for (let i = 0; i < WAIT_FOR; i++) {
  updateRitardi(estrazioni[i].numbers, ritardi);
  updateCategoryLastWon(estrazioni[i].numbers);
}

const getNumbersToPlay = () => {
  return Object.entries(categories).map(
    ([categoryName, { numbers, lastWon, loss }]) => {
      // select 4 numbers from the category with max ritardo
      const numbersToPlay = numbers
        .sort((a, b) => ritardi[b] - ritardi[a])
        .slice(0, 4)
        .sort();

      const stake = getStake(loss);

      if (stake > MAX_STAKE) {
        console.log(
          `La categoria ${categoryName} ha raggiunto il limite di ${MAX_STAKE}`
        );
        process.exit(0);
      }

      return {
        categoryName,
        numbersToPlay,
        stake,
        totalCategoryStake: stake * 4, // 4 permutations of 3 numbers each
        shouldPlay: lastWon > MIN_CATEGORY_RITARDI,
      };
    }
  );
};

const updateBudgedOnBet = (currentPlay) => {
  console.log(
    `Gioca la categoria ${currentPlay.categoryName} con €${currentPlay.totalCategoryStake}: ${currentPlay.numbersToPlay}`
  );
  if (budget - currentPlay.totalCategoryStake < 0) {
    console.log("Hai finito i soldi. Hai perso.");
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

    console.group(estrazione.date);
    const shouldPlay = currentPlay.some((p) => p.shouldPlay);
    if (shouldPlay) {
      // update the budget. because we just placed the bet
      console.group("Scommesse:");
      currentPlay.forEach((p) => p.shouldPlay && updateBudgedOnBet(p));
      console.groupEnd("Scommesse:");
      console.log("Soldi rimanenti dopo aver scommesso: €", budget);
    } else {
      console.log("Oggi non si gioca");
    }

    // ta-ta-ta.....
    const estrazioneNumbers = estrazione.numbers;

    // check if we won
    currentPlay.forEach((p) => processGame(estrazioneNumbers, p));

    if (shouldPlay) {
      console.log("Soldi rimanenti: €", budget);
    }
    console.groupEnd(estrazione.date);
    console.log("\n");

    updateRitardi(estrazione.numbers, ritardi);
  });
};

start();
