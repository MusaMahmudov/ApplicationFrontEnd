import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { BackButton } from "../../../UI/Buttons/ActionButtons";
import { getAppUserForDriverActions } from "../../../models/AppUserModels";
import { useService } from "../../../hooks/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  ChangeEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { updateDriverReducer } from "../../../Reducers/UpdateDriverReducer";
import { QueryKeys } from "../../../API/QueryKeys";
import {
  changeDriverLocation,
  updateDriver,
} from "../../../models/DriverModels";
import { tokenContext } from "../../../contexts/authContext";
import { getLocationByZipcode } from "../../../services/zipcodeServices";
import { DecodedToken, tokenRoleProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../../Enums/Roles";

export const ChangeDriverLocation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken[tokenRoleProperty] : null;
  const { id } = useParams();

  const [initialState, setInitialSate] = useState<changeDriverLocation>({
    zipcode: null,
    latitude: null,
    longitude: null,
    currentLocation: null,
  });

  const { driverServices } = useService();
  const mutate = useMutation(
    () => driverServices.changeDriverLocation(initialState, id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.getDriverForUpdateKey, id]);
        navigate("/CargosDriver");
      },
    }
  );

  const driverQuery = useQuery([QueryKeys.getDriverForUpdateKey, id], () =>
    driverServices.getDriverForLocationChange(id, token)
  );
  const handleUpdate = () => {
    mutate.mutate();
  };

  useEffect(() => {
    setInitialSate((state) => ({
      ...state,
      ...driverQuery.data?.data,
    }));
  }, [driverQuery.isSuccess]);
  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if ("target" in event) {
      if ("name" in event.target && "value" in event.target) {
        let {
          target: { name, value },
        } = event;
        if (name === "zipcode") {
          const response = await getLocationByZipcode(value);
          const result = response?.data?.results[value] ?? undefined;
          if (result) {
            setInitialSate((state) => ({
              ...state,
              zipcode: value,
              currentLocation: result[0].city,
              latitude: result[0].latitude,
              longitude: result[0].longitude,
            }));
          } else {
            setInitialSate((state) => ({
              ...state,
              zipcode: null,
              currentLocation: null,
              latitude: null,
              longitude: null,
            }));
          }
        }
      }
    }
  };
  if (role !== Roles.Driver) {
    return <h1>Error</h1>;
  }

  if (driverQuery.isLoading) {
    return <SkeletonLoading width={"100%"} />;
  }

  return (
    <div className="changeLocationDriver">
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
          label="Zipcode"
          name="zipcode"
          defaultValue={driverQuery.data?.data.zipcode ?? ""}
          onChange={handleChange}
          type="number"
          size="small"
        />
        {`Location: ${initialState.currentLocation ?? "No Location"}`}
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={handleUpdate}
          disabled={mutate.isLoading ? true : false}
        >
          Change Location
        </Button>
        <div>{mutate.isLoading ? <CircularProgress /> : ""}</div>
      </Box>
    </div>
  );
};
