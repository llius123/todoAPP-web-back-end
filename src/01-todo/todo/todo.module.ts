import { environment } from "../../environments/environment";
import { LoginService } from "../../login/login.service";
import { LoginController } from "../../login/login.controller";
import { GlobalModule } from "../../global/global.module";
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
import { AuthMiddleware } from "../../global/auth.middleware";
import { TagModule } from "../tag/tag.module";
import { TagService } from "../tag/tag.service";
import { Tag } from "../tag/entity/tag.entity";
import { Tag_Todo } from "../tag_todo/entity/tag_todo.entity";
import { TagTodoService } from "../tag_todo/tag_todo.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([Todo, Tag]),
		JwtModule.register({
			secret: environment.secret,
			signOptions: { expiresIn: environment.expiresIn },
		}),
		GlobalModule,
		TagModule
	],
	controllers: [TodoController, LoginController],
	providers: [TodoService, LoginService, TagService],
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
