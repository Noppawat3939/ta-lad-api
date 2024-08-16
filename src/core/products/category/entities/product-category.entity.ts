import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  image: string
}
