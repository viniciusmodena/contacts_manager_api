import "reflect-metadata";
import "express-async-errors";
import express from "express";
import handleAppErrorMiddleware from "./middlewares/handleAppError.middleware";
import appRoutes from "./routers";

const app = express();

app.use(express.json());

appRoutes(app);

app.use(handleAppErrorMiddleware);

export default app;
