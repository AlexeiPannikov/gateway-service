import {Injectable, CanActivate, ExecutionContext, Inject, HttpException, HttpStatus} from '@nestjs/common';
import {lastValueFrom, Observable} from 'rxjs';
import {ClientProxy} from "@nestjs/microservices";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
    ) {
    }

    async canActivate(
        context: ExecutionContext,
    ) {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers["authorization"]
        if (!authorization) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
        }
        const accessToken = authorization.split(' ')[1]
        const res = this.authService.send({cmd: "check-access-token"}, accessToken)
        const data = await lastValueFrom(res, {defaultValue: {data: {isValid: false}}})
        if (!data?.data?.isValid) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
        }
        return true
    }
}