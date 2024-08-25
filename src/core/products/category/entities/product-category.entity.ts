import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('product_category')
export class ProductCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  image: string
}
