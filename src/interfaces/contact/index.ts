export interface IContactRequest {
  name: string;
  email?: string;
  phone_number?: string;
}

export interface IUpdateContact {
  name?: string;
  email?: string;
  phone_number?: string;
}
