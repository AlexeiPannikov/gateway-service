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

        if (exception instanceof BaseError) {
            httpAdapter.reply(ctx.getResponse(), exception, exception.code);
            return;
        }

        const exc = (exception as any).error || exception
        const code = exc?.code || 500

        const responseBody = new BaseError({
            code,
            stack: code === 500 ? exc.stack?.split("\n") : null,
            messages: exc['messages'],
        });
        httpAdapter.reply(ctx.getResponse(), responseBody, code);
    }
}