import {Test, TestingModule} from "@nestjs/testing";
import {ConfigModule} from "@nestjs/config";
import {IUserService} from "./interface/IUserService";
import {UserService} from "./UserService";
import {IActivationService} from "../ActivationServices/interfaces/IActivationService";
import {EmailActivationService} from "../ActivationServices/EmailService/EmailActivationService";
import {IUserRepository} from "../../repositories/UserRepository/IUserRepository";
import {User} from "../../entities/User/User";
import {UserRoleEnum} from "../../entities/User/UserRoleEnum";
import {CreateUserDto} from "../../repositories/UserRepository/dto/CreateUser.dto";

describe("UserService", () => {

    let service: IUserService;

    const getUser = (data?: Partial<User>) =>
        new User({
            id: data.id || 1,
            role: data.role || UserRoleEnum.ADMIN,
            email: data.email || "2312312@email.com",
            name: data.name || "ADMIN",
            password: data.password || "asdadwerwerwe",
            activationLink: data.activationLink || "dfsfdfgdfghgwetrwer",
            isActivated: data.isActivated || true
        })

    let mockUserRepository: IUserRepository = {
        getUserById: jest.fn().mockImplementation((id) => Promise.resolve(getUser({id}))),
        getUsers(): Promise<User[]> {
            return Promise.resolve([getUser()])
        },
        getUserByEmail(email: string): Promise<User> {
            return Promise.resolve(getUser({email}))
        },
        updateUser(user: User): Promise<User> {
            return Promise.resolve(getUser())
        },
        createUser(dto: CreateUserDto): Promise<User> {
            return Promise.resolve(getUser({...dto}))
        },
        deleteUser(id: number): Promise<User> {
            return Promise.resolve(getUser({id}))
        },
        getUserByActivationLink(link: string): Promise<User> {
            return Promise.resolve(getUser({activationLink: link}))
        },
        activate(user: User): Promise<User> {
            return Promise.resolve(getUser())
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({isGlobal: true, envFilePath: './.env'}),
            ],
            providers: [
                UserService,
                {
                    provide: IActivationService,
                    useClass: EmailActivationService
                },
                {
                    provide: IUserRepository,
                    useValue: mockUserRepository
                }
            ]
        })
            .compile()

        service = module.get<UserService>(UserService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    it("should return user with id 1",  () => {
        service.getUserById(1).then(user => {
            expect(user.id).toBe(1)
            expect(typeof user.email).toBe("string")
            expect(typeof user.isActivated).toBe("boolean")
            expect(typeof user.name).toBe("string")
            expect(typeof user.password).toBe("string")
            expect(typeof user.activationLink).toBe("string")
            // expect(user.role in UserRoleEnum).toBe(true)
        })
    })
})