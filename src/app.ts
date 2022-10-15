import "reflect-metadata";
import "express-async-errors";
import express from "express";
import handleAppErrorMiddleware from "./middlewares/handleAppError.middleware";
import appRoutes from "./routers";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./swagger.json";

const app = express();

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());

appRoutes(app);

app.use(handleAppErrorMiddleware);

export default app;
