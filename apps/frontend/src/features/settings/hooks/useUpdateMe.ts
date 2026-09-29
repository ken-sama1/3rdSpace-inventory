import { usersApi } from "@/api/users.api";
import type { UpdateMeInput, UpdateMeResult } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateMeResult, Error, UpdateMeInput>({
    mutationKey: ["users", "update-me"],
    mutationFn: usersApi.updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(["users", "me"], user);
    },
  });
};
