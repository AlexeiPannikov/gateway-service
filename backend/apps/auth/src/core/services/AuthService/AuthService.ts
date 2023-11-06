import {IUserRepository} from '../../repositories/UserRepository/IUserRepository';
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {ITokenService} from '../TokenService/interface/ITokenService';
import {SignUpDto} from "./dto/SignUp.dto";
import {SignInDto} from './dto/SignIn.dto';
import {User} from "../../entities/User/User";
import {IAuthService} from "./interface/IAuthService";
import {IUserService} from "../UserService/interface/IUserService";
import {ISessionRepository} from "../../repositories/SessionRepository/ISessionRepository";
import {ISessionService} from "../SessionService/interface/ISessionService";
import {BaseError} from "@app/shared";

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository,
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
        @Inject(ISessionService)
        private readonly sessionService: ISessionService,
    ) {
    }

    async signIn(dto: SignInDto) {
        if (!dto.password || !dto.email) {
            throw new BaseError({
                messages: ["Bad request"],
                code: HttpStatus.BAD_REQUEST,
            })
        }
        const user = await this.userService.getUserByEmail(dto.email)
        const isEqualPass = bcrypt.compare(dto.password, user.password)
        if (!isEqualPass) {
            throw new BaseError({
                messages: ["Wrong password"],
                code: HttpStatus.BAD_REQUEST,
            })
        }
        const session = await this.sessionService.create({userId: user.id})
        const tokens = this.tokenService.generateTokens({
            userId: user.id,
            sessionUuid: session.uuid,
        });
        return {
            user,
            tokens,
        };
    }

    async signUp(dto: SignUpDto) {
        const user = await this.userService.createUser(dto)
        return {
            user,
        };
    }

    async refreshToken(refreshToken: string): Promise<{
        user: User,
        tokens: { accessToken: string; refreshToken: string; }
    }> {
        if (!refreshToken) {
            throw new BaseError({
                messages: ["Unauthorized"],
                code: HttpStatus.UNAUTHORIZED,
            })
        }
        const payload = this.tokenService.validateRefreshToken(refreshToken)
        if (!payload || !("sessionUuid" in payload) || !("userId" in payload)) {
            throw new BaseError({
                messages: ["Unauthorized"],
                code: HttpStatus.UNAUTHORIZED,
            })
        }
        const session = await this.sessionService.updateByUuid(payload.sessionUuid)
        if (!session) {
            throw new BaseError({
                messages: ["Unauthorized"],
                code: HttpStatus.UNAUTHORIZED,
            })
        }
        const user = await this.userRepository.getUserById(payload.userId)
        const tokens = this.tokenService.generateTokens({userId: user.id, sessionUuid: session.uuid});
        return {
            user,
            tokens,
        };
    }

    async logOut(refreshToken: string): Promise<boolean> {
        const payload = this.tokenService.validateRefreshToken(refreshToken)
        if (!payload || !("sessionUuid" in payload) || !("userId" in payload)) {
            throw new BaseError({
                messages: ["Unauthorized"],
                code: HttpStatus.UNAUTHORIZED,
            })
        }
        const session = await this.sessionService.deleteByUuid(payload.sessionUuid)
        return !!session;

    }
}
