import {Module} from "@nestjs/common";
import {SharedModule} from "@app/shared";
import * as process from "process";
import {ConfigModule} from "@nestjs/config";
import {UserHttpController} from "./controllers/http/user-http.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        SharedModule.registerRmq("AUTH_SERVICE", process.env.RABBITMQ_AUTH_QUEUE),
    ],
    controllers: [UserHttpController]
})
export class UserModule {
}