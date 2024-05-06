import React from "react";

export interface UserInformation {
  id: string;
  userName: string;
  email: string;
  Roles: string[];
}
export interface UserInformationStore {
  user: UserInformation;
  setUser: React.Dispatch<React.SetStateAction<UserInformation>>;
}
export interface ChangePasswordModel {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface UserInformationForNavbar {
  userName: string;
  role: string;
}
export interface UserInformationForChat {
  userName: string;
  userId: string;
  lastVisit: string;
  isOnline: boolean;
}
