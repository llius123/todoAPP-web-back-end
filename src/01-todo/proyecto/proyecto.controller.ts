import {
	Controller,
	Scope,
	Request,
	Param,
	Get,
	Post,
	Body,
	Delete,
	UsePipes,
	HttpCode,
} from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiUseTags,
	ApiOperation,
	ApiResponse,
} from "@nestjs/swagger";
import { ProyectoSwagger } from "../../global/swagger";
import { ProyectoService } from "./proyecto.service";
import { Proyecto } from "./entity/proyecto.index";
import { CreateProyecto } from "./entity/validator/createProyecto.validator";
import { ValidationPipe } from "../../global/pipes/validation.pipe";

@ApiBearerAuth()
@ApiUseTags("PROYECTO")
@Controller({ path: "proyecto", scope: Scope.REQUEST })
export class ProyectoController {
	constructor(private readonly proyectoService: ProyectoService) {}

	@ApiOperation({ title: "Obtener todos los PROYECTO" })
	@ApiResponse({ status: 201, type: ProyectoSwagger })
	@Get("getAllProyecto")
	async getAllProyecto(@Request() request): Promise<Proyecto[]> {
		return this.proyectoService.getAllProyecto(request.user);
	}

	@ApiOperation({ title: "Crear un PROYECTO" })
	@ApiResponse({ status: 201, type: ProyectoSwagger })
	@UsePipes(new ValidationPipe(CreateProyecto))
	@Post("createProyecto")
	@HttpCode(200)
	async createProyecto(@Body() proyecto: Proyecto, @Request() request) {
		return this.proyectoService.createProyecto(request.user, proyecto);
	}

	@ApiOperation({ title: "Eliminar un PROYECTO" })
	@ApiResponse({ status: 201, type: "Ok" })
	@Delete("eliminarProyecto/:idProyecto")
	async eliminarProyecto(@Param("idProyecto") id: number, @Request() request) {
		return this.proyectoService.eliminarProyecto(request.user, id);
	}
}
