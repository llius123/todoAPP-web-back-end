import { Injectable, Logger, Scope } from "@nestjs/common";
import { Connection, Repository, createQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entity/tag.entity";
import { User } from "../../login/user.entity";
import { Proyecto } from "../proyecto/entity/proyecto.index";
import { classToPlain } from "class-transformer";
import { TagInterface } from "./entity/tag.interface";

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
		.addSelect("tag.proyectoId", "proyectoId")
		.from(User, "user")
		.addFrom(Proyecto, "proyecto")
		.where("proyecto.id = :proyectoId", {proyectoId: idProyecto})
		.andWhere("user.id = :userId", {userId: user.id})
		.andWhere("user.id = proyecto.usuarioId")
		.andWhere("proyecto.id = tag.proyectoId").execute();
	}

	async updateSimpleTag(usuario: User, data: Tag, idProyecto: number) {
		this.logger.log("updateSimpleTag");
		const todo = await this.tagRepository
			.createQueryBuilder()
			.addFrom(Proyecto, "proyecto")
			.addFrom(User, "user")
			.where("user.id = :userId", { userId: usuario.id })
			.andWhere("tag.id = :tagId", { tagId: data.id })
			.andWhere("proyecto.id = :proyectoId", { proyectoId: idProyecto })
			.andWhere("user.id = proyecto.usuarioId")
			.execute();
		if (todo[0] !== null && todo.length > 0) {
			await this.tagRepository
				.createQueryBuilder()
				.update(Tag)
				.set({
					id: data.id,
					titulo: data.titulo,
				})
				.where("id = :todoId", { todoId: data.id })
				.execute();
		}
	}

	async eliminarTag(user: User, idTag: number){
		this.logger.log("eliminarTag");
		const tag: any = classToPlain(await this.tagRepository
		.createQueryBuilder()
		.select("tag.id", "id")
		.addSelect("tag.titulo", "titulo")
		.addSelect("tag.proyectoId", "proyectoId")
		.from(User, "user")
		.addFrom(Proyecto, "proyecto")
		.where("tag.id = :idTag", {idTag})
		.andWhere("user.id = :userId", {userId: user.id})
		.andWhere("tag.proyectoId = proyecto.id")
		.andWhere("proyecto.usuarioId = user.id")
		.execute())

		if (tag[0] !== null && tag.length > 0) {
			await this.tagRepository
			.createQueryBuilder()
			.delete()
			.where("id = :id", {id: idTag})
			.execute()
		}
	}

	async createTag(tag: Tag, user: User, idProyecto: number){
		this.logger.log("crearTag");
		this.tagRepository
		.createQueryBuilder()
		.insert()
		.values({
			titulo: tag.titulo,
			proyecto: {
				id: idProyecto,
			},
		})
		.execute();
	}

	async getSimpleTag(id: number): Promise<TagInterface[]>{
		this.logger.log("crearTag");
		return this.tagRepository
		.createQueryBuilder()
		.where("id = :id", {id: id})
		.execute();
	}
}
