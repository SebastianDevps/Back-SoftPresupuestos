import { IsBoolean, IsEmail, IsIn, IsOptional, IsString, Matches, MinLength } from 'class-validator'
import { ApiProperty, ApiSchema } from '@nestjs/swagger'

@ApiSchema({
	name: 'CreateUserDto',
})
export class CreateUserDto {
	@ApiProperty({
		description: 'El nombre del usuario',
		type: String,
		example: 'Juan Perez',
	})
	@IsString()
	name: string

	@ApiProperty({
		description: 'El email del usuario',
		type: String,
		example: 'usuario@example.com',
	})
	@IsEmail()
	email: string

	@ApiProperty({
		description: 'La contraseña del usuario',
		minimum: 6,
		type: String,
		example: '123456',
	})
	@IsString()
	@MinLength(6, { message: 'la Contraseña Debe Tener AlMenos 6 Caracteres' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
		message: 'La contraseña debe contener al menos 6 caracteres, una letra mayúscula, una letra minúscula, un número y un símbolo',
	})
	password: string

	@ApiProperty({
		description: 'El estado del usuario por defecto es true',
		type: Boolean,
		example: true,
	})
	@IsBoolean()
	isActive: boolean

	@ApiProperty({
		description: 'El rol del usuario por defecto es user',
		type: String,
		example: 'user',
	})
	@IsOptional()
	@IsString()
	@IsIn(['user', 'admin', 'superadmin'], { message: 'Rol inválido' })
	role: string
}
