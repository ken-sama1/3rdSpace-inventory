import js from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/**", "node_modules/**"]),
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
  },

  {
    files: ["**/*.{ts,mts,cts}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
  },
]);
