import { Express } from "express";
import clientRouter from "./clients.routes";
import contactRouter from "./contacts.routes";
import sessionRouter from "./session.routes";

const appRoutes = (app: Express) => {
  app.use("/clients", clientRouter);
  app.use("/login", sessionRouter);
  app.use("/client", contactRouter);
};

export default appRoutes;
