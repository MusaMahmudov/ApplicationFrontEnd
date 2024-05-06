import { authUser, generateNewAccessToken } from "../../models/AuthModels";
import { MainUrl } from "../BaseUrl";
import { HTTPClient } from "../HTTPClient";

export class AuthService extends HTTPClient {
  constructor() {
    super(MainUrl);
  }
  async signIn(body: authUser, token: undefined) {
    return await this.post("Authentications", body, token);
  }
  async generateNewAccessToken(
    body: generateNewAccessToken,
    token: string | undefined
  ) {
    return await this.post(
      "Authentications/GenerateNewAccessToken",
      body,
      token
    );
  }
}
