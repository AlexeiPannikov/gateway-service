import {Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus, Inject} from '@nestjs/common';
import {Observable} from 'rxjs';
import {ITokenService} from "../../core/services/TokenService/interface/ITokenService";

@Injectable()
export class AccessGuard implements CanActivate {

    constructor(
        @Inject(ITokenService)
        private readonly tokenService: ITokenService,
    ) {
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
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
        req["user"] = userData
        return true
    }
}