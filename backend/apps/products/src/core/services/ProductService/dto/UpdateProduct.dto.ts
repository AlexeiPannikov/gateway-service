import {Type} from "../../../entities/Type/Type";

export interface UpdateProductDto {
    name: string;
    description?: string;
    types?: Type[];
}