import { Controller, Scope, Post, Body, Request, Delete, Param } from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Tag } from "../tag/entity/tag.entity";
import { TagTodoService } from "./tag_todo.service";

@ApiBearerAuth()
@ApiUseTags("TAG_TODO")
@Controller({ path: "tagtodo", scope: Scope.REQUEST })
export class TagTodoController {
	constructor(
		private readonly tag_todoService: TagTodoService,
	) {}

	@ApiOperation({ title: "Crear y Enlazar TAG_TODO" })
	@ApiResponse({ status: 201, description: "ok" })
	@Post("crearEnlazarTagConTodo/:idProyecto/:idTodo")
	async crearEnlazarTagConTodo(@Body() tag: Tag, @Request() request) {
		await this.tag_todoService.crearEnlazarTagConTodo(
			tag,
			request.params.idTodo,
			request.user,
			request.params.idProyecto,
		)
	}

	@ApiOperation({ title: "Enlazar TAG_TODO" })
	@ApiResponse({ status: 201, description: "ok" })
	@Post("enlazarTagConTodo/:idProyecto/:idTodo/:idTag")
	async enlazarTagConTodo(@Request() request, @Param("idProyecto") idProyecto: number, @Param("idTodo") idTodo: number, @Param("idTag") idTag: number) {
		return await this.tag_todoService.enlazarTagConTodo(
			request.user,
			idProyecto,
			idTodo,
			idTag,
		);
	}

	@ApiOperation({ title: "Eliminar conexion TAG_TODO" })
	@ApiResponse({ status: 201, description: "ok" })
	@Delete("eliminarEnlazeTagConTodo/:idProyecto/:idTodo/:idTag")
	async eliminarEnlazeTagConTodo(@Request() request, @Param("idProyecto") idProyecto: number, @Param("idTodo") idTodo: number, @Param("idTag") idTag: number) {
		await this.tag_todoService.eliminarEnlazeTagConTodo(
			request.user,
			idProyecto,
			idTodo,
			idTag,
		);
	}
}
