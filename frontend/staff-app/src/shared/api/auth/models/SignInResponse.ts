import {User} from "./User";
import {Tokens} from "./Tokens";

export interface SignInResponse {
    user: User;
    tokens: Tokens;
}