import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guards'
import { JwtAuthGuard } from './guards/jwt-auth.guards'
import { RolesGuard } from 'src/guard/roles.guard'
import { Roles } from 'src/decorator/roles.decorator'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Inicia sesión en el sistema y devuelve un token de acceso'
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
	@ApiResponse({
		status: 401,
		description: 'Credenciales inválidas',
	})
	@Post('login')
	@UseGuards(LocalAuthGuard)
	async login(@Request() req) {
		return this.authService.login(req.user)
	}

	@ApiOperation({ 
    summary: 'Obtener el perfil del usuario',
    description: 'Obtiene el perfil del usuario autenticado'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
  })
	@ApiResponse({
		status: 401,
		description: 'No estás autenticado',
	})
	@Get('profile')
	getProfile(@Request() req) {
		return req.user
	}

	@ApiOperation({ 
    summary: 'Restablecer la contraseña de un usuario',
    description: 'Restablece la contraseña de un usuario por correo electrónico, solo los superadministradores pueden restablecer la contraseña de cualquier usuario'
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
  })
	@ApiResponse({
		status: 401,
		description: 'No estás autenticado',
	})
	@ApiResponse({
		status: 403,
		description: 'No tienes permisos para restablecer la contraseña',
	})
	@ApiResponse({
		status: 400,
		description: 'Datos inválidos',
	})
	@Post('reset-password')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles('superadmin')
	resetPassword(@Body() body: { email: string }, @Request() req) {
		return this.authService.resetUserPassword(req.user, body.email)
	}
}
