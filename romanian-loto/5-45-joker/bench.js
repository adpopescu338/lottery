const play = require('./player')
const { writeFileSync } = require('fs')
const { join } = require('path')

const waitFors = [0]//new Array(50).fill(0).map((_, i) => i * 20)

const maxStakes = [
    1,
    2, 3,
    4,
    5, 6, 7, 8,
    20, 50, 100, 1000

]
const budgets = [
    35_0000000,
]

const test = () => {
    console.log('\n'.repeat(50))
    console.log('_'.repeat(50))
    console.log('\n'.repeat(2))
    const data = []


    maxStakes.forEach(MAX_STAKE => {

        budgets.forEach(budget => {
            let budgetResults = []
            for (const WAIT_FOR of waitFors) {
                const values = {
                    WAIT_FOR,
                    MAX_STAKE,
                    budget,
                }
                const result = play(values)
                const money = result.money - budget

                if (money > 0) {
                    budgetResults.push(result)
                }
                else {
                    budgetResults = []
                    break
                }
            }
            if (budgetResults.length) {
                data.push({
                    budget,
                    MAX_STAKE,
                    money: budgetResults
                })
            }

        })
    })

    writeFileSync(join(__dirname, 'bench-result.json'), JSON.stringify(data, null, 2))
    console.log('done')

}


test()