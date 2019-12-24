import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, Unique, Index, Exclusion, ManyToMany, ManyToOne } from "typeorm";
import { Todo } from "../../todo/entity/todo.entity";
import { Tag } from "../../tag/entity/tag.entity";

@Entity({name: 'tag_todo'})
// tslint:disable-next-line: class-name
export class Tag_Todo {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(type => Todo, {
		onUpdate: "NO ACTION",
		onDelete: "CASCADE",
	})
    @JoinColumn({name: "todo_id"})
	todo: Todo;

	@ManyToOne(type => Tag,{
		onUpdate: "NO ACTION",
		onDelete: "CASCADE",
	})
	@JoinColumn({name: "tag_id"})
    tag: Tag;
}
