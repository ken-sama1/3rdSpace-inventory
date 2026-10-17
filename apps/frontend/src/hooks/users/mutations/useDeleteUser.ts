import { usersApi } from "@/api/users.api";
import type { DeleteUserResult, IdParamSchema } from "@repo/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteUser, ...rest } = useMutation<
    DeleteUserResult,
    Error,
    IdParamSchema
  >({
    mutationKey: ["users", "delete"],
    mutationFn: ({ id }) => usersApi.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        predicate: (q) => {
          const k = q.queryKey;

          const [resource] = k;

          return resource === "users";
        },
      });
    },
  });

  return {
    delete: deleteUser,
    ...rest,
  };
};
