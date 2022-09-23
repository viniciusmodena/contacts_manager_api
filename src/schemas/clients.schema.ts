import * as yup from "yup";
import { SchemaOf } from "yup";
import { IClientRequest, IUpdateClient } from "../interfaces/client";

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/


export const createClientSchema: SchemaOf<IClientRequest> = yup.object().shape({
    full_name: yup.string().required().max(127),
    email: yup.string().email().required().max(127),
    password: yup.string().required().min(4).max(16),
    phone_number: yup.string().matches(phoneRegExp, 'phone number is not valid').required()
})

export const updateClientSchema: SchemaOf<IUpdateClient> = yup.object().shape({
    full_name: yup.string().max(127),
    email: yup.string().email().max(127),
    password: yup.string().min(4).max(16),
    phone_number: yup.string().matches(phoneRegExp, 'Phone number is not valid')
})