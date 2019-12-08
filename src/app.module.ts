import { TodoModule } from "./todo/todo.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./login/user.entity";
import { LoginModule } from "./login/login.module";
import { GlobalModule } from "./global/global.module";
import { Todo } from "./todo/entity/todo.entity";
import { ProyectoModule } from "./proyecto/proyecto.module";
import { Proyecto } from "./proyecto/entity/proyecto.index";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "y55VDqj2LP%",
			database: "todoAPP",
			entities: [Todo, Proyecto, User],
			synchronize: true,
		}),
		LoginModule,
		GlobalModule,
		TodoModule,
		ProyectoModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
