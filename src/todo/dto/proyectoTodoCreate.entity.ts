import { IsInt, IsNotEmpty } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class ProyectoTodoCreate {
	@IsNotEmpty()
	@IsInt()
	id: number;
}