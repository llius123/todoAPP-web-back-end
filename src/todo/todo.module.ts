import { environment } from './../environments/environment';
import { LoginService } from './../login/login.service';
import { LoginController } from './../login/login.controller';
import { GlobalModule } from './../global/global.module';
import { Todo } from "./todo.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TodoController } from "./todo.controller";
import { TodoService } from "./todo.service";
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [TypeOrmModule.forFeature([Todo]),
	JwtModule.register({
		secret: environment.secret,
		signOptions: { expiresIn: environment.expiresIn },
	}), GlobalModule],
	controllers: [TodoController, LoginController],
	providers: [TodoService, LoginService],
})
export class TodoModule {}
