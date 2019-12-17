import { Injectable, Logger, Scope } from "@nestjs/common";
import { User } from "../login/user.entity";
import { Proyecto } from "./entity/proyecto.index";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection, createQueryBuilder } from "typeorm";
import { classToPlain } from "class-transformer";

@Injectable({ scope: Scope.REQUEST })
export class ProyectoService {
	public readonly logger = new Logger(ProyectoService.name);

	constructor(
		@InjectRepository(Proyecto)
		private readonly proyectoRepository: Repository<Proyecto>
	) {}

	async getAllProyecto(usuario: User): Promise<Proyecto[]>{
		this.logger.log("getAllProyecto");
		console.log(
			await this.proyectoRepository
		.createQueryBuilder()
		.select("proyecto.id", "id")
		.addSelect("proyecto.titulo", "titulo")
		.addSelect("proyecto.usuarioId", "usuarioId")
		.addFrom(User, "user")
		.addFrom(Proyecto, "proyecto")
		.where("proyecto.usuarioId = :idUsuario", {idUsuario: usuario.id})
		.andWhere("user.id = proyecto.usuarioId")
		.groupBy("proyecto.id").getQueryAndParameters()
		)
		return await this.proyectoRepository
		.createQueryBuilder()
		.select("proyecto.id", "id")
		.addSelect("proyecto.titulo", "titulo")
		.addSelect("proyecto.usuarioId", "usuarioId")
		.addFrom(User, "user")
		.addFrom(Proyecto, "proyecto")
		.where("proyecto.usuarioId = :idUsuario", {idUsuario: usuario.id})
		.andWhere("user.id = proyecto.usuarioId")
		.groupBy("proyecto.id").execute();
	}

	async createProyecto(usuario: User, proyecto: Proyecto) {
		this.logger.log("createProyecto");
		await this.proyectoRepository.createQueryBuilder()
		.insert()
		.values({
			titulo: proyecto.titulo,
			usuario: {
				id: usuario.id
			}
		}).execute();

		const id = await this.proyectoRepository
		.createQueryBuilder()
		.select("MAX(proyecto.id)", "id")
		.from(User, "user")
		.where("user.id = :userId", {userId: usuario.id})
		.andWhere("user.id = proyecto.usuarioId")
		.execute()

		return await this.proyectoRepository
		.createQueryBuilder()
		.select("proyecto.id", "id")
		.addSelect("proyecto.titulo", "titulo")
		.addSelect("proyecto.usuarioId", "usuarioId")
		.from(User, "user")
		.where("user.id = :usuarioId", {usuarioId: usuario.id})
		.andWhere("proyecto.id = :proyectoId", {proyectoId: id[0].id})
		.andWhere("user.id = proyecto.usuarioId")
		.execute();
	}

	async eliminarProyecto(usuario: User, idProyecto: number) {
		this.logger.log("eliminarProyecto");
		await this.proyectoRepository
		.createQueryBuilder()
		.delete()
		.where("id = :id", {id: idProyecto})
		.andWhere("usuario.id = :idUsuario", {idUsuario: usuario.id})
		.execute();
	}
}
