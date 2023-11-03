import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';
import {Observable, throwError} from "rxjs";
import {BaseError} from "@app/shared/models/BaseError";
import {RpcException} from "@nestjs/microservices";
import {HttpAdapterHost} from "@nestjs/core";

@Catch()
export class MicroserviceExceptionFilter implements ExceptionFilter {

    catch(exception: HttpException | Error): Observable<never> | void {
        console.log(exception)
        if (exception instanceof HttpException) {
            const httpStatus = exception.getStatus()
            const httpRes = exception.getResponse() as { details?: unknown, message: unknown }

            return throwError(() => (new RpcException(new BaseError({
                code: httpStatus,
                messages:  Array.isArray(httpRes.message) ? httpRes.message as string[] : httpRes.message || Array.isArray(exception.message) ? (exception.message as any) : [],
                details: Array.isArray(httpRes.details) ? httpRes.details as string[] : httpRes.message as string[] || [],
            }))))
        }
        if (exception instanceof Error) {
            return throwError(() => (new RpcException(new BaseError({
                code: 500,
                messages: exception.message ? [exception.message] : ["Internal server error"],
                details: exception.cause ? [exception.cause as string] : [],
                stack: exception.stack.split(" \n") as string[]
            }))))
        }
    }
}