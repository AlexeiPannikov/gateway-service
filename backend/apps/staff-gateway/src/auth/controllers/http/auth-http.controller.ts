import {
    Body,
    Controller,
    Get, HttpException, HttpStatus,
    Inject,
    Param,
    Post,
    Req,
    Res, UseFilters,
    UseGuards,
} from '@nestjs/common';
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {RegistrationRequestDto} from "../dto/auth/requests/RegistrationRequest.dto";
import {AuthGuard} from "@app/shared";
import {Request, Response} from "express";
import {lastValueFrom} from "rxjs";

@Controller("auth")
export class AuthHttpController {
    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
    ) {
    }

    @Post("sign-in")
    // @UseFilters(new RpcExceptionToHttpExceptionFilter())
    async signIn(
        @Body() body: RegistrationRequestDto,
        @Res({passthrough: true}) response: Response,
    ) {
        try {
            const res = this.authService.send(
                {cmd: "sign-in"},
                body
            )
            const data = await lastValueFrom(res)
            if (
                data.data.user.role !== "ADMIN"
                && data.data.user.role !== "WORKER"
                && data.data.user.role !== "OPERATOR"
            ) {
                return new HttpException("Forbidden", HttpStatus.FORBIDDEN)
            }
            response.cookie('refreshToken', data.data.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return data
        } catch (e) {
            throw new RpcException(e)
        }
    }

    @UseGuards(AuthGuard)
    @Get("log-out")
    async logOut(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response,
    ) {
        try {
            const {refreshToken} = request.cookies
            const res = this.authService.send(
                {cmd: "log-out"},
                refreshToken
            )
            const data = await lastValueFrom(res)
            response.clearCookie("refreshToken")
            return data
        } catch (e) {
            return new RpcException(e)
        }
    }

    @Get("activate")
    activate(
        @Param('link') link: string,
    ) {
        try {
            return this.authService.send(
                {cmd: "activate"},
                link
            )
        } catch (e) {
            return new RpcException(e)
        }
    }

    @Get("refresh")
    async refresh(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response,
    ) {
        try {
            const {refreshToken} = request.cookies
            const res = this.authService.send(
                {cmd: "refresh"},
                refreshToken
            )
            const data = await lastValueFrom(res)
            response.cookie('refreshToken', data.data.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return data
        } catch (e) {
            return new RpcException(e)
        }
    }

    @UseGuards(AuthGuard)
    @Get("me")
    async me(
        @Req() request: Request,
    ) {
        const authorization = request.headers["authorization"]
        const accessToken = authorization.split(" ")[1]
        try {
            const res = this.authService.send(
                {cmd: "me"},
                accessToken
            )
            return await lastValueFrom(res)
        } catch (e) {
            return new RpcException(e)
        }
    }
}
