import {
    Body,
    Controller,
    Get,
    Inject, Param, Post, UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {IUserService} from '../../../../core/services/UserService/interface/IUserService';
import {ResponseInterceptor} from '../../../interceptors/ResponseInterceptor';
import {UserResponse} from "../responses/UserResponse";
import {CreateUserRequestDto} from "../requests/CreateUserRequest.dto";
import {AccessGuard} from "../../../guards/Access.guard";
import {AdminGuard} from "../../../guards/AdminGuard";

@Controller('users')
@UseInterceptors(ResponseInterceptor)
export class UserHttpController {
    constructor(
        @Inject(IUserService)
        private readonly userService: IUserService,
    ) {
    }

    @UseGuards(AccessGuard)
    @UsePipes(new ValidationPipe())
    @Get()
    async getAllUsers() {
        try {
            const users = await this.userService.getAllUsers();
            return {
                users: users.map(user => new UserResponse(user))
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UseGuards(AccessGuard)
    @UsePipes(new ValidationPipe())
    @Get(":id")
    async getUserById(
        @Param("id") id: number
    ) {
        try {
            const user = await this.userService.getUserById(id);
            return {
                user: new UserResponse(user)
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }

    @UseGuards(AccessGuard)
    @UseGuards(AdminGuard)
    @UsePipes(new ValidationPipe())
    @Post()
    async createUser(
        @Body() dto: CreateUserRequestDto
    ) {
        try {
            const user = await this.userService.createUser(dto);
            return {
                user: new UserResponse(user)
            }
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
