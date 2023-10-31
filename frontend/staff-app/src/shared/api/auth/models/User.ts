import {Roles} from "./Roles";

export interface User {
    id: number;
    name: string;
    role: Roles;
    email: string ;
    isActivated: boolean;
}