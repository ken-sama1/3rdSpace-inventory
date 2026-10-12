import { createContext, useContext } from "react";

export type Token = string | null;

interface AuthContext {
  setToken: (token: Token) => void;
  isAuthenticated: boolean;
  token: Token;
  clearAuth: () => void;
}

export const AuthContext = createContext<null | AuthContext>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");

  return context;
};
