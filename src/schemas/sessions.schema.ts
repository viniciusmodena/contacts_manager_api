import * as yup from "yup";
import { SchemaOf } from "yup";
import { IClientLogin } from "../interfaces/client";

export const loginSchema: SchemaOf<IClientLogin> = yup.object().shape({
    email: yup.string().email().required().max(127),
    password: yup.string().required().min(4).max(16),
})