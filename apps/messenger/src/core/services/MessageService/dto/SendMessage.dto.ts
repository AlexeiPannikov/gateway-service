export interface SendMessageDto {
    fromUserId: number;
    toRoomId: number;
    text: string;
    attachment: Blob;
}