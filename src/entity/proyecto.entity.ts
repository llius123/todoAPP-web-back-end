import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Proyecto {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@Column()
	titulo: number;
}
