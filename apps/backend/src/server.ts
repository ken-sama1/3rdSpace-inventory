import express, { type Express } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { apiV1Router } from "./routes/index.js";
import { corsOptions } from "./config/cors-options.js";

import { ALLOWED_ORIGINS } from "./config/const.js";
const PORT = process.env["PORT"] || 3000;
const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());

app.get("/health", (_, res) => {
  res.send(ALLOWED_ORIGINS);
});
app.use("/api/v1", apiV1Router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
