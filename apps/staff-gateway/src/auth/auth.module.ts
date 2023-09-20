import {Module} from "@nestjs/common";
import {AuthHttpController} from "./controllers/http/auth-http.controller";
import {SharedModule} from "@app/shared";
import * as process from "process";
import {ConfigModule} from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        SharedModule.registerRmq("AUTH_SERVICE", process.env.RABBITMQ_AUTH_QUEUE),
    ],
    controllers: [AuthHttpController]
})
export class AuthModule {
}