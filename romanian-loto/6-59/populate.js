const axios = require('axios')
const { JSDOM } = require('jsdom')
const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')

const filePath = join(__dirname, './romanian-loto.json')

const url = 'https://www.loto.ro/loto-new/newLotoSiteNexioFinalVersion/web/app2.php/jocuri/joker_si_noroc_plus/rezultate_extrageri.html'

writeFileSync(filePath, '[]')

const getEstrazioni = async (date) => {

    date.setMonth(date.getMonth() + 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const now = new Date()

    if (year === now.getFullYear() && month === now.getMonth() + 1) {
        console.log('Finished')
        return;
    }

    const body = `select-year=${year}&select-month=${month}`
    console.log('Fetching', { year, month })

    const { data } = await axios.post(url, body)

    const document = new JSDOM(data).window.document

    const estrazioni = Array.from(document.querySelectorAll('.rezultate-extrageri-content'))

    const parsedEstrazioni = estrazioni.map((estrazione) => {

        const numbers = Array.from(estrazione.querySelectorAll('.numere-extrase:not(.numere-extrase-noroc) img'))
            .map((number) => {
                return parseInt(
                    number.getAttribute('src').split('/').pop().split('.')[0]
                )
            })
        if (!numbers.length) {
            return null
        }

        const joker = numbers.pop()

        let date = estrazione.querySelector('.button-open-details span').textContent.trim()
        date = date.replace(/\./g, '-')

        let premi = Array.from(estrazione.querySelectorAll('tbody tr'))
        premi.pop() // remove last row (total)
        if (premi.length === 9) {
            premi.pop() // remove last row (note)
        }
        premi = premi.map((tr, i) => {
            // return third td (amount)
            try {
                return Number(
                    tr.querySelectorAll('td')[2].textContent?.trim().replace(/\./g, '').replace(/,/, '.')
                )
            } catch (e) {
                console.log('error parsing premi', { date, numbers, joker })
                if (i === 0) {
                    return 100000
                }
                if (i === 1) {
                    return 20000
                }

                if (i === 2) {
                    return 10000
                }

                if (i === 3) {
                    return 1000
                }

                if (i === 4) {
                    return 500
                }

                if (i === 5) {
                    return 100
                }
                throw e
            }
        })

        return {
            date,
            numbers,
            joker,
            premi
        }
    }).filter(Boolean).reverse()

    const previousEstrazioni = JSON.parse(readFileSync(filePath))

    previousEstrazioni.push(...parsedEstrazioni)

    writeFileSync(filePath,
        JSON.stringify(previousEstrazioni, null, 2)
    )

    getEstrazioni(date)
}

getEstrazioni(new Date('2000'))