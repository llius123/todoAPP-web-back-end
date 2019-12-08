import {
	IsNotEmpty,
	Max,
	Min,
	IsInt,
	ValidateNested,
	IsIn,
} from "class-validator";
import { Entity } from "typeorm";
import { ProyectoTodoCreate } from "../todo.index";
import { Type } from "class-transformer";

/**
 * Clase que se usa para hacer las validaciones de ValidationPipe
 */
@Entity()
export class TodoUpdate {
	@IsNotEmpty()
	titulo: string;

	@IsNotEmpty()
	descripcion: string;

	@IsNotEmpty()
	@IsInt()
	orden: number;

	@IsNotEmpty()
	@IsIn([0, 1])
	completado: number;

	@ValidateNested()
	@Type(() => ProyectoTodoCreate)
	proyecto: ProyectoTodoCreate;
}
