import supertest from 'supertest';
import * as daoUtils from '../utils';
import app from 'server';
jest.mock('middlewares/auth', () => ({
    checkJwt: (req, res, next) => {
        next();
    }
}));

jest.mock('auth0', () => ({
    AuthenticationClient: () => ({
        clientCredentialsGrant: () => ({ access_token: 'access' })
    }),
    ManagementClient: () => ({
        createUser: () => ({})
    })
}));

jest.mock('express-jwt', () => secret => (req, res, next) => {
    if (!req?.headers['authorization']) {
        return res.status(401).json({});
    }
    req['user'] = {
        'https://express-demo/roles': ['SUPER_ADMIN']
    };
    next(null, {});
});

describe('requestGenerators tests', () => {
    let ENDPOINT;

    beforeAll(() => {
        ENDPOINT = '/products';
    });
    describe('generatePostRequest tests', () => {
        it('should generatePostRoute should perform success response', async () => {
            const reqBody = {
                name: 'Jane Doe'
            };
            const createSpy = jest
                .spyOn(daoUtils, 'createItem')
                .mockImplementation((_, body) => Promise.resolve(body));

            const res = await supertest(app)
                .post(ENDPOINT)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send(reqBody);
            expect(res.statusCode).toBe(200);
            expect(createSpy).toBeCalled();
            expect(res.body.data).toEqual(reqBody);
        });

        it('should generatePostRoute should perform error response', async () => {
            const error = new Error('error in post router');
            jest.spyOn(daoUtils, 'createItem').mockImplementation(() => {
                throw error;
            });

            const res = await supertest(app)
                .post(ENDPOINT)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body.error).toEqual(error.message);
        });
    });

    describe('generatePatchRequest tests', () => {
        it('should generate patch route that could return success response', async () => {
            const returnItem = { name: 'John Doe' };
            jest.spyOn(daoUtils, 'updateItem').mockResolvedValue(returnItem);

            const res = await supertest(app)
                .patch(`${ENDPOINT}/7`)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send({ name: 'Jane Doe' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: returnItem });
        });

        it('should generate patch route that could return error response', async () => {
            const error = new Error('update route failed');
            jest.spyOn(daoUtils, 'updateItem').mockRejectedValue(error);

            const res = await supertest(app)
                .patch(`${ENDPOINT}/7`)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    describe('generateFetchAllRequest tests', () => {
        it('should generate route that could fetch all items', async () => {
            const returnItems = [{ name: 'John Doe' }];
            jest.spyOn(daoUtils, 'fetchItems').mockResolvedValue(returnItems);

            const res = await supertest(app)
                .get(ENDPOINT)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send({});
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: returnItems });
        });

        it('should generate route that could return error response', async () => {
            const error = new Error("couldn't fetch items");
            jest.spyOn(daoUtils, 'fetchItems').mockRejectedValue(error);

            const res = await supertest(app)
                .get(ENDPOINT)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    describe('generateFetchOneRequest tests', () => {
        it('should generate get route that fetch single item', async () => {
            const returnItem = { name: 'sasuke' };
            jest.spyOn(daoUtils, 'fetchItem').mockResolvedValue(returnItem);

            const res = await supertest(app)
                .get(`${ENDPOINT}/7`)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send({ name: 'shikamaru' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: returnItem });
        });

        it('should generate get route that could return error response', async () => {
            const error = new Error('update failed');
            jest.spyOn(daoUtils, 'fetchItem').mockRejectedValue(error);

            const res = await supertest(app)
                .get(`${ENDPOINT}/7`)
                .set({
                    Accept: 'application/json',
                    Authorization: 'Bearer dummy-token'
                })
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    describe('generateDeleteRequest tests', () => {
        it('should generate delete route that could delete item', async () => {
            const deleteRes = 'item delete sucess';
            jest.spyOn(daoUtils, 'deleteItem').mockResolvedValue(deleteRes);

            const res = await supertest(app).delete(`${ENDPOINT}/7`).set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: deleteRes });
        });

        it('should generate delete route that could return error response', async () => {
            const error = new Error('delete failed');
            jest.spyOn(daoUtils, 'deleteItem').mockRejectedValue(error);

            const res = await supertest(app).delete(`${ENDPOINT}/7`).set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            });
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });
});
