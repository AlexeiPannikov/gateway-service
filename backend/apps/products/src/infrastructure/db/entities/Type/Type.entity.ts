import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {ProductEntity} from "../Product/Product.entity";

@Entity("types")
export class TypeEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @ManyToMany(() => ProductEntity)
    products: ProductEntity[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}