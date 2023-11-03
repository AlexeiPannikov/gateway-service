import {Roles} from "../../../shared";

export class AuthorizedUser {
    id: number = 0;
    name: string = "";
    role: Roles | null = null;
    email: string = "";
    isActivated: boolean = false;

    constructor(obj?: Partial<AuthorizedUser>) {
        if (obj) {
            Object.assign(this, obj)
        }
    }
}