import { Todo } from "./dto/todo.entity";
import { User } from "../login/user.entity";

import { Injectable, Logger, Scope } from "@nestjs/common";
import { Connection, Repository } from "typeorm";
import { OrdenarTodo } from "../todo/dto/todo.index";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable({ scope: Scope.REQUEST })
export class TodoService {
	public readonly logger = new Logger(TodoService.name);

	constructor(
		@InjectRepository(Todo)
		private readonly todoRepository: Repository<Todo>,
		private connection: Connection
	) {}

	async getAllTodo(usuario: User, proyecto: number) {
		this.logger.log("getAllTodo");
		return await this.todoRepository.query(
			`SELECT todo.id, todo.titulo, todo.descripcion, todo.orden, todo.completado
			FROM todo, proyecto, user
			WHERE proyecto.usuarioId = ?
				AND proyecto.id = ?
				AND proyecto.id = todo.proyectoId
			GROUP BY proyecto.id
			`, [usuario.id, proyecto]
		)
	}

	async orderTodo(usuario: User, data: OrdenarTodo) {
		this.logger.log("orderTodo");
		await this.todoRepository.query(
			`
			UPDATE todo, user, proyecto
			set todo.orden = ?
			WHERE user.id = ?
				AND todo.id = ?
				AND user.id = proyecto.usuarioId
				AND proyecto.id = todo.proyectoId
			`,
			[data.orden, usuario.id, data.id]
		)
	}

	async updateSimpleTodo(usuario: User, todo: Todo) {
		this.logger.log("updateSimpleTodo");
		await this.todoRepository.query(
			`
			UPDATE todo, user, proyecto
			SET todo.titulo = ?
				,todo.descripcion = ?
				,todo.orden = ?
				,todo.completado = ?
			WHERE user.id = ?
				AND todo.id = ?
				AND proyecto.id = todo.proyectoId
				AND user.id = proyecto.usuarioId
				AND proyecto.id = todo.proyectoId
			`,
			[todo.titulo, todo.descripcion, +todo.orden, +todo.completado, +usuario.id, +todo.id]
		)
	}

	async createTodo(usuario: User, todo: Todo) {
		this.connection.transaction( async transaction => {
			this.logger.log("createTodo");
			//Obtengo el orden del ultimo TODO y le sumo 1
			let getMaxOrden = await transaction.query(
				`
				SELECT MAX(todo.orden) as orden
				FROM todo, proyecto, user
				WHERE todo.proyectoId = ?
					AND user.id = ?
					AND user.id = proyecto.usuarioId
				`,
				[todo.id, usuario.id]);
			getMaxOrden = getMaxOrden[0].orden +1;
			//Inserto el nuevo registro
			await transaction.query(`INSERT INTO todo (titulo, descripcion, orden, completado, proyectoId) VALUES ('${todo.titulo}', '${todo.descripcion}', ${getMaxOrden}, ${todo.completado}, ${todo.proyecto.id})`);
			//Inserto el nuevo registro en la tabla intermedia
			return await transaction.getRepository(Todo).query(`SELECT * FROM todo WHERE id=(SELECT MAX(id) FROM todo);`)
		})
	}
}
