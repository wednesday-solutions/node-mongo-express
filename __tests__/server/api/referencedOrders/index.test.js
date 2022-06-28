import supertest from 'supertest';
import kebabCase from 'lodash/kebabCase';
import app from 'server';
import { mockData } from 'utils/mockData';

const { MOCK_UNSHARDED_REFERENCED_ORDERS: mockReferencedOrders } = mockData;
jest.mock('middlewares/auth', () => ({
    checkJwt: (req, res, next) => {
        next();
    }
}));
describe('fetchAllReferencedOrders tests', () => {
    let MODEL_NAME;
    let ENDPOINT;
    let mockingoose;

    beforeAll(() => {
        MODEL_NAME = 'referencedOrders';
        ENDPOINT = `/${kebabCase(MODEL_NAME)}`;
    });

    beforeEach(() => {
        mockingoose = require('mockingoose');
    });

    it('should fetch all referenced orders', async () => {
        mockingoose(MODEL_NAME).toReturn(mockReferencedOrders.data, 'find');
        const res = await supertest(app)
            .get(ENDPOINT)
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockReferencedOrders);
    });

    it('should fail to fetch all referenced orders if something goes wrong', async () => {
        const error = new Error('unable to fetch referenced orders');
        mockingoose(MODEL_NAME).toReturn(error, 'find');

        const res = await supertest(app)
            .get(ENDPOINT)
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe(error.message);
    });
});
