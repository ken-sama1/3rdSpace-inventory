import cors from "cors";
import express, { type Express } from "express";
import { corsOptions } from "./config/cors-options.js";
import { errorHandler } from "./middleware/error-handler.js";
import { apiV1Router } from "./routes/index.js";

const PORT = process.env["PORT"] || 3000;
const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/v1", apiV1Router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
