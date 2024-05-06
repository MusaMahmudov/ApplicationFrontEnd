import { PatchOffer, PostOffer } from "../../models/OfferModels";
import { MainUrl } from "../BaseUrl";
import { HTTPClient } from "../HTTPClient";

export class OfferService extends HTTPClient {
  constructor() {
    super(MainUrl);
  }
  async acceptOffer(
    id: string | undefined,
    token: string | undefined,
    body: null,
    ownPrice: number | undefined
  ) {
    await this.patch(
      `Offers/AcceptOffer`,
      id,
      body,
      token,
      `ownPrice=${ownPrice}`
    );
  }
  async rejectOffer(
    id: string | undefined,
    token: string | undefined,
    body: null
  ) {
    await this.patch(`Offers/RejectOffer`, id, body, token, "");
  }
  async getOffersByCargoId(cargoId: string | undefined, token: string) {
    return await this.getById("Offers/GetOffersByCargoId", cargoId, token);
  }
  async getOfferByIdForResponse(offerId: string | undefined, token: string) {
    return await this.getById("Offers/GetOfferByIdForResponse", offerId, token);
  }
  async getOffersByDriverId(driverId: string | undefined, token: string) {
    return await this.getById("Offers", driverId, token);
  }
  async getAllOffers(token: string, pageNumber: number) {
    return await this.getAll("Offers", token, pageNumber);
  }
  async postOffer(body: PostOffer, token: string) {
    await this.post("Offers", body, token);
  }
}
