import { UserSellerEntity } from 'src/core/user'
import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity('group_products')
export class GroupProductsEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  seller_id: number

  @Column('int', { array: true })
  product_ids: number[]

  @JoinColumn({ name: 'seller_id' })
  userSeller: UserSellerEntity
}
