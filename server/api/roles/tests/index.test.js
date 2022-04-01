import supertest from 'supertest';
import app from 'server';
import { mockData } from 'utils/mockData';
const { MOCK_ROLE: mockRole } = mockData;

jest.mock('express-jwt', () => {
    const mockFunc = (req, res, next) => {
        req['user'] = {
            'https://express-demo/roles': ['ADMIN', 'SUPER_ADMIN']
        };
        next();
    };

    return jest.fn(() => mockFunc);
});

jest.mock('auth0', () => ({
    AuthenticationClient: () => ({
        clientCredentialsGrant: () => ({ access_token: 'access' })
    }),
    ManagementClient: () => ({
        createRole: () => mockRole.data
    })
}));
describe('roles endpoint tests', () => {
    // beforeEach(() => jest.resetAllMocks());

    it('should throw an error when correct parameters are not passed', async () => {
        const res = await supertest(app)
            .post('/roles')
            .set('Accept', 'application/json')
            .send({});
        expect(res.statusCode).toBe(500);
        expect(res.error.text).toBe('{"error":"Invalid role name."}');
    });

    it('should throw an error when invalid role is passed', async () => {
        const res = await supertest(app)
            .post('/roles')
            .set('Accept', 'application/json')
            .send({
                name: 'Manager',
                description: 'Managing the user data.'
            });
        expect(res.statusCode).toBe(500);
        expect(res.error.text).toBe('{"error":"Invalid role name."}');
    });
    it('should create role when valid role and all parameters are passed', async () => {
        const res = await supertest(app)
            .post('/roles')
            .set('Accept', 'application/json')
            .send({
                name: 'SUPER_ADMIN',
                description: 'Can access all data.'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockRole);
    });
});
