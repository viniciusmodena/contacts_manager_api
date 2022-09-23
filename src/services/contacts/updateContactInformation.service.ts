import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";
import { IUpdateContact } from "../../interfaces/contact";

const updateContactService = async (
  contact_id: string,
  data: IUpdateContact
): Promise<Contact> => {
  const contactRepository = AppDataSource.getRepository(Contact);

  await contactRepository
    .createQueryBuilder()
    .update(Contact)
    .set(data)
    .where("id = :id", { id: contact_id })
    .execute();

  const updatedContact = await contactRepository.findOne({
    where: { id: contact_id },
  });

  if (!updatedContact) {
    throw new AppError("Contact not found", 404);
  }

  return updatedContact;
};

export default updateContactService;
