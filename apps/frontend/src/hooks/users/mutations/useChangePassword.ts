import { usersApi } from "@/api/users.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: changePassword, ...rest } = useMutation({
    mutationKey: ["users", "change-password"],
    mutationFn: usersApi.changePassword,
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
    changePassword,
    ...rest,
  };
};
