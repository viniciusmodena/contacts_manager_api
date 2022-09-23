import { Router } from "express";
import {
  checkContactDetailController,
  createContactController,
  deleteContactController,
  listClientContactsController,
  updateContactController,
} from "../controllers/contacts.controllers";
import isOwnerMiddleware from "../middlewares/isOwner.middleware";
import tokenValidation from "../middlewares/tokenValidation.middleware";
import { validateSchema } from "../middlewares/validateSchema.middleware";
import { createContactSchema, updateContactSchema } from "../schemas/contacts.schema";

const contactRouter = Router();

contactRouter.post(
  "/:client_id/contacts",
  tokenValidation,
  isOwnerMiddleware,
  validateSchema(createContactSchema),
  createContactController
);
contactRouter.get("/:client_id/contacts",tokenValidation, isOwnerMiddleware, listClientContactsController);
contactRouter.get(
  "/contacts/:contact_id",
  tokenValidation,
  isOwnerMiddleware,
  checkContactDetailController
);
contactRouter.patch(
  "/contacts/:contact_id",
  tokenValidation,
  isOwnerMiddleware,
  validateSchema(updateContactSchema),
  updateContactController
);
contactRouter.delete(
  "/contacts/:contact_id",
  tokenValidation,
  isOwnerMiddleware,
  deleteContactController
);

export default contactRouter;
