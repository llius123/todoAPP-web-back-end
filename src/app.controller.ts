import { Controller, Get } from "@nestjs/common";
import { createQueryBuilder } from "typeorm";
import { Todo } from "./01-todo/todo/entity/todo.index";
import { User } from "./login/user.entity";
import { Proyecto } from "./01-todo/proyecto/entity/proyecto.index";

@Controller()
export class AppController {
	constructor() {}

	// @Get("test")
	// async test() {
	// }
}
