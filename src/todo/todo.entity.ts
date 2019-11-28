import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { Proyecto } from "../entity/proyecto.entity";

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
	completado: boolean;

	@ManyToOne(type => Proyecto, proyecto => proyecto.todos)
	proyecto: Proyecto;
}
