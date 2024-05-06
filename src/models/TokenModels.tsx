export const tokenRoleProperty =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
export const tokenEmailProperty =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
export const tokenUserNameProperty =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
export const tokenIdProperty =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export interface DecodedToken {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
    | string[]
    | string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  DriverId: string | undefined;
}
