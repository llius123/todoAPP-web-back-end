import { ProyectoInterface } from "../../proyecto/entity/proyecto.interface";

export interface TagInterface {
	id: number;
	titulo: string;
	proyecto: ProyectoInterface;
}
