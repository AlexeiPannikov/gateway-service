import {DynamicModule, Module} from '@nestjs/common';
import { SharedService } from './shared.service';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {ClientProxyFactory, Transport} from "@nestjs/microservices";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../../apps/auth/src/infrastructure/db/entities/User/User.entity";
import {SessionEntity} from "../../../apps/auth/src/infrastructure/db/entities/Session/Session.entity";

@Module({
  providers: [SharedService, ConfigService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const USER = configService.get("RABBITMQ_USER")
          const PASSWORD = configService.get("RABBITMQ_PASS")
          const HOST = configService.get("RABBITMQ_HOST")
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue,
              queueOptions: {
                durable: true,
              }
            }
          })
        },
        inject: [ConfigService]
      }
    ]
    return {
      module: SharedModule,
      providers,
      exports: providers
    }
  }
  static registerAuthDb(): DynamicModule {
    return  TypeOrmModule.forRootAsync({
      name: "AUTH_DB",
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
    })
  }

  static registerProductsDb(): DynamicModule {
    return  TypeOrmModule.forRootAsync({
      name: "PRODUCTS_DB",
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: config.get<'aurora-postgres'>('TYPEORM_CONNECTION'),
          host: config.get<string>('TYPEORM_HOST'),
          username: config.get<string>('TYPEORM_USERNAME'),
          password: config.get<string>('TYPEORM_PASSWORD'),
          database: config.get<string>('TYPEORM_PRODUCTS_DATABASE'),
          port: config.get<number>('TYPEORM_PRODUCTS_PORT'),
          entities: [],
          synchronize: true,
          autoLoadEntities: true,
          logger: 'simple-console',
        };
      },
    })
  }
}
