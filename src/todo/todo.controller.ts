import { LoginService } from './../login/login.service';
import {
	Controller,
	Get,
	Put,
	Body,
	HttpStatus,
	HttpException,
	Headers,
	Post,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import {
	IsNotEmpty,
	validate,
	IsInt,
	IsString,
	IsIn,
	IsNumber,
	ValidationError,
} from "class-validator";
import { Todo } from "../entity/todo.entity";
import { JwtGlobalService } from './../global/jwt.service';

export class OrdenarTodo {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsInt()
	@IsNotEmpty()
	orden: number;
}

@Controller("todo")
export class TodoController {
	constructor(private readonly todoService: TodoService, private readonly jwtGlobalService: JwtGlobalService, private loginService: LoginService) {}

	@Get("getAllTodo")
	getAllTodo(@Headers("authorization") header) {
		console.log(header)
		// await this.loginService.getDatosVerificacionUsuario(header.authorization);
		return this.todoService.getAllTodo();
	}

	@Put("updateOrderTodo")
	updateOrderTodo(@Body() data: [OrdenarTodo]) {
		const erroresValidacion: any = [];
		data.forEach(async (elemento: OrdenarTodo) => {
			const ordenarTodo = new OrdenarTodo();
			ordenarTodo.id = elemento.id;
			ordenarTodo.orden = elemento.orden;
			const error: ValidationError[] = await validate(ordenarTodo);
			if (error.length > 0) {
				erroresValidacion.push(error[0].constraints);
			} else {
				await this.todoService.orderTodo(elemento);
			}
		});

		if (erroresValidacion.length <= 0) {
			return { code: 200, msg: "ok" };
		} else {
			throw new HttpException(
				{ status: HttpStatus.BAD_REQUEST, error: erroresValidacion },
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Put("updateSimpleTodo")
	async updateSimpleTodo(@Body() todo: Todo) {
		try {
			await this.todoService.updateSimpleTodo(todo);
			return { code: 200, msg: "ok" };
		} catch (error) {
			throw new HttpException(
				{ status: HttpStatus.BAD_REQUEST, error: error },
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Post("createTodo")
	async createTodo(@Body() todo: Todo){
		try{
			return this.todoService.createTodo(todo);
			// return { code: 200, msg: "ok" };
		} catch (error) {
			throw new HttpException(
				{ status: HttpStatus.BAD_REQUEST, error: error },
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
