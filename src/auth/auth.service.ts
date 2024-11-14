import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserService } from 'src/user/user.service'
import * as bcrypt from 'bcrypt'
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
			return result
		}

		throw new ForbiddenException('Usuario o contraseña incorrectos')
	}

	async login(user: IUser) {
		const { email, role } = user
		return {
			email,
			role,
			token: this.jwtService.sign({ email: user.email, role: user.role }),
		}
	}

	async resetUserPassword(adminUser: IUser, userEmailToReset: string) {
		if (adminUser.role !== 'superadmin') {
			throw new ForbiddenException(
				'Solo los superadministradores pueden restablecer contraseñas',
			)
		}

		const userToReset = await this.userService.findOne(userEmailToReset)
		if (!userToReset) {
			throw new ForbiddenException('Usuario no encontrado')
		}

		const newPassword = `Temp${Math.random().toString(36).substring(2, 6)}@${Math.random().toString(36).substring(2, 6)}1`

		const saltOrRounds = 10
		const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds)

		await this.userService.updatePassword(userToReset.id, hashedPassword)

		return {
			message: 'Contraseña restablecida exitosamente',
			email: userEmailToReset,
			temporaryPassword: newPassword,
		}
	}
}
