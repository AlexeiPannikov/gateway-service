import {User} from '../../../entities/User/User';
import {SignUpDto} from "../../AuthService/dto/SignUp.dto";
import {SignInDto} from "../../AuthService/dto/SignIn.dto";
import {UserRoleEnum} from "../../../entities/User/UserRoleEnum";

export interface IUserService {
    createUser(dto: SignUpDto): Promise<User>;

    getUserByEmail(email: string): Promise<User>

    activate(activationLink: string): Promise<User>;

    getAllUsers(): Promise<User[]>;

    getUserById(id: number): Promise<User>
}

export const IUserService = Symbol('IUserService');
