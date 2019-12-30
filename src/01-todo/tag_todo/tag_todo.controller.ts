import { Controller, Scope } from "@nestjs/common";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiUseTags("TAG_TODO")
@Controller({ path: "tagtodo", scope: Scope.REQUEST })
export class TagTodoController {
	constructor() {}
}
