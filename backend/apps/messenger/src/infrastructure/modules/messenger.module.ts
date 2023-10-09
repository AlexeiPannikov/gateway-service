import {Module} from '@nestjs/common';
import {MessengerGateway} from "../gateway/messenger.gateway";
import {typeOrmModule} from "../db/orm/TypeOrmModule";
import {SharedModule} from "@app/shared";
import {ConfigModule} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {RoomEntity} from "../db/entities/Room/Room.entity";
import {MessageEntity} from "../db/entities/Message/Message.entity";
import {UserRoomEntity} from "../db/entities/UserRoom/UserRoom.entity";
import * as process from "process";
import {IRoomService} from "../../core/services/RoomService/interface/IRoomService";
import {RoomService} from "../../core/services/RoomService/RoomService";
import {IRoomRepository} from "../../core/repositories/RoomRepository/IRoomRepository";
import {RoomRepositoryImpl} from "../db/repositories/RoomRepository/RoomRepositoryImpl";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        typeOrmModule,
        TypeOrmModule.forFeature([RoomEntity, MessageEntity, UserRoomEntity]),
        SharedModule.registerRmq("AUTH_SERVICE", process.env.RABBITMQ_AUTH_QUEUE),
    ],
    controllers: [],
    providers: [
        MessengerGateway,
        {
            provide: IRoomService,
            useClass: RoomService,
        },
        {
            provide: IRoomRepository,
            useClass: RoomRepositoryImpl,
        },
    ],
})
export class MessengerModule {
}
