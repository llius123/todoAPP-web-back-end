import { Injectable, Logger, Scope } from "@nestjs/common";
import { Connection, Repository, createQueryBuilder } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entity/tag.entity";
import { User } from "../../login/user.entity";
import { Proyecto } from "../proyecto/entity/proyecto.index";

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
		this.logger.log("updateSimpleTodo");
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
}
