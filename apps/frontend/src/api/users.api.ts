import type {
  GetMeResBody,
  GetMeResult,
  UpdateMeResBody,
  UpdateMeResult,
  UpdateMeSchema,
} from "@repo/shared";
import { api } from "./api";

const meUrl = "/me";
// const userUrl = "/user";

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

export const usersApi = {
  getMe,
  updateMe,
};
