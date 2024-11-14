import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator'
import { Category } from 'src/category/entities/category.entity'
import { User } from 'src/user/entities/user.entity'

export class CreateTransactionDto {
	@ApiProperty({
		description: 'El titulo de la transacción',
		type: String,
		example: 'Comida',
	})
	@IsNotEmpty()
	title: string

	@ApiProperty({
		description: 'El monto de la transacción',
		type: Number,
		example: 100,
	})
	@IsNotEmpty()
	@IsNumber()
	amount: number

	@ApiProperty({
		description: 'El tipo de la transacción',
		type: String,
		example: 'expense o income',
	})
	@IsString()
    @MinLength(6)
	type: 'expense' | 'income'
    
	@IsNotEmpty()
	category: Category

    // @IsNotEmpty()
    user: User
}
