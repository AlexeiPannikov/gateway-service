import {RoomEntity} from "../../../entities/Room/Room.entity";

export interface RoomEntityToDomainDto {
    entity: RoomEntity;
    userIds: number[]
}