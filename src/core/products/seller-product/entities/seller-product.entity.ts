import { UserSellerEntity } from 'src/core/user'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ProductEntity } from '../../product'
import { GroupProductsEntity } from '../../group-products'

@Entity('seller_product')
export class SellerProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  seller_id: number

  @Column({ unique: true })
  product_id: number

  @Column({ default: null })
  group_product_id: number

  @ManyToOne(() => ProductEntity, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity

  @ManyToOne(() => UserSellerEntity, (userSeller) => userSeller.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'seller_id' })
  userSeller: UserSellerEntity

  @ManyToOne(() => GroupProductsEntity, (groupPd) => groupPd.id)
  @JoinColumn({ name: 'group_product_id' })
  groupProduct: GroupProductsEntity
}
