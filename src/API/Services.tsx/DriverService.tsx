import {
  changeDriverDimensions,
  changeDriverLocation,
  createDriver,
  updateDriver,
} from "../../models/DriverModels";
import { MainUrl } from "../BaseUrl";
import { HTTPClient } from "../HTTPClient";

export class DriverService extends HTTPClient {
  constructor() {
    super(MainUrl);
  }
  async getAllDrivers(token: string, pageNumber: number) {
    return await this.getAll("Drivers", token, pageNumber);
  }
  async getDriverById(id: string | undefined, token: string) {
    return await this.getById(`Drivers`, id, token);
  }
  async getDriverForUpdateById(id: string | undefined, token: string) {
    return await this.getById(`Drivers/GetDriverForUpdate`, id, token);
  }
  async getDriverForOfferCreate(userId: string | undefined, token: string) {
    return await this.getById("Drivers/GetDriverForOfferCreate", userId, token);
  }
  async getDriverForLocationChange(
    driverId: string | undefined,
    token: string
  ) {
    return await this.getById(
      "Drivers/GetDriverForLocationChange",
      driverId,
      token
    );
  }
  async getDriverForLengthChange(userId: string | undefined, token: string) {
    return await this.getById(
      "Drivers/GetDriverForDimensionsChange",
      userId,
      token
    );
  }
  async createDriver(body: createDriver, token: string) {
    await this.post("Drivers", body, token);
  }
  async updateDriver(
    body: updateDriver,
    id: string | undefined,
    token: string
  ) {
    await this.put("Drivers", id, body, token);
  }
  async changeDriverLocation(
    body: changeDriverLocation,
    id: string | undefined,
    token: string
  ) {
    return await this.put("Drivers/ChangeDriverLocation", id, body, token);
  }
  async changeDriverLength(
    body: changeDriverDimensions,
    userId: string | undefined,
    token: string | undefined
  ) {
    return await this.patch(
      "Drivers/ChangeLength",
      userId,
      body,
      token,
      undefined
    );
  }
  async deleteDriverById(id: string | undefined, token: string) {
    await this.deleteById("Drivers", id, token);
  }
}
