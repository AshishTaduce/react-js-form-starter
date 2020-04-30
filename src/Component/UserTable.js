import React, {useEffect} from "react";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from "@material-ui/core/CircularProgress";

export default function UsersTable(props) {
    return <div className={"table"}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell align="center">Customer ID</TableCell>
                    <TableCell align="center">Customer Name</TableCell>
                    <TableCell align="center">Contact Number</TableCell>
                    <TableCell align="center">Gender</TableCell>
                    <TableCell align="center">Remove</TableCell>
                </TableRow>
            </TableHead>
            {props.usersMaps.map((userData) => {
                return <TableRow>
                    <TableCell align="center">{userData.customerID}</TableCell>
                    <TableCell align="center">{userData.name}</TableCell>
                    <TableCell align="center">{userData.number}</TableCell>
                    <TableCell align="center">{userData.gender}</TableCell>
                    <IconButton aria-label="delete"
                                onClick={() => {
                                    props.removeUser(userData.customerID);}}>
                       {userData.deleting ?  <CircularProgress/> : <DeleteIcon/>}

                    </IconButton>
                </TableRow>
                }
            )}
        </Table>
        {/*{props.usersMaps.map()}*/}
    </div>;
}