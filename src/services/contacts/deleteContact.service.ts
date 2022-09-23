import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";

const deleteContactService = async (contact_id: string): Promise<void> => {
  const contactRepository = AppDataSource.getRepository(Contact);

  const contact = await contactRepository.findOne({
    where: { id: contact_id },
  });

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  await contactRepository.delete(contact!.id);
};

export default deleteContactService;
