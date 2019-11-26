import { JwtGlobalService } from './../global/jwt.service';
import { User } from "./../entity/user.entity";
import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";

export interface UsuarioJwtInterface  {
	username: string, password: string, iat: number, exp: number
}
@Injectable()
export class LoginService {
	constructor(private connection: Connection, private jwtGlobalService: JwtGlobalService) {}
	async login(user: string, pass: string) {
		return await this.connection
			.getRepository(User)
			.createQueryBuilder("user")
			.select(["user.id", "user.username", "user.password"])
			.where("user.username = :user and user.password = :pass", {
				user: user,
				pass: pass
			})
			.getOne();
	}
	async getDatosVerificacionUsuario(jwt: string){
		let userJWT: UsuarioJwtInterface = this.jwtGlobalService.jwtDecode(jwt);
		return await this.login(userJWT.username, userJWT.password)
	}
}
