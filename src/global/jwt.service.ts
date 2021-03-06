import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/login/user.entity";

@Injectable()
export class JwtGlobalService {
	constructor(private _jwtService: JwtService) {}

	public jwtSign(user: User) {
		this._jwtService.sign(JSON.parse(JSON.stringify(user)));
	}

	public jwtDecode(token: string): any {
		return this._jwtService.decode(token);
	}
}
