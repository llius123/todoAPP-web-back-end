import { Todo } from "./entity/todo.entity";
import { User } from "../../login/user.entity";

import { Injectable, Logger, Scope, Inject, HttpStatus, HttpException } from "@nestjs/common";
import { Connection, Repository, createQueryBuilder } from "typeorm";
import { OrdenarTodo } from "./entity/todo.index";
import { InjectRepository } from "@nestjs/typeorm";
import { Proyecto } from "../proyecto/entity/proyecto.entity";
import { TodoInterface } from "./entity/todo.interface";
import { TagService } from "../tag/tag.service";
import { TagInterface } from "../tag/entity/tag.interface";
import { Tag } from "../tag/entity/tag.entity";
import { Tag_Todo } from './../tag_todo/entity/tag_todo.entity';

@Injectable({ scope: Scope.REQUEST })
export class TodoService {
	public readonly logger = new Logger(TodoService.name);

	constructor(
		@InjectRepository(Todo)
		@InjectRepository(Tag_Todo)
		private readonly todoRepository: Repository<Todo>,
		private readonly connection: Connection,
		private readonly tagService: TagService,
	) {}

	async getAllTodo(usuario: User, proyecto: number) {
		this.logger.log("getAllTodo");
		return await this.todoRepository
			.createQueryBuilder("todo")
			.select("todo.id", "id")
			.addSelect("todo.titulo", "titulo")
			.addSelect("todo.descripcion", "descripcion")
			.addSelect("todo.orden", "orden")
			.addSelect("todo.completado", "completado")
			.addSelect("todo.proyecto_id", "proyecto_id")
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("proyecto.usuario_id = :usuario_id", { usuario_id: usuario.id })
			.andWhere("proyecto.id = :proyecto_id", { proyecto_id: proyecto })
			.andWhere("proyecto.id = todo.proyecto_id")
			.groupBy("todo.id")
			.orderBy("todo.orden")
			.execute();
	}

	async orderTodo(usuario: User, data: OrdenarTodo, idProyecto: number) {
		this.logger.log("orderTodo");
		const todo = await this.todoRepository
			.createQueryBuilder()
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "usuario")
			.where("usuario.id = :userId", { userId: usuario.id })
			.andWhere("todo.id = :todo_id", { todo_id: data.id })
			.andWhere("proyecto.id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("usuario.id = proyecto.usuario_id")
			.andWhere("proyecto.id = todo.proyecto_id")
			.execute();
		if (todo[0] !== null && todo.length > 0) {
			await this.todoRepository
				.createQueryBuilder()
				.update(Todo)
				.set({ orden: data.orden })
				.where("id = :todo_id", { todo_id: data.id })
				.execute();
		}
	}

	async updateSimpleTodo(usuario: User, data: TodoInterface, idProyecto: number) {
		this.logger.log("updateSimpleTodo");
		const todo = await this.todoRepository
			.createQueryBuilder()
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("user.id = :userId", { userId: usuario.id })
			.andWhere("todo.id = :todo_id", { todo_id: data.id })
			.andWhere("proyecto.id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("user.id = proyecto.usuario_id")
			.andWhere("proyecto.id = todo.proyecto_id")
			.execute();
		if (todo[0] !== null && todo.length > 0) {
			await this.todoRepository
				.createQueryBuilder()
				.update(Todo)
				.set({
					orden: data.orden,
					titulo: data.titulo,
					descripcion: data.descripcion,
					completado: data.completado,
				})
				.where("id = :todo_id", { todo_id: data.id })
				.execute();
		}
	}

	async createTodo(usuario: User, todo: TodoInterface, idProyecto: number) {
		this.logger.log("createTodo");

		//Compruebo si los tags existen para crear el todo
		const tag: TagInterface[] = [];
		if (todo.tag.length > 0) {
			// tslint:disable-next-line: prefer-for-of
			for (let index = 0; index < todo.tag.length; index++) {
				const tagBuscado = await this.tagService.getSimpleTag(todo.tag[index].id);
				tag.push(tagBuscado[0]);
			}
		}
		//Si hay tags en el objeto pero por alguna razon no pertenecen a este usuario/proyecto cancelo la operacion
		if (todo.tag.length > 0 && (tag.length === 0 || tag[0] === undefined)) {
			throw new HttpException(
				{
					message: "Input data validation failed",
					errors: 'Tag: error',
				},
				HttpStatus.BAD_REQUEST,
			);
		}
		//Obtengo el orden del ultimo TODO y le sumo 1
		const getMaxOrden = await this.todoRepository
			.createQueryBuilder()
			.createQueryBuilder()
			.select("MAX(todo.orden)", "orden")
			.addFrom(Todo, "todo")
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("todo.proyecto_id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("user.id = usuario_id", { usuario_id: usuario.id })
			.andWhere("user.id = proyecto.usuario_id")
			.execute();
		//Aumento +1 el orden
		const aumentarMaxOrden = getMaxOrden[0].orden + 1;
		//Inserto el nuevo registro
		await this.todoRepository
			.createQueryBuilder()
			.insert()
			.values({
				titulo: todo.titulo,
				descripcion: todo.descripcion,
				orden: aumentarMaxOrden,
				completado: todo.completado,
				proyecto: {
					id: idProyecto,
				},
			})
			.execute();
		//Obtengo el registro insertado
		const todo_id = await this.todoRepository
			.createQueryBuilder()
			.select("MAX(todo.id)", "id")
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("todo.proyecto_id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("user.id = usuario_id", { usuario_id: usuario.id })
			.andWhere("user.id = proyecto.usuario_id")
			.execute();
		//Inserto los tags en la tabla correspondiente
		// tslint:disable-next-line: prefer-for-of
		for (let index = 0; index < todo.tag.length; index++) {
			await createQueryBuilder(Tag_Todo)
			.insert()
			.values({
				todo: {
					id: todo_id[0].id,
				},
				tag: {
					id: todo.tag[index].id,
				},
			})
			.execute();
		}
		await this.connection.transaction(async transaction => {
		});
	}

	async eliminarTodo(usuario: User, id: number) {
		this.logger.log("eliminarTodo");

		const todo: [any] = await createQueryBuilder()
			.from(User, "u")
			.addFrom(Proyecto, "p")
			.addFrom(Todo, "t")
			.where("t.id = :idTodo", { idTodo: id })
			.andWhere("u.id = p.usuario_id")
			.andWhere("p.id = t.proyecto_id")
			.andWhere("u.id = :idUsuario", { idUsuario: usuario.id })
			.execute();

		if (todo[0] !== null && todo.length > 0) {
			await this.todoRepository
				.createQueryBuilder()
				.delete()
				.from(Todo)
				.where("todo.id = :id", { id })
				.execute();
			return { msg: "Ok" };
		} else {
			return { msg: "Error" };
		}
	}
}
