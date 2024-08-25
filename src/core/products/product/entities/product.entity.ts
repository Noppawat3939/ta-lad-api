import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  product_name: string

  @Column()
  category_name: string

  @Column()
  brand: string

  @Column()
  price: number

  @Column({ default: 0 })
  stock_amount: number

  @Column({ default: 0 })
  sold_amount?: number

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date
}
