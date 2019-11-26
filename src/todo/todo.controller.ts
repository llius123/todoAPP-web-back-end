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
	Scope,
	UnauthorizedException,
} from "@nestjs/common";
import { TodoService } from "./todo.service";
import {
	IsNotEmpty,
	validate,
	IsInt,
	IsNumber,
	ValidationError,
} from "class-validator";
import { Todo } from "../entity/todo.entity";

export class OrdenarTodo {
	@IsNotEmpty()
	@IsNumber()
	id: number;

	@IsInt()
	@IsNotEmpty()
	orden: number;
}

@Controller({path: "todo", scope: Scope.REQUEST})
export class TodoController {
	constructor(private readonly todoService: TodoService, private loginService: LoginService) {}

	@Get("getAllTodo")
	async getAllTodo(@Headers("authorization") header) {
		const usuario = await this.loginService.getDatosVerificacionUsuario(header);
		if(usuario){
			return this.todoService.getAllTodo(usuario)
		}else{
			throw new UnauthorizedException(
				{ status: HttpStatus.UNAUTHORIZED, error: "Error loggin" },
				HttpStatus.UNAUTHORIZED.toString(),
			);
		} 
	}

	@Put("updateOrderTodo")
	async updateOrderTodo(@Body() data: [OrdenarTodo], @Headers("authorization") header) {
		const erroresValidacion: any = [];
		const usuario = await this.loginService.getDatosVerificacionUsuario(header);
		if(usuario){
			data.forEach(async (elemento: OrdenarTodo) => {
				const ordenarTodo = new OrdenarTodo();
				ordenarTodo.id = elemento.id;
				ordenarTodo.orden = elemento.orden;
				const error: ValidationError[] = await validate(ordenarTodo);
				if (error.length > 0) {
					erroresValidacion.push(error[0].constraints);
				} else {
					await this.todoService.orderTodo(usuario, elemento);
				}
			});
		}else{
			throw new UnauthorizedException(
				{ status: HttpStatus.UNAUTHORIZED, error: "Error loggin" },
				HttpStatus.UNAUTHORIZED.toString(),
			);
		}
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
	async updateSimpleTodo(@Body() todo: Todo,  @Headers("authorization") header) {
		const usuario = await this.loginService.getDatosVerificacionUsuario(header);
		try {
			await this.todoService.updateSimpleTodo(usuario, todo);
			return { code: 200, msg: "ok" };
		} catch (error) {
			throw new HttpException(
				{ status: HttpStatus.BAD_REQUEST, error: error },
				HttpStatus.BAD_REQUEST,
			);
		}
	}

	@Post("createTodo")
	async createTodo(@Body() todo: Todo,  @Headers("authorization") header){
		const usuario = await this.loginService.getDatosVerificacionUsuario(header);
		try{
			return this.todoService.createTodo(usuario, todo);
			// return { code: 200, msg: "ok" };
		} catch (error) {
			throw new HttpException(
				{ status: HttpStatus.BAD_REQUEST, error: error },
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
