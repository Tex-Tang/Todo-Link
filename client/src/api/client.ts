import axios, { AxiosPromise, AxiosRequestConfig } from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 10 * 1000,
  withCredentials: false,
});

export default function request<T = any>(config: AxiosRequestConfig): AxiosPromise<T> {
  return client(config);
}
