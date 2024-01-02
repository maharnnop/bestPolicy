export const  numberWithCommas = (input) => { // input number with comma 2 decimal
    let sanitizedValue = input.value.replace(/[^0-9.]/g, '');
console.log(input.value);
    // Split the value into integer and decimal parts
    let [integerPart, decimalPart] = sanitizedValue.split('.');

    // Format the integer part with commas
    const formattedInteger = parseInt(integerPart, 10).toLocaleString('en-US');
    // Combine the formatted integer and the decimal part (if exists)
    let formattedValue =0
    if (integerPart === '') {
      formattedValue = 0
    }else if(decimalPart !== undefined){
      decimalPart = decimalPart.substring(0,2)
      formattedValue  = `${formattedInteger}.${decimalPart}`
    }else{

      formattedValue =  formattedInteger;
    }
    
    
    // Update the input value
    input.value = formattedValue;
    // input.value = sanitizedValue
}

export const  numberpercentfixdigit = (input) => { // input number with comma 2 decimal
  
  const init = input.value.replace(/[^0-9.]/g, '');
  

  // Use test to check if the input value matches the pattern
  if (/^\d{0,2}?$/.test(init)) {
    console.log('case1');
    // If it matches, update the input value
    input.value =  parseInt(init);
  }else if (/^(\d{0,2}\.\d{0,2})?$/.test(init)) {
    console.log(init);
    input.value = init;
  }else{
    console.log('case3');
    input.value = 0
  }
}
  export default numberWithCommas;