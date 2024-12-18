import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ProductEntity } from '../../product/entities'

@Entity('product_image')
export class ProductImageEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  image: string

  @Column()
  product_id: number

  @Column({ default: false })
  is_main?: boolean

  @ManyToOne(() => ProductEntity, (product) => product.id)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity
}
