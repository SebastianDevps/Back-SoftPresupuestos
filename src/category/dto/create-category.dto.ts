import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import { User } from 'src/user/entities/user.entity'

export class CreateCategoryDto {

  @IsNotEmpty()
  @MinLength(3)
  title: string

  @IsOptional()
  user?: User
}
