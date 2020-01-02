import { TagService } from './../tag/tag.service';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { AuthMiddleware } from "../../global/auth.middleware";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "../tag/entity/tag.entity";
import { Tag_Todo } from "./entity/tag_todo.entity";
import { GlobalModule } from "../../global/global.module";
import { TagTodoController } from "./tag_todo.controller";
import { LoginService } from "../../login/login.service";
import { TagTodoService } from "./tag_todo.service";

@Module({
	imports: [TypeOrmModule.forFeature([Tag, Tag_Todo]), GlobalModule],
	controllers: [TagTodoController],
	providers: [TagTodoService, LoginService, TagService],
})
export class TagTodoModule implements NestModule {
	public configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.forRoutes(
				{ path: "/tagtodo/crearEnlazarTagConTodo/:idProyecto/:idTodo", method: RequestMethod.POST },
				{ path: "/tagtodo/enlazarTagConTodo/:idProyecto/:idTodo/:idTag", method: RequestMethod.POST },
				{ path: "/tagtodo/eliminarEnlazeTagConTodo/:idProyecto/:idTagTodo", method: RequestMethod.DELETE },
			);
	}
}
