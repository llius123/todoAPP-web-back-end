import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LoginAuthGuard } from "./global/login.guard";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.useGlobalGuards(new LoginAuthGuard());
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(3000);
}
bootstrap();
