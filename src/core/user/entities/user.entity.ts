import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole } from '../enum/user-role.enum'
import { AddressUser } from 'src/address-user'

@Entity()
export class User {
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

  @Column({ nullable: true, default: false })
  active: boolean

  @Column({ type: 'enum', nullable: true, enum: UserRole })
  role: UserRole

  @Column({ nullable: true })
  id_card: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @OneToMany(() => AddressUser, (address) => address.id)
  addresses: AddressUser[]
}
