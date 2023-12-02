export const  numberWithCommas = (input) => { // input number with comma 2 decimal
    let sanitizedValue = input.value.replace(/[^0-9.]/g, '');

    // Split the value into integer and decimal parts
    const [integerPart, decimalPart] = sanitizedValue.split('.');

    // Format the integer part with commas
    const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');

    // Combine the formatted integer and the decimal part (if exists)
    const formattedValue = decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;

    // Update the input value
    input.value = formattedValue;
}
  export default numberWithCommas;