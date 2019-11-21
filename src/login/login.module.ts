import { GlobalModule } from './../global/global.module';
import { JwtGlobalService } from './../global/jwt.service';
import { environment } from "./../environments/environment";
import { User } from "./../entity/user.entity";
import { Module } from "@nestjs/common";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: environment.secret,
			signOptions: { expiresIn: environment.expiresIn },
		}),
	],
	controllers: [LoginController],
	providers: [LoginService, JwtGlobalService],
})
export class LoginModule {}
