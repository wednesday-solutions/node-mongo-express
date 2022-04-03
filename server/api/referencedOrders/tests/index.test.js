import supertest from 'supertest';
import express from 'express';
import http from 'http';
import { fetchAllReferencedOrders } from '..';

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

describe('fetchAllReferencedOrders tests', () => {
    let app;
    let router;
    let model;

    afterEach(() => {
        app.close();
    });

    beforeAll(() => {
        router = express.Router();
        model = {};
        model.find = jest.fn().mockReturnValue(model);
        model.select = jest.fn().mockReturnValue(model);
        model.populate = jest.fn().mockReturnValue(model);
        model.skip = jest.fn().mockReturnValue(model);
        model.limit = jest.fn().mockReturnValue([{ item: 'parcel-mongo' }]);
    });
    it('should fetch all referenced orders', async () => {
        fetchAllReferencedOrders(router, model);
        app = createAppWithRouter(router);
        const res = await supertest(app)
            .get(CUSTOM_ROUTE)
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
    });

    it('should fail to fetch all referenced orders if something goes wrong', async () => {
        const error = new Error('unable to fetch referenced orders');
        model.find = jest.fn(() => {
            throw error;
        });
        fetchAllReferencedOrders(router, model, {});
        app = createAppWithRouter(router);
        const res = await supertest(app)
            .get(CUSTOM_ROUTE)
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe(error.message);
    });
});
