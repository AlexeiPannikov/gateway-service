import { NestFactory } from '@nestjs/core';
import { MessengerModule } from './infrastructure/modules/messenger.module';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(MessengerModule);
  const configService = app.get(ConfigService)
  const port = configService.get<number>('MESSENGER_PORT');
  await app.listen(port, () => {
    console.log(`Messenger started on port ${port}`)
  });
}
bootstrap();
