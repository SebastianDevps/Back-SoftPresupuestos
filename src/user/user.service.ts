import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(userDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: userDto.email,
      },
    })

    if (existUser) {
      throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST)
    }

    const saltOrRounds = 10
    const user = await this.userRepository.save({
      email: userDto.email,
      password: await bcrypt.hash(userDto.password, saltOrRounds),
    })

    const token = this.jwtService.sign( { email: userDto.email})

    return { user, token }
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    })
  }
}
