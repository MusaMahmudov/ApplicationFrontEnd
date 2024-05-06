import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../Common/Navbar";
import { tokenContext } from "../../contexts/authContext";
import { DecodedToken, tokenRoleProperty } from "../../models/TokenModels";
import { jwtDecode } from "jwt-decode";
import { Roles } from "../../Enums/Roles";
import { useService } from "../../hooks/hooks";
import axios from "axios";
import { MainUrl } from "../../API/BaseUrl";

export const Layout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const {
    token,
    expiresAt,
    setToken,
    setExpiresAt,
    setValidFrom,
    refreshToken,
    setRefreshToken,
    refreshTokenExpirationTime,
    setRefreshTokenExpirationTime,
  } = useContext(tokenContext);

  useEffect(() => {
    const checkToken = async () => {
      const currentDate = new Date();
      const expiresAtDateToken = new Date(expiresAt);
      const expiresAtDateRefreshToken = new Date(refreshTokenExpirationTime);
      if (token === "" || token === undefined) {
        navigate("/SignIn");
      } else if (currentDate > expiresAtDateToken) {
        try {
          const newTokenQuery = await axios.post(
            `${MainUrl}/Authentications/GenerateNewAccessToken`,
            { token, refreshToken }
          );

          localStorage.clear();
          setToken(newTokenQuery.data.token);
          setExpiresAt(newTokenQuery.data.expiresAt);
          setValidFrom(newTokenQuery.data.validFrom);
          setRefreshToken(newTokenQuery.data.refreshToken);
          setRefreshTokenExpirationTime(
            newTokenQuery.data.refreshTokenExpirationTime
          );
          localStorage.setItem("token", newTokenQuery.data.token);
          localStorage.setItem("expiresAt", newTokenQuery.data.expiresAt);
          localStorage.setItem("validFrom", newTokenQuery.data.validFrom);
          localStorage.setItem("refreshToken", newTokenQuery.data.refreshToken);
          localStorage.setItem(
            "refreshTokenExpireAt",
            newTokenQuery.data.refreshTokenExpirationTime
          );
        } catch (error) {
          navigate("/SignIn");
          console.log(error);
        }
      } else if (currentDate > expiresAtDateRefreshToken) {
        localStorage.clear();
        setToken("");
        setExpiresAt("");
        setValidFrom("");
        setRefreshToken("");
        setRefreshTokenExpirationTime("");
        navigate("/SignIn");
      } else if (pathname === "/" || pathname === "") {
        const decodedToken: DecodedToken | undefined = token
          ? jwtDecode(token)
          : undefined;
        if (decodedToken) {
          if (decodedToken[tokenRoleProperty] === Roles.Admin) {
            navigate("/Cargos");
          } else if (decodedToken[tokenRoleProperty] === Roles.Driver) {
            navigate("/CargosDriver");
          }
        } else {
          navigate("/SignIn");
        }
      }
    };
    checkToken();
  });

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
