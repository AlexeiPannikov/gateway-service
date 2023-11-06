import {Roles} from "../../../entities/authorized-user/models/Roles";

export interface User {
    id: number;
    name: string;
    role: Roles;
    email: string ;
    isActivated: boolean;
}