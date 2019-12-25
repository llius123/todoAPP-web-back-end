import request = require('supertest');

import done = require('supertest');
import { environment } from '../../environments/environment';

const BASE_URL = 'http://localhost:3000';



describe('01-todo', () => {
	it('Get all proyecto', async () => {
        const login = await request(environment.testBaseUrl)
			.get('/login')
			.query({user: "test", pass: "test"})
			.expect(200)
		expect(login.body).toBe({ username: 'test',
		access_token:
		 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNTc3MjcyNTM1LCJleHAiOjE1NzcyNzI1OTV9.HgYPIqejU-6iCP78l2vaqF_2dgOFTt15VW0vsUE_8xM' })
		// console.log(login.body)
    });
    // it('Get all proyecto', async () => {
    //     await request(environment.testBaseUrl)
    //         .get('/proyecto/getAllProyecto')
    //         .set('Authorization', environment.testJwt)
    //         .send({})
	// 		.expect(200,{
	// 			"username": "test",
	// 			"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwicGFzc3dvcmQiOiJ0ZXN0IiwiaWF0IjoxNTc1Mjc1MDI0LCJleHAiOjE1NzUyNzUwODR9.7NWBK9xFQEDVUBCpvPk69sMdJwtBHjdNhUt__jS7i8o"
	// 		})
    // });
});
