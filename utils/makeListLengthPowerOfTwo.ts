const makeListLengthPowerOfTwo = (
  list: Array<string>,
  placeholder: string
): Array<string> => {
  // calculate the log2 of the list length
  const log2ListLength = Math.log2(list.length);

  // calculate the number of elements that must be added to the list
  // to make the length a power of 2
  const numberElementMissing =
    2 ** (Math.trunc(log2ListLength) + 1) - list.length;

  // add as many placholder as we need
  for (let i = 0; i < numberElementMissing; i++) {
    list.push(placeholder);
  }

  return list;
};

export default makeListLengthPowerOfTwo;
