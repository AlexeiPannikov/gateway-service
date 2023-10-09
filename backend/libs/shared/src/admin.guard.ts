import {Injectable, CanActivate, ExecutionContext, Inject, HttpException, HttpStatus} from '@nestjs/common';
import {lastValueFrom, Observable} from 'rxjs';
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ) {
        const request = context.switchToHttp().getRequest();
        const {refreshToken} = request.cookies
        if (!refreshToken) {
            return false
        }
        const res = this.authService.send({cmd: "get-user-by-refresh-token"}, refreshToken)
        const data = await lastValueFrom(res)
        if (!data) {
            return false
        }
        return data.data?.user?.role === "ADMIN"
    }
}