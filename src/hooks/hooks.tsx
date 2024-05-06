import { AuthService } from "../API/Services.tsx/AuthService";
import { CargoService } from "../API/Services.tsx/CargoService";
import { DriverService } from "../API/Services.tsx/DriverService";
import { MessageService } from "../API/Services.tsx/MessageService";
import { OfferService } from "../API/Services.tsx/OfferService";
import { UserService } from "../API/Services.tsx/UserService";

export function useService() {
  const driverServices = new DriverService();
  const userServices = new UserService();
  const authServices = new AuthService();
  const messageServices = new MessageService();
  const cargoServices = new CargoService();
  const offerServices = new OfferService();
  return {
    offerServices,
    driverServices,
    userServices,
    authServices,
    messageServices,
    cargoServices,
  };
}
