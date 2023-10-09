import {Room} from "../../entities/Room/Room";
import {AddUserToRoomDto} from "./dto/AddUserToRoom.dto";

export interface IRoomRepository {
    create(userId: number): Promise<Room>;
    getRoomsByUserId(userId: number): Promise<Room[]>;
    addUserToRoom(dto: AddUserToRoomDto): Promise<Room>;
    delete(id: number): Promise<Room>;
}

export const IRoomRepository = Symbol("IRoomRepository")