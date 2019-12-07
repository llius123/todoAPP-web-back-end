import { GlobalModule } from "../global/global.module";
import { Proyecto } from "../proyecto/entity/proyecto.entity";
import {
	Module,
	NestModule,
	MiddlewareConsumer,
	RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthMiddleware } from "../global/auth.middleware";
import { ProyectoController } from "./proyecto.controller";
import { ProyectoService } from "./proyecto.service";
import { LoginService } from "../login/login.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Proyecto]),
		GlobalModule,
	],
	controllers: [ProyectoController],
	providers: [ProyectoService, LoginService],
})
export class ProyectoModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{ path: "proyecto/getAllProyecto", method: RequestMethod.GET },
				{ path: "proyecto/createProyecto", method: RequestMethod.POST }
			);
	}
}
