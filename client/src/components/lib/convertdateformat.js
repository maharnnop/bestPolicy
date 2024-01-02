
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
export const  getDateReport = (type) => {
  // Parse the input date string
  let inputDate = new Date().toLocaleDateString()
  let dateParts = inputDate.split('T')[0].split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];

  // Create a Date object with the parsed values
  const parsedDate = new Date(year, month - 1, day);
let formattedDate
  if (type ='D') { // for pattern 2023-09-14T03:44:19.691Z => 14/09/2023
    formattedDate = `${String(parsedDate.getDate()).padStart(2, '0')}_${String(parsedDate.getMonth() + 1).padStart(2, '0')}_${parsedDate.getFullYear()}`;
 }else if (type ='M'){ //for pattern 2024-01-30 => 30/01/2024
 formattedDate = `${String(parsedDate.getMonth() + 1).padStart(2, '0')}_${parsedDate.getFullYear()}`;
 }else if (type = 'Y'){
  formattedDate = `${parsedDate.getFullYear()}`;

 }
  

  console.log(formattedDate);
  return formattedDate;
}

// date obj to yyyy-mm-dd
export const  convertDate2= (date,format,nextday = false) => {
  // Parse the input date string
  try{
    
    if (nextday) {
      date.setDate(date.getDate() + 1);
     
    }
    let inputDate = date.toLocaleDateString() // MM/dd/yyyy 
      let dateParts
      if (format === 1) { // for pattern MM/dd/yyyy  => yyyy-mm-dd
        dateParts = inputDate.split('/');
        
      }
      const year = dateParts[2];
      const month = dateParts[0];
      const day = dateParts[1];

      // Create a Date object with the parsed values
      const parsedDate = new Date(year, month - 1, day);

      // Format the date in "dd/MM/yyyy" format
      let formattedDate = null
      if (format === 1) {
        formattedDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
        
      }

      return formattedDate;}
  catch{
    return null
  }
}
  export default convertDateFormat;