import type {
  GetReportSummaryReqQueryInput,
  GetReportSummaryResBody,
  GetReportSummaryResult,
} from "@repo/shared";
import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

export const reportsApi = {
  async getSummary(
    query?: GetReportSummaryReqQueryInput,
    config?: AxiosRequestConfig
  ): Promise<GetReportSummaryResult> {
    const { data } = await api.get<GetReportSummaryResBody>("/reports", {
      ...config,
      params: query,
    });

    return data.data;
  },
};
