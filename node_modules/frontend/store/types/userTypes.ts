export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "customer" | "admin";
  cart?: Array<{
    product: string;
    quantity: number;
  }>;
}

export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface UserLoginResponse {
  user: IUser;
  token: string;
}
