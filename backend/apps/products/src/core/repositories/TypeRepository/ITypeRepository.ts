import {Type} from "../../entities/Type/Type";

export interface ITypeRepository {
    getTypes(): Promise<Type[]>;
    create(): Promise<Type>;
    update(): Promise<Type>;
    delete(id: number): Promise<Type>;
}

export const ITypeRepository = Symbol("ITypeRepository")