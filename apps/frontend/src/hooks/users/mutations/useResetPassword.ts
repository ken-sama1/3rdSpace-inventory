
import { usersApi } from "@/api/users.api";
import type { IdParamSchema, ResetPasswordInput } from "@repo/shared";
import { useMutation } from "@tanstack/react-query";

type ResetPasswordVariables = IdParamSchema & {
  data: ResetPasswordInput;
};

export const useResetPassword = () => {
  const { mutateAsync: resetPassword, ...rest } = useMutation<
    undefined,
    Error,
    ResetPasswordVariables
  >({
    mutationKey: ["users", "reset-password"],
    mutationFn: async ({ id, data }) => {
      await usersApi.resetPassword(id, data);
      return undefined;
    },
  });

  return {
    resetPassword,
    ...rest,
  };
};
