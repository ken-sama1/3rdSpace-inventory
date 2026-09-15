import { login } from "./login.service.js";
import { logout } from "./logout.js";
import { refresh } from "./refresh.service.js";
import { register } from "./register.service.js";

export const authService = {
  register,
  login,
  refresh,
  logout,
};
