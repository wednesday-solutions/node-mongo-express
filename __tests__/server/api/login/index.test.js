jest.mock('node-fetch');
import supertest from 'supertest';
import fetch from 'node-fetch';
const { Response } = jest.requireActual('node-fetch');

import app from 'server';
import { mockData } from 'utils/mockData';
const { MOCK_USER_LOGIN: mockUserLogin } = mockData;

describe('login endpoint tests', () => {
    it('should throw an error whan correct parameters are not passsed', async () => {
        const res = await supertest(app)
            .post('/login')
            .send({})
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(500);
        expect(res.error.text).toBe('{"error":"username must be present"}');
    });
    it('should ensure it return 200 and gives token in the response ', async () => {
        fetch.mockReturnValue(
            Promise.resolve(
                new Response(
                    '{"access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXV","scope": "read:current_user","expires_in": 864009,"token_type": "Bearer"}'
                )
            )
        );
        const res = await supertest(app)
            .post('/login')
            .send({
                username: 'doe@wednesday.is',
                password: 'doe@12345'
            })
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUserLogin);
    });
});
