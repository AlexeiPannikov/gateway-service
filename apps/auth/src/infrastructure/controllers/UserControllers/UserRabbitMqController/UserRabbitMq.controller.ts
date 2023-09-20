import {
    Body,
    Controller, Get, HttpException, HttpStatus,
    Inject, Param,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {IUserService} from '../../../../core/services/UserService/interface/IUserService';
import {UserResponse} from "../../UserControllers/responses/UserResponse";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {SharedService} from "@app/shared";
import {CreateUserRequestDto} from "../requests/CreateUserRequest.dto";
import {ITokenService} from "../../../../core/services/TokenService/interface/ITokenService";
import {ISessionService} from "../../../../core/services/SessionService/interface/ISessionService";

@Controller('users')
export class UserRabbitMqController {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
        @Inject(ISessionService)
        private readonly sessionService: ISessionService,
        @Inject(SharedService)
        private readonly sharedService: SharedService,
    ) {
    }

    @MessagePattern({cmd: "get-all-users"})
    async getAllUsers(
        @Ctx() context: RmqContext,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const users = await this.userService.getAllUsers();
            return {
                users: users.map(user => new UserResponse(user))
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @MessagePattern({cmd: "get-user-by-id"})
    async getUserById(
        @Ctx() context: RmqContext,
        @Payload() id: number,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const user = await this.userService.getUserById(id);
            return {
                user: new UserResponse(user)
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @MessagePattern({cmd: "create-user"})
    async createUser(
        @Ctx() context: RmqContext,
        @Payload() dto: CreateUserRequestDto
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            const user = await this.userService.createUser(dto);
            return {
                user: new UserResponse(user)
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @MessagePattern({cmd: 'get-user-by-refresh-token'})
    async getUserByToken(
        @Ctx() context: RmqContext,
        @Payload() refreshToken: string,
    ) {
        try {
            this.sharedService.acknowledgeMessage(context)
            if (!refreshToken) {
                return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
            }
            const payload = this.tokenService.validateRefreshToken(refreshToken);
            if (!payload || !("sessionUuid" in payload) || !("userId" in payload)) {
                return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
            }
            const session = await this.sessionService.getSessionByUuid(payload.sessionUuid)
            if (!session) {
                return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
            }
            const user = await this.userService.getUserById(payload.userId)
            if (!user) {
                return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
            }
            return {
                user: new UserResponse(user)
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
