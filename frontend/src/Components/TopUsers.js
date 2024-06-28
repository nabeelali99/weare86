import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";

export const TopUsers = ({ topUsers }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>UserName</TableCell>
            <TableCell style={{ fontWeight: "bold" }} align="right">
              Posts
            </TableCell>
            <TableCell style={{ fontWeight: "bold" }} align="right">
              Age
            </TableCell>
            <TableCell style={{ fontWeight: "bold" }} align="right">
              Phone
            </TableCell>
            <TableCell style={{ fontWeight: "bold" }} align="right">
              Email
            </TableCell>
            <TableCell style={{ fontWeight: "bold" }} align="right">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {topUsers.map((topUser) => (
            <TableRow
              key={topUser._id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row" style={{ display: "flex" }}>
                <Avatar sx={{ width: 50, height: 50 }}>
                  {topUser.username.charAt(0)}
                </Avatar>
                <div style={{ marginLeft: "10px", marginTop: "15px" }}>
                  {topUser.username}
                </div>
              </TableCell>
              <TableCell align="right">{topUser.postCount}</TableCell>
              <TableCell align="right">{topUser.age}</TableCell>
              <TableCell align="right">{topUser.phone}</TableCell>
              <TableCell align="right">{topUser.email}</TableCell>
              <TableCell align="right" style={{ display: "flex" }}>
                <Link
                  style={{ textDecoration: "none" }}
                  to={`/delete/${topUser._id}`}
                >
                  <button
                    style={{
                      width: "50px",
                      height: "35px",
                      fontSize: "14px",
                      marginTop: "5px",
                    }}
                  >
                    Delete
                  </button>
                </Link>
                <Link
                  to={`/profile/${topUser._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    style={{
                      width: "50px",
                      height: "35px",
                      fontSize: "14px",
                      marginTop: "5px",
                    }}
                  >
                    Edit
                  </button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
