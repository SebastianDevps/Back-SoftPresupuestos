import { Transaction } from 'src/transaction/entities/transaction.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number

  @Column()
  title: string

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  transactions: Transaction[]

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date

}
