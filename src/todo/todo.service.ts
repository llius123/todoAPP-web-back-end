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
		return await this.todoRepository.query(
			`SELECT todo.id, todo.titulo, todo.descripcion, todo.orden, todo.completado
			FROM todo, proyecto, user
			WHERE proyecto.usuarioId = ?
				AND proyecto.id = ?
				AND proyecto.id = todo.proyectoId
			GROUP BY todo.id
			ORDER BY todo.orden
			`,
			[usuario.id, proyecto],
		);
	}

	async orderTodo(usuario: User, data: OrdenarTodo, idProyecto: number) {
		this.logger.log("orderTodo");
		await this.todoRepository.query(
			`
			UPDATE todo, user, proyecto
			set todo.orden = ?
			WHERE user.id = ?
				AND todo.id = ?
				AND proyecto.id = ?
				AND user.id = proyecto.usuarioId
				AND proyecto.id = todo.proyectoId
			`,
			[data.orden, usuario.id, data.id, idProyecto],
		);
	}

	async updateSimpleTodo(usuario: User, todo: Todo, idProyecto: number) {
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
				AND proyecto.id = ?
				AND proyecto.id = todo.proyectoId
				AND user.id = proyecto.usuarioId
				AND proyecto.id = todo.proyectoId
			`,
			[
				todo.titulo,
				todo.descripcion,
				+todo.orden,
				+todo.completado,
				+usuario.id,
				+todo.id,
				idProyecto,
			],
		);
	}

	async createTodo(usuario: User, todo: Todo, idProyecto: number) {
		this.connection.transaction(async transaction => {
			this.logger.log("createTodo");
			// Obtengo el orden del ultimo TODO y le sumo 1
			let getMaxOrden = await transaction.query(
				`
				SELECT MAX(todo.orden) as orden
				FROM todo, proyecto, user
				WHERE todo.proyectoId = ?
					AND user.id = ?
					AND user.id = proyecto.usuarioId
				`,
				[idProyecto, usuario.id],
			);
			getMaxOrden = getMaxOrden[0].orden + 1;
			// Inserto el nuevo registro
			await transaction.query(
				`INSERT INTO todo (titulo, descripcion, orden, completado, proyectoId) VALUES ('${todo.titulo}', '${todo.descripcion}', ${getMaxOrden}, ${todo.completado}, ${idProyecto})`,
			);
			// Devuelvo el todo creado
			const nuevoTodo = await transaction.getRepository(Todo).query(
				`
			SELECT *
			FROM todo, proyecto, user
			WHERE todo.id=(SELECT MAX(todo.id))
				AND proyecto.usuarioId = ?
				AND proyecto.id = ?
				AND proyecto.id = todo.proyectoId
				ORDER BY todo.id DESC LIMIT 0, 1
				`,
				[usuario.id, idProyecto],
			);
			return nuevoTodo;
		});
	}

	async eliminarTodo(usuario: User, id: number){
		this.logger.log("eliminarTodo");

		// const todo: any = await this.todoRepository.createQueryBuilder('todo')
		// // .select('todo.id as id').addSelect('todo.titulo as titulo').addSelect('todo.descripcion as descripcion').addSelect('todo.orden as orden').addSelect('todo.completado as completado').addSelect('todo.proyectoId as proyectoId')
		// .addFrom(User, "user").addFrom(Proyecto, "proyecto")
		// .where('user.id = :id AND proyecto.usuarioId = user.id', {id: usuario.id})
		// // .andWhere('proyecto.usuarioId = user.id')
		// .andWhere('proyecto.id = todo.proyectoId')
		// .andWhere('todo.id = :id', {id: id})
		// .getSql()

		const todo: any = await createQueryBuilder(Todo, 'todo')
		.from(User, 'u')
		.addFrom(Proyecto, 'p')
		.where('t.id = 44')
		.andWhere('u.id = p.usuarioId')
		.andWhere('p.id = t.proyectoId')
		.andWhere('u.id = 1').execute()

		if(todo.length > 0){
			await this.todoRepository.createQueryBuilder().delete().from(Todo).where("todo.id = :id", {id: id}).execute()
			return { msg: 'Ok'}
		}else{
			return { msg: 'Error'}
		}
	}
}
