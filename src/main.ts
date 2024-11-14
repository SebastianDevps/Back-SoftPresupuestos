import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
		}),
	)
	const config = new DocumentBuilder()
		.setTitle('Finance API')
		.setDescription('API para la gestión de finanzas personales')
		.setVersion('1.0')
		.build()
	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, documentFactory)
	app.setGlobalPrefix('api')
	app.enableCors()
	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
