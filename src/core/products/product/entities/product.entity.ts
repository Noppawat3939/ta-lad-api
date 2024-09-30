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

  @Column({ default: null })
  description?: string | null

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

  @Column({ default: 0 })
  discount_percent?: number

  @Column({ default: 0 })
  discount_price?: number

  @Column({ default: null })
  discount_start_date?: string | null

  @Column({ default: null })
  discount_end_date?: string | null

  @Column({ default: null })
  sku?: string

  @Column({ default: false })
  is_preorder?: boolean

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date
}
