import request = require('supertest');

import done = require('supertest');
import { environment } from '../../environments/environment';

const BASE_URL = 'http://localhost:3000';
const JWT_MOCK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNTc1Mjc1MDI0LCJleHAiOjE1NzUyNzUwODR9.7NWBK9xFQEDVUBCpvPk69sMdJwtBHjdNhUt__jS7i8o";
const USER_MOCK = {user: "test", pass: "test"}
let USER_MOCK_ID;



describe('01-todo-login', () => {
	it('Login', async () => {
		const login = await request(BASE_URL)
			.get('/login')
			.query(USER_MOCK)
			.expect(200)
		expect(login.body.username).toBe('test')
		USER_MOCK_ID = login.body.id;
	});
});

// Revisar el id del usuario test
const NUEVO_PROYECTO_MOCK = {"titulo": "test","usuarioId": USER_MOCK_ID}
let PROYECTO_MOCK_ID;
describe('02-todo-proyecto', () => {
	it('Crear un nuevo proyecto', async () => {
		const proyectoCreado = await request(BASE_URL)
			.post('/proyecto/createProyecto')
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(NUEVO_PROYECTO_MOCK)
			.send(USER_MOCK)
			.expect(200)
		expect(proyectoCreado.body[0].titulo).toBe("test")
		expect(proyectoCreado.body[0].usuario_id).toBe(USER_MOCK_ID)
	});
	it('Obtener todos los proyectos', async () => {
		const proyectoCreado = await request(BASE_URL)
			.get('/proyecto/getAllProyecto')
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(USER_MOCK)
			.expect(200)
		expect(proyectoCreado.body[0].titulo).toBe("test")
		expect(proyectoCreado.body[0].usuario_id).toBe(USER_MOCK_ID)
		PROYECTO_MOCK_ID = proyectoCreado.body[0].id
	});
});

const TAG_MOCK = {"id":1,"titulo": "test","proyectoId": PROYECTO_MOCK_ID}
describe('02-todo-tag', () => {
	it('Crear un tag', async () => {
		const tagCreado = await request(BASE_URL)
			.post('/tag/createTag/' + PROYECTO_MOCK_ID)
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(TAG_MOCK)
			.send(USER_MOCK)
			.expect(201)
		expect(tagCreado.body[0].titulo).toBe("test")
		expect(tagCreado.body[0].proyecto_id).toBe(PROYECTO_MOCK_ID)
	});
	// it('Obtener todos los proyectos', async () => {
	// 	const proyectoCreado = await request(BASE_URL)
	// 		.get('/proyecto/getAllProyecto')
	// 		.set("Content-Type","application/json")
	// 		.set('Authorization', JWT_MOCK)
	// 		.send(USER_MOCK)
	// 		.expect(200)
	// 	expect(proyectoCreado.body[0].titulo).toBe("test")
	// 	expect(proyectoCreado.body[0].usuario_id).toBe(USER_MOCK_ID)
	// 	PROYECTO_MOCK_ID = proyectoCreado.body[0].id
	// });
	// it('Eliminar el proyecto creado para test', async () => {
	// 	const proyectoCreado = await request(BASE_URL)
	// 		.delete('/proyecto/eliminarProyecto/'+PROYECTO_MOCK_ID)
	// 		.set("Content-Type","application/json")
	// 		.set('Authorization', JWT_MOCK)
	// 		.send(USER_MOCK)
	// 		.expect(200)
	// });
});


describe('02-todo-borrar', () => {
	it('Eliminar el proyecto creado para test', async () => {
		const proyectoCreado = await request(BASE_URL)
			.delete('/proyecto/eliminarProyecto/'+PROYECTO_MOCK_ID)
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(USER_MOCK)
			.expect(200)
	});
});