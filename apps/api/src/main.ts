import {NestFactory} from '@nestjs/core';
import {ApiModule} from './api.module';
import {ConfigService} from "@nestjs/config";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
    const app = await NestFactory.create(ApiModule);
    app.use(cookieParser());
    const configService = app.get(ConfigService)
    const port = configService.get<number>('PORT');
    await app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

bootstrap();
