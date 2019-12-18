import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./login/user.entity";
import { LoginModule } from "./login/login.module";
import { GlobalModule } from "./global/global.module";
//01-todo
import { TodoModule } from "./01-todo/todo/todo.module";
import { Todo } from "./01-todo/todo/entity/todo.entity";
import { ProyectoModule } from "./01-todo/proyecto/proyecto.module";
import { Proyecto } from "./01-todo/proyecto/entity/proyecto.index";
import { TagModule } from "./01-todo/tag/tag.module";
import { Tag } from "./01-todo/tag/entity/tag.entity";

@Module({
	imports: [
		// TypeOrmModule.forRoot({
		// 	host: 'localhost',
		// 	port: 5432,
		// 	username: 'postgres',
		// 	password: 'admin',
		// 	database: 'todoAPP',
		// 	type: 'postgres',
		// 	entities: [Todo, Proyecto, User],
		// 	synchronize: true
		// }),
		TypeOrmModule.forRoot({
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "",
			database: "todoAPP",
			entities: [Todo, Proyecto, User, Tag],
			synchronize: true,
		}),
		LoginModule,
		GlobalModule,
		TodoModule,
		ProyectoModule,
		TagModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
