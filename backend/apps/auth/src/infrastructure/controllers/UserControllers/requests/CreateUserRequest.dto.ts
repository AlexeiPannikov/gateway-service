import {UserRoleEnum} from "../../../../core/entities/User/UserRoleEnum";
import {IsEmail, IsEnum, IsNotEmpty, IsString} from "class-validator";

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