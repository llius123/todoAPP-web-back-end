import { Todo } from './../entity/todo.entity';

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Connection } from 'typeorm';
import { OrdenarTodo } from './todo.controller';

@Injectable()
export class TodoService {
	
	public readonly logger = new Logger(TodoService.name);
	
	constructor(
		private connection: Connection
	){}
	async getAllTodo() {
		this.logger.log('getAllTodo')
		return await this.connection.getRepository(Todo).find();
	}

	async orderTodo(data: OrdenarTodo) {
		this.logger.log('orderTodo')
		await this.connection.getRepository(Todo).query(
			`
			UPDATE todo
			set orden = ${data.orden}
			WHERE id = ${data.id};
			`
		)
	}

	async updateSimpleTodo( todo: Todo ){
		this.logger.log('updateSimpleTodo')
		await this.connection.createQueryBuilder().update(Todo).
		set({
			titulo: todo.titulo ,
			descripcion: todo.descripcion,
			orden: todo.orden,
			completado: todo.completado
		})
		.where("id = :id", { id: todo.id })
		.execute()
	}
}
