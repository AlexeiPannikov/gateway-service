import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {UserRoleEnum} from "../../../../core/entities/User/UserRoleEnum";
import {SessionEntity} from "../Session/Session.entity";

@Entity("users")
export class UserEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  email: string;

  @Column({default: UserRoleEnum.CUSTOMER})
  role: UserRoleEnum

  @Column()
  password: string;

  @OneToMany(() => SessionEntity, (s) => s.user)
  sessions: SessionEntity[]

  @Column()
  activationLink: string;

  @Column({ default: false })
  isActivated: boolean;
}
