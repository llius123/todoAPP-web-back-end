import { UserDto } from "src/login/user.dto";
import { TodoDTO } from "src/todo/todo.dto";

export interface ProyectoDTO {
	id: number;
	titulo: string;
	usuario: UserDto;
	todos: TodoDTO[]
}