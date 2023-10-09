import {Test, TestingModule} from "@nestjs/testing";
import {ConfigModule} from "@nestjs/config";
import {TokenService} from "./TokenService";
import {ITokenService} from "./interface/ITokenService";
import {v4} from "uuid";

describe("TokenService", () => {

    let service: TokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({isGlobal: true, envFilePath: './.env'}),
            ],
            providers: [
                TokenService
            ]
        })
            .compile()

        service = module.get<TokenService>(TokenService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    it("should generate tokens", () => {
        expect(service.generateTokens({userId: 1, sessionUuid: v4()})).toEqual({
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
        })
    })
})