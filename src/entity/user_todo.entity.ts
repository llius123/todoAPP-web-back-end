import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserTodo {
	@PrimaryGeneratedColumn()
	id: number;

	@Column( )
	user_id: number;

	@Column(  )
	todo_id: number;
}