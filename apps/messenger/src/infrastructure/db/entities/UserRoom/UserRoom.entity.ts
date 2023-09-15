import {Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {RoomEntity} from "../Room/Room.entity";

@Entity("users-rooms")
export class UserRoomEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToMany(() => RoomEntity, (r: RoomEntity) => r.id)
    @JoinColumn({name: "roomId"})
    roomId: number;
}