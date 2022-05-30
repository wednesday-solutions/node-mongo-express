import supertest from 'supertest';
import app from 'server';

jest.mock('middlewares/checkRole', () => {
    const mockFunc = (req, res, next) => {
        req.route = { path: '/assign-roles/' };
        next();
    };

    return mockFunc;
});

jest.mock('express-jwt', () => secret => (req, res, next) => {
    if (!req?.headers['authorization']) {
        return res.status(401).json({});
    }
    req['user'] = {
        'https://express-demo/roles': ['SUPER_ADMIN']
    };
    next(null, {});
});

jest.mock('auth0', () => ({
    AuthenticationClient: () => ({
        clientCredentialsGrant: () => ({ access_token: 'access' })
    }),
    ManagementClient: () => ({
        createUser: () => ({ user_id: 'auth0|12345678' }),
        getRole: () => [
            { id: 1, name: 'ADMIN' },
            { id: 2, name: 'SUPER_ADMIN' }
        ],
        assignRolestoUser: jest.fn()
    })
}));
describe('assignRoles tests ', () => {
    it('should esnure it return 401 when no authorization token is passed', async () => {
        const res = await supertest(app)
            .put('/assign-roles')
            .set('Accept', 'application/json')
            .send({
                authId: 'auth0|623e8f868ffd8b007',
                role: ['ADMIN', 'SUPER_ADMIN']
            });
        expect(res.error.status).toBe(401);
    });
    it('should ensure it return 200 when correct authorization token and parameters are  passed', async () => {
        const res = await supertest(app)
            .put('/assign-roles')
            .set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            })
            .send({
                authId: 'auth0|623e8f868ffd8b007',
                role: ['SUPER_ADMIN']
            });
        expect(res.body.data.message).toBe('Role updated successfully');
    });

    it('should throw error when correct parameter is not passes', async () => {
        const res = await supertest(app)
            .put('/assign-roles')
            .set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            })
            .send({
                role: ['ADMIN', 'SUPER_ADMIN']
            });
        expect(res.statusCode).toBe(500);
        expect(res.error.text).toBe(
            '{"error":"user auth0 id must be present"}'
        );
    });
});
