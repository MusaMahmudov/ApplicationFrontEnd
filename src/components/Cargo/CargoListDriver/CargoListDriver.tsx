import { useQuery } from "react-query";
import { useService } from "../../../hooks/hooks";
import styled from "./CargoListDriver.module.scss";
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
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { useNavigate } from "react-router-dom";
import { tokenContext } from "../../../contexts/authContext";
import { useContext, useState } from "react";
import { getCargoForDriver } from "../../../models/CargoModels";
import { DecodedToken, tokenRoleProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { QueryKeys } from "../../../API/QueryKeys";
import { Roles } from "../../../Enums/Roles";

export const CargoListDriver = () => {
  const tokenCont = useContext(tokenContext);
  const [pageNumber, setPageNumber] = useState(1);
  const { token } = tokenCont;
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken[tokenRoleProperty] : "";
  const navigate = useNavigate();
  const { cargoServices } = useService();
  const cargoQuery = useQuery([QueryKeys.getCargosForDriver], () =>
    cargoServices.getCargosForDriver(
      tokenCont.token,
      `CurrentPage=${pageNumber}`
    )
  );
  if (role !== Roles.Driver) {
    return <h1>Error</h1>;
  }

  if (cargoQuery.isLoading) {
    return <SkeletonLoading width={"100%"} />;
  }
  if (cargoQuery.isError) {
    return <h1>Error</h1>;
  }
  return (
    <div>
      <div className={styled.pagination}>
        <div className={styled.buttons}>
          <div>
            <button
              onClick={() => setPageNumber((state) => state - 1)}
              disabled={pageNumber === 1}
            >
              Back
            </button>
          </div>
          <div>{pageNumber}</div>
          <div>
            <button
              onClick={() => setPageNumber((state) => state + 1)}
              disabled={pageNumber === cargoQuery.data?.data.pageNumber}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Id</StyledTableCell>
              <StyledTableCell align="left">Miles</StyledTableCell>
              <StyledTableCell align="left">Pieces</StyledTableCell>
              <StyledTableCell align="left">Weight</StyledTableCell>
              <StyledTableCell align="left">Dimensions</StyledTableCell>
              <StyledTableCell align="left">Pick Up </StyledTableCell>
              <StyledTableCell align="left">Deliver to </StyledTableCell>
              <StyledTableCell align="left">notes</StyledTableCell>
              <StyledTableCell align="left">Distance to Driver</StyledTableCell>
              <StyledTableCell align="left">Is Taken</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cargoQuery.data?.data.items.map((cargo: getCargoForDriver) => (
              <StyledTableRow key={cargo.id}>
                <StyledTableCell align="left">{cargo.id}</StyledTableCell>
                <StyledTableCell align="left">
                  {cargo.miles ?? "No Info"}
                </StyledTableCell>
                <StyledTableCell align="left" component="th" scope="row">
                  {cargo.pieces ?? "No Info"}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {cargo.weight ?? "No Ingo"}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {`${cargo.length ?? "?"}x${cargo.width ?? "?"}x${
                    cargo.height ?? "?"
                  }`}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {cargo.pickUpZipcode ?? ""},{cargo.pickUpCity ?? ""}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {cargo.deliverToZipcode ?? ""},{cargo.deliverToCity ?? ""}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {cargo.notes ?? "No Notes"}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {cargo.distanceToDriver ?? "No Info"}-MI
                </StyledTableCell>

                <StyledTableCell align="left">
                  {cargo.isTaken ? "Yes" : "No"}
                </StyledTableCell>

                <StyledTableCell align="left">
                  {cargo.isTaken ? (
                    <Button
                      variant="contained"
                      color="success"
                      style={{
                        display: `${role !== "Driver" ? "none" : "block"}`,
                      }}
                    >
                      Cargo Is Taken
                    </Button>
                  ) : !cargo.hasOffer ? (
                    <Button
                      style={{
                        display: `${role !== "Driver" ? "none" : "block"}`,
                      }}
                      variant="contained"
                      onClick={() => navigate(`PostOffer/${cargo.id}`)}
                    >
                      Post offer
                    </Button>
                  ) : (
                    <Button variant="contained">In the View</Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
