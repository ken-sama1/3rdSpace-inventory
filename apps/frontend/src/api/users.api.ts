import type {
  ChangePasswordInput,
  DeleteUserResBody,
  DeleteUserResult,
  GetMeResBody,
  GetMeResult,
  GetUserReqQueryInput,
  GetUsersResBody,
  GetUsersResult,
  IdSchema,
  ResetPasswordInput,
  UpdateMeResBody,
  UpdateMeResult,
  UpdateMeSchema,
  UpdateUserInput,
  UpdateUserResBody,
  UpdateUserResult,
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

const update = async (
  id: IdSchema,
  fields: UpdateUserInput
): Promise<UpdateUserResult> => {
  const { data } = await api.patch<UpdateUserResBody>(
    `${usersUrl}/${id}`,
    fields
  );

  return data.data;
};

const remove = async (id: IdSchema): Promise<DeleteUserResult> => {
  const { data } = await api.delete<DeleteUserResBody>(`${usersUrl}/${id}`);

  return data.data;
};

export const changePassword = async ({
  oldPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> => {
  await api.post(`${meUrl}/password`, {
    oldPassword,
    newPassword,
  });
};

export const resetPassword = async (
  id: IdSchema,
  { newPassword }: ResetPasswordInput
): Promise<void> => {
  await api.post(`${usersUrl}/${id}/password`, {
    newPassword,
  });
};

export const usersApi = {
  getMe,
  updateMe,
  getMany,
  update,
  delete: remove,
  changePassword,
  resetPassword,
};
