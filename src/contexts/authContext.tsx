import { createContext, useState } from "react";
import { tokenContextState } from "../models/AuthModels";

type ContainerProps = {
  children: React.ReactNode;
};
const initialValue = {
  validFrom: "",
  expiresAt: "",
  token: "",
  refreshToken: "",
  refreshTokenExpirationTime: "",
  setRefreshTokenExpirationTime: () => "",
  setRefreshToken: () => "",
  setToken: () => "",
  setExpiresAt: () => "",
  setValidFrom: () => "",
};

const tokenContext = createContext<tokenContextState>(initialValue);

const TokenContextProvider = (props: ContainerProps) => {
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") ?? ""
  );
  const [expiresAt, setExpiresAt] = useState<string>(
    localStorage.getItem("expiresAt") ?? ""
  );
  const [validFrom, setValidFrom] = useState<string>(
    localStorage.getItem("validFrom") ?? ""
  );
  const [refreshToken, setRefreshToken] = useState<string>(
    localStorage.getItem("refreshToken") ?? ""
  );
  const [refreshTokenExpirationTime, setRefreshTokenExpirationTime] =
    useState<string>(localStorage.getItem("refreshTokenExpireAt") ?? "");
  return (
    <tokenContext.Provider
      value={{
        refreshToken,
        setRefreshToken,
        refreshTokenExpirationTime,
        setRefreshTokenExpirationTime,
        token,
        setToken,
        expiresAt,
        setExpiresAt,
        validFrom,
        setValidFrom,
      }}
    >
      {props.children}
    </tokenContext.Provider>
  );
};

export { tokenContext, TokenContextProvider };
