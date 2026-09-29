import { reportsApi } from "@/api/reports.api";
import type {
  GetReportSummaryReqQuerySchema,
  GetReportSummaryResult,
} from "@repo/shared";
import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "../types/QueryOptions";

interface UseGetReportSummaryProps {
  query?: GetReportSummaryReqQuerySchema;
  options?: QueryOptions<GetReportSummaryResult>;
}

export const useGetReportSummary = ({
  query,
  options,
}: UseGetReportSummaryProps) => {
  return useQuery({
    queryKey: ["reports", query?.filter],
    queryFn: ({ signal }) => reportsApi.getSummary(query, { signal }),
    ...options,
  });
};
