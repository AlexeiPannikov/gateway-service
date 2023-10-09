import {GenerateTokensPayloadDto} from "../dto/GenerateTokensPayload.dto";

export interface ITokenService {
    generateTokens(payload: GenerateTokensPayloadDto): {
        accessToken: string;
        refreshToken: string;
    };

    validateRefreshToken(token: string): GenerateTokensPayloadDto

    validateAccessToken(token: string): GenerateTokensPayloadDto
}

export const ITokenService = Symbol('ITokenService');
