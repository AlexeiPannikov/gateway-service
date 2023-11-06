import {
    Body,
    Controller,
    Get, HttpException, HttpStatus,
    Inject,
    Param,
    Post,
    Req,
    Res, UseFilters,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {RegistrationRequestDto} from "../dto/auth/requests/RegistrationRequest.dto";
import {AuthGuard} from "@app/shared";
import {Request, Response} from "express";
import {lastValueFrom} from "rxjs";
import {ResponseInterceptor} from "../../../interceptors/ResponseInterceptor";

@Controller("auth")
@UseInterceptors(ResponseInterceptor)
export class AuthHttpController {
    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
    ) {
    }

    @Post("sign-in")
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
                data.user.role !== "ADMIN"
                && data.user.role !== "WORKER"
                && data.user.role !== "OPERATOR"
            ) {
                return new HttpException("Forbidden", HttpStatus.FORBIDDEN)
            }
            response.cookie('refreshToken', data.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return data
        } catch (e) {
            throw e
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
            throw e
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
            return e
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
            response.cookie('refreshToken', data.tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return data
        } catch (e) {
            throw e
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
            throw e
        }
    }
}
