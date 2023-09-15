import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {MessageTypeEnum} from "../../../../core/entities/Message/MessageTypeEnum";
import {RoomEntity} from "../Room/Room.entity";

@Entity("messages")
export class MessageEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    userId: number;

    @ManyToOne(() => RoomEntity, (r: RoomEntity) => r.id)
    @JoinColumn({name: "roomId"})
    roomId: number;

    @Column({type: "enum", enum: MessageTypeEnum, default: MessageTypeEnum.TEXT})
    type: MessageTypeEnum;

    @Column({default: ""})
    text: string;

    @Column()
    attachment: string;

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @Column({default: false})
    isRead: boolean;
}