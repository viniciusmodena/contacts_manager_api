import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";

const listClientContactsService = async (
  client_id: string
): Promise<Client> => {
  const clientRepository = AppDataSource.getRepository(Client);
  const contactRepository = AppDataSource.getRepository(Contact);

  const client = await clientRepository.findOne({ where: { id: client_id } });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  // const contacts = await contactRepository.find({relations: {client:true}, where: { client: client } });

  const clientContacts = await clientRepository.findOne({
    relations: {
      contacts: true,
    },
    where: {
      id: client_id,
    },
  });

  if (!clientContacts) {
    throw new AppError("Client not found", 404)
  }

  return clientContacts

  // return contacts;
};

export default listClientContactsService;
