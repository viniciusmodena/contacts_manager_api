import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";
import { IContactRequest } from "../../interfaces/contact";

const createContactService = async (
  { name, email, phone_number }: IContactRequest,
  client_id: string
): Promise<Contact> => {
  const contactRepository = AppDataSource.getRepository(Contact);
  const clientRepository = AppDataSource.getRepository(Client);

  const client = await clientRepository.findOne({ where: { id: client_id } });

  if (!client) {
    throw new AppError("Client not found", 404);
  }

  const contact = contactRepository.create({
    name,
    email,
    phone_number,
    client,
  });
  await contactRepository.save(contact);

  return contact;
};

export default createContactService;
