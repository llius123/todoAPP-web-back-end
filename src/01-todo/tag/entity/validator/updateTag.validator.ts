import {
	IsNotEmpty,
	IsInt,
} from "class-validator";

/**
 * Clase que se usa para hacer las validaciones de ValidationPipe
 */
export class TagUpdate {
	@IsNotEmpty()
	@IsInt()
	id: number;

	@IsNotEmpty()
	titulo: string;

	@IsNotEmpty()
	@IsInt()
	proyecto_id: number;

}
