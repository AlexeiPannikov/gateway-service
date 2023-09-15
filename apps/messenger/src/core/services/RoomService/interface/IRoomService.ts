import {Room} from "../../../entities/Room/Room";
import {AddUserToRoomDto} from "./dto/AddUserToRoom.dto";

export interface IRoomService {
    getRoomsByUserId(userId: number): Promise<Room[]>
    create(userId: number): Promise<Room>;
    addUserToRoom(dto: AddUserToRoomDto): Promise<Room>
    delete(id: number): Promise<Room>;
}

export const IRoomService = Symbol("IRoomService")