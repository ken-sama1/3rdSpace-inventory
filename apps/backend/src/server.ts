import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { corsOptions } from "./config/cors-options.js";
import { apiV1Router } from "./routes/index.js";
import { PORT } from "./constants.js";

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.set("query parser", "extended");

app.get("/health", async (_, res) => {
  res.send("Healty I guess??");
});

app.use("/api/v1", apiV1Router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`);
});
