import {IsEmail, IsEnum, IsNotEmpty, IsString} from "class-validator";
import {UserRoleEnum} from "../../../../../auth/src/core/entities/User/UserRoleEnum";

export class CreateUserRequestDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;
}