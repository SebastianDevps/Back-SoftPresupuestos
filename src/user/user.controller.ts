import { Controller, Post, Body, Get, UseGuards, Patch, Param, Request } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards'
import { RolesGuard } from 'src/guard/roles.guard'
import { Roles } from 'decorator/roles.decorator'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un usuario',
    description: 'Crea un nuevo usuario en el sistema con la información proporcionada'
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'El usuario ya existe o datos inválidos',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @ApiOperation({ 
    summary: 'Obtener todos los usuarios',
    description: 'Obtiene todos los usuarios registrados en el sistema, solo los superadministradores y administradores pueden obtener todos los usuarios'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios obtenidos exitosamente',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para obtener todos los usuarios',
  })
  @ApiResponse({
    status: 401,
    description: 'No estás autenticado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin')
  findAll() {
    return this.userService.findAll()
  }


  @ApiOperation({ 
    summary: 'Actualizar un usuario',
    description: `
      Actualiza un usuario existente en el sistema.
      
      Permisos:
      - Usuarios normales: Solo pueden actualizar su propia información (excepto rol)
      - Administradores: Pueden actualizar cualquier usuario excepto superadmin
      - Superadministradores: Tienen control total
      
      Notas importantes:
      - Para actualizar contraseña se requiere la contraseña actual
      - Solo admin y superadmin pueden modificar roles
      - El rol de superadmin solo puede ser modificado por otro superadmin
    `
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o contraseña actual incorrecta',
  })
  @ApiResponse({
    status: 403,
    description: 'No tienes permisos para actualizar este usuario',
  })
  @ApiResponse({
    status: 401,
    description: 'No estás autenticado',
  })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'superadmin', 'user')
  update(@Param('id') id: number, @Body() userDto: UpdateUserDto, @Request() req) {
    return this.userService.update(id, userDto, req.user)
  }
}
