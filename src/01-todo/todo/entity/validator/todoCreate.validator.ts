import { IsNotEmpty, Max, Min, IsInt, ValidateNested } from "class-validator";
import { Entity } from "typeorm";
import { ProyectoTodoCreate } from "../todo.index";
import { Type } from "class-transformer";

/**
 * Clase que se usa para hacer las validaciones de ValidationPipe
 */
@Entity()
export class TodoCreate {
	@IsNotEmpty()
	titulo: string;

	@IsNotEmpty()
	descripcion: string;

	@IsNotEmpty()
	@Min(0)
	@Max(1)
	completado: boolean;

	@ValidateNested()
	@Type(() => ProyectoTodoCreate)
	proyecto: ProyectoTodoCreate;
}
