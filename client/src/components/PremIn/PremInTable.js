import React, { useEffect, useRef  } from "react";
import "./PremInTable.css";
import $ from "jquery"; // Import jQuery
import "datatables.net"; // Import DataTables

export default function PremInTable({
  cols,
  rows,
  setPoliciesData,
  checknetflag,
}) {

  // const tableRef = useRef(null);

  const changestatementtype = (e) => {
    console.log(e.target.name);
    const updatedRows = rows.map((row, index) => { 
      return row;
    });
    updatedRows[e.target.id][e.target.name] = e.target.checked 
    console.log(updatedRows);
    setPoliciesData(updatedRows);
  };

  const changenetflag = (e) => {
    const updatedRows = rows.map((row, index) => {
      return row;
    });
    updatedRows[e.target.id][e.target.name] = e.target.checked ? "N" : "G";
    setPoliciesData(updatedRows);
  };
  // useEffect(() => {
  //   // Check if DataTables is already initialized on the table
  //   if (!$.fn.DataTable.isDataTable(tableRef.current)) {
  //     // Initialize DataTables
  //     $(tableRef.current).DataTable({
  //       scrollX: true,
  //       // ... other DataTables options ...
  //     });
  //   }

  //   // Return a cleanup function
  //   return () => {
  //     // Destroy the DataTable instance when the component unmounts
  //     if ($.fn.DataTable.isDataTable(tableRef.current)) {
  //       $(tableRef.current).DataTable().destroy();
  //     }
  //   };
  // }, [rows]); 
  const getColname = (cols) => {
    return Object.entries(cols).map(([key, value]) => (
      <th className="sortable-column" key={key} scope="col">
        {value}
      </th>
    ));
  };

  const getRecord2 = (item, index) => {
    return Object.entries(cols).map(([keym, valuem]) => {
      if (keym === "select") {
        // console.log(index);
        return (
          
          <td key={keym}>
            <input
              type="checkbox"
              defaultChecked = {item[`${keym}`] ?true : false}
              name="select"
              id={index}
              onChange={changestatementtype}
            />
          </td>
        );
      } else if (keym === "netflag" && checknetflag) {
        return (
          <td key={keym}>
            <input
              type="checkbox"
              defaultChecked = {valuem === 'N'?true : false}
              name="netflag"
              id={index}
              onChange={changenetflag}
            />
          </td>
        );
      } else if (keym ==='seqNo'){
        return <td key={keym}> {item[keym]}</td>;
      }
      return <td key={keym}>{typeof(item[keym]) === 'number'? item[keym].toLocaleString(undefined, { minimumFractionDigits: 2 }) : item[keym]}</td>;
    });
  };

  const colsElement = getColname(cols);
  const rowsElement2 = rows.map((item, index) => (
    <tr key={index} scope="row">
      {getRecord2(item, index)}
    </tr>
  ));

  return (
    <div id="contable">
    <table
      id="dtHorizontalExample"
      className="table table-striped table-bordered table-sm"
      cellSpacing="0"
      width="100%"
    >
      <thead className="table-success">
        <tr>{colsElement}</tr>
      </thead>
      <tbody>{rowsElement2}</tbody>
    </table>
    </div>
  );
}
