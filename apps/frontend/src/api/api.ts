import axios from "axios";

export const apiBaseUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";
export const apiVersion = import.meta.env.VITE_API_VERSION ?? "v1";

export const api = axios.create({
  baseURL: `${apiBaseUrl}/api/${apiVersion}`,
  withCredentials: true,
});
