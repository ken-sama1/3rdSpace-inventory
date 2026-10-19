import { useAuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/auth/useAuth";
import Login from "@/pages/Login";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useEffect, type FC, type ReactNode } from "react";

const InitializeSession: FC<{ children: ReactNode }> = ({ children }) => {
  const { setToken } = useAuthContext();
  const { refresh, isAuthenticated, isLoggingIn, isRefreshing } = useAuth();

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const { accessToken } = await refresh();
        setToken(accessToken);
      } catch (error) {
        console.error(error);
        setToken(null);
      }
    };

    initializeSession()
      .then(() => {
        console.log("Session intialized");
      })
      .catch((err: unknown) => {
        console.error("Session failed to initialize: ", err);
      });
  }, [setToken, refresh]);

  if (isRefreshing || isLoggingIn) {
    return <LoadingScreen message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

export default InitializeSession;
