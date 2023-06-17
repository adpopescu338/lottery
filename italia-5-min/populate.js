const axios = require('axios');
const { JSDOM } = require('jsdom');
const { join } = require('path');
const { writeFileSync, readFileSync } = require('fs');
const moment = require('moment');
const chunk = require('lodash/chunk');

const filePath = join(__dirname, './italia-5-min.json');
//https://www.lottologia.com/10elotto5minuti/archivio-estrazioni/?table_view_type=draws&date=2023-6-10&date_num=265&numbers=
const url = 'https://www.lottologia.com/10elotto5minuti/archivio-estrazioni/';

writeFileSync(filePath, '[]');

const getEstrazioni = async (date) => {
  const dt = moment(date).format('YYYY-MM-DD');

  if(dt === moment().format('YYYY-MM-DD')) {
    console.log('Finished');
    return;
  }

  console.log('Fetching', dt);

  const { data } = await axios.get(url, {
    params: {
      date: dt,
      table_view_type: 'draws',
    },
  });

  const document = new JSDOM(data).window.document;

  const estrazioni = Array.from(document.querySelectorAll('td.SERIES'));
  const nrs = estrazioni.map((estrazione) => {
    const textContent = estrazione.textContent.replaceAll('\n', '');

    let numbers = chunk(textContent, 2);
    numbers = numbers.map(([n1, n2]) => {
      return Number(n1 + n2);
    });

    return numbers;
  });

  const previousEstrazioni = JSON.parse(readFileSync(filePath));

  previousEstrazioni.push(...nrs);

  writeFileSync(filePath, JSON.stringify(previousEstrazioni, null, 2));

  date.setDate(date.getDate() + 1);
  getEstrazioni(date);
};

getEstrazioni(new Date('2023-04-01'));
