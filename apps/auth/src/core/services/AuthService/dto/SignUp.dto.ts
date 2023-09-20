import {UserRoleEnum} from "../../../entities/User/UserRoleEnum";

export interface SignUpDto {
  name: string;
  email: string;
  password: string;
  role?: UserRoleEnum;
}
