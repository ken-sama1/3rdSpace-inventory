import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

type Token = string | null;

interface AuthContext {
  setToken: (token: Token) => void;
  isAuthenticated: boolean;
  token: Token;
  clearAuth: () => void;
}

const AuthContext = createContext<null | AuthContext>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
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

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");

  return context;
};
