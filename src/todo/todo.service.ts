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
		return await this.connection.getRepository(Todo).find();
	}

	async orderTodo(data: OrdenarTodo) {
		await this.connection.getRepository(Todo).query(
			`
			UPDATE todo
			set orden = ${data.orden}
			WHERE id = ${data.id};
			`
		)
	}
}
