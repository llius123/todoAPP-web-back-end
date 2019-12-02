import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { NestMiddleware, HttpStatus, Injectable } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { LoginService } from "../login/login.service";
import { environment } from "../environments/environment";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly loginService: LoginService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		const token: string = req.headers.authorization;
		const decoded: any = jwt.decode(token);
		const user = await this.loginService.login(
			decoded.username,
			decoded.password,
		);
		if (!user) {
			throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
		}

		req.user = user;
		next();
	}
}
