import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, "src");

const indexFile = path.join(sourceDir, "index.ts");

const files = fs.readdirSync(sourceDir, { recursive: true });

const fileFilter = (file) => {
  const isIndex = file.includes("index.ts");
  const isCodeFile = file.endsWith(".ts") || file.endsWith(".js");

  return !isIndex && isCodeFile;
};

const filePaths = files.filter((f) => fileFilter(f));

const exports = filePaths.map((file) => {
  return `export * from "./${file.replace(/\.ts/g, ".js")}";`;
});

fs.writeFileSync(indexFile, exports.join("\n"));

console.log("Successfully re-generated src/index.ts file");
