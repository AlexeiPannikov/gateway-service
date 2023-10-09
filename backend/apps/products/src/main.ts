import { NestFactory } from '@nestjs/core';
import {ConfigService} from "@nestjs/config";
import {SharedService} from "@app/shared";
import {ProductsModule} from "./infrastructure/modules/products.module";

async function start() {
  const app = await NestFactory.create(ProductsModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);
  const QUEUE = configService.get("RABBITMQ_PRODUCTS_QUEUE")
  app.connectMicroservice(sharedService.getRmqOptions(QUEUE))
  await app.startAllMicroservices()
}

start();
