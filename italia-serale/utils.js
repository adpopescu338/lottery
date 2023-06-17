const { PREMIO_PER_3_NUMBERI, PERMUTATIONS } = require("./constants");
const buildArray = require("../utils/buildArray");

const defaultCategoriesValues = {
  perdite: 0,
  lastWon: 0,
  loss: 0,
};

const categories = {
  "1-20": {
    ...defaultCategoriesValues,
    numbers: buildArray(1, 20),
  },
  "21-40": {
    ...defaultCategoriesValues,
    numbers: buildArray(21, 40),
  },
  "41-60": {
    ...defaultCategoriesValues,
    numbers: buildArray(41, 60),
  },
  "61-80": {
    ...defaultCategoriesValues,
    numbers: buildArray(61, 80),
  },
  "81-10": {
    ...defaultCategoriesValues,
    numbers: [...buildArray(81, 90), ...buildArray(1, 10)],
  },
  "11-30": {
    ...defaultCategoriesValues,
    numbers: buildArray(11, 30),
  },
  "31-50": {
    ...defaultCategoriesValues,
    numbers: buildArray(31, 50),
  },
  "51-70": {
    ...defaultCategoriesValues,
    numbers: buildArray(51, 70),
  },
  "71-90": {
    ...defaultCategoriesValues,
    numbers: buildArray(71, 90),
  },
};

const categories30 = {
  "1-30": {
    ...defaultCategoriesValues,
    numbers: buildArray(1, 30),
  },
  "31-60": {
    ...defaultCategoriesValues,
    numbers: buildArray(31, 60),
  },
  "61-90": {
    ...defaultCategoriesValues,
    numbers: buildArray(61, 90),
  },
};

const getRitardi = () => {
  const ritardi = {};
  for (let i = 1; i <= 90; i++) {
    ritardi[i] = 0;
  }
  return ritardi;
};

const updateRitardi = (estrazione, ritardiOb) => {
  Object.keys(ritardiOb).forEach((key) => {
    if (estrazione.includes(parseInt(key))) {
      ritardiOb[key] = 0;
    } else {
      ritardiOb[key]++;
    }
  });
};

const getStake = (loss) => {
  if (!loss) loss = 1;
  /**
     PREMIO_PER_3_NUMBERI = 45 + 6
    PERMUTATIONS = 4
    x * PREMIO_PER_3_NUMBERI = x * PERMUTATIONS + LOSS
    x * (PREMIO_PER_3_NUMBERI - PERMUTATIONS) = LOSS
    x = LOSS / (PREMIO_PER_3_NUMBERI - PERMUTATIONS)
   */

  let x = Math.ceil(loss / (PREMIO_PER_3_NUMBERI - PERMUTATIONS));

  if (x < 1) {
    x = 1;
  }

  return x;
};

const getStake30 = (loss) => {
  if (!loss) loss = 1;
  /**
     PREMIO_PER_3_NUMBERI = 45 + 6
    PERMUTATIONS = 4
    x * PREMIO_PER_3_NUMBERI = x * PERMUTATIONS + LOSS
    x * (PREMIO_PER_3_NUMBERI - PERMUTATIONS) = LOSS
    x = LOSS / (PREMIO_PER_3_NUMBERI - PERMUTATIONS)
   */

  let x = Math.ceil(loss / (57 - 10));

  if (x < 1) {
    x = 1;
  }

  return x;
};

const clearConsole = () => {
  console.clear();
  console.log("\n".repeat(100));
  console.log("--".repeat(50));
  console.log("\n".repeat(2));
};

module.exports = {
  categories,
  getRitardi,
  updateRitardi,
  getStake,
  clearConsole,
  categories30,
  getStake30,
};
