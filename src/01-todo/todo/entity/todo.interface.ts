import { ProyectoInterface } from "../../proyecto/entity/proyecto.interface";
import { TagInterface } from "../../tag/entity/tag.interface";

export interface TodoInterface {
	id: number;
	titulo: string;
	descripcion: string;
	orden: number;
	completado: number;
	proyecto: ProyectoInterface;
	tag: TagInterface[];
}
