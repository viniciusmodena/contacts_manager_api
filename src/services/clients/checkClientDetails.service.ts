import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { AppError } from "../../errors/appError";

const checkClientDetailsService = async (client_id: string) => {
  const clientRepository = AppDataSource.getRepository(Client);

  const client = await clientRepository.findOne({
    where: { id: client_id },
  });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  return client;
};

export default checkClientDetailsService;
