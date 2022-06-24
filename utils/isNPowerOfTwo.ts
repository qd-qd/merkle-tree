const isNPowerOfTwo = (number: number): boolean => {
  const log2Number = Math.log2(number);
  // return true only if Math.log2(x) is a integer different than 0
  return Number.isInteger(log2Number) && log2Number !== 0;
};

export default isNPowerOfTwo;
