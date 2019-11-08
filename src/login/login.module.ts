import { environment } from './../environments/environment';
import { User } from './../entity/user.entity';
import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module( {
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register( {
			secret: environment.secret,
			signOptions: { expiresIn: environment.expiresIn},
		} )
	],
	controllers: [ LoginController ],
	providers: [ LoginService ],
} )
export class LoginModule { }
