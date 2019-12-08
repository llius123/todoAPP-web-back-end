import { environment } from "./../environments/environment.prod";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtGlobalService } from "./jwt.service";

@Module({
	imports: [
		JwtModule.register({
			secret: environment.secret,
			signOptions: { expiresIn: environment.expiresIn },
		}),
	],
	controllers: [],
	providers: [JwtGlobalService],
	exports: [JwtGlobalService],
})
export class GlobalModule {}
