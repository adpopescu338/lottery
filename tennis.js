function calculateCashout(initialOdds, betAmount, currentOdds) {
    // calculate potential payout from original bet
    let potentialPayout = initialOdds * betAmount;

    // calculate implied probability from current odds
    let impliedProbability = 1 / currentOdds;

    // calculate expected value based on implied probability and potential payout
    let expectedValue = impliedProbability * potentialPayout;

    // If the odds haven't changed, offer back the stake minus the margin
    // If the odds have decreased (your bet is winning), the cashout will be higher
    if (currentOdds === initialOdds) {
        expectedValue = betAmount;
    } else if (currentOdds < initialOdds) {
        expectedValue = Math.max(betAmount, expectedValue);
    }

    // subtract bookmaker's 10% margin
    const cashoutValue = expectedValue * 0.85;

    // return cashout value, rounded to two decimal places for currency
    return Math.floor(Math.round(cashoutValue * 100) / 100);
}

const betAmount = 10;

const initialOdds = [
    1.5,
    2.5
]
const initialOddsSet = [
    1.5,
    2.5
]

const currentOdds = [
    2.5,
    1.5
]

const currentOdds2 = [...currentOdds].reverse();

const team = 1



const result = calculateCashout(2.2, 10, 1.7);
//const result2 = calculateCashout(initialOdds[team], betAmount, currentOdds2[team]);

console.log(result);