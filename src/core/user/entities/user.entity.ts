import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole } from '../enum/user-role.enum'
import { AddressUserEntity } from 'src/core/address-user'

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: null })
  profile_image?: string

  @Column({ nullable: true, default: false })
  active: boolean

  @Column({
    type: 'enum',
    nullable: true,
    enum: UserRole,
  })
  role: UserRole

  @Column({ nullable: true })
  id_card: string

  @Column()
  phone_number: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @OneToMany(() => AddressUserEntity, (address) => address.id)
  addresses: AddressUserEntity[]
}
