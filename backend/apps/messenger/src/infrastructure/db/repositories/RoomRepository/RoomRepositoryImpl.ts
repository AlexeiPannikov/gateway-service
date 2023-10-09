import {IRoomRepository} from "../../../../core/repositories/RoomRepository/IRoomRepository";
import {Room} from "../../../../core/entities/Room/Room";
import {AddUserToRoomDto} from "../../../../core/repositories/RoomRepository/dto/AddUserToRoom.dto";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {RoomEntity} from "../../entities/Room/Room.entity";
import {Repository} from "typeorm";
import {UserRoomEntity} from "../../entities/UserRoom/UserRoom.entity";
import {RoomMapper} from "../../mappers/Room/RoomMapper";
import {logLevel} from "@nestjs/microservices/external/kafka.interface";

@Injectable()
export class RoomRepositoryImpl implements IRoomRepository {

    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        @InjectRepository(UserRoomEntity)
        private readonly userRoomRepository: Repository<UserRoomEntity>,
    ) {
    }

    async addUserToRoom(dto: AddUserToRoomDto): Promise<Room> {
        const room = await this.roomRepository.findOneBy({id: dto.userId})
        if (room) {
            const userRoomRelationFromBase = await this.userRoomRepository.findOneBy({
                roomId: dto.roomId,
                userId: dto.userId
            })
            if (!userRoomRelationFromBase) {
                const userRoomRelation = new UserRoomEntity()
                Object.assign(userRoomRelation, dto)
                await this.userRoomRepository.save(userRoomRelation)
            }
            const allRelations = await this.userRoomRepository.findBy({
                roomId: dto.roomId
            })
            return RoomMapper.toDomain({
                entity: room,
                userIds: allRelations.map(({userId}) => userId)
            })
        }
    }

    async create(userId: number): Promise<Room> {
        const entity = RoomMapper.toEntity({
            creatorId: userId,
            userIds: [userId]
        })
        const newRoom = await this.roomRepository.save(entity)
        const userRoomRelation = new UserRoomEntity()
        userRoomRelation.roomId = newRoom.id
        userRoomRelation.userId = userId
        await this.userRoomRepository.save(userRoomRelation)
        return RoomMapper.toDomain({
            entity: newRoom,
            userIds: [userId]
        })
    }

    delete(id: number): Promise<Room> {
        return Promise.resolve(undefined);
    }

    async getRoomsByUserId(userId: number): Promise<Room[]> {
        const rooms: Room[] = []
        const entities = await this.roomRepository.findBy({creatorId: userId})
        for (const room of entities) {
            const userRoomRelation = await this.userRoomRepository.findBy({roomId: room.id})
            rooms.push(
                RoomMapper.toDomain({
                    entity: room,
                    userIds: userRoomRelation.map(({userId}) => userId)
                })
            )
        }
        return rooms
    }

}