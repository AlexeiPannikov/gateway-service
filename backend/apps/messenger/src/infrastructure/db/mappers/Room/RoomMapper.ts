import {Room} from "../../../../core/entities/Room/Room";
import {RoomEntity} from "../../entities/Room/Room.entity";
import {RoomEntityToDomainDto} from "./dto/RoomEntityToDomain.dto";

export class RoomMapper {
    static toDomain(dto: RoomEntityToDomainDto): Room {
        const domain = new Room()
        Object.assign(domain, dto.entity)
        domain.userIds = dto.userIds
        return domain
    }

    static toEntity(domain: Partial<Room>): RoomEntity {
        const entity = new RoomEntity()
        entity.id = domain.id
        entity.creatorId = domain.creatorId
        return entity
    }
}