import { GlobalModule } from "../../global/global.module";
import {
	Module,
	NestModule,
	MiddlewareConsumer,
	RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthMiddleware } from "../../global/auth.middleware";
import { Tag } from "./entity/tag.entity";
import { TagController } from "./tag.controller";
import { LoginService } from "../../login/login.service";
import { TagService } from "./tag.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Tag]),
		GlobalModule,
	],
	controllers: [TagController],
	providers: [TagService, LoginService]
})
export class TagModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{ path: "tag/getAllTag/:id", method: RequestMethod.GET },
				{ path: "tag/updateSimpleTag/:idProyecto", method: RequestMethod.PUT },
				{ path: "tag/eliminarTag/:idTag", method: RequestMethod.DELETE },
				{ path: "tag/createTag/:idTag", method: RequestMethod.POST },
			);
	}
}
