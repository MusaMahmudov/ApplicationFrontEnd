import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../UI/Tables/TableStyles";
import { useNavigate } from "react-router-dom";
import { useService } from "../../../hooks/hooks";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../API/QueryKeys";
import { getAllAppUser } from "../../../models/AppUserModels";
import {
  DeleteButton,
  DetailsButton,
  UpdateButton,
} from "../../../UI/Buttons/ActionButtons";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { useContext } from "react";
import { tokenContext } from "../../../contexts/authContext";

export const UsersList = () => {
  const { token } = useContext(tokenContext);
  const navigate = useNavigate();
  const { userServices } = useService();
  const userQuery = useQuery([QueryKeys.getAllUser], () =>
    userServices.getAllUser(token)
  );
  if (userQuery.isLoading) {
    return <SkeletonLoading width={"100%"} />;
  }
  if (userQuery.isError) {
    return <h1>Error</h1>;
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Id</StyledTableCell>
              <StyledTableCell align="left">Username</StyledTableCell>
              <StyledTableCell align="left">Fullname</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="left">Last Visit</StyledTableCell>
              <StyledTableCell align="left">Roles</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>

              <StyledTableCell align="left">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate("CreateUser")}
                >
                  Add new
                </Button>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userQuery.data?.data.map((user: getAllAppUser) => (
              <StyledTableRow key={user.id}>
                <StyledTableCell align="left">{user.id}</StyledTableCell>
                <StyledTableCell align="left">{user.userName}</StyledTableCell>
                <StyledTableCell align="left" component="th" scope="row">
                  {user.fullname}
                </StyledTableCell>
                <StyledTableCell align="left">{user.email}</StyledTableCell>
                <StyledTableCell align="left">{`${user.lastVisit.substring(
                  0,
                  10
                )} - ${user.lastVisit.substring(11, 19)}`}</StyledTableCell>
                <StyledTableCell align="left">
                  {user.roles.map(
                    (role, index) =>
                      `${
                        user.roles.length - 1 === index ? `${role}` : `${role}-`
                      } `
                  )}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <DetailsButton onClick={() => navigate(`${user.id}`)} />
                </StyledTableCell>
                <StyledTableCell align="left">
                  <UpdateButton
                    onClick={() => navigate(`UpdateUser/${user.id}`)}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">
                  <DeleteButton
                    onClick={() => navigate(`DeleteUser/${user.id}`)}
                    disabled={
                      user.roles.filter((role: string) => role === "Admin")
                        .length > 0
                        ? true
                        : false
                    }
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
