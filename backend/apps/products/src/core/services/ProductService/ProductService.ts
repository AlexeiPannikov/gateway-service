import {IProductService} from "./interface/IProductService";
import {Product} from "../../entities/Product/Product";
import {CreateProductDto} from "./dto/CreateProduct.dto";
import {UpdateProductDto} from "./dto/UpdateProduct.dto";
import {Inject, Injectable} from "@nestjs/common";
import {IProductRepository} from "../../repositories/ProductRepository/IProductRepository";

@Injectable()
export class ProductService implements IProductService {

    constructor(
        @Inject(IProductRepository) private readonly productRepository: IProductRepository,
    ) {
    }

    create(dto: CreateProductDto): Promise<Product> {
        return Promise.resolve(undefined);
    }

    delete(id: number): Promise<boolean> {
        return undefined;
    }

    getProductById(id: number): Promise<Product> {
        return Promise.resolve(undefined);
    }

    getProducts(): Promise<Product[]> {
        return Promise.resolve([]);
    }

    update(dto: Partial<UpdateProductDto>): Promise<Product> {
        return Promise.resolve(undefined);
    }

}