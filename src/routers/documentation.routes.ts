import { Router } from "express";

import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../swagger.json";

const docRouter = Router();

docRouter.use("api-docs", swaggerUi.serve);
docRouter.get("api-docs", swaggerUi.setup(swaggerDocument));

export default docRouter;
