import { Proyecto } from "../proyecto/entity/proyecto.entity";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column()
	password: string;

	@OneToMany(type => Proyecto, proyecto => proyecto.id, { onUpdate: 'NO ACTION', onDelete: 'NO ACTION' }, )
	proyecto: Proyecto[];
}
