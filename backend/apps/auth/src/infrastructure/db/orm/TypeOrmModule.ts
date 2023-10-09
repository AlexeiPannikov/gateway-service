import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {UserEntity} from "../entities/User/User.entity";
import {SessionEntity} from "../entities/Session/Session.entity";

export const typeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    return {
      type: config.get<'aurora-postgres'>('TYPEORM_CONNECTION'),
      host: config.get<string>('TYPEORM_HOST'),
      username: config.get<string>('TYPEORM_USERNAME'),
      password: config.get<string>('TYPEORM_PASSWORD'),
      database: config.get<string>('TYPEORM_DATABASE'),
      port: config.get<number>('TYPEORM_PORT'),
      entities: [UserEntity, SessionEntity],
      synchronize: true,
      autoLoadEntities: true,
      logger: 'simple-console',
    };
  },
});
