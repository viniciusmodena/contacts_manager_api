import { Request, Response } from "express";
import checkClientDetailsService from "../services/clients/checkClientDetails.service";
import createClientService from "../services/clients/createClient.service";
import deleteClientService from "../services/clients/deleteClient.service";
import listClientsService from "../services/clients/listClients.service";
import updateClientService from "../services/clients/updateClient.service";

export const createClientController = async (req: Request, res: Response) => {
  const { first_name, last_name, email, password, phone_number } = req.reqData;

  const client = await createClientService({
    first_name,
    last_name,
    email,
    password,
    phone_number,
  });

  return res.status(201).json(client);
};

export const listClientsController = async (req: Request, res: Response) => {
  const clients = await listClientsService();

  return res.status(200).json(clients);
};

export const checkClientDetaislController = async (
  req: Request,
  res: Response
) => {
  const { client_id } = req.params;

  const client = await checkClientDetailsService(client_id);

  return res.status(200).json(client);
};

export const updateClientController = async (req: Request, res: Response) => {
  const { client_id } = req.params;
  const data = req.reqData;

  const client = await updateClientService(client_id, data);

  res.status(200).json(client);
};

export const deleteClientController = async (req: Request, res: Response) => {
  const { client_id } = req.params;

  await deleteClientService(client_id);

  return res.status(204).json({ message: "Client deleted" });
};
