import {
	Injectable,
	CanActivate,
	ExecutionContext,
	UnauthorizedException,
	HttpStatus,
	Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class LoginAuthGuard implements CanActivate {
	public readonly logger = new Logger(LoginAuthGuard.name);

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		if (
			request.path !== "/login" &&
			request.headers.authorization === undefined
		) {
			throw new UnauthorizedException(
				{ status: HttpStatus.UNAUTHORIZED, error: "Error loggin" },
				HttpStatus.UNAUTHORIZED.toString(),
			);
		} else {
			this.logger.log("LoginAuthGuard correcto");
			return true;
		}
	}
}
