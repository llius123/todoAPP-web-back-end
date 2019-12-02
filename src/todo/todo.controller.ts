import {
	Controller,
	Get,
	Put,
	Body,
	Post,
	Scope,
	Param,
	UsePipes,
	Res,
	Request,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import { Todo, TodoCreate, OrdenarTodo } from "./dto/todo.index";
import {
	ApiResponse,
	ApiOperation,
	ApiUseTags,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { TodoSwagger } from "../global/swagger";
import {
	ValidationPipe,
	ValidationArrayPipe,
} from "../global/pipes/validation.pipe";

@ApiBearerAuth()
@ApiUseTags("TODO")
@Controller({ path: "todo", scope: Scope.REQUEST })
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	@ApiOperation({ title: "Obtener todos los TODO" })
	@ApiResponse({ status: 201, type: TodoSwagger })
	@Get("getAllTodo/:id")
	async getAllTodo(@Param("id") proyecto: number, @Request() request) {
		return this.todoService.getAllTodo(request.user, proyecto);
	}

	@ApiOperation({ title: "Update order TODO" })
	@ApiResponse({ status: 201, description: "ok" })
	@UsePipes(new ValidationArrayPipe(OrdenarTodo))
	@Put("updateOrderTodo/:id")
	async updateOrderTodo(@Body() data: [OrdenarTodo], @Request() request) {
		data.forEach(async (elemento: OrdenarTodo) => {
			await this.todoService.orderTodo(
				request.user,
				elemento,
				request.params.id,
			);
		});
		return { code: 200, msg: "ok" };
	}

	@ApiOperation({ title: "Update simple TODO" })
	@ApiResponse({ status: 201, description: "ok" })
	@UsePipes(new ValidationPipe(TodoCreate))
	@Put("updateSimpleTodo")
	async updateSimpleTodo(@Body() todo: Todo, @Request() request) {
		await this.todoService.updateSimpleTodo(request.user, todo);
		return { code: 200, msg: "ok" };
	}

	@ApiOperation({ title: "Create TODO" })
	@ApiResponse({ status: 201, type: TodoSwagger })
	@UsePipes(new ValidationPipe(TodoCreate))
	@Post("createTodo")
	async createTodo(@Body() todo: Todo, @Request() request) {
		return this.todoService.createTodo(request.user, todo);
	}
}
