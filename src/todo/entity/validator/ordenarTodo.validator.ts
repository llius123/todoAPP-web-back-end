import { IsNotEmpty, IsDefined, Validate, IsInt } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class OrdenarTodo {
	@IsNotEmpty()
	@IsInt()
	id: number;

	@IsNotEmpty()
	@IsInt()
	orden: number;
}
