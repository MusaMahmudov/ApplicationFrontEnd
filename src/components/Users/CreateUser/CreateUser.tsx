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
import { useNavigate } from "react-router-dom";
import { BackButton } from "../../../UI/Buttons/ActionButtons";
import {
  createAppUser,
  getAppUserForDriverActions,
  getRoleForAppUserActions,
} from "../../../models/AppUserModels";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { createAndUpdateUserErrors } from "../../../models/ErrorModels";
import { tokenContext } from "../../../contexts/authContext";

export const CreateUser: React.FC<{}> = () => {
  const [error, setError] = useState<string>("");
  const { token } = useContext(tokenContext);

  const [newUser, setNewUser] = useState<createAppUser>({
    userName: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    roles: [],
  });
  const [isValid, setIsValid] = useState({
    userName: false,
    fullname: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const { userServices } = useService();
  const navigate = useNavigate();
  const rolesQuery = useQuery(["GetRoles"], () =>
    userServices.getAllRoles(token)
  );

  const mutate = useMutation(() => userServices.createUser(newUser, token), {
    onSuccess: () => navigate("/Users"),
    onError: (error: createAndUpdateUserErrors) => {
      if ("message" in error.response.data) {
        setError(error.response.data.message);
      } else if ("errors" in error.response.data) {
        if ("ConfirmPassword" in error.response.data.errors) {
          setError(error.response.data.errors.ConfirmPassword.join(""));
        }
      }
    },
  });
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = event;

    setNewUser((state) => ({ ...state, [name]: value }));
  };

  const checkValue = (
    event:
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.SyntheticEvent<Element | Event>
  ) => {
    if ("target" in event) {
      if ("name" in event.target && "value" in event.target) {
        let {
          target: { name, value },
        } = event;
        if (name !== "password" && name !== "confirmPassword") {
          if (value.length < 3)
            setIsValid((state) => ({
              ...state,
              [name]: false,
            }));
          else {
            setIsValid((state) => ({
              ...state,
              [name]: true,
            }));
          }
        } else {
          if (value.length < 8) {
            setIsValid((state) => ({
              ...state,
              [name]: false,
            }));
          } else {
            setIsValid((state) => ({
              ...state,
              [name]: true,
            }));
          }
        }
      }
    }
  };
  const createNewUser = () => {
    mutate.mutate();
  };

  if (rolesQuery.isLoading) {
    return <SkeletonLoading width="100%" />;
  }

  return (
    <div className="createUser">
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
          multiple
          id="Roles"
          options={rolesQuery.data?.data}
          getOptionLabel={(option: getRoleForAppUserActions) => option.name}
          onChange={(e, newValue: getRoleForAppUserActions[]) => (
            checkValue(e),
            setNewUser((state) => ({
              ...state,
              roles: newValue.map((role) => role.id),
            }))
          )}
          sx={{ width: { xs: 180, sm: 250, md: 330, lg: 370, xl: 400 } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Roles"
              error={newUser.roles.length > 0 ? false : true}
              helperText={newUser.roles ? "" : "Role is required"}
            />
          )}
        />
        <TextField
          onBlur={checkValue}
          onChange={handleInputChange}
          required
          label="User Name"
          name="userName"
          value={newUser.userName}
          type="text"
          size="small"
          error={isValid.userName ? false : true}
          helperText={isValid.userName ? "" : "User Name is required"}
        />
        <TextField
          required
          onBlur={checkValue}
          onChange={handleInputChange}
          label="Fullname"
          name="fullname"
          value={newUser.fullname}
          size="small"
          error={isValid.fullname ? false : true}
          helperText={isValid.fullname ? "" : "Fullname is required"}
        />
        <TextField
          required
          onBlur={checkValue}
          onChange={handleInputChange}
          label="Email"
          name="email"
          value={newUser.email}
          size="small"
          error={isValid.email ? false : true}
          helperText={isValid.email ? "" : "Email is required"}
        />
        <TextField
          required
          onBlur={checkValue}
          onChange={handleInputChange}
          label="Password"
          name="password"
          value={newUser.password}
          size="small"
          type="password"
          error={isValid.password ? false : true}
          helperText={
            isValid.password ? "" : "Password's length has to be at least 8 "
          }
        />
        <TextField
          type="password"
          required
          onBlur={checkValue}
          onChange={handleInputChange}
          label="Confirm Password"
          name="confirmPassword"
          value={newUser.confirmPassword}
          size="small"
          error={isValid.confirmPassword ? false : true}
          helperText={
            isValid.confirmPassword ? "" : "Confirm Password is required"
          }
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={createNewUser}
        >
          Create
        </Button>
        <div className="error">
          <h1>{error}</h1>
        </div>
        <div>{mutate.isLoading ? <CircularProgress /> : ""}</div>
      </Box>
    </div>
  );
};
