import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {GroupEntity} from "../Group/Group.entity";
import {TypeEntity} from "../Type/Type.entity";

@Entity("products")
export class ProductEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column({default: ""})
    description: string;

    @ManyToMany(() => TypeEntity)
    @JoinColumn()
    types: TypeEntity[];

    @ManyToMany(() => GroupEntity)
    groups: GroupEntity[]

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}