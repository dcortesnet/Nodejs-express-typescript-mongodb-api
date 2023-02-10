import express, { Response, Request, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import mongoose from "mongoose";
import userRouter from "./routers/user.router";
import morganMiddleware from "./middlewares/morgan.middleware";
import httpExceptionMiddleware from "./middlewares/httpexception.middleware";
import authRouter from "./routers/auth.router";
import Logger from "./config/logger";
import cors from "cors";

export const app = express();

mongoose
  .connect("", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    Logger.info("Database connected!");
  })
  .catch(() => {
    Logger.error("Database connection failed!");
  });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/docs", swaggerUi.serve, async (req: Request, res: Response) => {
  return res.send(swaggerUi.generateHTML(await import("./swagger.json")));
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-type", "text/html");
  return res.send(`<h1>Bienvenidos al workshop</h1>`);
});

app.use("/api/v1/users", morganMiddleware, userRouter);
app.use("/api/v1/auth", morganMiddleware, authRouter);
app.use(httpExceptionMiddleware);
