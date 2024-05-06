import { MainUrl } from "../BaseUrl";
import { HTTPClient } from "../HTTPClient";

export class MessageService extends HTTPClient {
  constructor() {
    super(MainUrl);
  }

  async getAllMessages(
    userId: string,
    receiverId: string | undefined,
    token: string
  ) {
    return await this.getAll(
      `ChatMessages/${userId}/${receiverId}`,
      token,
      undefined
    );
  }
}
