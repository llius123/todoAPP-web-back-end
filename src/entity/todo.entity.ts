import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

	@Column()
	proyecto_id: number;
}
