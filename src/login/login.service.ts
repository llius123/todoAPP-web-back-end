import { User } from './../entity/user.entity';
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class LoginService {
	constructor(
		private connection: Connection
	){}
	async login(user:string, pass: string) {
		return await this.connection.getRepository(User).createQueryBuilder("user").select(["user.username", "user.password"]).where("user.username = :user and user.password = :pass", {user: user, pass:pass}).getOne();
	}
}
