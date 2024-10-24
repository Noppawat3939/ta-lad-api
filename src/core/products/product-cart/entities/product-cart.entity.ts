import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ProductEntity } from '../../product/entities'
import { UserEntity } from 'src/core/user'
import { ProductCartStatus } from '../enum'

@Entity('product_cart')
export class ProductCartEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  product_id: number

  @Column()
  user_id: number

  @Column({ nullable: true })
  amount: number

  @Column({ nullable: true })
  price: number

  @Column({
    type: 'enum',
    enum: ProductCartStatus,
    default: ProductCartStatus.OPEN,
  })
  status: ProductCartStatus

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @ManyToOne(() => ProductEntity, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity
}
