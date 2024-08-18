import { User, UserSeller } from 'src/core/user'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class AddressUser {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  address_card_id: string

  @Column()
  province: string

  @Column()
  district: string

  @Column()
  sub_district: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user_id: number

  @ManyToOne(() => UserSeller, (user) => user.id)
  @JoinColumn({ name: 'user_seller_id' })
  user_seller_id: number
}
