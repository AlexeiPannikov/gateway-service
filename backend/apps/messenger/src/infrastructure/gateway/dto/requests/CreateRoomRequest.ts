import {IsNotEmpty, IsNumber} from "class-validator";

export class CreateRoomRequest {

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}