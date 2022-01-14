import request from "./client";
import { ISessionRequest } from "./request";
import { ISessionResponse } from "./response";

export function CreateSession(data: ISessionRequest) {
  return request<ISessionResponse>({
    method: "POST",
    url: "/sessions",
    data,
  });
}

export function UpdateSession(id: string, data: ISessionRequest) {
  return request<ISessionResponse>({
    method: "PUT",
    url: "/sessions/" + id,
    data,
  });
}

export function RetrieveSession(id: string) {
  return request<ISessionResponse>({
    method: "GET",
    url: "/sessions/" + id,
  });
}

export function DeleteSession(id: string) {
  return request({
    method: "DELETE",
    url: "/sessions/" + id,
  });
}
