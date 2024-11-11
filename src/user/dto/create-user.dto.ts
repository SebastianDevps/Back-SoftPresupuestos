import { IsEmail, IsString, MinLength } from 'class-validator'

export class CreateUserDto {

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6, { message: 'la Contraseña Debe Tener AlMenos 6 Caracteres' })
  password: string
}
