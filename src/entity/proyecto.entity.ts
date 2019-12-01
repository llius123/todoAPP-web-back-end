import { User } from '../login/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Todo } from '../todo/dto/todo.index';

@Entity()
export class Proyecto {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	titulo: string;

	@ManyToOne(type => User, user => user.proyecto)
	usuario: User;

	@OneToMany(type => Todo, todo => todo.id)
	todos: Todo[];
}
