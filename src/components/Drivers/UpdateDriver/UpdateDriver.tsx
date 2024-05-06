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
  useState,
} from "react";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { QueryKeys } from "../../../API/QueryKeys";
import { updateDriver } from "../../../models/DriverModels";
import { tokenContext } from "../../../contexts/authContext";
import { getLocationByZipcode } from "../../../services/zipcodeServices";

export const UpdateDriver = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useContext(tokenContext);
  const { id } = useParams();
  const [isValid, setIsValid] = useState({
    length: true,
    width: true,
    height: true,
    telegramUserName: true,
    telegramUserId: true,
  });
  const [initialState, setInitialSate] = useState<updateDriver>({
    appUserId: "",
    length: 0,
    width: 0,
    height: 0,
    zipcode: null,
    latitude: null,
    longitude: null,
    currentLocation: null,
    phoneNumber: null,
    telegramUserName: null,
    telegramUserId: null,
  });

  const { userServices, driverServices } = useService();
  const mutate = useMutation(
    () => driverServices.updateDriver(initialState, id, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.getDriverForUpdateKey, id]);
        navigate("/Drivers");
      },
    }
  );
  const userQuery = useQuery([QueryKeys.getUsersForDriverActionsKey, id], () =>
    userServices.getUsersForDriverUpdate(id, token)
  );
  const driverQuery = useQuery([QueryKeys.getDriverForUpdateKey, id], () =>
    driverServices.getDriverForUpdateById(id, token)
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
        } else {
          setInitialSate((state) => ({
            ...state,
            [name]: value,
          }));
        }
      }
    }
  };

  if (driverQuery.isLoading || userQuery.isLoading) {
    return <SkeletonLoading width={"100%"} />;
  }

  return (
    <div className="updateDriver">
      <Box
        component="form"
        sx={{
          padding: "20px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: { xs: 180, sm: 250, md: 330, lg: 370, xl: 400 },
        }}
      >
        <BackButton sx={{ width: "100px" }} />

        <Autocomplete
          disablePortal
          id="appUserId"
          options={userQuery.data?.data ?? []}
          onChange={(
            event: SyntheticEvent,
            newValue: getAppUserForDriverActions | null
          ) =>
            setInitialSate((state) => ({
              ...state,
              appUserId: newValue ? newValue.id : null,
            }))
          }
          defaultValue={
            driverQuery.data?.data.appUserId
              ? userQuery.data?.data.find(
                  (user: getAppUserForDriverActions) =>
                    user.id === driverQuery.data?.data.appUserId
                )
              : null
          }
          getOptionLabel={(option: getAppUserForDriverActions) =>
            option.userName
          }
          sx={{ width: { xs: 180, sm: 250, md: 330, lg: 370, xl: 400 } }}
          renderInput={(params) => <TextField {...params} label="User" />}
        />
        <TextField
          required
          label="Width"
          name="width"
          defaultValue={driverQuery.data?.data.width}
          onChange={handleChange}
          type="number"
          size="small"
          error={isValid.width ? false : true}
          helperText={isValid.width ? "" : "Width has to be more than 0"}
        />
        <TextField
          onChange={handleChange}
          label="TelegramUserName"
          name="telegramUserName"
          type="text"
          defaultValue={driverQuery.data?.data.telegramUserName}
          size="small"
        />
        <TextField
          required
          label="Length"
          name="length"
          type="number"
          onChange={handleChange}
          defaultValue={driverQuery.data?.data.length}
          size="small"
          error={isValid.length ? false : true}
          helperText={isValid.length ? "" : "Length has to be more than 0"}
        />
        <TextField
          required
          label="Height"
          name="height"
          type="number"
          onChange={handleChange}
          defaultValue={driverQuery.data?.data.height}
          size="small"
          error={isValid.height ? false : true}
          helperText={isValid.height ? "" : "Height has to be more than 0"}
        />
        <TextField
          required
          label="Phone Number"
          name="phoneNumber"
          defaultValue={driverQuery.data?.data.phoneNumber}
          onChange={handleChange}
          type="text"
          size="small"
        />
        <TextField
          required
          label="Zipcode"
          name="zipcode"
          defaultValue={driverQuery.data?.data.zipcode}
          onChange={handleChange}
          type="number"
          size="small"
        />
        {initialState.currentLocation ?? "No Info"}
        <TextField
          error={isValid.telegramUserName ? false : true}
          helperText={
            isValid.telegramUserName
              ? ""
              : "telegram User Name minimum length is 3"
          }
          // onBlur={checkValue}
          onChange={handleChange}
          label="TelegramUserName"
          name="telegramUserName"
          type="text"
          value={initialState.telegramUserName}
          size="small"
        />
        <TextField
          error={isValid.telegramUserId ? false : true}
          helperText={
            isValid.telegramUserId ? "" : "telegram User Id minimum length is 6"
          }
          // onBlur={checkValue}
          onChange={handleChange}
          label="TelegramUserId"
          name="telegramUserId"
          type="text"
          value={initialState.telegramUserId}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={handleUpdate}
        >
          Update driver
        </Button>
        <div>{mutate.isLoading ? <CircularProgress /> : ""}</div>
      </Box>
    </div>
  );
};
