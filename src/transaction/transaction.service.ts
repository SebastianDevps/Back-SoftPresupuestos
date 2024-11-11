import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from './entities/transaction.entity'
import { IsNull, Not, Repository } from 'typeorm'

@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly transactionRepository: Repository<Transaction>,
	) {}

	async create(createTransactionDto: CreateTransactionDto, id: number) {
		const newTransaction = {
			title: createTransactionDto.title,
			amount: createTransactionDto.amount,
			type: createTransactionDto.type,
			category: { id: +createTransactionDto.category },
			user: { id },
		}

		if (!newTransaction) throw new BadRequestException('Algo salió mal...')

		return await this.transactionRepository.save(newTransaction)
	}

	async findAll(id: number) {
		const transaction = await this.transactionRepository.find({
			where: {
				user: { id },
			},
			relations: {
				category: true
			},
			order: {
				createdAt: 'DESC',
			},
		})

		return transaction
	}

	async findAllWithDeleted(id: number) {
		const transactions = await this.transactionRepository.find({
			where: {
				user: { id },
				deleteAt: Not(IsNull()),
			},
			withDeleted: true,
			order: {
				createdAt: 'DESC',
			},
		})

		return transactions
	}

	async findOne(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: {
				id,
			},
			relations: {
				user: true,
				category: true,
			},
		})

		if (!transaction)
			throw new NotFoundException('Transacción no encontrada')
		return transaction
	}

	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		await this.findTransaction(id)

		return await this.transactionRepository.update(id, updateTransactionDto)
	}

	async remove(id: number) {
		await this.findTransaction(id)
		return await this.transactionRepository.softDelete(id)
	}

	async removeDefinitive(id: number) {
		await this.findTransaction(id)
		return await this.transactionRepository.delete(id)
	}

	async findAllWithPagination(id: number, page: number, limit: number) {
		const transaction = await this.transactionRepository.find({
			where: {
				user: { id },
			},
			relations: {
				category: true,
				user: true,
			},
			order: {
				createdAt: 'DESC',
			},
			take: limit,
			skip: (page - 1) * limit,
		})

		return transaction
	}

	async findAllByType(id: number, type: string) {
		const transaction = await this.transactionRepository.find({
			where: {
				user: { id },
				type,
			},
		})

		const total = transaction.reduce((acc, obj) => acc + obj.amount, 0)
		return total
	}

	private async findTransaction(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: {
				id,
			},
			withDeleted: true,
		})
		if (!transaction) {
			throw new NotFoundException('Transacción no encontrada')
		}
	}
}
