import express from 'express';
import supertest from 'supertest';
import {
    generateCreateUserRequest,
    generateDeleteRequest,
    generateFetchAllRequest,
    generateFetchOneRequest,
    generatePatchRequest,
    generatePostRequest
} from '../requestGenerators';
import * as daoUtils from '../utils';
import * as auth0Utils from 'utils/auth0';
import http from 'http';
import { checkSchema } from 'express-validator';

jest.mock('auth0', () => ({
    AuthenticationClient: () => ({
        clientCredentialsGrant: () => ({ access_token: 'access' })
    }),
    ManagementClient: () => ({
        createUser: () => ({})
    })
}));

const CUSTOM_ROUTE = '/custom-route';

function createAppWithRouter(router) {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(CUSTOM_ROUTE, router);
    const server = http.createServer(app);
    server.listen(4321, () => {});
    return server;
}

describe('requestGenerators tests', () => {
    const model = {};
    let app;
    let router;

    beforeEach(() => {
        router = express.Router();
    });

    afterEach(() => {
        app?.close();
    });

    describe('generatePostRequest tests', () => {
        it('should generatePostRoute should perform success response', async () => {
            const reqBody = {
                name: 'Jane Doe'
            };
            const createSpy = jest
                .spyOn(daoUtils, 'createItem')
                .mockImplementation((_, body) => Promise.resolve(body));
            generatePostRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .post(CUSTOM_ROUTE)
                .set('Accept', 'application/json')
                .send(reqBody);
            expect(createSpy).toBeCalledWith(model, reqBody);
            expect(res.statusCode).toBe(200);
            expect(res.body.data).toEqual(reqBody);
        });

        it('should generatePostRoute should perform error response', async () => {
            const error = new Error('error in post router');
            jest.spyOn(daoUtils, 'createItem').mockImplementation(() => {
                throw error;
            });
            generatePostRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .post(CUSTOM_ROUTE)
                .set('Accept', 'application/json')
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body.error).toEqual(error.message);
        });

        it('should generatePostRoute with validators', async () => {
            jest.spyOn(daoUtils, 'createItem').mockImplementation(() => {});
            const testValidator = checkSchema({
                name: {
                    in: ['body'],
                    errorMessage: 'name must be defined',
                    isString: true
                }
            });
            generatePostRequest(router, model, testValidator);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .post(CUSTOM_ROUTE)
                .set('Accept', 'application/json')
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body.error[0].msg).toEqual('name must be defined');
        });
    });

    describe('generatePatchRequest tests', () => {
        it('should generate patch route that could return success response', async () => {
            const returnItem = { name: 'John Doe' };
            jest.spyOn(daoUtils, 'updateItem').mockResolvedValue(returnItem);
            generatePatchRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .patch(`${CUSTOM_ROUTE}/7`)
                .set('Accept', 'application/json')
                .send({ name: 'Jane Doe' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: returnItem });
        });

        it('should generate patch route that could return error response', async () => {
            const error = new Error('update route failed');
            jest.spyOn(daoUtils, 'updateItem').mockRejectedValue(error);
            generatePatchRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .patch(`${CUSTOM_ROUTE}/7`)
                .set('Accept', 'application/json')
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    describe('generateFetchAllRequest tests', () => {
        it('should generate route that could fetch all items', async () => {
            const returnItems = [{ name: 'John Doe' }];
            jest.spyOn(daoUtils, 'fetchItems').mockResolvedValue(returnItems);
            generateFetchAllRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .get(CUSTOM_ROUTE)
                .set('Accept', 'application/json')
                .send({});
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: returnItems });
        });

        it('should generate route that could return error response', async () => {
            const error = new Error("couldn't fetch items");
            jest.spyOn(daoUtils, 'fetchItems').mockRejectedValue(error);
            generateFetchAllRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .get(CUSTOM_ROUTE)
                .set('Accept', 'application/json')
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    describe('generateFetchOneRequest tests', () => {
        it('should generate get route that fetch single item', async () => {
            const returnItem = { name: 'sasuke' };
            jest.spyOn(daoUtils, 'fetchItem').mockResolvedValue(returnItem);
            generateFetchOneRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .get(`${CUSTOM_ROUTE}/7`)
                .set('Accept', 'application/json')
                .send({ name: 'shikamaru' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: returnItem });
        });

        it('should generate get route that could return error response', async () => {
            const error = new Error('update failed');
            jest.spyOn(daoUtils, 'fetchItem').mockRejectedValue(error);
            generateFetchOneRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .get(`${CUSTOM_ROUTE}/7`)
                .set('Accept', 'application/json')
                .send({});
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    describe('generateDeleteRequest tests', () => {
        it('should generate delete route that could delete item', async () => {
            const deleteRes = 'item delete sucess';
            jest.spyOn(daoUtils, 'deleteItem').mockResolvedValue(deleteRes);
            generateDeleteRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .delete(`${CUSTOM_ROUTE}/7`)
                .set('Accept', 'application/json');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: deleteRes });
        });

        it('should generate delete route that could return error response', async () => {
            const error = new Error('delete failed');
            jest.spyOn(daoUtils, 'deleteItem').mockRejectedValue(error);
            generateDeleteRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .delete(`${CUSTOM_ROUTE}/7`)
                .set('Accept', 'application/json');
            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });

    describe('generateCreateUserRequest tests', () => {
        it('should generate create user route that could give success response', async () => {
            const user = { email: 'mac@wednesday.is', password: 'macwed' };
            jest.spyOn(daoUtils, 'createUser').mockImplementation((_, body) =>
                Promise.resolve(body)
            );
            generateCreateUserRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .post(CUSTOM_ROUTE)
                .set('Access', 'application/json')
                .send(user);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: user });
        });

        it('should generate create user route that could give error response', async () => {
            const error = new Error('user create failed');
            jest.spyOn(auth0Utils, 'clientCredentialsGrant').mockImplementation(
                () => {
                    throw error;
                }
            );
            generateCreateUserRequest(router, model);
            app = createAppWithRouter(router);
            const res = await supertest(app)
                .post(CUSTOM_ROUTE)
                .set('Access', 'application/json')
                .send({});

            expect(res.statusCode).toBe(500);
            expect(res.body).toEqual({ error: error.message });
        });
    });
});
