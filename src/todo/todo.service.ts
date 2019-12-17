import { Todo } from "./entity/todo.entity";
import { User } from "../login/user.entity";

import { Injectable, Logger, Scope } from "@nestjs/common";
import { Connection, Repository, createQueryBuilder } from "typeorm";
import { OrdenarTodo } from "./entity/todo.index";
import { InjectRepository } from "@nestjs/typeorm";
import { Proyecto } from "../proyecto/entity/proyecto.entity";

@Injectable({ scope: Scope.REQUEST })
export class TodoService {
	public readonly logger = new Logger(TodoService.name);

	constructor(
		@InjectRepository(Todo)
		private readonly todoRepository: Repository<Todo>,
		private connection: Connection,
	) {}

	async getAllTodo(usuario: User, proyecto: number) {
		this.logger.log("getAllTodo");
		return await this.todoRepository
		.createQueryBuilder("todo")
		.addFrom(Proyecto, "proyecto")
		.addFrom(User, "user")
		.where("proyecto.usuarioId = :usuarioId", {usuarioId: usuario.id})
		.andWhere("proyecto.id = :proyectoId", {proyectoId: proyecto})
		.andWhere("proyecto.id = todo.proyectoId")
		.groupBy("todo.id")
		.orderBy("todo.orden")
		.execute();
	}

	async orderTodo(usuario: User, data: OrdenarTodo, idProyecto: number) {
		this.logger.log("orderTodo");
		const todo = await this.todoRepository.createQueryBuilder()
		.addFrom(Proyecto, "proyecto")
		.addFrom(User, "user")
		.where("user.id = :userId", {userId: usuario.id})
		.andWhere("todo.id = :todoId", {todoId: data.id})
		.andWhere("proyecto.id = :proyectoId", {proyectoId: idProyecto})
		.andWhere("user.id = proyecto.usuarioId")
		.andWhere("proyecto.id = todo.proyectoId").execute()
		if(todo[0] !== null && todo.length > 0){
			await this.todoRepository.createQueryBuilder()
			.update(Todo)
			.set({orden: data.orden})
			.where("id = :todoId", {todoId: data.id})
			.execute()
		}
	}

	async updateSimpleTodo(usuario: User, data: Todo, idProyecto: number) {
		this.logger.log("updateSimpleTodo");
		const todo = await this.todoRepository.createQueryBuilder()
		.addFrom(Proyecto, "proyecto")
		.addFrom(User, "user")
		.where("user.id = :userId", {userId: usuario.id})
		.andWhere("todo.id = :todoId", {todoId: data.id})
		.andWhere("proyecto.id = :proyectoId", {proyectoId: idProyecto})
		.andWhere("user.id = proyecto.usuarioId")
		.andWhere("proyecto.id = todo.proyectoId").execute()
		if(todo[0] !== null && todo.length > 0){
			await this.todoRepository.createQueryBuilder()
			.update(Todo)
			.set({
				orden: data.orden,
				titulo: data.titulo,
				descripcion: data.descripcion,
				completado: data.completado
			})
			.where("id = :todoId", {todoId: data.id})
			.execute()
		}
	}

	async createTodo(usuario: User, todo: Todo, idProyecto: number) {
		await this.connection.transaction(async transaction => {
			this.logger.log("createTodo");
			// Obtengo el orden del ultimo TODO y le sumo 1
			let getMaxOrden = await transaction
			.createQueryBuilder()
			.select("MAX(todo.orden)", "orden")
			.addFrom(Todo, "todo")
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("todo.proyectoId = :proyectoId",{proyectoId: idProyecto})
			.andWhere("user.id = usuarioId", {usuarioId: usuario.id})
			.andWhere("user.id = proyecto.usuarioId").execute();
			getMaxOrden = getMaxOrden[0].orden + 1;
			// Inserto el nuevo registro
			await transaction
			.createQueryBuilder(Todo, "todo")
			.insert()
			.values({
				titulo: todo.titulo,
				descripcion: todo.descripcion,
				orden: getMaxOrden,
				completado: todo.completado,
				proyecto: {
					id: idProyecto
				}
			}).execute()
		});
	}

	async eliminarTodo(usuario: User, id: number){
		this.logger.log("eliminarTodo");

		const todo: [any] = await createQueryBuilder()
		.from(User, 'u')
		.addFrom(Proyecto, 'p')
		.addFrom(Todo, 't')
		.where('t.id = :idTodo', {idTodo: id})
		.andWhere('u.id = p.usuarioId')
		.andWhere('p.id = t.proyectoId')
		.andWhere('u.id = :idUsuario', {idUsuario: usuario.id}).execute()

		if(todo[0] !== null && todo.length > 0){
			await this.todoRepository.createQueryBuilder().delete().from(Todo).where("todo.id = :id", {id: id}).execute()
			return { msg: 'Ok'}
		}else{
			return { msg: 'Error'}
		}
	}
}
