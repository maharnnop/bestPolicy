export const  stringToNumber = (value) => { // input number with comma 2 decimal
  const integerValue = parseFloat(value.replace(/,/g, ''), 10);
  return integerValue
}
export const  NumberToString = (value) => { // input number with comma 2 decimal
  const integerValue = parseFloat(value).toFixed(2);
  const formattedInteger = parseFloat(value, 10).toLocaleString('en-US',{
    maximumFractionDigits: 2,
  });
  return formattedInteger
}
