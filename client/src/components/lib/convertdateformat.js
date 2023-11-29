
export const  convertDateFormat = (inputDate) => {
    // Parse the input date string
    const dateParts = inputDate.split('T')[0].split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    // Create a Date object with the parsed values
    const parsedDate = new Date(year, month - 1, day);

    // Format the date in "dd/MM/yyyy" format
    const formattedDate = `${String(parsedDate.getDate()).padStart(2, '0')}/${String(parsedDate.getMonth() + 1).padStart(2, '0')}/${parsedDate.getFullYear()}`;

    return formattedDate;
}
  export default convertDateFormat;