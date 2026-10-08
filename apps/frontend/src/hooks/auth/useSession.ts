import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "./useAuth";
import { useEffect, useRef } from "react";
import { api } from "@/api/api";
import type { AxiosError } from "axios";

interface FailedRequest {
  reject: (reason: unknown) => void;
  resolve: (token: string) => void;
}

type ProcessQueueArgs =
  | {
      error: Error;
      token: null;
    }
  | {
      error: null;
      token: string;
    };

export const useSession = () => {
  const { token, setToken, clearAuth } = useAuthContext();
  const { refresh, logout } = useAuth();

  const failedRequestsRef = useRef<FailedRequest[]>([]);
  const tokenRef = useRef<typeof token>(token);
  const isRefreshingRef = useRef<boolean>(false);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    const processQueue = ({ error, token }: ProcessQueueArgs) => {
      failedRequestsRef.current.forEach((failedRequest) => {
        if (error) {
          return failedRequest.reject(error);
        }
        failedRequest.resolve(token);
      });
      failedRequestsRef.current = [];
    };

    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (config.url?.includes("cloudinary.com")) return config;

        if (tokenRef.current && !config._retry) {
          config.headers.Authorization = `Bearer ${tokenRef.current}`;
        }

        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        const originalReq = error.config;

        if (!originalReq) return Promise.reject(error);

        const url = originalReq.url;
        const status = error.response?.status;
        const isAuthEndpoint = url?.includes("/auth");

        if (isAuthEndpoint || status !== 401 || originalReq._retry)
          return Promise.reject(error);

        if (isRefreshingRef.current) {
          return new Promise<string>((resolve, reject) => {
            failedRequestsRef.current.push({ resolve, reject });
          }).then((token) => {
            originalReq.headers = originalReq.headers ?? {};
            originalReq.headers.Authorization = `Bearer ${token}`;

            return api(originalReq);
          });
        }

        originalReq._retry = true;
        isRefreshingRef.current = true;

        try {
          const { accessToken } = await refresh();

          originalReq.headers = originalReq.headers ?? {};
          originalReq.headers.Authorization = `Bearer ${accessToken}`;

          tokenRef.current = accessToken;
          setToken(accessToken);
          processQueue({ error: null, token: accessToken });
          return api(originalReq);
        } catch (refreshErr) {
          processQueue({ error: refreshErr as Error, token: null });

          try {
            await logout();
          } catch (logOutErr) {
            console.log(
              "Silent background session revocation failed:",
              logOutErr
            );
          } finally {
            clearAuth();
            tokenRef.current = null;
            setToken(null);
          }

          return Promise.reject(refreshErr);
        } finally {
          isRefreshingRef.current = false;
        }
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [setToken]);
};
