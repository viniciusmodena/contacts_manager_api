import { Request, Response } from "express";
import loginService from "../services/sessions/login.service";

export const LoginController = async (req: Request, res: Response) => {
  const { email, password } = req.reqData;

  const token = await loginService({ email, password });

  return res.status(201).json(token);
};
