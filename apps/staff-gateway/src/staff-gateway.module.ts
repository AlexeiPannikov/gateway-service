import {Module} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import {SharedModule} from "@app/shared";
import * as process from "process";
import {ThrottlerModule} from "@nestjs/throttler";
import {AuthModule} from "./auth/auth.module";
import {UserModule} from "./user/user.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: "./.env"
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 10,
        }]),
        AuthModule,
        UserModule
    ],
})
export class StaffGatewayModule {
}
