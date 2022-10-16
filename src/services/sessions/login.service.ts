import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";
import { IClientLogin } from "../../interfaces/client";
import { AppDataSource } from "../../data-source";
import { Client } from "../../entities/client.entity";
import { AppError } from "../../errors/appError";

const loginService = async ({ email, password }: IClientLogin) => {
  const clientRepository = AppDataSource.getRepository(Client);

  const client = await clientRepository.findOne({
    where: { email: email },
  });

  if (!client) {
    throw new AppError("Invalid email or password", 403);
  }

  if (client.password) {
    const passwordCheck = await compare(password, client.password);

    if (!passwordCheck) {
      throw new AppError("Invalid email or password", 403);
    }
  }

  const token = jwt.sign({ id: client.id }, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });

  return {
    access_token: token,
    token_type: "Bearer",
    user: client,
  };
};

export default loginService;
