import React, {useState} from "react";
import { useTable, useFilters } from "react-table";
import {Container, Table} from "react-bootstrap";


const UserTable = ({columns, data, setSelectedMail}) => {

  const [filterInput, setFilterInput] = useState("");

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter
  } = useTable({
    columns,
    data
  },
    useFilters
  );
  

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("username", value); // Név alapú keresőfilter beállítása
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
          {
          headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
              {
              headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                  {
                  column.render('Header')}
                  </th>
              ))}
              </tr>
          ))}
          </thead>
          <tbody {...getTableBodyProps()}>
          {
          rows.map(row => {
              prepareRow(row)
              return (
              <tr {...row.getRowProps()} onClick={() => handleOnClick(row.original)}>
                  {
                  row.cells.map(cell => {
                  return (
                      <td {...cell.getCellProps()}>
                      {
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