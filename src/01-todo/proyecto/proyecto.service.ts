import { Injectable, Logger, Scope } from "@nestjs/common";
import { User } from "../../login/user.entity";
import { Proyecto } from "./entity/proyecto.index";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection, createQueryBuilder } from "typeorm";
import { classToPlain } from "class-transformer";

@Injectable({ scope: Scope.REQUEST })
export class ProyectoService {
	public readonly logger = new Logger(ProyectoService.name);

	constructor(
		@InjectRepository(Proyecto)
		private readonly proyectoRepository: Repository<Proyecto>,
	) {}

	async getAllProyecto(usuario: User): Promise<Proyecto[]> {
		this.logger.log("getAllProyecto");
		return await this.proyectoRepository
			.createQueryBuilder()
			.select("proyecto.id", "id")
			.addSelect("proyecto.titulo", "titulo")
			.addSelect("proyecto.usuario_id", "usuario_id")
			.addFrom(User, "user")
			.addFrom(Proyecto, "proyecto")
			.where("proyecto.usuario_id = :idUsuario", { idUsuario: usuario.id })
			.andWhere("user.id = proyecto.usuario_id")
			.groupBy("proyecto.id")
			.execute();
	}

	async createProyecto(usuario: User, proyecto: Proyecto) {
		this.logger.log("createProyecto");
		await this.proyectoRepository
			.createQueryBuilder()
			.insert()
			.values({
				titulo: proyecto.titulo,
				usuario: {
					id: usuario.id,
				},
			})
			.execute();

		const id = await this.proyectoRepository
			.createQueryBuilder()
			.select("MAX(proyecto.id)", "id")
			.from(User, "user")
			.where("user.id = :userId", { userId: usuario.id })
			.andWhere("user.id = proyecto.usuario_id")
			.execute();

		return await this.proyectoRepository
			.createQueryBuilder()
			.select("proyecto.id", "id")
			.addSelect("proyecto.titulo", "titulo")
			.addSelect("proyecto.usuario_id", "usuario_id")
			.from(User, "user")
			.where("user.id = :usuario_id", { usuario_id: usuario.id })
			.andWhere("proyecto.id = :proyecto_id", { proyecto_id: id[0].id })
			.andWhere("user.id = proyecto.usuario_id")
			.execute();
	}

	async eliminarProyecto(usuario: User, idProyecto: number) {
		this.logger.log("eliminarProyecto");
		await this.proyectoRepository
			.createQueryBuilder()
			.delete()
			.where("id = :id", { id: idProyecto })
			.andWhere("usuario.id = :idUsuario", { idUsuario: usuario.id })
			.execute();
	}
}
