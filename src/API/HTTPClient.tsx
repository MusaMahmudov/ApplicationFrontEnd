import axios from "axios";
import { signInResponse } from "../models/AuthModels";

export class HTTPClient {
  BaseUrl: string;
  constructor(BaseUrl: string) {
    this.BaseUrl = BaseUrl;
  }
  async getAll(
    endPoint: string,
    token: string | undefined,
    query: number | string | undefined
  ) {
    let url = `${this.BaseUrl}/${endPoint}`;
    if (query) {
      url += `?${query}`;
    }
    return await axios.get(`${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async getById(endPoint: string, id: string | undefined, token: string) {
    return await axios.get(`${this.BaseUrl}/${endPoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async post<T>(endPoint: string, body: T, token: string | undefined) {
    return await axios.post(`${this.BaseUrl}/${endPoint}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async put<T>(
    endPoint: string,
    id: string | undefined,
    body: T,
    token: string
  ) {
    await axios.put(`${this.BaseUrl}/${endPoint}/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  async patch<T>(
    endPoint: string,
    id: string | undefined,
    body: T | null,
    token: string | undefined,
    query: string | undefined
  ) {
    let url = `${this.BaseUrl}/${endPoint}/${id}`;
    if (query) {
      url += `?${query}`;
    }
    return await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteById<T>(endPoint: string, id: string | undefined, token: string) {
    await axios.delete(`${this.BaseUrl}/${endPoint}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
