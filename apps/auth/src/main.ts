import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import {SessionService} from "./core/services/SessionService/SessionService";
import {ISessionService} from "./core/services/SessionService/interface/ISessionService";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {SharedService} from "@app/shared";

async function start() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const sessionService = app.get(ISessionService)
  const QUEUE = configService.get("RABBITMQ_AUTH_QUEUE")
  app.connectMicroservice(sharedService.getRmqOptions(QUEUE))
  await app.startAllMicroservices()
  sessionService.runOldSessionsCleaner()
}

start();
