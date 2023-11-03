import {Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';
import {RpcException} from '@nestjs/microservices';
import {HttpAdapterHost} from "@nestjs/core";
import {BaseError} from "@app/shared/models/BaseError";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    }

    catch(exception: unknown, host: ArgumentsHost): void {
        // In certain situations `httpAdapter` might not be available in the
        // constructor method, thus we should resolve it here.
        const {httpAdapter} = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        if (exception instanceof RpcException) {
            const {error} = exception.getError() as any;
            console.log(error)
            httpAdapter.reply(ctx.getResponse(), error, error.code || HttpStatus.INTERNAL_SERVER_ERROR);
            return
        }

        if (exception instanceof HttpException) {
            const res = exception.getResponse()
            const status = exception.getStatus()
            const responseBody = new BaseError({
                code: status,
                stack: status >= 500 && status <= 599 ? exception.stack.split("\n") : [],
                messages: [exception.message],
            });
            httpAdapter.reply(ctx.getResponse(), responseBody, status);
            return;
        }

        const exc = exception as Error

        const responseBody = new BaseError({
            code: 500,
            stack: exc.stack.split("\n"),
            messages: [exc.message],
        });
        httpAdapter.reply(ctx.getResponse(), responseBody, 500);
    }
}