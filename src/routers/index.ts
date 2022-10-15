import { Express } from "express";
import clientRouter from "./clients.routes";
import contactRouter from "./contacts.routes";
import docRouter from "./documentation.routes";
import sessionRouter from "./session.routes";

const appRoutes = (app: Express) => {
  app.use("/clients", clientRouter);
  app.use("/login", sessionRouter);
  app.use("/client", contactRouter);
  app.use("", docRouter);
};

export default appRoutes;
