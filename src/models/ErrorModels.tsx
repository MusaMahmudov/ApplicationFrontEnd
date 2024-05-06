import { HttpStatusCode } from "axios";

export interface errorDTO {
  data:
    | {
        message: string;
        httpStatusCode: number;
      }
    | errors;
}
export interface errors {
  errors: {
    ConfirmPassword: string[];
  };
}
export interface changePasswordResponse {
  response: errorDTO;
}
//
export interface createAndUpdateUserErrors {
  response: responseCreateAndUpdateUserErrors;
}
interface responseCreateAndUpdateUserErrors {
  data:
    | dataCreateAndUpdateUserErrors
    | {
        errors: {
          ConfirmPassword: string[];
        };
      };
}
interface dataCreateAndUpdateUserErrors {
  httpStatusCode: number;
  message: string;
}
export interface cargoPostOfferErrors {
  response: { data: cargoPostOfferErrorsData };
}
interface cargoPostOfferErrorsData {
  message: string;
  httpStatusCode: string;
}
