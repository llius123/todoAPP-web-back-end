import { environment } from "./../environments/environment";
import { LoginService } from "./../login/login.service";
import { LoginController } from "./../login/login.controller";
import { GlobalModule } from "./../global/global.module";
import { Todo } from "./entity/todo.entity";
import {
	Module,
	NestModule,
	MiddlewareConsumer,
	RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthMiddleware } from "../global/auth.middleware";

@Module({
	imports: [
		TypeOrmModule.forFeature([Todo]),
		JwtModule.register({
			secret: environment.secret,
			signOptions: { expiresIn: environment.expiresIn },
		}),
		GlobalModule,
	],
	controllers: [TodoController, LoginController],
	providers: [TodoService, LoginService],
})
export class TodoModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{ path: "todo/getAllTodo/:id", method: RequestMethod.GET },
				{ path: "todo/updateOrderTodo/:id", method: RequestMethod.PUT },
				{ path: "todo/updateSimpleTodo/:id", method: RequestMethod.PUT },
				{ path: "todo/createTodo/:id", method: RequestMethod.POST },
				{ path: "todo/eliminarTodo/:idTodo", method: RequestMethod.DELETE },
			);
	}
}
