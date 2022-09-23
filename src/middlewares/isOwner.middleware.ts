import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Contact } from "../entities/contact.entity";
import { AppError } from "../errors/appError";

const isOwnerMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client_id = req.clientData.client_id;

  if (req.params.client_id) {
    if (client_id === req.params.client_id) {
      next();
    } else {
      throw new AppError("Unauthorized", 401);
    }
  }

  if (req.params.contact_id) {
    const contactRepository = AppDataSource.getRepository(Contact);
    
    const owner = await contactRepository.findOne({
      relations: {client: true},
      where: { id: req.params.contact_id },
    });
    
    if (client_id === owner?.client.id) {
      next();
    } else {
      throw new AppError("Unauthorized", 401);
    }
  }
};

export default isOwnerMiddleware;
