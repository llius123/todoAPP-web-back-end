import { Injectable, Logger, Scope } from "@nestjs/common";
import { Connection, Repository, createQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entity/tag.entity";
import { User } from "../../login/user.entity";
import { Proyecto } from "../proyecto/entity/proyecto.index";
import { classToPlain } from "class-transformer";
import { TagInterface } from "./entity/tag.interface";
import { Tag_Todo } from "../tag_todo/entity/tag_todo.entity";

@Injectable({ scope: Scope.REQUEST })
export class TagService {
	public readonly logger = new Logger(TagService.name);

	constructor(
		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,
		private connection: Connection,
	) {}

	async getAllTag(user: User, idProyecto: number) {
		this.logger.log("getAllTag");
		return await this.tagRepository
			.createQueryBuilder()
			.select("tag.id", "id")
			.addSelect("tag.titulo", "titulo")
			.addSelect("tag.proyecto_id", "proyecto_id")
			.from(User, "user")
			.addFrom(Proyecto, "proyecto")
			.where("proyecto.id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("user.id = :userId", { userId: user.id })
			.andWhere("user.id = proyecto.usuario_id")
			.andWhere("proyecto.id = tag.proyecto_id")
			.execute();
	}

	async updateSimpleTag(usuario: User, data: Tag, idProyecto: number) {
		this.logger.log("updateSimpleTag");
		const todo = await this.tagRepository
			.createQueryBuilder()
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("user.id = :userId", { userId: usuario.id })
			.andWhere("tag.id = :tag_id", { tag_id: data.id })
			.andWhere("proyecto.id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("user.id = proyecto.usuario_id")
			.execute();
		if (todo[0] !== null && todo.length > 0) {
			await this.tagRepository
				.createQueryBuilder()
				.update()
				.set({
					titulo: data.titulo,
				})
				.where("id = :todo_id", { todo_id: data.id })
				.execute();
			return await this.tagRepository
				.createQueryBuilder()
				.select("id")
				.addSelect("titulo")
				.addSelect("proyecto_id")
				.where("id = :id", { id: todo[0].Tag_id })
				.execute();
		}
	}

	async eliminarTag(user: User, idTag: number) {
		this.logger.log("eliminarTag");
		const tag: any = classToPlain(
			await this.tagRepository
				.createQueryBuilder()
				.select("tag.id", "id")
				.addSelect("tag.titulo", "titulo")
				.addSelect("tag.proyecto_id", "proyecto_id")
				.from(User, "user")
				.addFrom(Proyecto, "proyecto")
				.where("tag.id = :idTag", { idTag })
				.andWhere("user.id = :userId", { userId: user.id })
				.andWhere("tag.proyecto_id = proyecto.id")
				.andWhere("proyecto.usuario_id = user.id")
				.execute(),
		);

		if (tag[0] !== null && tag.length > 0) {
			await this.tagRepository
				.createQueryBuilder()
				.delete()
				.where("id = :id", { id: idTag })
				.execute();
		}
	}

	async createTag(tag: Tag, user: User, idProyecto: number) {
		this.logger.log("crearTag");
		await this.tagRepository
			.createQueryBuilder()
			.insert()
			.values({
				titulo: tag.titulo,
				proyecto: {
					id: idProyecto,
				},
			})
			.execute();

		return await this.tagRepository
			.createQueryBuilder()
			.select("MAX(tag.id)", "id")
			.addSelect("tag.titulo", "titulo")
			.addSelect("tag.proyecto_id", "proyecto_id")
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("tag.proyecto_id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("user.id = usuario_id", { usuario_id: user.id })
			.andWhere("user.id = proyecto.usuario_id")
			.limit(1)
			.execute();
	}

	async getSimpleTag(id: number): Promise<TagInterface[]> {
		this.logger.log("crearTag");
		return this.tagRepository
			.createQueryBuilder()
			.where("id = :id", { id })
			.execute();
	}

	async getAllTagByTodo(idProyecto: number,idTodo: number,user: User){
		this.logger.log("getAllTagByTodo");
		return await this.tagRepository
			.createQueryBuilder()
			.select("tag.id", "id")
			.addSelect("tag.titulo", "titulo")
			.addSelect("tag.proyecto_id", "proyecto_id")
			.from(User, "user")
			.addFrom(Proyecto, "proyecto")
			.addFrom(Tag_Todo, "tag_todo")
			.where("proyecto.id = :proyecto_id", { proyecto_id: idProyecto })
			.andWhere("proyecto.id = tag.proyecto_id")
			.andWhere("user.id = :userId", { userId: user.id })
			.andWhere("user.id = proyecto.usuario_id")
			.andWhere("tag_todo.todo_id = :todoId", {todoId: idTodo})
			.andWhere("tag_todo.tag_id = tag.id")
			.groupBy("tag.id")
			.execute();
	}
}
