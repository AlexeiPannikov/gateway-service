import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {ITokenService} from "../../core/services/TokenService/interface/ITokenService";
import {IUserService} from "../../core/services/UserService/interface/IUserService";
import {UserRoleEnum} from "../../core/entities/User/UserRoleEnum";

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authorizationHeader = req.headers["authorization"]
        if (!authorizationHeader) {
            return false
        }
        const accessToken = authorizationHeader.split(' ')[1]
        if (!accessToken) {
            return false
        }
        const userData = this.tokenService.validateAccessToken(accessToken)
        if (!userData) {
            return false
        }
        const user = await this.userService.getUserById(userData.userId)
        if (!user) {
            return false
        }
        if (user.role !== UserRoleEnum.ADMIN) {
            return false
        }
        req["user"] = userData
        return true
    }
}