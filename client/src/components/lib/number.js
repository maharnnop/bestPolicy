export const  numberWithCommas = (field) => {
    // Get the input field ID
    let element = document.getElementById(field.id);
    // Replace all the commas of input field value with empty value
    // And assign it to amount variable
    let amount = element.value.replace(/,/g, '');

    // Check if the amount contains (-) sign in the beginning
    if(amount.charAt(0)==='-'){
    // if amount contains (-) sign, remove first character then replace all
    // (-) signs from the amount with empty value & concate (-) in amount
        amount = '-'+amount.substring(1).replace(/-/g, '');
    }else{
    // Replace all (-) signs from the amount with empty value
        amount = amount.replace(/-/g, '');
    }
    // First add commas into the amount then update the input field value
    element.value = amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return element
}
  export default numberWithCommas;