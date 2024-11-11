import { Category } from 'src/category/entities/category.entity'
import { Transaction } from 'src/transaction/entities/transaction.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  password: string

  @OneToMany(() => Category, (category) => category.user, {
    onDelete: 'CASCADE',
  })
  categories: Category[]

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[]

  @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date
}
