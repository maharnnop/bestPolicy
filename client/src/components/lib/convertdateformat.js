
export const  convertDateFormat = (inputDate,withT =true) => {
    // Parse the input date string
    let dateParts 

    if (withT) { // for pattern 2023-09-14T03:44:19.691Z => 14/09/2023
       dateParts = inputDate.split('T')[0].split("-");
      
    }else{ //for pattern 2024-01-30 => 30/01/2024
      dateParts = inputDate.split("-");
    }
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