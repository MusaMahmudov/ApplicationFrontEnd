import { useQuery } from "react-query";
import { useService } from "../../../hooks/hooks";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { getDriver } from "../../../models/DriverModels";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../UI/Tables/TableStyles";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import {
  DeleteButton,
  DetailsButton,
  UpdateButton,
} from "../../../UI/Buttons/ActionButtons";
import { useNavigate } from "react-router-dom";
import { tokenContext } from "../../../contexts/authContext";
import { useContext } from "react";
import { DecodedToken, tokenRoleProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../../Enums/Roles";

export const DriversList = () => {
  const navigate = useNavigate();
  const { driverServices } = useService();

  const driverQuery = useQuery(["GetDrivers"], () =>
    driverServices.getAllDrivers(token, 1)
  );
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken[tokenRoleProperty] : null;
  if (role !== Roles.Admin) {
    return <h1>Error</h1>;
  }
  if (driverQuery.isLoading) {
    return <SkeletonLoading width={"100%"} />;
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Driver Id</StyledTableCell>
              <StyledTableCell align="left">Username</StyledTableCell>
              <StyledTableCell align="left">Fullname</StyledTableCell>
              <StyledTableCell align="left">Height</StyledTableCell>
              <StyledTableCell align="left">Length</StyledTableCell>
              <StyledTableCell align="left">Width</StyledTableCell>
              <StyledTableCell align="left">Phone Number</StyledTableCell>
              <StyledTableCell align="left">Telegram User Name</StyledTableCell>
              <StyledTableCell align="left">Telegram User Id</StyledTableCell>

              <StyledTableCell align="left">Zipcode</StyledTableCell>
              <StyledTableCell align="left">Current Location</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
              <StyledTableCell align="left">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => navigate("CreateDriver")}
                >
                  Add new
                </Button>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {driverQuery.data?.data.map((driver: getDriver) => (
              <StyledTableRow key={driver.driverId}>
                <StyledTableCell align="left">
                  {driver.driverId}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {driver.appUser?.userName
                    ? driver.appUser?.userName
                    : "No User"}
                </StyledTableCell>
                <StyledTableCell align="left" component="th" scope="row">
                  {driver.appUser?.fullname
                    ? driver.appUser?.fullname
                    : "No User"}
                </StyledTableCell>
                <StyledTableCell align="left">{driver.height}</StyledTableCell>
                <StyledTableCell align="left">{driver.length}</StyledTableCell>
                <StyledTableCell align="left">{driver.width}</StyledTableCell>
                <StyledTableCell align="left">
                  {driver.phoneNumber}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {!driver.telegramUserName || driver.telegramUserName === ""
                    ? "No Info"
                    : driver.telegramUserName}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {!driver.telegramUserId || driver.telegramUserId === ""
                    ? "No Info"
                    : driver.telegramUserId}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {driver.zipcode ?? "No Info"}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {driver.currentLocation ?? "No Information"}
                </StyledTableCell>

                <StyledTableCell align="left">
                  <DetailsButton
                    onClick={() => navigate(`${driver.driverId}`)}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">
                  <UpdateButton
                    onClick={() => navigate(`UpdateDriver/${driver.driverId}`)}
                  />
                </StyledTableCell>
                <StyledTableCell align="left">
                  <DeleteButton
                    onClick={() => navigate(`DeleteDriver/${driver.driverId}`)}
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
