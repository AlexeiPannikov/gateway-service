import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity("rooms")
export class RoomEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creatorId: number;
}