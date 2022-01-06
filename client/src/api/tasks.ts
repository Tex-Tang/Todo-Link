import request from "./client";
import { ICreateTaskRequest, IListTasksRequest, IUpdateTaskRequest } from "./request";
import { ITaskResponse } from "./response";

export async function CreateTask(data: ICreateTaskRequest): Promise<ITaskResponse> {
  const res = await request<ITaskResponse>({
    method: "POST",
    url: "/tasks",
    data,
  });

  return res.data;
}

export async function ListTasks(params: IListTasksRequest) {
  const res = await request<ITaskResponse[]>({
    method: "GET",
    url: "/tasks",
    params,
  });

  return res.data;
}

export async function UpdateTask(id: string, data: IUpdateTaskRequest) {
  const res = await request<ITaskResponse>({
    method: "PUT",
    url: "/tasks/" + id,
    data,
  });

  return res.data;
}

export async function DeleteTask(id: string) {
  const res = request({
    method: "DELETE",
    url: "/tasks/" + id,
  });

  return res;
}
