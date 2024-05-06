export interface authUser {
  userName: string;
  password: string;
}
export interface signInResponse {
  token: string;
  expiresAt: string;
  validFrom: string;
  refreshToken: string;
  refreshTokenExpirationTime: string;
}
export interface tokenContextState {
  validFrom: string;
  expiresAt: string;
  token: string;
  refreshToken: string;
  refreshTokenExpirationTime: string;
  setRefreshTokenExpirationTime: React.Dispatch<React.SetStateAction<string>>;
  setRefreshToken: React.Dispatch<React.SetStateAction<string>>;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setExpiresAt: React.Dispatch<React.SetStateAction<string>>;
  setValidFrom: React.Dispatch<React.SetStateAction<string>>;
}
export interface generateNewAccessToken {
  token: string;
  refreshToken: string;
}
