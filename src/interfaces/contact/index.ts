export interface IContactRequest {
  full_name: string;
  email?: string;
  phone_number?: string;
}

export interface IUpdateContact {
  full_name?: string;
  email?: string;
  phone_number?: string;
}
