import { Router } from "express";
import { LoginController } from "../controllers/sessions.controllers";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { loginSchema } from "../schemas/sessions.schema";

const sessionRouter = Router();

sessionRouter.post("",validateSchema(loginSchema), LoginController);

export default sessionRouter;
