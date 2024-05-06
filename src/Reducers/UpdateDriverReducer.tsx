import { updateDriver } from "../models/DriverModels";

export const updateDriverReducer = (state: updateDriver, action: any) => {
  switch (action.type) {
    case "init":
      return { ...state, ...action.payload };
    case "appUserId":
      return { ...state, appUserId: action.payload };
    case "width":
      return { ...state, width: action.payload };
    case "length":
      return { ...state, length: action.payload };
    case "height":
      return { ...state, height: action.payload };
  }
};
