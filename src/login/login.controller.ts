import { User } from './../entity/user.entity';
import { Controller, Get, Post, Param, Query, UnauthorizedException, HttpStatus, HttpException } from '@nestjs/common';
import { LoginService } from './login.service';
import { JwtService } from '@nestjs/jwt';

@Controller('login')
export class LoginController {
	constructor(
		private readonly loginService: LoginService,
		private readonly jwtService: JwtService
		) {}

	@Get()
	async login(@Query('user') user: string, @Query('pass')pass: string): Promise<any> {
		const userLogged: any = await this.loginService.login(user, pass);
		if(userLogged !== undefined){
			return { username: userLogged.username, access_token: this.jwtService.sign(JSON.parse(JSON.stringify(userLogged)))}
		}else{
			throw new UnauthorizedException({status: HttpStatus.UNAUTHORIZED, error: 'Error loggin'}, HttpStatus.UNAUTHORIZED.toString())
		}
	}
}
