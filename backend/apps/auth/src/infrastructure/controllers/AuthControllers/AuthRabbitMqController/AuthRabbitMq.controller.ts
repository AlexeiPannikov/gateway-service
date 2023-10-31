import {
    Controller,
    HttpException,
    HttpStatus,
    Inject,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {IUserService} from '../../../../core/services/UserService/interface/IUserService';
import {ResponseInterceptor} from '../../../interceptors/ResponseInterceptor';
import {ITokenService} from "../../../../core/services/TokenService/interface/ITokenService";
import {SignUpRequestDto} from "../requests/SignUpRequest.dto";
import {SignInRequestDto} from "../requests/SignInRequest.dto";
import {UserResponse} from "../../UserControllers/responses/UserResponse";
import {IAuthService} from "../../../../core/services/AuthService/interface/IAuthService";
import {ISessionService} from "../../../../core/services/SessionService/interface/ISessionService";
import {Ctx, MessagePattern, Payload, RmqContext, RpcException} from "@nestjs/microservices";
import {SharedService} from "@app/shared";

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthRabbitMqController {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
        @Inject(IAuthService)
        private readonly authService: IAuthService,
        @Inject(ISessionService)
        private readonly sessionService: ISessionService,
        @Inject(SharedService)
        private readonly sharedService: SharedService,
    ) {
    }

    @MessagePattern({cmd: 'sign-up'})
    async signUp(
        @Ctx() context: RmqContext,
        @Payload() dto: SignUpRequestDto,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const data = await this.authService.signUp(dto);
            const user = new UserResponse(data.user)
            return {
                user
            }
        } catch (e) {
            console.log(e);
            throw new RpcException(e)
        }
    }

    @MessagePattern({cmd: 'activate'})
    async activate(
        @Ctx() context: RmqContext,
        @Payload() link: string,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const user = await this.userService.activate(link);
            return {
                user: new UserResponse(user)
            }
        } catch (e) {
            console.log(e);
            throw new RpcException(e)
        }
    }

    @MessagePattern({cmd: 'sign-in'})
    async signIn(
        @Ctx() context: RmqContext,
        @Payload() dto: SignInRequestDto,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const data = await this.authService.signIn(dto);
            return {
                user: new UserResponse(data.user),
                tokens: data.tokens
            }
        } catch (e) {
            console.log(e);
            throw new RpcException(e)
        }
    }

    @MessagePattern({cmd: 'log-out'})
    async logOut(
        @Ctx() context: RmqContext,
        @Payload() refreshToken: string,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const res = await this.authService.logOut(refreshToken);
            return {
                success: res
            }
        } catch (e) {
            console.log(e);
            throw new RpcException(e)
        }
    }

    @MessagePattern({cmd: 'refresh'})
    async refresh(
        @Ctx() context: RmqContext,
        @Payload() refreshToken: string,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const data = await this.authService.refreshToken(refreshToken);
            return {
                user: new UserResponse(data.user),
                tokens: data.tokens
            };
        } catch (e) {
            console.log(e);
            throw new RpcException(e)
        }
    }

    @MessagePattern({cmd: 'me'})
    async me(
        @Ctx() context: RmqContext,
        @Payload() accessToken: string,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const userData = this.tokenService.validateAccessToken(accessToken)
            if (!userData || !userData?.userId) {
                const exception = new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
                return  new RpcException(exception)
            }
            const user = await this.userService.getUserById(userData.userId);
            return {
                user: new UserResponse(user),
            };
        } catch (e) {
            console.log(e);
            throw new RpcException(e)
        }
    }

    @MessagePattern({cmd: 'check-access-token'})
    async checkToken(
        @Ctx() context: RmqContext,
        @Payload() accessToken: string,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            if (!accessToken) {
                return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
            }
            const payload = this.tokenService.validateAccessToken(accessToken);
            if (!payload || !("sessionUuid" in payload) || !("userId" in payload)) {
                return {
                    isValid: false,
                }
            }
            const session = await this.sessionService.getSessionByUuid(payload.sessionUuid)
            if (!session) {
                return {
                    isValid: false,
                }
            }
            return {
                payload,
                isValid: true,
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
