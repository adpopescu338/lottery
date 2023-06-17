const { writeFileSync } = require('fs');

const getLogger = (path, log = true) => {
  const data = [];
  let groupStarted = false;
  return {
    log: (...args) => {
      data.push(args);
      if (log) {
        console.log(...args);
      }
    },
    group: () => {
      groupStarted = true;
    },

    groupEnd: () => {
      groupStarted = false;
    },
    save: () => {
      writeFileSync(path, JSON.stringify(data.flat(), null, 2));
    },
  };
};

module.exports = getLogger;
