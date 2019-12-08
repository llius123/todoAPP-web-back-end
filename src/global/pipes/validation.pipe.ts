import {
	PipeTransform,
	ArgumentMetadata,
	BadRequestException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { validate, Validator } from "class-validator";
import { plainToClass } from "class-transformer";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { isArray } from "util";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
	constructor(private data) {}
	async transform(value, metadata: ArgumentMetadata) {
		let object: any;
		const errors: any = [];
		/**
		 * Si no hay valores corto el proceso ya que es obligatorio que haya datos que validar
		 */
		if (!value) {
			throw new BadRequestException("No data submitted");
		}
		/**
		 * Trasnformo la clase que quiero validar y el body de la peticion en un objeto de la libreria class-validator
		 */
		object = plainToClass(this.data, value);
		/**
		 * Valido si el objeto es correcto
		 */
		const data = await validate(object);
		if (data.length > 0) {
			errors.push(data);
		}
		/**
		 * Si hay errores lanzo una excepcion
		 */
		if (errors.length > 0) {
			throw new HttpException(
				{
					message: "Input data validation failed",
					errors: this.buildError(errors),
				},
				HttpStatus.BAD_REQUEST,
			);
		}
		return value;
	}

	/**
	 * La validacion de datos de datos esta capada hasta un primer hijo, si alguna vez se tiene un hijo dentro de otro, modificar el if
	 * Todo {proyecto{pepe{...}}}
	 * Modificar el if, añadiendo otro foreach
	 * el.children.forEach(element => {
	 * 		Object.entries(element.constraints).forEach(constraint => {
	 * 			result[prop + constraint[0]] = `${constraint[1]}`;
	 *  	});
	 * });
	 */
	private buildError(errors) {
		const result = {};
		if (Array.isArray(errors)) {
			errors.forEach(error => {
				error.forEach(el => {
					const prop = el.property;
					if (el.children.length >= 1) {
						el.children.forEach(element => {
							Object.entries(element.constraints).forEach(constraint => {
								result[prop + constraint[0]] = `${constraint[1]}`;
							});
						});
					} else {
						Object.entries(el.constraints).forEach(constraint => {
							result[prop + constraint[0]] = `${constraint[1]}`;
						});
					}
				});
			});
		} else {
			errors.forEach(el => {
				const prop = el.property;
				if (el.children.length >= 1) {
					el.children.forEach(element => {
						Object.entries(element.constraints).forEach(constraint => {
							result[prop + constraint[0]] = `${constraint[1]}`;
						});
					});
				} else {
					Object.entries(el.constraints).forEach(constraint => {
						result[prop + constraint[0]] = `${constraint[1]}`;
					});
				}
			});
		}
		return result;
	}
}

@Injectable()
export class ValidationArrayPipe implements PipeTransform<any> {
	constructor(private data) {}
	async transform(value, metadata: ArgumentMetadata) {
		let object: any;
		const errors: any = [];
		/**
		 * Si no hay valores corto el proceso ya que es obligatorio que haya datos que validar
		 */
		if (!value) {
			throw new BadRequestException("No data submitted");
		}
		/**
		 * Trasnformo la clase que quiero validar y el body de la peticion en un objeto de la libreria class-validator
		 */
		object = await plainToClass(this.data, value);
		/**
		 * Recorro los objetos validando uno a uno
		 */
		/* tslint:disable:prefer-for-of */
		for (let i = 0; i < object.length; i++) {
			/**
			 * Valido si el objeto es correcto
			 */
			const data = await validate(object[i]);
			if (data.length > 0) {
				errors.push(data);
			}
		}
		/**
		 * Si hay errores lanzo una excepcion
		 */
		if (errors.length > 0) {
			throw new HttpException(
				{
					message: "Input data validation failed",
					errors: this.buildError(errors),
				},
				HttpStatus.BAD_REQUEST,
			);
		}
		return value;
	}
	// // La validacion de datos de datos esta capada hasta un primer hijo, si alguna vez se tiene un hijo dentro de otro, modificar el if
	// // Todo {proyecto{pepe{...}}}
	// // Modificar el if, añadiendo otro foreach
	// el.children.forEach(element => {
	// 	Object.entries(element.constraints).forEach(constraint => {
	// 		result[prop + constraint[0]] = `${constraint[1]}`;
	// 	});
	// });
	private buildError(errors) {
		const result = {};
		if (Array.isArray(errors)) {
			errors.forEach(error => {
				error.forEach(el => {
					const prop = el.property;
					if (el.children.length >= 1) {
						el.children.forEach(element => {
							Object.entries(element.constraints).forEach(constraint => {
								result[prop + constraint[0]] = `${constraint[1]}`;
							});
						});
					} else {
						Object.entries(el.constraints).forEach(constraint => {
							result[prop + constraint[0]] = `${constraint[1]}`;
						});
					}
				});
			});
		} else {
			errors.forEach(el => {
				const prop = el.property;
				if (el.children.length >= 1) {
					el.children.forEach(element => {
						Object.entries(element.constraints).forEach(constraint => {
							result[prop + constraint[0]] = `${constraint[1]}`;
						});
					});
				} else {
					Object.entries(el.constraints).forEach(constraint => {
						result[prop + constraint[0]] = `${constraint[1]}`;
					});
				}
			});
		}
		return result;
	}
}
