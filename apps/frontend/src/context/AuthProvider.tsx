import { useState, type FC, type ReactNode } from "react";
import { AuthContext, type Token } from "./AuthContext";
import { useQueryClient } from "@tanstack/react-query";

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const [token, setToken] = useState<Token>(null);

  const clearAuth = () => {
    queryClient.clear();
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        clearAuth,
        token,
        setToken,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
