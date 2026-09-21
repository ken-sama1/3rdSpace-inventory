import { usersApi } from "@/api/users.api";
import type { GetMeResult } from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetMeProps {
  options?: QueryOptions<GetMeResult>;
}

export const useGetMe = ({ options }: UseGetMeProps) => {
  return useQuery<GetMeResult>({
    queryKey: ["users", "me"],
    queryFn: usersApi.getMe,
    ...options,
  });
};
