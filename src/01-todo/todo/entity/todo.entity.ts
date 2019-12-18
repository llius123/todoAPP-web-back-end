import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Proyecto } from "../../proyecto/entity/proyecto.entity";

@Entity()
export class Todo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	titulo: string;

	@Column()
	descripcion: string;

	@Column()
	orden: number;

	@Column()
	completado: number;

	@ManyToOne(type => Proyecto, proyecto => proyecto.id, {
		onUpdate: "NO ACTION",
		onDelete: "CASCADE",
	})
	proyecto: Proyecto;
}
