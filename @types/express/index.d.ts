import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      clientData: any;
      reqData: any;
      pagination: any;
    }
  }
}
