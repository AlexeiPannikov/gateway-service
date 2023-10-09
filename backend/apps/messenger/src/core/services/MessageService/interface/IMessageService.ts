import {SendMessageDto} from "../dto/SendMessage.dto";
import {Message} from "../../../entities/Message/Message";
import {DeleteMessageDto} from "../dto/DeleteMessage.dto";

export interface IMessageService {
    sendMessage(dto: SendMessageDto): Promise<Message>;
    getRoomMessages(roomId: number): Promise<Message[]>;
    deleteMessage(dto: DeleteMessageDto): Promise<Message>;
}

export const IMessageService = Symbol("IMessageService")
