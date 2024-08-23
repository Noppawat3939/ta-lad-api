import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { UserRole } from '../enum/user-role.enum'
import { AddressUser } from 'src/core/address-user'
import { SellerProduct } from 'src/core/products/seller-product'

@Entity()
export class UserSeller {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column()
  store_name: string

  @Column()
  phone_number: string

  @Column({ nullable: true })
  id_card: string

  @Column()
  password: string

  @Column({
    type: 'enum',
    nullable: true,
    enum: UserRole,
    default: UserRole.STORE,
  })
  role: UserRole

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @OneToOne(() => AddressUser, (address) => address.id)
  addresses: AddressUser[]

  @OneToMany(
    () => SellerProduct,
    (seller_propduct) => seller_propduct.seller_id
  )
  seller_propduct: SellerProduct
}
