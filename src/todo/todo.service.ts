import { Todo } from "./todo.entity";

import { Injectable, Logger, Scope } from "@nestjs/common";
import { Connection } from "typeorm";
import { OrdenarTodo } from "./todo.controller";
import { User } from "src/login/user.entity";

@Injectable({ scope: Scope.REQUEST })
export class TodoService {
	public readonly logger = new Logger(TodoService.name);

	constructor(private connection: Connection) {}
	async getAllTodo(usuario: User, proyecto: number) {
		this.logger.log("getAllTodo");
		return await this.connection.getRepository(Todo).query(
			`SELECT todo.id, todo.titulo, todo.descripcion, todo.orden, todo.completado
			FROM todo, proyecto, user
			WHERE proyecto.user_id = ?
				AND proyecto.id = ?
				AND proyecto.id = todo.proyecto_id
			GROUP BY proyecto.id
			`, [usuario.id, proyecto]);
	}

	async orderTodo(usuario: User, data: OrdenarTodo) {
		this.logger.log("orderTodo");
		await this.connection.query(
			`
			UPDATE todo, user, proyecto
			set todo.orden = ?
			WHERE user.id = ?
				AND todo.id = ?
				AND user.id = proyecto.user_id
				AND proyecto.id = todo.proyecto_id
			`,
			[data.orden, usuario.id, data.id]
		)
	}

	async updateSimpleTodo(usuario: User, todo: Todo) {
		this.logger.log("updateSimpleTodo");
		await this.connection.query(
			`
			UPDATE todo, user, proyecto
			SET todo.titulo = ?
				,todo.descripcion = ?
				,todo.orden = ?
				,todo.completado = ?
			WHERE user.id = ?
				AND todo.id = ?
				AND proyecto.id = todo.proyecto_id
				AND user.id = proyecto.user_id
				AND proyecto.id = todo.proyecto_id
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
				WHERE todo.proyecto_id = ?
					AND user.id = ?
					AND user.id = proyecto.user_id
				`,
				[todo.id, usuario.id]);
			getMaxOrden = getMaxOrden[0].orden +1;
			//Inserto el nuevo registro
			await transaction.query(`INSERT INTO todo (titulo, descripcion, orden, completado) VALUES ('${todo.titulo}', '${todo.descripcion}', ${getMaxOrden}, ${todo.completado})`);
			//Inserto el nuevo registro en la tabla intermedia
			const nuevoTodo: Todo = await transaction.getRepository(Todo).query(`SELECT * FROM todo WHERE id=(SELECT MAX(id) FROM todo);`)
			//Inserto en la tabla intermedia el nuevo registro
			await transaction.query(`INSERT INTO user_todo (user_id, todo_id) VALUES ('${usuario.id}', '${nuevoTodo[0].id}')`).then(resp => {console.log(resp)})
		})
	}
}
