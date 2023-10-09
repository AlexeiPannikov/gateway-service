import {UserRoleEnum} from "../../../entities/User/UserRoleEnum";

export interface CreateUserDto {
  email: string;
  name: string;
  role?: UserRoleEnum;
  password: string;
  activationLink: string;
}
