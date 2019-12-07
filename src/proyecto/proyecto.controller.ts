import { Controller, Scope, Request, Param, Get, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ProyectoSwagger } from '../global/swagger';
import { ProyectoService } from './proyecto.service';
import { Proyecto } from './entity/proyecto.index';

@ApiBearerAuth()
@ApiUseTags("PROYECTO")
@Controller({ path: "proyecto", scope: Scope.REQUEST })
export class ProyectoController {
	constructor(private readonly proyectoService: ProyectoService ) {}

	@ApiOperation({ title: "Obtener todos los PROYECTO" })
	@ApiResponse({ status: 201, type: ProyectoSwagger })
	@Get("getAllProyecto")
	async getAllProyecto(@Request() request) {
		return this.proyectoService.getAllProyecto(request.user)
	}

	@ApiOperation({ title: "Crear un PROYECTO" })
	@ApiResponse({ status: 201, type: ProyectoSwagger })
	@Post("createProyecto")
	async createProyecto(@Body() proyecto: Proyecto,  @Request() request) {
		return this.proyectoService.createProyecto(request.user, proyecto)
	}
}