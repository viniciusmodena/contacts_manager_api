import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../data-source";
import app from "../../app";
import { IClientRequest } from "../../interfaces/client";
import { Contact } from "../../entities/contact.entity";
import { IContactRequest } from "../../interfaces/contact";

const client_1: IClientRequest = {
  full_name: "Client One",
  email: "client1@email.com",
  password: "1234",
  phone_number: "111111111",
};

const client_2: IClientRequest = {
  full_name: "Client Two",
  email: "client2@email.com",
  password: "1234",
  phone_number: "222222222",
};

const contact_1: IContactRequest = {
  full_name: "Contact One Name",
  email: "contact1@email.com",
  phone_number: "123123123",
};

let client_1_id: string;
let client_2_id: string;
let contact_id: string;
let access_token: string;
let access_token_2: string;

describe("Test routes for contact", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });

    const create_client_1_response = await request(app)
      .post("/clients")
      .send(client_1);
    client_1_id = create_client_1_response.body.id;

    const create_client_2_response = await request(app)
      .post("/clients")
      .send(client_2);
    client_2_id = create_client_2_response.body.id;

    const credentials = {
      email: client_1.email,
      password: client_1.password,
    };

    const login_response = await request(app).post("/login").send(credentials);
    access_token = login_response.body.access_token;

    const credentials_2 = {
      email: client_2.email,
      password: client_2.password,
    };

    const login_2_response = await request(app)
      .post("/login")
      .send(credentials_2);
    access_token_2 = login_2_response.body.access_token;
  });

  afterAll(async () => {
    const contactRepository = AppDataSource.getRepository(Contact);
    await contactRepository
      .createQueryBuilder()
      .delete()
      .from(Contact)
      .execute();
    await connection.destroy();
  });

  test("Should be able to create a contact to client 1", async () => {
    const response = await request(app)
      .post(`/client/${client_1_id}/contacts`)
      .send(contact_1)
      .set("Authorization", `bearer: ${access_token}`);
    contact_id = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("full_name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("phone_number");
  });

  test("Should not be able to create a contact without authentication", async () => {
    const response = await request(app)
      .post(`/client/${client_1_id}/contacts`)
      .send(contact_1);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should not be able to create a contact to other client", async () => {
    const response = await request(app)
      .post(`/client/${client_2_id}/contacts`)
      .send(contact_1)
      .set("Authorization", `bearer: ${access_token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  test("Should be able to list all contact from client 1", async () => {
    const response = await request(app)
      .get(`/client/${client_1_id}/contacts`)
      .set("Authorization", `bearer: ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("contacts");
    expect(response.body.contacts).toHaveProperty("map");
  });

  test("Should not be able to list contacts without authentication", async () => {
    const response = await request(app).get(`/client/${client_1_id}/contacts`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should not be able to list contacts from other client", async () => {
    const response = await request(app)
      .get(`/client/${client_2_id}/contacts`)
      .set("Authorization", `bearer: ${access_token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  test("Should be able to update own contact", async () => {
    const update_contact = {
      full_name: "Updated name",
      email: "updatedemail@email.com",
    };
    const response = await request(app)
      .patch(`/client/contacts/${contact_id}`)
      .send(update_contact)
      .set("Authorization", `bearer: ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("full_name", update_contact.full_name);
    expect(response.body).toHaveProperty("email", update_contact.email);
    expect(response.body).toHaveProperty("phone_number");
    expect(response.body).toHaveProperty("id");
  });

  test("Should not be able to update contact without authentication", async () => {
    const update_contact = {
      full_name: "Updated name",
      email: "updatedemail@email.com",
    };
    const response = await request(app)
      .patch(`/client/contacts/${contact_id}`)
      .send(update_contact);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should not be able to update contact from other client", async () => {
    const new_contact = {
      full_name: "new contact",
      email: "newcontact@email.com",
      phone_number: "000555123",
    };

    const create_contact_response = await request(app)
      .post(`/client/${client_2_id}/contacts`)
      .send(new_contact)
      .set("Authorization", `bearer: ${access_token_2}`);
    const new_contact_id = create_contact_response.body.id;

    const update_contact = {
      full_name: "Updated name",
      email: "updatedemail@email.com",
    };
    const response = await request(app)
      .patch(`/client/contacts/${new_contact_id}`)
      .send(update_contact)
      .set("Authorization", `bearer: ${access_token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  test("Should not be able to delete contact without authentication", async () => {
    const response = await request(app).delete(
      `/client/contacts/${contact_id}`
    );

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should not be able to delete contact from other client", async () => {
    const new_contact = {
      full_name: "new contact_2",
      email: "newcontact2@email.com",
      phone_number: "000555123",
    };

    const create_contact_response = await request(app)
      .post(`/client/${client_2_id}/contacts`)
      .send(new_contact)
      .set("Authorization", `bearer: ${access_token_2}`);
    const new_contact_id = create_contact_response.body.id;
    const response = await request(app)
      .delete(`/client/contacts/${new_contact_id}`)
      .set("Authorization", `bearer: ${access_token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  test("Should be able to delete own contact", async () => {
    const response = await request(app)
      .delete(`/client/contacts/${contact_id}`)
      .set("Authorization", `bearer: ${access_token}`);

    expect(response.status).toBe(204);
  });
});
