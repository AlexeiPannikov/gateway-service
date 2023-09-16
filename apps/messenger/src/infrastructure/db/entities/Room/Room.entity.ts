import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity("rooms")
export class RoomEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creatorId: number;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}