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
import { useService } from "../../../hooks/hooks";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../API/QueryKeys";
import { useContext } from "react";
import { tokenContext } from "../../../contexts/authContext";
import { DecodedToken } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { GetOfferToDriver } from "../../../models/OfferModels";
import { off } from "process";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";

export const OfferOfDriver = () => {
  const { offerServices } = useService();
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken = jwtDecode(token);
  let driverId = decodedToken.DriverId;

  const offerQuery = useQuery([QueryKeys.getOffersOfDriver], () =>
    offerServices.getOffersByDriverId(driverId, token)
  );
  if (offerQuery.isLoading) {
    <SkeletonLoading width="100%" />;
  }
  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ width: "100%" }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Offer</StyledTableCell>
              <StyledTableCell align="left">Miles</StyledTableCell>
              <StyledTableCell align="left">pieces</StyledTableCell>
              <StyledTableCell align="left">Weight</StyledTableCell>
              <StyledTableCell align="left">Dims</StyledTableCell>
              <StyledTableCell align="left">Pick Up To</StyledTableCell>
              <StyledTableCell align="left">Deliver To</StyledTableCell>

              <StyledTableCell align="left">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offerQuery.data?.data.map((offer: GetOfferToDriver) => (
              <StyledTableRow key={offer.id}>
                <StyledTableCell align="left" style={{ color: "green" }}>
                  {offer.price}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {offer.cargo.miles}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {offer.cargo.pieces}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {offer.cargo.weight}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {`${offer.cargo.length ?? "?"}x${offer.cargo.width ?? "?"}x${
                    offer.cargo.height ?? "?"
                  }`}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {offer.cargo.pickUpZipcode}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {offer.cargo.deliverToZipcode}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <Button
                    variant="contained"
                    color={`${
                      offer.accepted === null
                        ? "primary"
                        : offer.accepted === false
                        ? "error"
                        : "success"
                    }`}
                  >
                    {offer.accepted === null
                      ? "In the View"
                      : offer.accepted === false
                      ? "Rejected"
                      : "Accepted"}
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
