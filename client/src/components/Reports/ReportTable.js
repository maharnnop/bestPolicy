import React, { useEffect, useRef  } from "react";
import "./ReportTable.css";
import $ from "jquery"; // Import jQuery
import "datatables.net"; // Import DataTables

export default function ReportTable({
  cols,
  rows,
  setPoliciesData,
  checknetflag,
}) {

  // const tableRef = useRef(null);

  const changestatementtype = (e) => {
    console.log(e.target.name);
    const updatedRows = rows.map((row, index) => {
      if (index === e.target.id) {
        return { ...row, [e.target.name]: e.target.checked };
      }
      return row;
    });
    setPoliciesData(updatedRows);
  };

  const changenetflag = (e) => {
    const updatedRows = rows.map((row, index) => {
      if (index === e.target.id) {
        row.netflag = e.target.checked ? "N" : "G";
      }
      return row;
    });
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
        return (
          <td key={keym}>
            <input
              type="checkbox"
              defaultChecked
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
              defaultChecked
              name="netflag"
              id={index}
              onChange={changenetflag}
            />
          </td>
        );
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
      <thead>
        <tr>{colsElement}</tr>
      </thead>
      <tbody>{rowsElement2}</tbody>
    </table>
    </div>
  );
}
