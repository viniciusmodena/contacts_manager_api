import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";

const listClientsService = async (): Promise<Client[]> => {
  const userRepository = AppDataSource.getRepository(Client);

  const clients = await userRepository.find();

  return clients;
};

export default listClientsService;
