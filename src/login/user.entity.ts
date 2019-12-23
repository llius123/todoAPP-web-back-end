import { Proyecto } from "../01-todo/proyecto/entity/proyecto.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from "typeorm";

@Entity({name: "usuario"})
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@OneToMany(type => Proyecto, proyecto => proyecto.id, {
		onUpdate: "NO ACTION",
		onDelete: "NO ACTION",
	})
	proyecto: Proyecto[];
}
