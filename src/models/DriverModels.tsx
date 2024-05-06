import { string } from "yup";
import { getAppUserForDriver } from "./AppUserModels";

export interface getDriver {
  driverId: string;
  length: number;
  width: number;
  height: number;
  appUser: getAppUserForDriver;
  zipcode: string | null;
  currentLocation: string | null;
  phoneNumber: string;
  telegramUserName: string | null;
  telegramUserId: string | null;
}
export interface createDriver {
  appUserId: string | null;
  width: number | null;
  length: number | null;
  height: number | null;
  zipcode: string | null;
  currentLocation: string | null;
  latitude: string | null;
  longitude: string | null;
  phoneNumber: string | null;
  telegramUserName: string | null;
  telegramUserId: string | null;
}
export interface updateDriver {
  appUserId: string | null;
  width: number | null;
  length: number | null;
  height: number | null;
  zipcode: string | null;
  currentLocation: string | null;
  latitude: string | null;
  longitude: string | null;
  phoneNumber: string | null;
  telegramUserName: string | null;
  telegramUserId: string | null;
}
export interface getDriverForOffer {
  driverId: string;
  fullname: string;
  username: string;
  width: number;
  length: number;
  height: number;
  zipcode: string;
  currentLocation: string;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  telegramUserName: string | null;
  telegramUserId: string | null;
}
export interface getDriverForAllOffersList {
  driverId: string;
  fullname: string;
  username: string;
  width: number;
  length: number;
  height: number;
  currentLocation: string;
  phoneNumber: string;
  telegramUserName: string | null;
  telegramUserId: string | null;
}
export interface changeDriverLocation {
  zipcode: string | null;
  currentLocation: string | null;
  latitude: string | null;
  longitude: string | null;
}
export interface changeDriverDimensions {
  length: number;
}
