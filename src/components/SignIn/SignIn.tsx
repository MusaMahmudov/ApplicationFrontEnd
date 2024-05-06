import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useState } from "react";
import { useEffect } from "react";
import { Alert, LinearProgress, Snackbar } from "@mui/material";
import { LockOpenOutlined } from "@mui/icons-material";
import { authUser } from "../../models/AuthModels";
import { useService } from "../../hooks/hooks";
import { tokenContext } from "../../contexts/authContext";
import { UserContext } from "../../contexts/userContext";
import {
  DecodedToken,
  tokenIdProperty,
  tokenRoleProperty,
} from "../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../Enums/Roles";
import { Cookies, useCookies } from "react-cookie";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      2024 Developed by Musa Mahmudov
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();
export default function SignIn() {
  const navigate = useNavigate();

  const { authServices } = useService();
  const tokenCont = React.useContext(tokenContext);
  const [userId, setUserId] = useState<string>("");
  const [authUser, setAuthUser] = useState<authUser>({
    userName: "",
    password: "",
  });

  const mutate = useMutation(() => authServices.signIn(authUser, undefined), {
    onSuccess: ({
      data: {
        token,
        expiresAt,
        validFrom,
        refreshToken,
        refreshTokenExpirationTime,
      },
    }) => (
      localStorage.setItem("token", token),
      localStorage.setItem("expiresAt", expiresAt),
      localStorage.setItem("validFrom", validFrom),
      localStorage.setItem("refreshToken", refreshToken),
      localStorage.setItem("refreshTokenExpireAt", refreshTokenExpirationTime),
      tokenCont.setRefreshToken(refreshToken),
      tokenCont.setRefreshTokenExpirationTime(refreshTokenExpirationTime),
      tokenCont.setToken(token),
      tokenCont.setExpiresAt(expiresAt),
      tokenCont.setValidFrom(validFrom)
    ),
    onError: () => handleClick(),
  });
  useEffect(() => {
    const token = tokenCont.token;

    if (mutate.isSuccess && token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      const userId = decodedToken[tokenIdProperty];

      setUserId(userId);
      if (
        decodedToken[tokenRoleProperty] === Roles.Admin ||
        decodedToken[tokenRoleProperty] === Roles.Dispatcher
      ) {
        navigate("/Cargos");
      } else {
        navigate("/CargosDriver");
      }
    }
  }, [mutate.isSuccess]);

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event: React.ChangeEvent, reason: any) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const {
      target: { name, value },
    } = event;
    setAuthUser((state) => ({
      ...state,
      [name]: value,
    }));
  };
  const handleSignIn = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    mutate.mutate();
  };
  useEffect(() => {
    if (tokenCont.token) {
      navigate("/Cargos");
    }
  }, []);

  return (
    <div className="adminPanelLogin">
      <ThemeProvider theme={defaultTheme}>
        <Container
          sx={{
            marginTop: 2,
            background: "white",
            borderRadius: 10,
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
          component="main"
          maxWidth="xs"
        >
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
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
              <LockOpenOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="User Name"
                name="userName"
                autoComplete="userName"
                onChange={handleInputChange}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleInputChange}
                autoComplete="current-password"
              />

              <Snackbar open={open} autoHideDuration={6000}>
                <Alert severity="error" sx={{ width: "100%" }} variant="filled">
                  Username or Password is wrong!
                </Alert>
              </Snackbar>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSignIn}
              >
                Sign In
              </Button>
              <div className="progress">
                {mutate.isLoading ? <LinearProgress /> : ""}{" "}
              </div>
              {/* <Grid container>
                <Grid item xs>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/ForgotPassword")}
                  >
                    Forgot password?
                  </Link>
                </Grid>
              </Grid> */}
            </Box>
          </Box>
          <Copyright sx={{ mt: 4, mb: 4, pb: 4 }} />
        </Container>
      </ThemeProvider>
    </div>
  );
}
