export interface IMessageNotificationService {
    sendNotificationToRoom(roomId: number): void
}

export const IMessageNotificationService = Symbol("IMessageNotificationService")