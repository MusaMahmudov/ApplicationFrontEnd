import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useService } from "../../../hooks/hooks";
import { createDriver } from "../../../models/DriverModels";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../UI/Buttons/ActionButtons";
import { getAppUserForDriverActions } from "../../../models/AppUserModels";
import { tokenContext } from "../../../contexts/authContext";
import { getLocationByZipcode } from "../../../services/zipcodeServices";
import { DecodedToken, tokenRoleProperty } from "../../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../../Enums/Roles";

export const CreateDriver: React.FC<{}> = () => {
  const { userServices, driverServices } = useService();
  const navigate = useNavigate();
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken | null = token ? jwtDecode(token) : null;
  const role = decodedToken ? decodedToken[tokenRoleProperty] : null;
  const [isValid, setIsValid] = useState({
    width: false,
    height: false,
    length: false,
    phoneNumber: false,
    telegramUserName: true,
    telegramUserId: true,
  });
  const [newDriver, setNewDriver] = useState<createDriver>({
    appUserId: null,
    width: 0,
    length: 0,
    height: 0,
    zipcode: null,
    currentLocation: null,
    latitude: null,
    longitude: null,
    phoneNumber: null,
    telegramUserName: null,
    telegramUserId: null,
  });
  useEffect(() => {}, []);
  let userQuery = useQuery(["getUsers"], () =>
    userServices.getUsersForDriverCreate(token)
  );
  const mutate = useMutation(
    () => driverServices.createDriver(newDriver, token),
    {
      onSuccess: () => navigate(-1),
      onError: (error) => console.log(error),
    }
  );
  useEffect(() => {
    console.log(newDriver);
  }, [newDriver]);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let {
      target: { value, name },
    } = event;
    if (name === "zipcode") {
      setNewDriver((state) => ({
        ...state,
        zipcode: value,
      }));
      const response = await getLocationByZipcode(value);
      if (response) {
        const results = response.data?.results[value] ?? undefined;
        if (results) {
          setNewDriver((state) => ({
            ...state,
            latitude: results[0].latitude,
            longitude: results[0].longitude,
            currentLocation: results[0].city,
            zipcode: value,
          }));
        } else {
          setNewDriver((state) => ({
            ...state,
            latitude: null,
            longitude: null,
            currentLocation: null,
            zipcode: null,
          }));
        }
      }
    } else {
      if (
        (name === "telegramUserName" || name === "telegramUserId") &&
        value.trim() === ""
      ) {
        setNewDriver((state) => ({ ...state, [name]: null }));
      } else {
        setNewDriver((state) => ({ ...state, [name]: value }));
      }
    }
  };
  const checkValue = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { value, name },
    } = event;
    const number = parseInt(value);

    if (
      number <= 0 ||
      (!number && name !== "telegramUserName" && name !== "telegramUserId")
    ) {
      setIsValid((state) => ({
        ...state,
        [name]: false,
      }));
    } else if (
      name === "telegramUserName" &&
      value.length <= 2 &&
      value !== null &&
      value.trim() !== ""
    ) {
      setIsValid((state) => ({ ...state, [name]: false }));
    } else if (
      name === "telegramUserId" &&
      value.length <= 6 &&
      value !== null &&
      value.trim() !== ""
    ) {
      setIsValid((state) => ({ ...state, [name]: false }));
    } else {
      setIsValid((state) => ({ ...state, [name]: true }));
    }
  };
  const createNewDriver = () => {
    mutate.mutate();
  };
  if (role !== Roles.Admin) {
    return <h1>Error</h1>;
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
          width: { xs: 180, sm: 250, md: 330, lg: 370, xl: 400 },
        }}
      >
        <BackButton sx={{ width: "100px" }} />

        <Autocomplete
          disablePortal
          id="appUserId"
          options={userQuery.data?.data}
          getOptionLabel={(option: getAppUserForDriverActions) =>
            option.userName
          }
          onChange={(e, newValue) =>
            setNewDriver((state) => ({
              ...state,
              appUserId: newValue?.id ? newValue?.id : null,
            }))
          }
          sx={{ width: { xs: 180, sm: 250, md: 330, lg: 370, xl: 400 } }}
          renderInput={(params) => <TextField {...params} label="User" />}
        />
        <TextField
          onBlur={checkValue}
          onChange={handleInputChange}
          required
          label="Width"
          name="width"
          value={newDriver.width}
          type="number"
          size="small"
          error={isValid.width ? false : true}
          helperText={isValid.width ? "" : "Width has to be more than 0"}
        />
        <TextField
          required
          onBlur={checkValue}
          onChange={handleInputChange}
          label="Length"
          name="length"
          value={newDriver.length}
          size="small"
          error={isValid.length ? false : true}
          helperText={isValid.length ? "" : "Length has to be more than 0"}
        />
        <TextField
          required
          onBlur={checkValue}
          onChange={handleInputChange}
          label="Height"
          name="height"
          value={newDriver.height}
          size="small"
          error={isValid.height ? false : true}
          helperText={isValid.height ? "" : "Height has to be more than 0"}
        />
        <TextField
          error={isValid.phoneNumber ? false : true}
          helperText={isValid.phoneNumber ? "" : "Phone number is required"}
          onBlur={checkValue}
          onChange={handleInputChange}
          label="Phone Number"
          name="phoneNumber"
          type="text"
          value={newDriver.phoneNumber}
          size="small"
        />
        <TextField
          onChange={handleInputChange}
          label="Zipcode"
          name="zipcode"
          type="text"
          value={newDriver.zipcode}
          size="small"
        />
        <TextField
          error={isValid.telegramUserName ? false : true}
          helperText={
            isValid.telegramUserName
              ? ""
              : "telegram User Name minimum length is 3"
          }
          onBlur={checkValue}
          onChange={handleInputChange}
          label="TelegramUserName"
          name="telegramUserName"
          type="text"
          value={newDriver.telegramUserName}
          size="small"
        />
        <TextField
          error={isValid.telegramUserId ? false : true}
          helperText={
            isValid.telegramUserId ? "" : "telegram User Id minimum length is 6"
          }
          onBlur={checkValue}
          onChange={handleInputChange}
          label="TelegramUserId"
          name="telegramUserId"
          type="text"
          value={newDriver.telegramUserId}
          size="small"
        />
        {newDriver.currentLocation ?? "No Location"}
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={createNewDriver}
        >
          Create
        </Button>
        <div>{mutate.isLoading ? <CircularProgress /> : ""}</div>
      </Box>
    </div>
  );
};
