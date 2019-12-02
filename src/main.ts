import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoginAuthGuard } from "./global/login.guard";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	// app.useGlobalGuards(new LoginAuthGuard());
	// app.useGlobalPipes(new ValidationPipe());

	// app.setGlobalPrefix('api');

	const options = new DocumentBuilder()
		.setTitle("Api docs")
		.setDescription("Api docs")
		.setVersion("1.0")
		.setBasePath("api")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("/docs", app, document);

	await app.listen(3000);
}
bootstrap();
