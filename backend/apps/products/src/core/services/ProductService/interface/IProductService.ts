import {Product} from "../../../entities/Product/Product";
import {CreateProductDto} from "../dto/CreateProduct.dto";
import {UpdateProductDto} from "../dto/UpdateProduct.dto";

export interface IProductService {
    getProducts(): Promise<Product[]>

    getProductById(id: number): Promise<Product>

    create(dto: CreateProductDto): Promise<Product>

    update(dto: Partial<UpdateProductDto>): Promise<Product>

    delete(id: number): Promise<boolean>
}

export const IProductService = Symbol("IProductService")