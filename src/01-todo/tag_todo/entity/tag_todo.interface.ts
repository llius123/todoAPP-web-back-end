import { TagInterface } from "../../tag/entity/tag.interface";
import { TodoInterface } from "../../todo/entity/todo.interface";

// tslint:disable-next-line: class-name
export interface Tag_Todo {
	id: number;
	todo: TodoInterface;
    tag: TagInterface;
}
