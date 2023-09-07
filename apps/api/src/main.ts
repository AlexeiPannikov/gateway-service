import {NestFactory} from '@nestjs/core';
import {ApiModule} from './api.module';
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {
    const app = await NestFactory.create(ApiModule);
    const configService = app.get(ConfigService)
    const USER = configService.get("RABBITMQ_USER")
    const PASSWORD = configService.get("RABBITMQ_PASS")
    const HOST = configService.get("RABBITMQ_HOST")
    const QUEUE = configService.get("RABBITMQ_QUEUE")
    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.RMQ,
        options: {
            urls: [`ampq://${USER}:${PASSWORD}@${HOST}`],
            noAck: false,
            queue: QUEUE,
            queueOptions: {
                durable: true,
            }
        }
    })
    await app.startAllMicroservices()
}

bootstrap();
