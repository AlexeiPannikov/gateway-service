import {HttpAdapterHost, NestFactory} from '@nestjs/core';
import {StaffGatewayModule} from './staff-gateway.module';
import {ConfigService} from "@nestjs/config";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
import {AllExceptionsFilter} from "@app/shared";

async function bootstrap() {
    const app = await NestFactory.create(StaffGatewayModule);
    app.enableCors({
        origin: ["http://localhost:5173"],
        credentials: true,
    });
    app.use(helmet())
    app.use(cookieParser());
    // app.use(csurf({cookie: true}));
    const configService = app.get(ConfigService)
    const port = configService.get<number>('PORT');
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
    await app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
}

bootstrap();
