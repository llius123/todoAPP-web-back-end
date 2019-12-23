import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Proyecto } from "../../proyecto/entity/proyecto.entity";

@Entity()
export class Tag {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	titulo: string;

	@ManyToOne(type => Proyecto, proyecto => proyecto.id, {
		onUpdate: "NO ACTION",
		onDelete: "CASCADE",
	})
	@JoinColumn({name: "proyecto_id"})
	proyecto: Proyecto;
}
