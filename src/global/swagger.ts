import { ApiModelProperty } from "@nestjs/swagger";

export class TodoSwagger {
	@ApiModelProperty({ example: 1, description: "Id TODO" })
	id: number;

	@ApiModelProperty({ example: "titulo", description: "Titulo TODO" })
	titulo: string;

	@ApiModelProperty({ example: "descripcion", description: "Descripcion TODO" })
	descripcion: string;

	@ApiModelProperty({ example: 1, description: "Orden TODO" })
	orden: number;

	@ApiModelProperty({ example: true, description: "Boolean TODO" })
	completado: boolean;

	@ApiModelProperty({ example: 1, description: "proyecto_id TODO" })
	proyecto_id: number;
}

export class UserSwagger {
	@ApiModelProperty({ example: 1, description: "Id USER" })
	id: number;

	@ApiModelProperty({ example: "Admin", description: "Username USER" })
	username: string;

	@ApiModelProperty({ example: "Admin", description: "Password USER" })
	password: string;
}

export class ProyectoSwagger {
	@ApiModelProperty({ example: 1, description: "Id PROYECTO" })
	id: number;

	@ApiModelProperty({ example: "Titulo", description: "Titulo PROYECTO" })
	titulo: string;

	@ApiModelProperty({ example: 1, description: "usuario_id PROYECTO" })
	usuario_id: number;
}

export class TagSwagger {
	@ApiModelProperty({ example: 1, description: "Id TAG" })
	id: number;

	@ApiModelProperty({ example: "Titulo", description: "Titulo PROYECTO" })
	titulo: string;

	@ApiModelProperty({ example: 1, description: "proyecto_id PROYECTO" })
	proyecto_id: number;
}
