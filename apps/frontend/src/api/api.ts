import axios from "axios";

export const apiVersion = (import.meta.env.VITE_API_VERSION ?? "v1") as string;

export const api = axios.create({
  baseURL: `/api/${apiVersion}`,
  withCredentials: true,
});
