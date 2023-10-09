import {NestFactory} from '@nestjs/core';
import {StaffGatewayModule} from './staff-gateway.module';
import {ConfigService} from "@nestjs/config";
import cookieParser from "cookie-parser";
import * as csurf from "csurf";
import helmet from "helmet";

async function bootstrap() {
    const app = await NestFactory.create(StaffGatewayModule);
    app.enableCors();
    app.use(helmet())
    app.use(cookieParser());
    // app.use(csurf({cookie: true}));
    const configService = app.get(ConfigService)
    const port = configService.get<number>('PORT');
    await app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

bootstrap();
