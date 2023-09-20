import { Module } from '@nestjs/common';
import { AuthHttpController } from '../controllers/AuthControllers/AuthHttpController/AuthHttp.controller';
import { TokenService } from '../../core/services/TokenService/TokenService';
import { EmailActivationService } from '../../core/services/ActivationServices/EmailService/EmailActivationService';
import { UserRepositoryImpl } from '../db/repositories/User/UserRepositoryImpl';
import { IUserRepository } from '../../core/repositories/UserRepository/IUserRepository';
import { UserEntity } from '../db/entities/User/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITokenService } from '../../core/services/TokenService/interface/ITokenService';
import { IActivationService } from '../../core/services/ActivationServices/interfaces/IActivationService';
import { IUserService } from '../../core/services/UserService/interface/IUserService';
import { UserService } from '../../core/services/UserService/UserService';
import { ResponseInterceptor } from '../interceptors/ResponseInterceptor';
import {SessionEntity} from "../db/entities/Session/Session.entity";
import {ISessionRepository} from "../../core/repositories/SessionRepository/ISessionRepository";
import {SessionRepositoryImpl} from "../db/repositories/Session/SessionRepositoryImpl";
import {ISessionService} from "../../core/services/SessionService/interface/ISessionService";
import {SessionService} from "../../core/services/SessionService/SessionService";
import {IAuthService} from "../../core/services/AuthService/interface/IAuthService";
import {AuthService} from "../../core/services/AuthService/AuthService";
import {AuthRabbitMqController} from "../controllers/AuthControllers/AuthRabbitMqController/AuthRabbitMq.controller";
import {SharedService} from "@app/shared";
import {UserRabbitMqController} from "../controllers/UserControllers/UserRabbitMqController/UserRabbitMq.controller";
import {UserHttpController} from "../controllers/UserControllers/UserHttpController/UserHttp.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SessionEntity])],
  controllers: [AuthRabbitMqController, UserRabbitMqController],
  providers: [
    ResponseInterceptor,
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IUserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: ITokenService,
      useClass: TokenService,
    },
    {
      provide: IAuthService,
      useClass: AuthService,
    },
    {
      provide: IActivationService,
      useClass: EmailActivationService,
    },
    {
      provide: ISessionRepository,
      useClass: SessionRepositoryImpl,
    },
    {
      provide: ISessionService,
      useClass: SessionService,
    },
    SharedService,
  ],
})
export class AuthModule {}
