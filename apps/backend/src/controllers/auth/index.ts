import { login } from "./login.controller.js";
import { logout } from "./logout.controller.js";
import { refresh } from "./refresh.controller.js";
import { register } from "./register.controller.js";

export const authController = {
  login,
  logout,
  refresh,
  register,
};
