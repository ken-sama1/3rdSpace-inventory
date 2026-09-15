import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { ALLOWED_ORIGINS } from "./config/constants.js";
import { corsOptions } from "./config/cors-options.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { apiV1Router } from "./routes/index.js";

const PORT = process.env["PORT"] || 3000;
const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.set("query parser", "extended");

app.get("/health", (_, res) => {
  res.send(ALLOWED_ORIGINS);
});
app.use("/api/v1", apiV1Router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
