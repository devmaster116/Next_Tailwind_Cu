export const formatRoundUp = (num: number) => {
  const convertToNumber = Number(num);
  if (!isNaN(convertToNumber)) {
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(convertToNumber);
  } else {
    // invalid number
    return 0;
  }
};
