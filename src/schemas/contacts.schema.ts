import * as yup from "yup";
import { SchemaOf } from "yup";
import { IContactRequest, IUpdateContact } from "../interfaces/contact";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const createContactSchema: SchemaOf<IContactRequest> = yup
  .object()
  .shape({
    name: yup.string().required().max(127),
    email: yup.string().email().max(127),
    phone_number: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid"),
  });

export const updateContactSchema: SchemaOf<IUpdateContact> = yup
  .object()
  .shape({
    name: yup.string().max(127),
    email: yup.string().email().max(127),
    phone_number: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid"),
  });
