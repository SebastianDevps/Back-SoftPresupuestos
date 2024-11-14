import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import { User } from 'src/user/entities/user.entity'

export class CreateCategoryDto {
	@ApiProperty({
		description: 'El titulo de la categoria',
		minimum: 3,
		type: String,
		example: 'Comida',
	})
	@IsNotEmpty()
	@MinLength(3)
	title: string

	@IsOptional()
	user?: User
}
