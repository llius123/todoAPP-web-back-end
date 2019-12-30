import { Injectable, Logger, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class TagTodoService {
	public readonly logger = new Logger(TagTodoService.name);

	constructor() {}
}
