import type {
  LoginInput,
  LoginResBody,
  LoginResult,
  RefreshResBody,
  RefreshResult,
  RegisterInput,
  RegisterResBody,
  RegisterResult,
} from "@repo/shared";
import { api } from "./api";

const baseUrl = "/auth";

const register = async (
  credentials: RegisterInput
): Promise<RegisterResult> => {
  const { data } = await api.post<RegisterResBody>(
    `${baseUrl}/register`,
    credentials
  );

  return data.data;
};

const login = async (credentials: LoginInput): Promise<LoginResult> => {
  const { data } = await api.post<LoginResBody>(
    `${baseUrl}/login`,
    credentials
  );

  return data.data;
};

const logout = async () => {
  await api.post(`${baseUrl}/logout`);
};

const refresh = async (): Promise<RefreshResult> => {
  const { data } = await api.post<RefreshResBody>(baseUrl + "refresh");

  return data.data;
};

export const authApi = {
  register,
  login,
  logout,
  refresh,
};
