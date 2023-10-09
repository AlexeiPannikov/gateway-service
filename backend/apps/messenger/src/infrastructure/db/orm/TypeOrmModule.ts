import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {MessageEntity} from "../entities/Message/Message.entity";
import {RoomEntity} from "../entities/Room/Room.entity";
import {UserRoomEntity} from "../entities/UserRoom/UserRoom.entity";

export const typeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    return {
      type: config.get<'aurora-postgres'>('TYPEORM_CONNECTION'),
      host: config.get<string>('TYPEORM_HOST'),
      username: config.get<string>('TYPEORM_USERNAME'),
      password: config.get<string>('TYPEORM_PASSWORD'),
      database: config.get<string>('TYPEORM_MESSENGER_DATABASE'),
      port: config.get<number>('TYPEORM_MESSENGER_PORT'),
      entities: [MessageEntity, RoomEntity, UserRoomEntity],
      synchronize: true,
      autoLoadEntities: true,
      logger: 'simple-console',
    };
  },
});
