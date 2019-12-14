import { Controller, Get } from "@nestjs/common";
import { createQueryBuilder } from "typeorm";
import { Todo } from "./todo/entity/todo.index";
import { User } from "./login/user.entity";
import { Proyecto } from "./proyecto/entity/proyecto.index";

@Controller()
export class AppController {
	constructor() {}

	@Get("test")
	async test() {
		const data = await createQueryBuilder()
		.from(User, 'u')
		.addFrom(Proyecto, 'p')
		.addFrom(Todo, 't')
		.where('t.id = 44')
		.andWhere('u.id = p.usuarioId')
		.andWhere('p.id = t.proyectoId')
		.andWhere('u.id = 1').execute()
		console.log(JSON.parse(JSON.stringify(data)))
	}
}
