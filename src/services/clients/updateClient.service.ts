import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { AppError } from "../../errors/appError";
import { IUpdateClient } from "../../interfaces/client";
import { hashSync } from "bcryptjs";

const updateClientService = async (
  client_id: string,
  data: IUpdateClient
): Promise<Client> => {
  const clientRepository = AppDataSource.getRepository(Client);

  const client = await clientRepository.findOne({ where: { id: client_id } });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  if (data.email) {
    if (data.email !== client.email) {
      const clients = await clientRepository.find();

      const emailAlreadyExist = clients.find((el) => el.email === data.email);

      if (emailAlreadyExist) {
        throw new AppError("Email already exists");
      }
    }
  }

  if (data.password) {
    data.password = hashSync(data.password, 10);
  }

  await clientRepository
    .createQueryBuilder()
    .update(Client)
    .set(data)
    .where("id = :id", { id: client_id })
    .execute();

  const updatedClient = await clientRepository.findOne({
    where: { id: client_id },
  });

  if (!updatedClient) {
    throw new AppError("Client not found", 404);
  }

  return updatedClient;
};

export default updateClientService;
