import {Type} from "../../../entities/Type/Type";

export interface CreateProductDto {
    name: string;
    description?: string;
    types?: Type[];
}