import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { AppError } from "../../errors/appError";
import { IClientRequest } from "../../interfaces/client";
import { hash } from "bcryptjs";

const createClientService = async ({
  first_name,
  last_name,
  email,
  phone_number,
  password,
}: IClientRequest): Promise<Client> => {
  const clientRepository = AppDataSource.getRepository(Client);

  const clients = await clientRepository.find();

  const emailAlreadyExist = clients.find((client) => client.email === email);

  if (emailAlreadyExist) {
    throw new AppError("Email already exists", 400);
  }

  const phoneNumberAlreadyExist = clients.find(
    (client) => client.phone_number === phone_number
  );

  if (phoneNumberAlreadyExist) {
    throw new AppError("Phone number already exists", 400);
  }

  const hashedPassword = await hash(password, 10);

  const client = clientRepository.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
    phone_number,
  });

  await clientRepository.save(client);

  delete client.password;
  return client;
};

export default createClientService;
