import { updateAppUser } from "../models/AppUserModels";

export const UpdateUserReducer = (state: updateAppUser, action: any) => {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "userName":
      return { ...state, userName: action.payload };
    case "fullname":
      return { ...state, fullname: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "password":
      return { ...state, password: action.payload };
    case "confirmPassword":
      return { ...state, confirmPassword: action.payload };
    case "rolesId":
      return { ...state, rolesId: action.payload };
  }
};
