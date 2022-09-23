export interface IClientRequest {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface IUpdateClient {
  full_name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}

export interface IClientLogin {
  email: string;
  password: string;
}
