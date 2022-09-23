import { Router } from "express";
import {
  checkClientDetaislController,
  createClientController,
  deleteClientController,
  listClientsController,
  updateClientController,
} from "../controllers/clients.controllers";
import isOwnerMiddleware from "../middlewares/isOwner.middleware";
import tokenValidation from "../middlewares/tokenValidation.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createClientSchema, updateClientSchema } from "../schemas/clients.schema";

const clientRouter = Router();

clientRouter.post("",validateSchema(createClientSchema), createClientController);
clientRouter.get("", tokenValidation, listClientsController);
clientRouter.get(
  "/:client_id",
  tokenValidation,
  isOwnerMiddleware,
  checkClientDetaislController
);
clientRouter.patch(
  "/:client_id",
  tokenValidation,
  isOwnerMiddleware,
  validateSchema(updateClientSchema),
  updateClientController
);
clientRouter.delete(
  "/:client_id",
  tokenValidation,
  isOwnerMiddleware,
  deleteClientController
);

export default clientRouter;
