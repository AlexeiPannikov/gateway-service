import {IRoomService} from "./interface/IRoomService";
import {Inject, Injectable} from "@nestjs/common";
import {Room} from "../../entities/Room/Room";
import {AddUserToRoomDto} from "./interface/dto/AddUserToRoom.dto";
import {IRoomRepository} from "../../repositories/RoomRepository/IRoomRepository";
import {WsException} from "@nestjs/websockets";

@Injectable()
export class RoomService implements IRoomService {

    constructor(
        @Inject(IRoomRepository)
        private readonly roomRepository: IRoomRepository,
    ) {
    }

    getRoomsByUserId(userId: number): Promise<Room[]> {
        return this.roomRepository.getRoomsByUserId(userId)
    }

    async create(userId: number): Promise<Room> {
        const room =  await this.roomRepository.create(userId)
        if (!room) {
            throw new WsException("Room was not created")
        }
        return room
    }

    async delete(id: number): Promise<Room> {
        return await this.roomRepository.delete(id)
    }

    async addUserToRoom(dto: AddUserToRoomDto): Promise<Room> {
        return await this.roomRepository.addUserToRoom(dto)
    }
}