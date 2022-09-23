import { AppDataSource } from "../../data-source";
import { Contact } from "../../entities/contact.entity";
import { AppError } from "../../errors/appError";

const checkContactDetailService = async (contact_id: string) => {
  const contactRepository = AppDataSource.getRepository(Contact);

  const contact = contactRepository.findOne({ where: { id: contact_id } });

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  return contact;
};

export default checkContactDetailService;
