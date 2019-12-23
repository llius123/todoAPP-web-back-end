import { JwtGlobalService } from "./../global/jwt.service";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { Connection } from "typeorm";

export interface UsuarioJwtInterface {
	username: string;
	password: string;
	iat: number;
	exp: number;
}
@Injectable()
export class LoginService {
	constructor(
		private connection: Connection,
		private jwtGlobalService: JwtGlobalService,
	) {}
	async login(user: string, pass: string) {
		return await this.connection
			.createQueryBuilder(User, "usuario")
			.select(["usuario.id", "usuario.username", "usuario.password"])
			.where("usuario.username = :user and usuario.password = :pass", {
				user,
				pass,
			})
			.getOne();
	}
	async getDatosVerificacionUsuario(jwt: string) {
		const userJWT: UsuarioJwtInterface = this.jwtGlobalService.jwtDecode(jwt);
		return await this.login(userJWT.username, userJWT.password);
	}
}
