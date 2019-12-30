import request = require('supertest');

import done = require('supertest');
import { environment } from '../../environments/environment';

const BASE_URL = 'http://localhost:3000';
const JWT_MOCK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNTc1Mjc1MDI0LCJleHAiOjE1NzUyNzUwODR9.7NWBK9xFQEDVUBCpvPk69sMdJwtBHjdNhUt__jS7i8o";
const USER_MOCK = {id: null, user: "test", pass: "test"}
const NUEVO_PROYECTO_MOCK = {id: 0, "titulo": "test","usuario_id": USER_MOCK.id}
const TAG_MOCK = {"id":1,"titulo": "test","proyecto_id": 0}
const TODO_MOCK = {
	"id": 0,
	"titulo": "test1",
	"descripcion": "test2",
	"orden": 1,
	"completado": 0,
	"proyecto_id":0,
	"tag": [{id: TAG_MOCK.id}]
}


describe('01-todo-login', () => {
	it('Login', async () => {
		const login = await request(BASE_URL)
			.get('/login')
			.query(USER_MOCK)
			.expect(200)
		expect(login.body.username).toBe('test')
		USER_MOCK.id = login.body.id;
		NUEVO_PROYECTO_MOCK.usuario_id = login.body.id;
	});
});

// Revisar el id del usuario test
describe('02-todo-proyecto', () => {
	it('Crear un nuevo proyecto', async () => {
		const proyectoCreado = await request(BASE_URL)
			.post('/proyecto/createProyecto')
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(NUEVO_PROYECTO_MOCK)
			.send(USER_MOCK)
			.expect(200)
		expect(proyectoCreado.body[0].titulo).toBe("test");
		NUEVO_PROYECTO_MOCK.id = proyectoCreado.body[0].id;
		TAG_MOCK.proyecto_id = proyectoCreado.body[0].id;
		TODO_MOCK.proyecto_id = proyectoCreado.body[0].id;
	});
	it('Obtener todos los proyectos', async () => {
		const proyectoCreado = await request(BASE_URL)
			.get('/proyecto/getAllProyecto')
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(USER_MOCK)
			.expect(200)
		expect(proyectoCreado.body[0].titulo).toBe("test")
	});
});
describe('02-todo-tag', () => {
	it('Crear un tag', async () => {
		const tagCreado = await request(BASE_URL)
			.post('/tag/createTag/' + NUEVO_PROYECTO_MOCK.id)
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(TAG_MOCK)
			.send(USER_MOCK)
			.expect(201)
		expect(tagCreado.body[0].titulo).toBe("test");
		expect(tagCreado.body[0].proyecto_id).toBe(NUEVO_PROYECTO_MOCK.id);
		TAG_MOCK.id = tagCreado.body[0].id;
		TODO_MOCK.tag[0].id = tagCreado.body[0].id;
	});
	it('Updateo un tag', async () => {
		TAG_MOCK.titulo = "EDITADO";
		const tagCreado = await request(BASE_URL)
			.put('/tag/updateSimpleTag/' + NUEVO_PROYECTO_MOCK.id)
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send([TAG_MOCK])
			.send(USER_MOCK)
			.expect(200);
		expect(tagCreado.body[0].titulo).toBe("EDITADO");
		expect(tagCreado.body[0].proyecto_id).toBe(NUEVO_PROYECTO_MOCK.id);
	});
	// it('Eliminar un tag', async () => {
	// 	const tagCreado = await request(BASE_URL)
	// 		.delete('/tag/eliminarTag/' + TAG_MOCK.id)
	// 		.set("Content-Type","application/json")
	// 		.set('Authorization', JWT_MOCK)
	// 		.send(USER_MOCK)
	// 		.expect(200);
	// });
});
describe('02-todo-todo', () => {
	it('Crear un todo', async () => {
		const tagCreado = await request(BASE_URL)
			.post('/todo/createTodo/' + NUEVO_PROYECTO_MOCK.id)
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(TODO_MOCK)
			.send(USER_MOCK)
			.expect(201)
		expect(tagCreado.body[0].titulo).toBe("test1");
		expect(tagCreado.body[0].descripcion).toBe("test2");
		expect(tagCreado.body[0].orden).toBe(1);
		expect(tagCreado.body[0].completado).toBe(0);
		expect(tagCreado.body[0].tag[0].id).toBe(TAG_MOCK.id);
		expect(tagCreado.body[0].proyecto_id).toBe(NUEVO_PROYECTO_MOCK.id);
		TODO_MOCK.id = tagCreado.body[0].id;
	});
	it('Updateo un todo', async () => {
		TODO_MOCK.titulo = "EDITADO";
		console.log(TODO_MOCK, NUEVO_PROYECTO_MOCK)
		const tagCreado = await request(BASE_URL)
			.put('/todo/updateSimpleTodo/' + NUEVO_PROYECTO_MOCK.id)
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(TODO_MOCK)
			.expect(200);
		expect(tagCreado.body[0].titulo).toBe("EDITADO");
		expect(tagCreado.body[0].proyecto_id).toBe(NUEVO_PROYECTO_MOCK.id);
	});
	// it('Eliminar un tag', async () => {
	// 	const tagCreado = await request(BASE_URL)
	// 		.delete('/tag/eliminarTag/' + TAG_MOCK.id)
	// 		.set("Content-Type","application/json")
	// 		.set('Authorization', JWT_MOCK)
	// 		.send(USER_MOCK)
	// 		.expect(200);
	// });
});


describe('02-todo-borrar', () => {
	it('Eliminar el proyecto creado para test', async () => {
		const proyectoCreado = await request(BASE_URL)
			.delete('/proyecto/eliminarProyecto/'+ NUEVO_PROYECTO_MOCK.id)
			.set("Content-Type","application/json")
			.set('Authorization', JWT_MOCK)
			.send(USER_MOCK)
			.expect(200)
	});
});