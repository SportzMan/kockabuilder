import React, {useState} from "react";
import { useTable, useFilters } from "react-table";
import {Container, Table} from "react-bootstrap";




const UserTable = ({columns, data, setSelectedMail}) => {

  const [filterInput, setFilterInput] = useState("");

  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups,
    rows, // rows for the table based on the data passed
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    setFilter
  } = useTable({
    columns,
    data
  },
    useFilters
  );
  

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("username", value); // Update the show.name filter. Now our table will filter and show only the rows which have a matching value
    setFilterInput(value);
  };

  const handleOnClick = (row) => {
    setSelectedMail(row.email);
  };

  return (
    <Container fluid>      
      <input
      value={filterInput}
      onChange={handleFilterChange}
      placeholder={"Keresés"}
      className="form-control"
      />
      <Table id = "usersTable" {...getTableProps()} striped bordered hover>

          <thead>
          {// Loop over the header rows
          headerGroups.map(headerGroup => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
              {// Loop over the headers in each row
              headerGroup.headers.map(column => (
                  // Apply the header cell props
                  <th {...column.getHeaderProps()}>
                  {// Render the header
                  column.render('Header')}
                  </th>
              ))}
              </tr>
          ))}
          </thead>
          {/* Apply the table body props */}
          <tbody {...getTableBodyProps()}>
          {// Loop over the table rows
          rows.map(row => {
              // Prepare the row for display
              prepareRow(row)
              return (
              // Apply the row props
              <tr {...row.getRowProps()} onClick={() => handleOnClick(row.original)}>
                  {// Loop over the rows cells
                  row.cells.map(cell => {
                  // Apply the cell props
                  return (
                      <td {...cell.getCellProps()}>
                      {// Render the cell contents
                      cell.render('Cell')}
                      </td>
                  )
                  })}
              </tr>
              )
          })}
          </tbody>
      </Table>
    </Container>
  );
    //https://blog.logrocket.com/complete-guide-building-smart-data-table-react/#whentouse
}

  export default UserTable;