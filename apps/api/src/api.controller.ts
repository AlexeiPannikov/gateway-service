import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {RegistrationRequestDto} from "./dto/auth/requests/RegistrationRequest.dto";
import {AuthGuard} from "@app/shared";
import {Request, Response} from "express";
import {lastValueFrom} from "rxjs";

@Controller()
export class ApiController {
    constructor(
        @Inject("AUTH_SERVICE")
        private readonly authService: ClientProxy,
    ) {
    }

    @Post("auth/sign-up")
    signUp(
        @Body() body: RegistrationRequestDto,
    ) {
        return this.authService.send(
            {cmd: "sign-up"},
            body
        )
    }

    @Post("auth/sign-in")
    async signIn(
        @Body() body: RegistrationRequestDto,
        @Res({passthrough: true}) response: Response,
    ) {
        const res = this.authService.send(
            {cmd: "sign-in"},
            body
        )
        const data = await lastValueFrom(res)
        response.cookie('refreshToken', data.data.tokens.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return data
    }

    @UseGuards(AuthGuard)
    @Get("auth/log-out")
    async logOut(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response,
    ) {
        const {refreshToken} = request.cookies
        const res = this.authService.send(
            {cmd: "log-out"},
            refreshToken
        )
        const data = await lastValueFrom(res)
        console.log(data)
        response.clearCookie("refreshToken")
        return data
    }

    @Get("auth/activate")
    activate(
        @Param('link') link: string,
    ) {
        return this.authService.send(
            {cmd: "activate"},
            link
        )
    }

    @Get("auth/refresh")
    async refresh(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response,
    ) {
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
    }
}
