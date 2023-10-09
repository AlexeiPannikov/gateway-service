import {SubscribeMessage, WebSocketGateway, WebSocketServer, WsException} from '@nestjs/websockets';
import {Socket, Server} from "socket.io"
import {NestGateway} from "@nestjs/websockets/interfaces/nest-gateway.interface";
import {Inject, UsePipes, ValidationPipe} from "@nestjs/common";
import {ClientProxy} from "@nestjs/microservices";
import {lastValueFrom} from "rxjs";
import {IRoomService} from "../../core/services/RoomService/interface/IRoomService";
import {RoomService} from "../../core/services/RoomService/RoomService";
import {CreateRoomRequest} from "./dto/requests/CreateRoomRequest";

interface IConnection {
    [userId: number]: string[]
}

@WebSocketGateway()
export class MessengerGateway implements NestGateway {

    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
        @Inject(IRoomService)
        private readonly roomService: IRoomService,
    ) {
    }

    @WebSocketServer()
    server: Server

    private connections: IConnection = {}

    async handleConnection(client: Socket) {
        try {
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
                const rooms = await this.roomService.getRoomsByUserId(client["userId"])
                rooms.forEach(room => client.join(room.id.toString()))
                client.emit("user:authorized")
            }
            if (!data?.data?.isValid || !data?.data?.payload) {
                client.disconnect()
                return
            }
        } catch (e) {
            // client.emit("error", e)
            console.log(e)
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

    @UsePipes(new ValidationPipe())
    @SubscribeMessage('room:create')
    async handleCreateRoom(client: Socket, payload: CreateRoomRequest) {
        try {
            const room = await this.roomService.create(payload.userId)
            client.join(room.id.toString())
            this.server.to(room.id.toString()).emit("room:created", room)
        } catch (e) {
            client.emit("error", e)
            console.log(e)
        }
    }
}
