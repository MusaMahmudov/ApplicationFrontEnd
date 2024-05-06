import { Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useService } from "../../../hooks/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../../UI/Buttons/ActionButtons";
import { tokenContext } from "../../../contexts/authContext";
import { QueryKeys } from "../../../API/QueryKeys";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";

export const SendResponse = () => {
  const { offerServices } = useService();
  const [error, setError] = useState<string>("");
  const { Id: offerId } = useParams();
  const navigate = useNavigate();
  const [ownPrice, setOwnPrice] = useState<number>(0);
  const { token } = useContext(tokenContext);
  const offerQuery = useQuery(
    [QueryKeys.getOfferForResponse, offerId],
    () => offerServices.getOfferByIdForResponse(offerId, token),
    {
      onError: (response: any) => {
        if (response?.response?.status === 400) {
          setError(response?.response?.data?.message);
        }
      },
    }
  );

  const acceptMutate = useMutation(
    () => offerServices.acceptOffer(offerId, token, null, ownPrice),
    {
      onSuccess: () => navigate("/AllOffers"),
    }
  );
  const rejectMutate = useMutation(
    () => offerServices.rejectOffer(offerId, token, null),
    {
      onSuccess: () => navigate("/AllOffers"),
    }
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ownPriceInt = parseInt(event.target.value);
    console.log(ownPrice);
    if (typeof ownPriceInt === "number") {
      setOwnPrice(ownPriceInt);
    }
  };
  const acceptOffer = () => {
    acceptMutate.mutate();
  };
  const rejectOffer = () => {
    rejectMutate.mutate();
  };
  useEffect(() => {
    if (offerQuery.isSuccess) {
      setOwnPrice(offerQuery.data?.data.withPercent);
    }
  }, [offerQuery.isSuccess]);

  if (offerQuery.isLoading) {
    return <SkeletonLoading width="100%" />;
  }
  if (offerQuery.isError) {
    return <h1>{error ?? "Error"}</h1>;
  }

  return (
    <div className="createDriver">
      <Box
        component="form"
        sx={{
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "400px",
        }}
      >
        <BackButton
          sx={{ width: "100px" }}
          disabled={
            acceptMutate.isLoading || rejectMutate.isLoading ? true : false
          }
        />

        <TextField
          required
          onChange={handleInputChange}
          label="With Percent"
          name="withPercent"
          type="number"
          value={ownPrice}
          size="small"
          error={ownPrice > 0 ? false : true}
          helperText={ownPrice > 0 ? "" : "Value has to be more than 0"}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ width: "150px" }}
            onClick={acceptOffer}
            disabled={
              acceptMutate.isLoading || rejectMutate.isLoading ? true : false
            }
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ width: "150px" }}
            onClick={rejectOffer}
            disabled={
              acceptMutate.isLoading || rejectMutate.isLoading ? true : false
            }
          >
            Reject
          </Button>
        </div>

        <div>
          {acceptMutate.isLoading || rejectMutate.isLoading ? (
            <CircularProgress />
          ) : (
            ""
          )}
        </div>
      </Box>
    </div>
  );
};
