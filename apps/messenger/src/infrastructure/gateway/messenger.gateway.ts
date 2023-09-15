import {SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {Socket, Server} from "socket.io"
import {NestGateway} from "@nestjs/websockets/interfaces/nest-gateway.interface";
import {Inject} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";
import {IRoomService} from "../../core/services/RoomService/interface/IRoomService";
import {RoomService} from "../../core/services/RoomService/RoomService";

interface IConnection {
    [userId: number]: string[]
}

@WebSocketGateway()
export class MessengerGateway implements NestGateway {

    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
        @Inject(IRoomService)
        private readonly roomService: RoomService,
    ) {
    }

    @WebSocketServer()
    server: Server

    private connections: IConnection = {}

    async handleConnection(client: Socket) {
        console.log(`${client.id}  connected`)
        const accessToken = client.handshake.headers.authorization
        const res = this.authService.send({cmd: "check-access-token"}, accessToken)
        const data = await lastValueFrom(res, {defaultValue: {data: {isValid: false}}})
        if (data?.data?.isValid && data?.data?.payload?.userId) {
            if (this.connections[data.userId]) {
                this.connections[data.userId].push(client.id)
            } else {
                this.connections[data.userId] = [client.id]
            }
            client["userId"] = data.data.payload.userId
            console.log(`User ${client["userId"]} client ${client.id} authorized`)
        }
        if (!data?.data?.isValid || !data?.data?.payload) {
            client.disconnect()
        }
    }

    async handleDisconnect(client: Socket) {
        if (this.connections[client["userId"]]) {
            this.connections[client["userId"]] = this.connections[client["userId"]].filter(id => client.id !== id)
            if (!this.connections[client["userId"]].length) {
                delete this.connections[client["userId"]]
            }
        }
        console.log(`${client["userId"] ? "User" : ""} ${client["userId"] || ""} client ${client.id} disconnected`)
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): string {
        return 'Hello world!';
    }
}
