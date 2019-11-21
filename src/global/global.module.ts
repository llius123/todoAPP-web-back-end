import { LoginModule } from "./../login/login.module";
import { environment } from "./../environments/environment.prod";
import { LoginService } from "./../login/login.service";
import { Module } from "@nestjs/common";
import { LoginAuthGuard } from "./login.guard";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtGlobalService } from "./jwt.service";

@Module({
	imports: [
		JwtModule.register({
			secret: environment.secret,
			signOptions: { expiresIn: environment.expiresIn }
		})
	],
	controllers: [],
	providers: [JwtGlobalService],
	exports: [JwtGlobalService]
})
export class GlobalModule {}
