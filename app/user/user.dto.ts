import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
  _id: string;
  name: string;
  email: string;
  active?: boolean;
  role: "USER" | "ADMIN";
  password?: string;
  refreshToken?: string;
  blocked?: boolean;
  blockReason?: string;
  provider: ProviderType;
  facebookId?: string;
  image?: string;
  linkedinId?: string;
}

export enum ProviderType {
  GOOGLE = "google",
  MANUAL = "manual",
  FACEBOOK = "facebook",
  APPLE = "apple",
  LINKEDIN = "linkedin",
}


export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "CANDIDATE" | "USER";
}