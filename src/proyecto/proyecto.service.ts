import { Injectable, Logger, Scope } from "@nestjs/common";
import { User } from "../login/user.entity";
import { Proyecto } from "./entity/proyecto.index";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Connection } from "typeorm";

@Injectable({ scope: Scope.REQUEST })
export class ProyectoService {
	public readonly logger = new Logger(ProyectoService.name);

	constructor(
		@InjectRepository(Proyecto)
		private readonly proyectoRepository: Repository<Proyecto>,
		private connection: Connection,
	) {}

	async getAllProyecto(usuario: User) {
		this.logger.log("getAllProyecto");
		return await this.proyectoRepository.query(
			`SELECT proyecto.id, proyecto.usuarioId, proyecto.titulo
			FROM proyecto, user
			WHERE proyecto.usuarioId = ?
				AND user.id = proyecto.usuarioId
			GROUP BY proyecto.id
			`,
			[usuario.id],
		);
	}

	async createProyecto(usuario: User, proyecto: Proyecto) {
		this.logger.log("createProyecto");
		await this.proyectoRepository.query(
			`
			INSERT INTO proyecto (titulo, usuarioId) VALUES (?, ?)
			`,
			[proyecto.titulo, usuario.id],
		);

		const id = await this.proyectoRepository.query(
			`
			SELECT MAX(proyecto.id) as id
				FROM proyecto, user
				WHERE user.id = ?
					AND user.id = proyecto.usuarioId
			`,
			[usuario.id]
		)

		return await this.proyectoRepository.query(
			`
			SELECT proyecto.id as id, proyecto.titulo as titulo, proyecto.usuarioId as usuarioId 
				FROM proyecto, user
				WHERE user.id = ?
					AND proyecto.id = ?
					AND user.id = proyecto.usuarioId
			`,
			[usuario.id, id[0].id]
		)
	}
}
