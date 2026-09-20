import { createContext, type FC, type ReactNode } from "react";

interface AuthContext {}

const AuthContext = createContext<null | AuthContext>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {};
