import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UpdateUserDto } from './dto/update-user.dto'
import { IUser } from 'src/auth/types/types'

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
			throw new HttpException(
				'El usuario ya existe',
				HttpStatus.BAD_REQUEST,
			)
		}

		const saltOrRounds = 10
		const role = userDto.role || 'user'
		const isActive =
			userDto.isActive !== undefined ? userDto.isActive : true
		const hashedPassword = await bcrypt.hash(userDto.password, saltOrRounds)

		const user = await this.userRepository.save({
			email: userDto.email,
			password: hashedPassword,
			name: userDto.name,
			role,
			isActive,
		})

		const token = this.jwtService.sign({
			email: user.email,
			role: user.role,
		})

		return { user, token }
	}

	async findOne(email: string) {
		return await this.userRepository.findOne({
			where: {
				email,
			},
		})
	}

	async findAll() {
		const users = await this.userRepository.find()
		return users.map((user) => ({ ...user, password: undefined }))
	}

	async update(id: number, userDto: UpdateUserDto, user: IUser) {
		const isExistUser = await this.userRepository.findOne({
			where: { id },
		})

		if (!isExistUser) {
			throw new HttpException(
				'El usuario no existe',
				HttpStatus.BAD_REQUEST,
			)
		}

		// Verificar email solo si se está actualizando y es diferente al actual
		if (userDto.email && userDto.email !== isExistUser.email) {
			const existEmail = await this.userRepository.findOne({
				where: { email: userDto.email },
			})

			if (existEmail) {
				throw new HttpException(
					'El email ya existe',
					HttpStatus.BAD_REQUEST,
				)
			}
		}

		// Validación de contraseña
		if (userDto.password) {
			if (!userDto.oldPassword) {
				throw new HttpException(
					'Debe proporcionar la contraseña anterior',
					HttpStatus.BAD_REQUEST,
				)
			}

			const isPasswordValid = await bcrypt.compare(
				userDto.oldPassword,
				isExistUser.password,
			)

			if (!isPasswordValid) {
				throw new HttpException(
					'Contraseña anterior incorrecta',
					HttpStatus.BAD_REQUEST,
				)
			}

			const saltOrRounds = 10
			userDto.password = await bcrypt.hash(userDto.password, saltOrRounds)
		}
		delete userDto.oldPassword // Eliminamos oldPassword del DTO

		if (userDto.role) {
			if (
				user.role !== 'superadmin' &&
				!['admin', 'superadmin'].includes(user.role)
			) {
				throw new HttpException(
					'No tienes permisos para cambiar roles',
					HttpStatus.FORBIDDEN,
				)
			}
		}

		if (user.role === 'admin' && isExistUser.role === 'superadmin') {
			throw new HttpException(
				'No tienes permisos para modificar el rol de un superadmin',
				HttpStatus.FORBIDDEN,
			)
		}

		const role = userDto.role || isExistUser.role
		const isActive =
			userDto.isActive !== undefined
				? userDto.isActive
				: isExistUser.isActive

		const updateData = {
			...userDto,
			role,
			isActive,
		}
		delete updateData['oldPassword']

		await this.userRepository.update(id, updateData)

		const updatedUser = await this.userRepository.findOne({
			where: { id },
		})

		return { ...updatedUser, password: undefined }
	}

	async updatePassword(id: number, password: string) {
		await this.userRepository.update(id, { password })
	}
}
