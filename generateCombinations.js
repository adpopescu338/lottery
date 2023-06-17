const buildArray = require('./utils/buildArray');
const { fixedPremi } = require('./italia-serale/constants');
const { random, sampleSize, get, sample } = require('lodash');

function generateAllCombinations(numbers, n) {
  const combinations = [];

  function combine(start, prefix) {
    if (prefix.length === n) {
      combinations.push(prefix);
      return;
    }

    for (let i = start; i < numbers.length; i++) {
      combine(i + 1, [...prefix, numbers[i]]);
    }
  }

  combine(0, []);
  return combinations;
}

const combine = (numbers, combinationLength, guaranteedMatches) => {
  
  console.log(
    `${combinationLength} din ${numbers.length} cu ${guaranteedMatches} numere garantate`
  );

  const allCombinations = generateAllCombinations(numbers, combinationLength);

  if (guaranteedMatches === 0 || guaranteedMatches === combinationLength) {
    return allCombinations;
  }

  const combinationsWithGuaranteedMatches = allCombinations.filter((combination, i) => {
    const subSequentCombinations = allCombinations.slice(i + 1);

    const combinationSubsets = generateAllCombinations(combination, guaranteedMatches);

    const isRedundant = combinationSubsets.every((subset) => {
      return subSequentCombinations.some((subSequentCombination) => {
        return subset.every((number) => subSequentCombination.includes(number));
      });
    });

    return !isRedundant;
  });
  console.log({
    allCombinations: allCombinations.length,
    combinationsWithGuaranteedMatches: combinationsWithGuaranteedMatches.length,
  });

  test(allCombinations, combinationsWithGuaranteedMatches, guaranteedMatches);
  return combinationsWithGuaranteedMatches;
};

module.exports = combine;

const test = (allCombinations, combinationsWithGuaranteedMatches, guaranteedMatches) => {
  return;
  try {
    allCombinations.forEach((combination) => {
      const hasMatches = combinationsWithGuaranteedMatches.some(
        (combinationWithGuaranteedMatches) => {
          let matchesCount = 0;

          combination.forEach((number) => {
            if (combinationWithGuaranteedMatches.includes(number)) {
              matchesCount++;
            }
          });

          return matchesCount >= guaranteedMatches;
        }
      );

      if (!hasMatches) {
        console.log('No matches for combination', combination);
        throw new Error('No matches for combination');
      }
    });

    console.log('Test passed');
  } catch (e) {
    console.log('Test failed', e);
  }
};

combine(buildArray(1, 9), 2, 2);
