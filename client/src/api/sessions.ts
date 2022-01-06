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

export function RetrieveSession(id: string) {
  return request<ISessionResponse>({
    method: "GET",
    url: "/sessions/" + id,
  });
}
