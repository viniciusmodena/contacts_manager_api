import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { AppError } from "../../errors/appError";

const deleteClientService = async (client_id: string): Promise<void> => {
  const clientRepository = AppDataSource.getRepository(Client);

  const client = await clientRepository.findOne({ where: { id: client_id } });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  await clientRepository.delete(client!.id);
};

export default deleteClientService;
