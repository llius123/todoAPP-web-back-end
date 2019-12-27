import {
	IsNotEmpty,
	IsDefined,
	Validate,
	IsInt,
	IsEmpty,
	IsString,
} from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class CreateProyecto {
	@IsNotEmpty()
	@IsString()
	titulo: string;
}
