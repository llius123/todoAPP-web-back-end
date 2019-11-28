import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import * as path from "path";
import { ApiUseTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiUseTags('articles')
@Controller('articles')
export class AppController {
	constructor() {}

	@ApiOperation({ title: 'Get all articles' })
	@ApiResponse({ status: 200, description: 'Return all articles.'})
	@Get('hello')
	getHello() {
		// return this.appService.getHello();
	}
}
