import {User} from "../models/User";
import {Tokens} from "../../../entities/authorized-user/models/Tokens";

export interface SignInResponse {
    user: User;
    tokens: Tokens;
}