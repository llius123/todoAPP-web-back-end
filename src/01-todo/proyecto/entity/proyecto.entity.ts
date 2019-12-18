import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "../../../login/user.entity";
@Entity()
export class Proyecto {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	titulo: string;

	@ManyToOne(type => User, usuario => usuario.id, {
		onUpdate: "NO ACTION",
		onDelete: "NO ACTION",
	})
	usuario: User;
}
