import { usersApi } from "@/api/users.api";
import type {
  IdParamSchema,
  UpdateUserInput,
  UpdateUserResult,
} from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: update, ...rest } = useMutation<
    UpdateUserResult,
    Error,
    IdParamSchema & {
      data: UpdateUserInput;
    }
  >({
    mutationKey: ["users", "update"],
    mutationFn: async ({ id, data }) => await usersApi.update(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;

          const [resource] = k;

          return resource === "users";
        },
      });
    },
  });

  return {
    update,
    ...rest,
  };
};
