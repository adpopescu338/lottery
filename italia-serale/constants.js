const PREMIO_PER_2_NUMBERI = 4; // because we have 4 numbers, 4 permutations of 3 numbers each. so each couple of numbers is repeated twice
const PREMIO_PER_3_NUMBERI = 45 + 6; // 45 for the 3 numbers match, and 6 for the 2 numbers match
const PREMIO_PER_4_NUMBERI = 180;
const MAX_STAKE = 100;
const PERMUTATIONS = 4;

const fixedPremi = {
  1:{
    0: 0,
    1: 3
  },
  2:{
    0: 0,
    1: 0,
    2: 14
  },
  3:{
    0: 0,
    1: 0,
    2: 2,
    3: 45
  },
  4:{
    0: 0,
    1: 0,
    2: 1,
    3: 10,
    4: 90
  },
  5:{
    0: 0,
    1: 0,
    2: 1,
    3: 4,
    4: 15,
    5: 140
  },
  6:{
    0: 0,
    1: 0,
    2: 0,
    3: 2,
    4: 10,
    5: 100,
    6: 1000
  },
  7:{
    0: 1,

    1: 0,
    2: 0,
    3: 0,
    4: 4,
    5: 40,
    6: 400,
    7: 1600
  },
  8:{
    0: 1,

    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 20,
    6: 200,
    7: 800,
    8: 10000
  },
  9:{

    0: 2,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 10,
    6: 40,
    7: 400,
    8: 2000,
    9: 100000
  },
  10:{
    0: 2,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 5,
    6: 15,
    7: 150,
    8: 1000,
    9: 20000,
    10: 1000000
  }
}

module.exports = {
  PREMIO_PER_2_NUMBERI,
  PREMIO_PER_3_NUMBERI,
  PREMIO_PER_4_NUMBERI,
  MAX_STAKE,
  PERMUTATIONS,
  fixedPremi
};
