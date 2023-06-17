const { readFileSync, writeFileSync } = require('fs')
const chunk = require('lodash/chunk')
const { join } = require('path')

const fullEstrazioni = JSON.parse(readFileSync(
    join(__dirname, './romanian-loto.json')
))

const play = ({
    WAIT_FOR = 0,
    MAX_STAKE,
    budget,
    PLAYING_NUMBERS_LIMIT = 40 // How many numbers to play
}) => {
    let loss = 0;
    const estrazioni = fullEstrazioni.slice(WAIT_FOR)

    const totNumbers = new Array(PLAYING_NUMBERS_LIMIT).fill(0).map((_, i) => i + 1)
    const jokers = new Array(20).fill(0).map((_, i) => i + 1)
    const combinazioni = jokers.flatMap((joker) => {
        const chunks = chunk(totNumbers, 5)

        return chunks.map((numbers) => (
            {
                numbers,
                joker
            }
        ))
    })

    for (const estrazione of estrazioni) {

        const stake = getStake({
            premio: estrazione.premi,
            loss,
            MAX_STAKE,
            budget,
            combinazioni
        })
      

        const totalPlayCost = (stake * 6.5 * combinazioni.length)


        if (budget - totalPlayCost <= 0) {
            // no more money!!!!!!!!!!!
            budget = 0
            break
        }

        let winForThisCombination = -((combinazioni.length * stake * 6) + combinazioni.length * 0.5)

        combinazioni.forEach((combinazione) => {
            const hasJokerMatch = combinazione.joker === estrazione.joker
            const numbersMatched = combinazione.numbers.filter((number) =>
                estrazione.numbers.includes(number)
            )

            const premio = Math.floor(getPremio(
                numbersMatched.length,
                hasJokerMatch,
                estrazione.premi
            )) * stake

            winForThisCombination += premio

        })
        loss = updateLoss(winForThisCombination, loss)

        budget += winForThisCombination
        budget = Math.floor(budget)
    }

    return {
        money: budget,
        date: estrazioni[0].date
    }
}

const getPremio = (numbersMatched, hasJokerMatch, premi) => {
    if (hasJokerMatch) {
        switch (numbersMatched) {
            case 5:
                return premi[0]
            case 4:
                return premi[2]
            case 3:
                return premi[4]
            case 2:
                return premi[6]
            case 1:
                return premi[7]
            default:
                return 0
        }
    }

    switch (numbersMatched) {
        case 5:
            return premi[1]
        case 4:
            return premi[3]
        case 3:
            return premi[5]
        default:
            return 0
    }
}

const getStake = ({ premio, loss, MAX_STAKE, budget, combinazioni }) => {
    return 1
    const combinationsCost = combinazioni.length * 6.5
    const baseWin = premio[4] + (premio[5] * 19) + premio[7] * 2

    /*
    X*baseWin = X*combinationsCost + loss
    X*(baseWin - combinationsCost) = loss
    X = loss / (baseWin - combinationsCost)
    */
    const x = Math.abs(loss / (baseWin - combinationsCost))

    if (loss < 0) {
        const stake = Math.ceil(x)

        if (!stake) {
            return 1
        }

        if (stake * combinationsCost > budget) {
            return Math.ceil(budget / combinationsCost)
        }

        if (stake > MAX_STAKE) {
            return MAX_STAKE
        }

        return stake
    }

    return 1
}

const updateLoss = (winForThisCombination, loss) => {
    if (winForThisCombination < 0) {

        loss += winForThisCombination
    } else {
        loss += winForThisCombination
        if (loss > 0) {
            loss = 0
        }

    }

    return loss
}

module.exports = play