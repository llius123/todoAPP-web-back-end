import {
	IsNotEmpty,
	IsInt,
} from "class-validator";
import { Entity } from "typeorm";

/**
 * Clase que se usa para hacer las validaciones de ValidationPipe
 */
@Entity()
export class TagUpdate {
	@IsNotEmpty()
	titulo: string;

	@IsNotEmpty()
	@IsInt()
	proyectoId: number;

}
