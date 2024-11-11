import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Req,
	Query,
} from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards'
import { AuthorGuard } from 'src/guard/author.guard'

@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
		return this.transactionService.create(createTransactionDto, req.user.id)
	}

	@Get(':type/find')
	@UseGuards(JwtAuthGuard)
	findAllByType(@Req() req, @Param('type') type: string) {
		return this.transactionService.findAllByType(req.user.id, type)
	}

	@Get('pagination')
	@UseGuards(JwtAuthGuard)
	findAllWithPagination(
		@Req() req,
		@Query('page') page: number = 1,
		@Query('limit') limit: number = 5,
	) {
		return this.transactionService.findAllWithPagination(
			req.user.id,
			page,
			limit,
		)
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@Req() req) {
		return this.transactionService.findAll(req.user.id)
	}

	@Get(':type/deleted')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	findAllRecords(@Req() req) {
		return this.transactionService.findAllWithDeleted(req.user.id)
	}

	@Get(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	findOne(@Param('id') id: number) {
		return this.transactionService.findOne(id)
	}

	@Patch(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	update(
		@Param('id') id: number,
		@Body() updateTransactionDto: UpdateTransactionDto,
	) {
		return this.transactionService.update(id, updateTransactionDto)
	}

	@Delete(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	remove(@Param('id') id: number) {
		return this.transactionService.remove(id)
	}

	@Delete(':type/deleted/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	removeDefinitive(@Param('id') id: number) {
		return this.transactionService.removeDefinitive(id)
	}
}
