import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import * as path from "path";

@Controller()
export class AppController {
	constructor() {}

	// @Get('hello')
	// getHello() {
	// 	// return this.appService.getHello();
	// }
}
