import { DataSource } from "typeorm";
import request from "supertest";
import { IClientRequest } from "../../interfaces/client";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import app from "../../app";
import loginService from "../../services/sessions/login.service";

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

let client_1_id: string;
let client_2_id: string;

const credentials = {
  email: client_1.email,
  password: client_1.password,
};

describe("Test routes for client", () => {
  let connection: DataSource;

  beforeAll(async () => {
    await AppDataSource.initialize()
      .then((res) => (connection = res))
      .catch((err) => {
        console.error("Error during Data Source initialization", err);
      });
  });

  afterAll(async () => {
    const clientRepository = AppDataSource.getRepository(Client);
    await clientRepository.createQueryBuilder().delete().from(Client).execute();
    await connection.destroy();
  });

  test("Should be able to create client 1", async () => {
    const response = await request(app).post("/clients").send(client_1);
    client_1_id = response.body.id;

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("full_name", client_1.full_name);
    expect(response.body).toHaveProperty("email", client_1.email);
    expect(response.body).toHaveProperty("phone_number", client_1.phone_number);
    expect(response.body).toHaveProperty("created_at");
  });

  test("Should be able to create client 2", async () => {
    const response = await request(app).post("/clients").send(client_2);
    client_2_id = response.body.id;

    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("full_name", client_2.full_name);
    expect(response.body).toHaveProperty("email", client_2.email);
    expect(response.body).toHaveProperty("phone_number", client_2.phone_number);
    expect(response.body).toHaveProperty("created_at");
  });

  test("Should not be able to create a client with a email already registered", async () => {
    const client: IClientRequest = {
      full_name: "Client One",
      email: "client1@email.com",
      password: "1234",
      phone_number: "654654654",
    };
    const response = await request(app).post("/clients").send(client);

    expect(response.status).toBe(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Email already exists",
      })
    );
  });

  test("Should not be able to create a client with a phone number already registered", async () => {
    const client: IClientRequest = {
      full_name: "Client",
      email: "client_random@email.com",
      password: "1234",
      phone_number: "111111111",
    };
    const response = await request(app).post("/clients").send(client);

    expect(response.status).toBe(400);

    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Phone number already exists",
      })
    );
  });

  test("Should be able to login", async () => {
    const response = await request(app).post("/login").send(credentials);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
  });

  test("Should not be able to login", async () => {
    const credentials = {
      email: "random@email.com",
      password: "1235465",
    };

    const response = await request(app).post("/login").send(credentials);

    expect(response.status).toBe(403);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid email or password",
      })
    );
  });

  test("Should be able to list all clients", async () => {
    const login_response = await request(app).post("/login").send(credentials);
    const token = login_response.body.token;

    const response = await request(app)
      .get("/clients")
      .set("Authorization", `bearer: ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("map");
  });

  test("Should not be able to list client without authentication", async () => {
    const response = await request(app).get(`/clients/${client_1_id}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should be able to check a specific client", async () => {
    const login_response = await request(app).post("/login").send(credentials);
    const token = login_response.body.token;

    const response = await request(app)
      .get(`/clients/${client_1_id}`)
      .set("Authorization", `bearer: ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty("full_name", client_1.full_name);
    expect(response.body).toHaveProperty("email", client_1.email);
    expect(response.body).toHaveProperty("phone_number", client_1.phone_number);
  });

  test("Should not be able to check a specific client without authentication", async () => {
    const response = await request(app).get(`/clients/${client_1_id}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should be able to update own client", async () => {
    const login_response = await request(app).post("/login").send(credentials);
    const token = login_response.body.token;

    const updateClient = { full_name: "Updated Client" };

    const response = await request(app)
      .patch(`/clients/${client_1_id}`)
      .send(updateClient)
      .set("Authorization", `bearer: ${token}`);

    expect(response.status).toBe(200);

    expect(response.body.full_name).toBe(updateClient.full_name);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("phone_number");
    expect(response.body).toHaveProperty("created_at");
  });

  test("Should not be able to update own client without authentication", async () => {
    const updateClient = { full_name: "Updated Client" };

    const response = await request(app)
      .patch(`/clients/${client_1_id}`)
      .send(updateClient);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should not be able to update other client", async () => {
    const login_response = await request(app).post("/login").send(credentials);
    const token = login_response.body.token;

    const updateClient = { full_name: "Updated Full Name" };

    const response = await request(app)
      .patch(`/clients/${client_2_id}`)
      .send(updateClient)
      .set("Authorization", `bearer: ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  test("Should not be able to delete other client", async () => {
    const login_response = await request(app).post("/login").send(credentials);
    const token = login_response.body.token;

    const response = await request(app)
      .delete(`/clients/${client_2_id}`)
      .set("Authorization", `bearer: ${token}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Unauthorized",
      })
    );
  });

  test("Should not be able to delete client without authentication", async () => {
    const response = await request(app).delete(`/clients/${client_1_id}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: "Invalid token",
      })
    );
  });

  test("Should be able to delete own client", async () => {
    const login_response = await request(app).post("/login").send(credentials);
    const token = login_response.body.token;

    const response = await request(app)
      .delete(`/clients/${client_1_id}`)
      .set("Authorization", `bearer: ${token}`);

    expect(response.status).toBe(204);
  });
});
