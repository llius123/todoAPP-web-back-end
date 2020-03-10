import { Injectable, Logger, Scope } from "@nestjs/common";
import { TagService } from "../tag/tag.service";
import { User } from "src/login/user.entity";
import { Tag } from "../tag/entity/tag.entity";
import { createQueryBuilder, Repository, createConnection } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag_Todo } from "./entity/tag_todo.entity";

@Injectable({ scope: Scope.REQUEST })
export class TagTodoService {
	public readonly logger = new Logger(TagTodoService.name);

	constructor(
		@InjectRepository(Tag_Todo)
		private readonly tag_todoRepository: Repository<Tag_Todo>,
		private readonly tagService: TagService) {}

	public async crearEnlazarTagConTodo(tag: Tag, idTodo: number, user: User, idProyecto: number){
		this.logger.log("crearEnlazarTagConTodo");
		const nuevoTag: [Tag] = await this.tagService.createTag(tag, user, idProyecto);
		await this.tag_todoRepository
			.createQueryBuilder()
			.insert()
			.values({
				todo: {id: idTodo},
				tag: {id: nuevoTag[0].id},
			})
			.execute();
	}

	public async enlazarTagConTodo(user: User, idProyecto: number, idTodo: number, idTag: number){
		this.logger.log("enlazarTagConTodo");
		await this.tag_todoRepository
			.createQueryBuilder()
			.insert()
			.values({
				todo: {id: idTodo},
				tag: {id: idTag},
			})
			.execute();
		return await this.tagService.getSimpleTag(idTag);
	}

	public async eliminarEnlazeTagConTodo(user: User, idProyecto: number, idTodo: number, idTag: number){
		this.logger.log("eliminarEnlazeTagConTodo");
		await this.tag_todoRepository
		.createQueryBuilder()
		.delete()
		.where("todo_id = :todoId", {todoId: idTodo})
		.andWhere("tag_id = :tagId", {tagId: idTag})
		.execute();
	}
}
