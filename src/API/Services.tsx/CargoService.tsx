import { MainUrl } from "../BaseUrl";
import { HTTPClient } from "../HTTPClient";

export class CargoService extends HTTPClient {
  constructor() {
    super(MainUrl);
  }
  async getAllCargos(token: string, pageNumber: string) {
    return await this.getAll("Cargos", token, pageNumber);
  }
  async getCargoForOfferPost(id: string | undefined, token: string) {
    return await this.getById("Cargos/GetCargoForOfferPost", id, token);
  }
  async getCargosForDriver(token: string | undefined, pageNumber: string) {
    return await this.getAll("Cargos/getCargosForDriver", token, pageNumber);
  }
}
