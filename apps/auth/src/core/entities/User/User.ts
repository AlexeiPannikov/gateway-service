import {UserRoleEnum} from "./UserRoleEnum";

export class User {
  id: number;
  name: string;
  role: UserRoleEnum;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;

  constructor(obj?: Partial<User>) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
}
