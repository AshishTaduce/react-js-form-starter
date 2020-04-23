import React from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

export default function UsersTable(props) {
    console.log('Table data: ', props);
    return <div className={"table"}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center">Customer ID</TableCell>
                    <TableCell align="center">Customer Name</TableCell>
                    <TableCell align="center">Contact Number</TableCell>
                    <TableCell align="center">Gender</TableCell>
                </TableRow>
            </TableHead>
            {props.usersMaps.map((userData) =>
                <TableRow>
                    <TableCell align="center">{userData.customerID}</TableCell>
                    <TableCell align="center">{userData.name}</TableCell>
                    <TableCell align="center">{userData.number}</TableCell>
                    <TableCell align="center">{userData.gender}</TableCell>
                </TableRow>
            )}
        </Table>
        {/*{props.usersMaps.map()}*/}
    </div>;
}