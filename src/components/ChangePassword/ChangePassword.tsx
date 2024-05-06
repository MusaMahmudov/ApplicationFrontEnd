import React, { FormEvent, useContext, useState } from "react";
import { ChangePasswordModel } from "../../models/UserModels";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Snackbar,
  SnackbarCloseReason,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Copyright } from "@mui/icons-material";
import { useMutation } from "react-query";
import { useService } from "../../hooks/hooks";
import { jwtDecode } from "jwt-decode";
import { DecodedToken, tokenIdProperty } from "../../models/TokenModels";
import { tokenContext } from "../../contexts/authContext";
import { changePasswordResponse } from "../../models/ErrorModels";

const defaultTheme = createTheme();
export const ChangePassword = () => {
  const { token } = useContext(tokenContext);
  const decodedToken: DecodedToken = jwtDecode(token);
  const { userServices } = useService();
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  const [error, setError] = useState<string[] | string | null>();
  const [changePasswordValues, setChangePasswordValues] =
    useState<ChangePasswordModel>({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  const mutate = useMutation(
    () =>
      userServices.changePassword(
        decodedToken[tokenIdProperty],
        changePasswordValues,
        token
      ),
    {
      onError: (error: changePasswordResponse) => {
        if ("message" in error.response.data) {
          setOpenSuccess(false);
          setError(error.response.data.message);
          setOpenError(true);
        } else if ("errors" in error.response.data) {
          setOpenSuccess(false);
          setError(error.response.data.errors.ConfirmPassword);
          setOpenError(true);
        } else {
          setOpenSuccess(false);
          setError("An unknown error occurred.");
          setOpenError(true);
        }
      },
      onSuccess: () => {
        return setOpenError(false), setOpenSuccess(true);
      },
    }
  );

  const handleCloseError = (
    event:
      | React.SyntheticEvent<any>
      | Event
      | React.SyntheticEvent<Element, Event>,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
  };

  const handleCloseSuccess = (
    event: React.SyntheticEvent<any> | Event | React.SyntheticEvent,
    reason: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate.mutate();
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    let {
      target: { name, value },
    } = e;
    setChangePasswordValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return (
    <div className="change-password">
      <div className="container">
        <div className="form">
          <ThemeProvider theme={defaultTheme}>
            <Container
              sx={{
                background: "white",
                borderRadius: 10,
              }}
              component="main"
              maxWidth="xs"
            >
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  pr: 5,
                  pl: 5,
                  pt: 3,
                  pb: 3,
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Change Password
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="userName"
                    type="password"
                    label="Old Password"
                    name="oldPassword"
                    autoComplete="oldPassword"
                    autoFocus
                    onChange={handleChangePassword}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    type="password"
                    id="newPassword"
                    autoComplete="current-password"
                    onChange={handleChangePassword}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    autoComplete="current-password"
                    onChange={handleChangePassword}
                  />

                  <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleCloseError}
                  >
                    <Alert
                      severity="error"
                      sx={{ width: "100%" }}
                      variant="filled"
                    >
                      {Array.isArray(error) ? error?.map((err) => err) : error}
                    </Alert>
                  </Snackbar>
                  <Snackbar
                    open={openSuccess}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccess}
                  >
                    <Alert
                      severity="success"
                      sx={{ width: "100%" }}
                      variant="filled"
                    >
                      Password Changed Successefully
                    </Alert>
                  </Snackbar>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Change Password
                  </Button>
                </Box>
              </Box>
              <Copyright sx={{ mt: 4, mb: 4, pb: 4 }} />
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};
