import type {
  GetMeResBody,
  GetMeResult,
  GetUserReqQueryInput,
  GetUsersResBody,
  GetUsersResult,
  UpdateMeResBody,
  UpdateMeResult,
  UpdateMeSchema,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

const meUrl = "/users/me";
const usersUrl = "/users";

const getMe = async (): Promise<GetMeResult> => {
  const { data } = await api.get<GetMeResBody>(meUrl);

  return data.data;
};

const updateMe = async (
  credentials: UpdateMeSchema
): Promise<UpdateMeResult> => {
  const { data } = await api.patch<UpdateMeResBody>(meUrl, credentials);

  return data.data;
};

const getMany = async (
  { filter, options }: GetUserReqQueryInput = {},
  config?: AxiosRequestConfig
): Promise<GetUsersResult> => {
  const { data } = await api.get<GetUsersResBody>(usersUrl, {
    params: {
      filter,
      options,
    },
    ...config,
  });

  return data.data;
};

export const usersApi = {
  getMe,
  updateMe,
  getMany,
};
