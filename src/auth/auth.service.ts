import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
import { UserResponseDto } from 'src/user/dto/response.user.dto'
import { JwtService } from '@nestjs/jwt'
import { IUser } from './types/types'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email)

    if (!user) {
      throw new ForbiddenException('Usuario o contraseña incorrectos')
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password)

    if (passwordIsMatch) {
      const { password, ...result } = user
      return new UserResponseDto(result)
    }

    throw new ForbiddenException('Usuario o contraseña incorrectos')
  }

  async login(user: IUser) {
    const { id, email } = user
    return {
      id,
      email,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    }
  }
}
