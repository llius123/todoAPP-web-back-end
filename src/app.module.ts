import { TodoModule } from './todo/todo.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { LoginModule } from './login/login.module';
import { JwtModule } from '@nestjs/jwt';
import * as path from 'path';
import { GlobalModule } from './global/global.module';

@Module( {
	imports: [
		TypeOrmModule.forRoot({
			"type": "mysql",
			"host": "localhost",
			"port": 3306,
			"username": "root",
			"password": "",
			"database": "todoAPP",
			"entities": [path.join(__dirname, "**/*.entity{.ts,.js}")]
		}),
		LoginModule,
		GlobalModule,
		TodoModule
	],
	controllers: [ AppController ],
	providers: [ AppService ],
} )
export class AppModule { }
