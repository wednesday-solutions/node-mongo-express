import supertest from 'supertest';
import app from 'server';
import { mockData } from 'utils/mockData';
import kebabCase from 'lodash/kebabCase';

const { MOCK_UNSHARDED_REFERENCED_ORDERS: mockUnshardedReferencedOrders } =
    mockData;

describe('fetchAllUnshardedReferencedOrders tests', () => {
    let MODEL_NAME;
    let ENDPOINT;
    let mockingoose;

    beforeAll(() => {
        MODEL_NAME = 'unsharded_referenced_orders';
        ENDPOINT = `/${kebabCase(MODEL_NAME)}`;
    });

    beforeEach(() => {
        mockingoose = require('mockingoose');
    });
    it('should fetch all unsharded referenced orders', async () => {
        mockingoose(MODEL_NAME).toReturn(
            mockUnshardedReferencedOrders.data,
            'find'
        );
        const res = await supertest(app)
            .get(ENDPOINT)
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(mockUnshardedReferencedOrders);
    });

    it('should fail to fetch if something goes wrong', async () => {
        const error = new Error('unable to fetch unsharded referenced orders');
        mockingoose(MODEL_NAME).toReturn(error, 'find');
        const res = await supertest(app)
            .get(ENDPOINT)
            .set('Accept', 'application/json');

        expect(res.statusCode).toBe(500);
        expect(res.body.error).toBe(error.message);
    });
});
