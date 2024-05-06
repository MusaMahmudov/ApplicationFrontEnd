import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import React, {
  ChangeEventHandler,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery } from "react-query";
import { useService } from "../../../hooks/hooks";
import { createDriver } from "../../../models/DriverModels";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../../UI/Buttons/ActionButtons";
import { getAppUserForDriverActions } from "../../../models/AppUserModels";
import { tokenContext } from "../../../contexts/authContext";
import { PostOffer } from "../../../models/OfferModels";
import { QueryKeys } from "../../../API/QueryKeys";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, tokenIdProperty } from "../../../models/TokenModels";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { cargoPostOfferErrors } from "../../../models/ErrorModels";

export const CargoOffer: React.FC<{}> = () => {
  const [error, setError] = useState<string>("");
  const { id: cargoId } = useParams();
  const { cargoServices, offerServices, driverServices } = useService();
  const navigate = useNavigate();
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken = jwtDecode(token);
  const userId = decodedToken[tokenIdProperty];
  const [isValid, setIsValid] = useState({
    price: false,
  });
  console.log(cargoId);
  var driverQuery = useQuery([QueryKeys.getDriver, userId], () =>
    driverServices.getDriverForOfferCreate(userId, token)
  );
  const [newOffer, setNewOffer] = useState<PostOffer>({
    price: 0,
    cargoId: cargoId,
    driverId: "",
  });
  const cargoQuery = useQuery(
    [QueryKeys.getCargoForOfferPost],
    () => cargoServices.getCargoForOfferPost(cargoId, token),
    {
      onError: (error: cargoPostOfferErrors) => {
        if (error.response.data?.httpStatusCode == "400") {
          setError(error.response.data.message);
        }
      },
    }
  );

  useEffect(() => {
    if (driverQuery.isSuccess) {
      setNewOffer((state) => ({
        ...state,
        driverId: driverQuery.data?.data.id,
      }));
    }
  }, [driverQuery.isSuccess]);
  const mutate = useMutation(() => offerServices.postOffer(newOffer, token), {
    onSuccess: () => navigate("/CargosDriver"),
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = event;

    setNewOffer((state) => ({ ...state, [name]: value }));
  };

  const checkValue = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { value, name },
    } = event;
    const number = parseInt(value);
    if (number <= 0 || !number) {
      setIsValid((state) => ({
        ...state,
        [name]: false,
      }));
    } else {
      setIsValid((state) => ({ ...state, [name]: true }));
    }
  };
  const postNewOffer = () => {
    mutate.mutate();
  };
  if (driverQuery.isLoading || cargoQuery.isLoading) {
    return <SkeletonLoading width="100%" />;
  }
  if (cargoQuery.isError) {
    return <h1> {error ?? "Error"}</h1>;
  }

  return (
    <div className="postOffer">
      {error ? (
        error
      ) : (
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
          <BackButton sx={{ width: "100px" }} />

          <TextField
            required
            onBlur={checkValue}
            onChange={handleInputChange}
            label="Price"
            name="price"
            type="number"
            value={newOffer.price}
            size="small"
            error={isValid.price ? false : true}
            helperText={isValid.price ? "" : "Price has to be more than 0"}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ width: "200px" }}
            onClick={postNewOffer}
          >
            Post
          </Button>
          <div>{mutate.isLoading ? <CircularProgress /> : ""}</div>
        </Box>
      )}
    </div>
  );
};
