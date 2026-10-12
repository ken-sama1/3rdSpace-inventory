import type { GetUserReqQueryInput, GetUsersResult } from "@repo/shared";
import type { QueryOptions } from "../types/QueryOptions";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "@/api/users.api";

interface UseGetUsersParams {
  query?: GetUserReqQueryInput;
  options?: QueryOptions<GetUsersResult>;
}

export const useGetUsers = ({ query, options }: UseGetUsersParams) => {
  return useQuery({
    queryKey: ["users", query?.filter, query?.options],
    queryFn: ({ signal }) => usersApi.getMany(query, { signal }),
    ...options,
  });
};
