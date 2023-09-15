import {Module} from '@nestjs/common';
import {ApiController} from './api.controller';
import {ApiService} from './api.service';
import {ConfigModule} from "@nestjs/config";
import {AuthGuard, SharedModule} from "@app/shared";
import * as process from "process";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        SharedModule.registerRmq("AUTH_SERVICE", process.env.RABBITMQ_AUTH_QUEUE),
    ],
    controllers: [ApiController],
    providers: [
        ApiService,
        AuthGuard
    ],
})
export class ApiModule {
}
