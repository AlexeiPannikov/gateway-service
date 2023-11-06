import {Injectable, CanActivate, ExecutionContext, Inject, HttpException, HttpStatus} from '@nestjs/common';
import {lastValueFrom, Observable} from 'rxjs';
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {BaseError} from "@app/shared/models/BaseError";

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
        const exception = new BaseError({
            code: HttpStatus.UNAUTHORIZED,
            messages: ["Unauthorized"]
        })
        if (!authorization) {
            throw exception
        }
        const accessToken = authorization.split(' ')[1]
        const res = this.authService.send({cmd: "check-access-token"}, accessToken)
        const data = await lastValueFrom(res, {defaultValue: {data: {isValid: false}}})
        if (!data?.isValid) {
            throw exception
        }
        return true
    }
}