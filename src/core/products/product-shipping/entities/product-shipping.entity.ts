import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductEntity } from '../../product/entities'
import { ProdcutShippingStatus } from '../enum'

@Entity('product_shipping')
export class ProductShippingEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  product_id: number

  @Column({ default: null })
  provider: string

  @Column({ default: 0 })
  shipping_fee: number

  @Column({ nullable: false })
  delivery_time: number

  @Column({
    type: 'enum',
    default: ProdcutShippingStatus.PENDING,
    enum: ProdcutShippingStatus,
  })
  status: ProdcutShippingStatus

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @OneToOne(() => ProductEntity, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity
}
