import {Message} from "../../entities/Message/Message";

export interface IMessageRepository {
    getMessagesByRoomId(roomId: number): Promise<Message[]>;
    getMessagesByUserId(userId: number): Promise<Message[]>;
    addMessage(dto: Message): Promise<Message>;
    updateMessage(dto: Partial<Message>): Promise<Message>;
    deleteMessage(id: number): Promise<Message>;
}

export const IMessageRepository = Symbol("IMessageRepository")