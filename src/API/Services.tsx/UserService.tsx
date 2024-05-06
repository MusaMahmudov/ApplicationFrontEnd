import { string } from "yup";
import { createAppUser, updateAppUser } from "../../models/AppUserModels";
import { MainUrl } from "../BaseUrl";
import { HTTPClient } from "../HTTPClient";
import { ChangePasswordModel } from "../../models/UserModels";

export class UserService extends HTTPClient {
  constructor() {
    super(MainUrl);
  }
  async getAllUser(token: string) {
    return await this.getAll("Users", token, undefined);
  }
  async getUserById(Id: string | undefined, token: string) {
    return await this.getById("Users", Id, token);
  }
  async getUserByIdForUpdate(Id: string | undefined, token: string) {
    return await this.getById(`Users/GetUserForUpdate`, Id, token);
  }
  async getUsersForDriverCreate(token?: string) {
    return await this.getAll("Users/UsersForDriverCreate", token, undefined);
  }

  async getUsersForDriverUpdate(driverId: string | undefined, token?: string) {
    return await this.getAll(
      `Users/UsersForDriverUpdate/${driverId}`,
      token,
      undefined
    );
  }
  async getAllRoles(token: string) {
    return await this.getAll("Users/AllRoles", token, undefined);
  }
  async getUsersForChat(token: string) {
    return await this.getAll("Users/Chat", token, undefined);
  }
  async createUser(body: createAppUser | undefined, token: string) {
    return await this.post("Users", body, token);
  }
  async deleteUser(id: string | undefined, token: string) {
    await this.deleteById("Users", id, token);
  }
  async updateUser(id: string | undefined, body: updateAppUser, token: string) {
    await this.put("Users", id, body, token);
  }
  async changePassword(
    id: string | undefined,
    body: ChangePasswordModel,
    token: string
  ) {
    return await this.put(`Users/ChangePassword`, id, body, token);
  }
}
