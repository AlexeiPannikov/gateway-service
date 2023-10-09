import {AuthRabbitMqController} from "./AuthRabbitMq.controller";
import {Test, TestingModule} from "@nestjs/testing";
import {UserService} from "../../../../core/services/UserService/UserService";
import {TokenService} from "../../../../core/services/TokenService/TokenService";
import {AuthService} from "../../../../core/services/AuthService/AuthService";
import {SessionService} from "../../../../core/services/SessionService/SessionService";
import {SharedModule, SharedService} from "@app/shared";
import {IUserService} from "../../../../core/services/UserService/interface/IUserService";
import {ITokenService} from "../../../../core/services/TokenService/interface/ITokenService";
import {IAuthService} from "../../../../core/services/AuthService/interface/IAuthService";
import {ISessionService} from "../../../../core/services/SessionService/interface/ISessionService";
import {ResponseInterceptor} from "../../../interceptors/ResponseInterceptor";
import {IUserRepository} from "../../../../core/repositories/UserRepository/IUserRepository";
import {UserRepositoryImpl} from "../../../db/repositories/User/UserRepositoryImpl";
import {IActivationService} from "../../../../core/services/ActivationServices/interfaces/IActivationService";
import {EmailActivationService} from "../../../../core/services/ActivationServices/EmailService/EmailActivationService";
import {ISessionRepository} from "../../../../core/repositories/SessionRepository/ISessionRepository";
import {SessionRepositoryImpl} from "../../../db/repositories/Session/SessionRepositoryImpl";
import {UserEntity} from "../../../db/entities/User/User.entity";
import {ConfigModule} from "@nestjs/config";
import {typeOrmModule} from "../../../db/orm/TypeOrmModule";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SessionEntity} from "../../../db/entities/Session/Session.entity";
import {AuthModule} from "../../../modules/auth.module";
import {RmqContext} from "@nestjs/microservices";

describe("AuthRabbitMqController", () => {

    let controller: AuthRabbitMqController

    let mockUserService = {}
    let mockTokenService = {}
    let mockAuthService = {}
    let mockSessionService = {}

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({isGlobal: true, envFilePath: './.env'}),
                typeOrmModule,
                TypeOrmModule.forFeature([UserEntity, SessionEntity]),
                AuthModule,
                SharedModule
            ],
            controllers: [AuthRabbitMqController],
            providers: [
                {
                    provide: IUserService,
                    useClass: UserService,
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
                    provide: ISessionService,
                    useClass: SessionService,
                },
            ]
        })
            .overrideProvider(IUserService)
            .useValue(mockUserService)
            .overrideProvider(ITokenService)
            .useValue(mockTokenService)
            .overrideProvider(IAuthService)
            .useValue(mockAuthService)
            .overrideProvider(ISessionService)
            .useValue(mockSessionService)
            .compile()

        controller = module.get<AuthRabbitMqController>(AuthRabbitMqController)
    })

    it("should be defined", () => {
        expect(controller).toBeDefined()
    })
})