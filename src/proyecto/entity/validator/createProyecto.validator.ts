import { IsNotEmpty, IsDefined, Validate, IsInt, IsEmpty, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class CreateProyecto {
	@IsEmpty()
	id: number;

	@IsNotEmpty()
	@IsString()
	titulo: string;

	@IsEmpty()
	usuarioId: number;
}
