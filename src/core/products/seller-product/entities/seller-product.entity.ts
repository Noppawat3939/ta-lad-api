import { UserSeller } from 'src/core/user'
import { Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from '../../product'

@Entity()
export class SellerProduct {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => UserSeller, (user) => user.id)
  @JoinColumn({ name: 'seller_id' })
  seller_id: number

  @OneToMany(() => Product, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product_id: number
}
