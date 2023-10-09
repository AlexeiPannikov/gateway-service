import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Product} from "../../../../core/entities/Product/Product";
import {ProductEntity} from "../Product/Product.entity";

@Entity("groups")
export class GroupEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @ManyToMany(() => ProductEntity)
    @JoinColumn()
    products: ProductEntity[]

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}