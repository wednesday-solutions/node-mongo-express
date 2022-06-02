import supertest from 'supertest';
import app from 'server';
import * as daos from 'daos/order';

jest.mock('express-jwt', () => () => (req, res, next) => {
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

describe('aggregate tests', () => {
    const amt = 15000;
    const date = '2021-01-05';
    const category = 'Music';

    it('should throw error when authorization token is not sent in header', async () => {
        const res = await supertest(app)
            .get('/aggregate/order-amount')
            .set({
                Accept: 'application/json'
            })
            .send({});

        expect(res.statusCode).toBe(401);
    });

    it('should throw an error when date is not sent in query params', async () => {
        const res = await supertest(app)
            .get('/aggregate/order-amount')
            .set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            })
            .send({});

        expect(res.statusCode).toBe(500);
        expect(res.error.text).toBe('{"error":"Add a valid date"}');
    });

    it('should throw an error when an invalid date format is sent in query params', async () => {
        const res = await supertest(app)
            .get('/aggregate/order-amount?date=2021-01-0505:00')
            .set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            })
            .send({});

        expect(res.statusCode).toBe(500);
        expect(res.error.text).toBe('{"error":"Add a valid date"}');
    });
    it('should return total order amount for date sent in query', async () => {
        const totalAmtForDateSpy = jest
            .spyOn(daos, 'totalAmtForDate')
            .mockResolvedValueOnce(amt);
        const res = await supertest(app)
            .get(`/aggregate/order-amount?date=${date}`)
            .set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            })
            .send({});
        expect(totalAmtForDateSpy).toBeCalledWith(date);
        expect(res.body.data.totalOrderAmount).toBe(amt);
        expect(res.statusCode).toBe(200);
    });
    it('should return total order amount by date for category sent in query', async () => {
        const totalByDateForCategorySpy = jest
            .spyOn(daos, 'totalByDateForCategory')
            .mockResolvedValueOnce(amt);
        const res = await supertest(app)
            .get(`/aggregate/order-amount?date=${date}&category=${category}`)
            .set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            })
            .send({});
        expect(totalByDateForCategorySpy).toBeCalledWith(date, category);
        expect(res.body.data.totalOrderAmount).toBe(amt);
        expect(res.statusCode).toBe(200);
    });
});
