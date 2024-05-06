import { useMutation, useQuery, useQueryClient } from "react-query";
import { useService } from "../../../hooks/hooks";
import styled from "./OffersToCargo.module.scss";
import { QueryKeys } from "../../../API/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { tokenContext } from "../../../contexts/authContext";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { GetOffersToCargo } from "../../../models/OfferModels";
import { Button, TextField } from "@mui/material";
export const OffersToCargo = () => {
  const navigate = useNavigate();
  const { offerServices } = useService();
  const { Id: cargoId } = useParams();
  const [offerIdAccept, setOfferIdAccept] = useState("");
  const [offerIdReject, setOfferIdReject] = useState("");
  const [ownPrice, setOwnPrice] = useState<number>(0);
  const { token } = useContext(tokenContext);
  var offersQuery = useQuery([QueryKeys.getOffersToCargo], () =>
    offerServices.getOffersByCargoId(cargoId, token)
  );
  const mutateAccept = useMutation(
    () => offerServices.acceptOffer(offerIdAccept, token, null, ownPrice),
    { onSuccess: () => navigate("/Cargos") }
  );
  const mutateReject = useMutation(
    () => offerServices.rejectOffer(offerIdReject, token, null),
    { onSuccess: () => navigate("/Cargos") }
  );

  const handleChangeId = (
    event: React.MouseEvent<HTMLButtonElement>,
    offerId: string
  ) => {
    let ownPrice =
      event.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.getElementsByTagName(
        "input"
      )[0].value;
    if (typeof ownPrice === "string") {
      let ownPriceInt = parseInt(ownPrice);
      setOwnPrice(ownPriceInt);
      setOfferIdAccept(offerId);
    }
  };
  const handleChangeIdReject = (
    event: React.MouseEvent<HTMLButtonElement>,
    offerId: string
  ) => {
    setOfferIdReject(offerId);
  };
  useEffect(() => {
    if (offerIdAccept && ownPrice) {
      mutateAccept.mutate();
    }
  }, [offerIdAccept, ownPrice]);

  useEffect(() => {
    if (offerIdReject) {
      mutateReject.mutate();
    }
  }, [offerIdReject]);

  if (offersQuery.isLoading) {
    return <SkeletonLoading width="100%" />;
  }

  return (
    <div className={styled.OffersToCargo}>
      <section className={styled.action}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          disabled={
            mutateAccept.isLoading || mutateReject.isLoading ? true : false
          }
        >
          Back
        </Button>
      </section>
      <section className={styled.list}>
        <ul>
          {offersQuery.data?.data.length > 0 ? (
            offersQuery.data?.data.map((offer: GetOffersToCargo) => {
              return (
                <li key={offer.id}>
                  <div className={styled.firstLine}>
                    <div className={styled.prices}>
                      <h1>Offer:{offer.price}</h1>
                      <TextField
                        label="With Percentage"
                        name="withPercentage"
                        defaultValue={offer.withPercent}
                        type="number"
                        size="small"
                        disabled={offer.accepted !== null ? true : false}
                      />
                    </div>
                    <div className={styled.driverInformation}>
                      <h1>Username:{offer.driver.username}</h1>
                      <h1>Fullname:{offer.driver.fullname}</h1>
                    </div>
                  </div>
                  <div className={styled.secondLine}>
                    <div className={styled.actions}>
                      {offer.accepted !== null ? (
                        offer.accepted === true ? (
                          <Button variant="contained" color="success">
                            Accepted
                          </Button>
                        ) : (
                          <Button variant="contained" color="error">
                            Rejected
                          </Button>
                        )
                      ) : (
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div style={{ display: "flex", gap: 10 }}>
                            <Button
                              variant="contained"
                              onClick={(event) =>
                                handleChangeId(event, offer.id)
                              }
                              disabled={
                                mutateAccept.isLoading || mutateReject.isLoading
                                  ? true
                                  : false
                              }
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              disabled={
                                mutateAccept.isLoading || mutateReject.isLoading
                                  ? true
                                  : false
                              }
                              onClick={(event) =>
                                handleChangeIdReject(event, offer.id)
                              }
                            >
                              Reject
                            </Button>
                          </div>

                          <div>
                            <h1>
                              {mutateAccept.isLoading || mutateReject.isLoading
                                ? "...Loading"
                                : ""}{" "}
                            </h1>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <h1>No Offers</h1>
          )}
        </ul>
      </section>
    </div>
  );
};
