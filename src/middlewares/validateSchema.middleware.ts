import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { AppError } from "../errors/appError";


export const validateSchema =
  (schema: yup.AnyObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;

    try {
      const data = await schema.validate(body, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.reqData = data;

      next();
    } catch (e) {
      next(new AppError((e as any).errors.join(", "), (e as any).statusCode));
    }
  };