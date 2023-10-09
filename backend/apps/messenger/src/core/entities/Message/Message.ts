import {MessageTypeEnum} from "./MessageTypeEnum";

export interface Message {
    id: number;
    userId: number;
    roomId: number;
    type: MessageTypeEnum;
    text: string;
    attachment: Blob;
    createdAt: string;
    updatedAt: string;
    isRead: boolean;
}