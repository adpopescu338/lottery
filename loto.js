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

const estrazioni = JSON.parse(fs.readFileSync("./loto.json"));

const buildArray = (start, end) => {
  return Array.from({ length: end - start + 1 }, (v, k) => k + start);
};

const WAIT_FOR = 213;

let budget = 10000;

const stakeIncreases = [
  1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 5, 5, 5, 5, 10, 10, 10,
  20, 20, 20, 30, 30, 40, 40, 40, 40, 40, 50, 50, 50, 50, 50, 50, 60, 60, 60,
  60, 60, 60, 60, 60, 60, 60, 70, 70, 70,
];

const categories = {
  "1-20": {
    numbers: buildArray(1, 20),
    perdite: 0,
  },
  "21-40": {
    numbers: buildArray(21, 40),
    perdite: 0,
  },
  "41-60": {
    numbers: buildArray(41, 60),
    perdite: 0,
  },
  "61-80": {
    numbers: buildArray(61, 80),
    perdite: 0,
  },
  "81-10": {
    numbers: [...buildArray(81, 90), ...buildArray(1, 10)],
    perdite: 0,
  },
  "11-30": {
    numbers: buildArray(11, 30),
    perdite: 0,
  },
  "31-50": {
    numbers: buildArray(31, 50),
    perdite: 0,
  },
  "51-70": {
    numbers: buildArray(51, 70),
    perdite: 0,
  },
  "71-90": {
    numbers: buildArray(71, 90),
    perdite: 0,
  },
};

const ritardi = getRitardi()

const updateRitardi = (estrazione) => {
  Object.keys(ritardi).forEach((key) => {
    if (estrazione.includes(parseInt(key))) {
      ritardi[key] = 0;
    } else {
      ritardi[key]++;
    }
  });
};

// build ritardi
for (let i = 0; i < WAIT_FOR; i++) {
  updateRitardi(estrazioni[i].numbers);
}

const getNumbersToPlay = () => {
  return Object.entries(categories).map(
    ([categoryName, { numbers, perdite }]) => {
      // select 4 numbers from the category with max ritardo
      const numbersToPlay = numbers
        .sort((a, b) => ritardi[b] - ritardi[a])
        .slice(0, 4);

      const stake = stakeIncreases[perdite];
      if (!stake) {
        console.log(
          `La categoria ${categoryName} ha raggiunto il limite di perdite. Ha perso ${perdite} volte di fila.`
        );
        process.exit(0);
      }

      return {
        categoryName,
        numbersToPlay,
        stake,
        totalCategoryStake: stake * 4, // 4 permutations of 3 numbers each
      };
    }
  );
};

const updateBudgedOnBet = (stake) => {
  if (budget - stake < 0) {
    console.log("Hai finito i soldi. Hai perso.");
    process.exit(0);
  } else {
    budget -= stake;
  }
};

// eliminate the estrazioni used to build ritardi
estrazioni.splice(0, WAIT_FOR);

clearConsole()

estrazioni.forEach((estrazione) => {
  const currentPlay = getNumbersToPlay();

  // update the budget. because we just placed the bet
  currentPlay.forEach(({ totalCategoryStake }) => {
    updateBudgedOnBet(totalCategoryStake, categories);
  });

  // ta-ta-ta.....
  const estrazioneNumbers = estrazione.numbers;
  console.group(`${estrazione.date}: ${estrazioneNumbers}`);

  // check if we won
  currentPlay.forEach(({ categoryName, numbersToPlay, stake }) => {
    const numbersMatched = numbersToPlay.filter((number) =>
      estrazioneNumbers.includes(number)
    );

    switch (numbersMatched.length) {
      case 4:
        {
          budget += PREMIO_PER_4_NUMBERI * stake;
          categories[categoryName].perdite = 0;

          const premio = PREMIO_PER_4_NUMBERI * stake;
          console.log("Grande!!!!!!");
          console.log(
            `Hai vinto ${premio}€ con la categoria ${categoryName}. I numeri che hai indovinato sono: ${numbersMatched}`
          );
        }
        break;
      case 3:
        {
          budget += PREMIO_PER_3_NUMBERI * stake;
          categories[categoryName].perdite = 0;

          const premio = PREMIO_PER_3_NUMBERI * stake;
          console.log(
            `Hai vinto ${premio}€ con la categoria ${categoryName}. I numeri che hai indovinato sono: ${numbersMatched}`
          );
        }
        break;
      case 2:
        {
          budget += PREMIO_PER_2_NUMBERI * stake;
          // don't reset perdite

          const premio = PREMIO_PER_2_NUMBERI * stake;
          console.log(
            `Hai vinto ${premio}€ con la categoria ${categoryName}. I numeri che hai indovinato sono: ${numbersMatched}`
          );
        }
        break;
      default:
        categories[categoryName].perdite++;
    }
  });

  console.log("Soldi rimanenti: €", budget);
  console.groupEnd(`${estrazione.date}: ${estrazioneNumbers}`);
  console.log("\n");

  updateRitardi(estrazione.numbers);
});
