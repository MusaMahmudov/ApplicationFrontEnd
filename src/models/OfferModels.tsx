import { getCargoForOffer } from "./CargoModels";
import { getDriverForAllOffersList, getDriverForOffer } from "./DriverModels";

export interface PatchOffer {
  price: number;
}
export interface PostOffer {
  price: number | null;
  cargoId: string | undefined;
  driverId: string | undefined;
}
export interface GetOffersToCargo {
  id: string;
  accepted: boolean | null;
  price: number;
  withPercent: number;
  driver: getDriverForOffer;
  cargo: getCargoForOffer;
}
export interface GetOfferToDriver {
  id: string;
  price: number;
  accepted: boolean;
  cargo: getCargoForOffer;
}
export interface GetAllOffers {
  id: string;
  price: number;
  withPercent: number;
  accepted: boolean;
  cargo: getCargoForOffer;
  driver: getDriverForAllOffersList;
}
