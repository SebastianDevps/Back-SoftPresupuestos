import { Category } from 'src/category/entities/category.entity'
import { User } from 'src/user/entities/user.entity'
import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn({ name: 'transaction_id' })
	id: number

	@Column()
	title: string

	@Column({ nullable: true })
	type: string

	@Column()
	amount: number

	@DeleteDateColumn({ type: 'timestamp with time zone' })
	deleteAt: Date

	@ManyToOne(() => User, (user) => user.transactions)
	@JoinColumn({ name: 'user_id' })
	user: User

	@ManyToOne(() => Category, (category) => category.transactions, {
		onDelete: 'SET NULL',
	})
	@JoinColumn({ name: 'category_id' })
	category: Category

	@CreateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	createdAt: Date

	@UpdateDateColumn({
		type: 'timestamp with time zone',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updatedAt: Date
}
