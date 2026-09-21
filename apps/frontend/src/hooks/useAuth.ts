import { authApi } from "@/api/auth.api";
import { useAuthContext } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { useGetMe } from "./users/useGetMe";

export const useAuth = () => {
  const { setToken, isAuthenticated, clearAuth } = useAuthContext();

  const { data: user } = useGetMe({
    options: {
      enabled: isAuthenticated,
      staleTime: 15 * 60 * 1000,
      retry: false,
    },
  });

  const {
    mutateAsync: login,
    isPending: isLoggingIn,
    error: loginErr,
  } = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: authApi.login,
    onSuccess: ({ accessToken }) => {
      setToken(accessToken);
    },
  });

  const {
    mutateAsync: logout,
    error: logoutErr,
    isPending: isLoggingOut,
  } = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: authApi.logout,
    onSettled: () => {
      clearAuth();
    },
  });

  const {
    mutateAsync: refresh,
    error: refreshErr,
    isPending: isRefreshing,
  } = useMutation({
    mutationKey: ["auth", "refresh"],
    mutationFn: authApi.refresh,
    onSuccess: ({ accessToken }) => {
      setToken(accessToken);
    },
    onError: () => {
      clearAuth();
    },
  });

  const {
    mutateAsync: register,
    isPending: isRegistering,
    error: registerErr,
  } = useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: authApi.register,
  });

  return {
    login,
    loginErr,
    isLoggingIn,
    // logout
    logout,
    logoutErr,
    isLoggingOut,
    // refresh
    refresh,
    refreshErr,
    isRefreshing,
    //register
    register,
    isRegistering,
    registerErr,
    isAuthenticated,
    user: user ?? null,
  };
};
