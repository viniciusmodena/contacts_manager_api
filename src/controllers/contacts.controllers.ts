import { Request, Response } from "express";
import checkContactDetailService from "../services/contacts/checkContactDetails.service";
import createContactService from "../services/contacts/createContact.service";
import deleteContactService from "../services/contacts/deleteContact.service";
import listClientContactsService from "../services/contacts/listClientContacts.service";
import updateContactService from "../services/contacts/updateContactInformation.service";

export const createContactController = async (req: Request, res: Response) => {
  const { client_id } = req.params;
  const { full_name, email, phone_number } = req.reqData;
  const contact = await createContactService({
    full_name,
    email,
    phone_number
  }, client_id);

  return res.status(201).json(contact);
};

export const listClientContactsController = async (
  req: Request,
  res: Response
) => {
  const { client_id } = req.params;

  const contactList = await listClientContactsService(client_id);

  return res.status(200).json(contactList);
};

export const checkContactDetailController = async (
  req: Request,
  res: Response
) => {
  const { contact_id } = req.params;

  const contact = await checkContactDetailService(contact_id);

  return res.status(200).json(contact);
};

export const updateContactController = async (req: Request, res: Response) => {
  const { contact_id } = req.params;
  const data = req.reqData;

  const contact = await updateContactService(contact_id, data);

  return res.status(200).json(contact);
};

export const deleteContactController = async (req: Request, res: Response) => {
  const { contact_id } = req.params;

  await deleteContactService(contact_id);

  return res.status(204).json();
};
