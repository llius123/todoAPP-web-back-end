import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Todo } from "../../todo/entity/todo.entity";
import { Tag } from "../../tag/entity/tag.entity";

@Entity({name: 'tag_todo'})
// tslint:disable-next-line: class-name
export class Tag_Todo {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(type => Todo, {
		onUpdate: "NO ACTION",
		onDelete: "NO ACTION",
	})
    @JoinColumn({name: "todo_id"})
	todo: Todo;

	@OneToOne(type => Tag,{
		onUpdate: "NO ACTION",
		onDelete: "NO ACTION",
	})
    @JoinColumn({name: "tag_id"})
    tag: Tag;
}
