import { TodoModule } from "./todo/todo.module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./login/user.entity";
import { LoginModule } from "./login/login.module";
import { JwtModule } from "@nestjs/jwt";
import * as path from "path";
import { GlobalModule } from "./global/global.module";
import { Todo } from "./todo/entity/todo.entity";
import { Proyecto } from "./entity/proyecto.entity";

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: "mysql",
			host: "localhost",
			port: 3306,
			username: "root",
			password: "",
			database: "todoAPP",
			entities: [Todo, Proyecto, User],
			synchronize: true,
		}),
		LoginModule,
		GlobalModule,
		TodoModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
