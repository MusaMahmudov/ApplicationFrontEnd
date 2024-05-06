import { useContext } from "react";
import { tokenContext } from "../../../contexts/authContext";
import { useService } from "../../../hooks/hooks";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../API/QueryKeys";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
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
import { GetAllOffers } from "../../../models/OfferModels";
import { useNavigate } from "react-router-dom";

export const AllOffers = () => {
  const { offerServices } = useService();
  const { token } = useContext(tokenContext);
  const navigate = useNavigate();

  const offerQuery = useQuery([QueryKeys.getAllOffers], () =>
    offerServices.getAllOffers(token, 1)
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
              <StyledTableCell align="left">With percent</StyledTableCell>

              <StyledTableCell align="left">Miles</StyledTableCell>
              <StyledTableCell align="left">pieces</StyledTableCell>
              <StyledTableCell align="left">Weight</StyledTableCell>
              <StyledTableCell align="left">Dims</StyledTableCell>
              <StyledTableCell align="left">Pick Up At</StyledTableCell>
              <StyledTableCell align="left">Deliver To</StyledTableCell>
              <StyledTableCell align="left">User name</StyledTableCell>
              <StyledTableCell align="left">Fullname</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offerQuery.data?.data.map((offer: GetAllOffers) => (
              <StyledTableRow key={offer.id}>
                <StyledTableCell align="left" style={{ color: "green" }}>
                  {offer.price}$
                </StyledTableCell>
                <StyledTableCell align="left" style={{ color: "green" }}>
                  <StyledTableCell align="left" style={{ color: "green" }}>
                    {offer.withPercent}$
                  </StyledTableCell>
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
                  {offer.driver.username}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {offer.driver.fullname}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {offer.accepted === null ? (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/ResponseToOffer/${offer.id}`)}
                      >
                        Send Response
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color={`${offer.accepted === true ? "success" : "error"}`}
                    >
                      {offer.accepted === true ? "Accepted" : "Rejected"}
                    </Button>
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
