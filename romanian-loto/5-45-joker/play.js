const { readFileSync, writeFileSync } = require('fs')
const chunk = require('lodash/chunk')
const { join } = require('path')

const WAIT_FOR = 0
const MAX_STAKE = 1

const logger = (() => {
    const data = []
    return {
        log: (...args) => {
            data.push(args)
            console.log(...args)
        },
        save: () => {
            writeFileSync(
                join(__dirname, './romanian-loto.log.json'),
                JSON.stringify(data.flat(), null, 2)
            )
        }
    }
})()


let budget = 100_000
let loss = 0;
let estrazioni = JSON.parse(readFileSync(
    join(__dirname, './romanian-loto.json')
))
logger.log(`Loaded ${estrazioni.length} estrazioni starting from ${estrazioni[0].date}`)

estrazioni = estrazioni.slice(WAIT_FOR)

if (WAIT_FOR) {
    logger.log(`Removed first ${WAIT_FOR} estrazioni. Starting from ${estrazioni[0].date}`)
}

const totNumbers = new Array(20).fill(0).map((_, i) => i + 1)
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

const getStake = (premio) => {
    const combinationsCost = combinazioni.length * 6.5
    const baseWin = premio[4] + (premio[5] * 19) //+ premio[7] * 2

    /*
    X*baseWin = X*combinationsCost + loss
    X*(baseWin - combinationsCost) = loss
    X = loss / (baseWin - combinationsCost)
    */
    const stake = Math.abs(Math.ceil(loss / (baseWin - combinationsCost)))
    console.log({ stake, baseWin, combinationsCost, loss })
    if (!stake) return 1
    if(loss === 0) return 1

    
        if (stake * combinationsCost > budget) {
            return Math.ceil(budget / combinationsCost)
        }

        if (stake > MAX_STAKE) {
            return MAX_STAKE
        }

        return stake
}

const updateLoss = (winForThisCombination) => {
    if (winForThisCombination < 0) {

        loss += winForThisCombination
    } else {
        loss += winForThisCombination
        if (loss > 0) {
            loss = 0
        }
    }
}

console.log('\n'.repeat(50))
console.log('____'.repeat(50))
estrazioni.forEach((estrazione) => {

    if (budget <= 0) {
        logger.log('No more money')
        process.exit(0)
    }
    const stake = getStake(estrazione.premi)
    const totalPlayCost = (stake * 6.5 * combinazioni.length)

    if (budget - totalPlayCost <= 0) {
        // no more money!!!!!!!!!!!
        logger.log('No more money')
        process.exit(0)
    }

    let winForThisCombination = -totalPlayCost

    logger.log(`${estrazione.date}: Total stake: ${totalPlayCost}`)

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


        let shouldLog = false;
        if (hasJokerMatch && numbersMatched.length) {
            shouldLog = true
        } else if (!hasJokerMatch && numbersMatched.length > 2) {
            shouldLog = true
        }

        if (shouldLog) {
            //  logger.log(`Numbers: ${estrazione.numbers}. Joker: ${estrazione.joker}.`)
            logger.log(`Matched ${numbersMatched.length} numbers ${numbersMatched}. Joker: ${hasJokerMatch}. Premio: ${premio} `)
        }
        winForThisCombination += premio

    })
    updateLoss(winForThisCombination)

    budget += winForThisCombination
    budget = Math.floor(budget)


    logger.log(`winForThisCombination: ${winForThisCombination}. Budget: ${budget}`)

})

logger.log(`Final budget: ${budget}`)
logger.save()