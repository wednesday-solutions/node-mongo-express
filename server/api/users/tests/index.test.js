import supertest from 'supertest';
import * as requests from 'api/requestGenerators';
import Users from 'models/users';
import userValidator from '../validator';
import app from 'server';
import { createUser } from '../index';
import * as daos from 'api/utils';
import { mockData } from 'utils/mockData';
const { MOCK_USER: mockUser } = mockData;

jest.mock('auth0', () => ({
    AuthenticationClient: () => ({
        clientCredentialsGrant: () => ({ access_token: 'access' })
    }),
    ManagementClient: () => ({
        createUser: () => ({ user_id: 'auth0|12345678' })
    })
}));

describe('User tests', () => {
    it('should called createUser with correct parameter', async () => {
        let spy = jest
            .spyOn(requests, 'generateCreateUserRequest')
            .mockImplementationOnce(() => jest.fn());
        createUser(app, Users.Users, userValidator);
        expect(spy).toHaveBeenCalledWith(app, Users.Users, userValidator);
    });

    it('should call the create user api', async () => {
        jest.spyOn(daos, 'createUser').mockResolvedValueOnce({
            _doc: mockUser
        });
        const res = await supertest(app)
            .post('/users')
            .set('Accept', 'application/json')
            .send({
                firstName: 'Jhon',
                lastName: 'Doe',
                email: 'doe12@wednesday.is',
                password: 'wednesday@1234567'
            });
        expect(res.status).toEqual(200);
        expect(res.body.data).toEqual(mockUser);
    });

    it('should call the create user api and throw error', async () => {
        jest.spyOn(daos, 'createUser').mockResolvedValueOnce(mockUser);
        const res = await supertest(app)
            .post('/users')
            .set('Accept', 'application/json')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(JSON.stringify(res.body.error)).toContain('must be present');
    });

    it('should call the create user and throw error', async () => {
        jest.spyOn(daos, 'createUser').mockRejectedValueOnce(
            new Error('User already exists!')
        );
        const res = await supertest(app)
            .post('/users')
            .set('Accept', 'application/json')
            .send({
                firstName: 'Jhon',
                lastName: 'Doe',
                email: 'doe12@wednesday.is',
                password: 'wednesday@1234567'
            });
        expect(res.statusCode).toBe(500);
        expect(res.error.text).toEqual('{"error":"User already exists!"}');
    });
});
