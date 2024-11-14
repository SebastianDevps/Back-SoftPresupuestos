import { PartialType } from '@nestjs/mapped-types'
import { CreateUserDto } from './create-user.dto'
import { MinLength, Matches, ValidateIf } from 'class-validator'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@ApiProperty({
		description: 'La contraseña actual del usuario',
		type: String,
		example: 'miContraseña',
	})
	@ValidateIf((o) => o.password !== undefined)
	@IsString()
	oldPassword: string

	@ApiProperty({
		description: 'La contraseña nueva contraseña del usuario',
		type: String,
		example: '@Contaseña124',
	})
	// Sobrescribimos la validación de password del CreateUserDto
	@ValidateIf((o) => o.oldPassword !== undefined)
	@IsString()
    @MinLength(6, { message: 'la Contraseña Debe Tener AlMenos 6 Caracteres' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
		message: 'La contraseña debe contener al menos 6 caracteres, una letra mayúscula, una letra minúscula, un número y un símbolo',
	})
	password?: string

}
