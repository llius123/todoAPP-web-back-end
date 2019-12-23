import {
	Module,
	NestModule,
	MiddlewareConsumer,
} from "@nestjs/common";
import { AuthMiddleware } from "../../global/auth.middleware";

@Module({
	imports: [
	],
	controllers: [],
	providers: [],
})
export class TagTodoModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
			);
	}
}
