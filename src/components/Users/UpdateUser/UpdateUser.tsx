import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { BackButton } from "../../../UI/Buttons/ActionButtons";
import { useService } from "../../../hooks/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { QueryKeys } from "../../../API/QueryKeys";
import { useNavigate, useParams } from "react-router-dom";
import { SkeletonLoading } from "../../../UI/Loading/LoadingComponents";
import { getRoleForAppUserActions } from "../../../models/AppUserModels";
import {
  ChangeEvent,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { UpdateUserReducer } from "../../../Reducers/UpdateUserReducer";
import { createAndUpdateUserErrors } from "../../../models/ErrorModels";
import { tokenContext } from "../../../contexts/authContext";

export const UpdateUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(tokenContext);

  const { userServices } = useService();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>();
  const [isValid, setIsValid] = useState({
    userName: true,
    fullname: true,
    email: true,
    roles: true,
  });
  const [initialValue, dispatch] = useReducer(UpdateUserReducer, {
    userName: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    rolesId: [],
  });
  const rolesQuery = useQuery(["GetRoles"], () =>
    userServices.getAllRoles(token)
  );
  const userQuery = useQuery([QueryKeys.getUserByIdForUpdate, id], () =>
    userServices.getUserByIdForUpdate(id, token)
  );
  const mutate = useMutation(
    () => userServices.updateUser(id, initialValue, token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.getUserByIdForUpdate, id]);
        navigate("/Users");
      },
      onError: (error: createAndUpdateUserErrors) => {
        if ("message" in error.response.data) {
          setError(error.response.data.message);
        } else if ("errors" in error.response.data) {
          if ("ConfirmPassword" in error.response.data.errors) {
            setError(error.response.data.errors.ConfirmPassword.join(""));
          }
        }
      },
    }
  );

  const updateUser = () => {
    mutate.mutate();
  };
  const checkValue = (
    event:
      | React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
      | React.SyntheticEvent<Element | Event>
  ) => {
    if (
      "target" in event &&
      "name" in event.target &&
      "value" in event.target
    ) {
      let {
        target: { value, name },
      } = event;
      if (name !== "password" && name !== "confirmPassword") {
        if (value.length < 3) {
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
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    dispatch({
      type: name,
      payload: value,
    });
  };

  useEffect(() => {
    dispatch({
      type: "init",
      payload: userQuery.data?.data,
    });
  }, [userQuery.isSuccess]);

  if (userQuery.isLoading || rolesQuery.isLoading) {
    return <SkeletonLoading width="100%" />;
  }

  return (
    <div className="updateUser">
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
            dispatch({
              type: "rolesId",
              payload: newValue.map((roleId) => roleId.id),
            })
          )}
          defaultValue={[
            ...rolesQuery.data?.data.filter((role: getRoleForAppUserActions) =>
              userQuery.data?.data.rolesId.some((userRole: string) => {
                return userRole === role.id;
              })
            ),
          ]}
          sx={{ width: { xs: 180, sm: 250, md: 330, lg: 370, xl: 400 } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Roles"
              error={initialValue.rolesId.length > 0 ? false : true}
              helperText={
                initialValue.rolesId.length !== 0 ? "" : "Role is required"
              }
            />
          )}
        />
        <TextField
          onBlur={checkValue}
          onChange={handleInputChange}
          required
          label="User Name"
          name="userName"
          value={initialValue.userName}
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
          value={initialValue.fullname}
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
          value={initialValue.email}
          size="small"
          error={isValid.email ? false : true}
          helperText={isValid.email ? "" : "Email is required"}
        />
        <TextField
          required
          onChange={handleInputChange}
          label="Password"
          name="password"
          value={initialValue.password}
          size="small"
          type="password"
        />
        <TextField
          type="password"
          required
          onChange={handleInputChange}
          label="Confirm Password"
          name="confirmPassword"
          value={initialValue.confirmPassword}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: "200px" }}
          onClick={updateUser}
        >
          Update
        </Button>
        <div className="error">
          <h1>{error}</h1>
        </div>
        <div>{mutate.isLoading ? <CircularProgress /> : " "}</div>
      </Box>
    </div>
  );
};
