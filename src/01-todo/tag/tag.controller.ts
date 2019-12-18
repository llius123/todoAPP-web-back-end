import { ValidationArrayPipe } from './../../global/pipes/validation.pipe';
import { TagSwagger } from './../../global/swagger';
import {
	Controller,
	Get,
	Put,
	Body,
	Post,
	Scope,
	Param,
	UsePipes,
	Res,
	Request,
	Delete,
} from "@nestjs/common";
import {
	ApiResponse,
	ApiOperation,
	ApiUseTags,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { TagService } from "./tag.service";
import { Tag } from "./entity/tag.entity";
import { TagUpdate } from "./entity/validator/updateTag.validator";

@ApiBearerAuth()
@ApiUseTags("TAG")
@Controller({ path: "tag", scope: Scope.REQUEST })
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@ApiOperation({ title: "Get all tag TAG" })
	@ApiResponse({ status: 201, type: [TagSwagger] })
	@Get("getAllTag/:id")
	async getAllTag(@Param("id") id: number, @Request() request) {
		return this.tagService.getAllTag(request.user, id);
	}

	@ApiOperation({ title: "Update simple TAG" })
	@ApiResponse({ status: 201, description: "ok" })
	@UsePipes(new ValidationArrayPipe(TagUpdate))
	@Put("updateSimpleTag/:idProyecto")
	async updateSimpleTag( @Body() tag: Tag[], @Request() request) {
		tag.forEach(element => {
			this.tagService.updateSimpleTag(request.user, element, request.params.idProyecto);
		})
	}

	@ApiOperation({ title: "Eliminar TAG" })
	@ApiResponse({ status: 201, description: "ok" })
	@Delete("eliminarTag/:idTag")
	async eliminarTag(@Param("idTag") id: number, @Request() request) {
		this.tagService.eliminarTag(request.user, id)
	}

	@ApiOperation({ title: "Crear TAG" })
	@ApiResponse({ status: 201, description: "ok" })
	@Post("createTag/:idProyecto")
	async createTag(@Body() tag: Tag, @Request() request) {
		this.tagService.createTag(tag, request.user, request.params.idProyecto)
	}
}
