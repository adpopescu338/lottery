const buildArray = (start, end) => {
  return Array.from({ length: end - start + 1 }, (v, k) => k + start);
};

module.exports = buildArray;
