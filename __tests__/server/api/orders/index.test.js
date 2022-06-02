import supertest from 'supertest';
import app from 'server';
import {
    getTotalOrderCountByDate,
    getTotalOrderCountByDateForCategory,
    getEarliestOrderCreatedDate,
    getTotalOrderAmtForDate,
    getTotalOrderAmtByDateForCategory
} from 'api/orders';
import { updateOrderDetailInRedis } from 'api/orders/updateRedis';
import * as daos from 'daos/order';
import * as updateRedis from 'api/orders/updateRedis';
import { redis } from 'services/redis';
import { mockData } from 'utils/mockData';
const { MOCK_ORDER_DETAILS: mockOrderDetails, MOCK_ORDER: mockOrder } =
    mockData;

describe('Order  tests', () => {
    const date = '1994-10-24';
    const amt = 25000;
    const category = 'Sports';
    const mockError = new Error('Mock Error');
    const count = 1500;

    describe('getEarliestOrderCreatedDate function tests', () => {
        it('should return date of the earliest order', async () => {
            const spy = jest
                .spyOn(daos, 'earliestCreatedDate')
                .mockResolvedValueOnce(date);
            let res = await getEarliestOrderCreatedDate();
            expect(spy).toBeCalledTimes(1);
            expect(res).toBe(date);
        });

        it('should  throw error it the error is thrown from db', async () => {
            jest.spyOn(daos, 'earliestCreatedDate').mockRejectedValueOnce(
                mockError
            );
            expect(async () => {
                await getEarliestOrderCreatedDate();
            }).rejects.toThrowError(mockError);
        });
    });

    describe('getTotalOrderAmtForDate function tests', () => {
        it('should return total amount for  the day', async () => {
            const spy = jest
                .spyOn(daos, 'totalAmtForDate')
                .mockResolvedValueOnce(amt);
            const totalAmount = await getTotalOrderAmtForDate(date);
            expect(spy).toBeCalledWith(date);
            expect(totalAmount).toBe(amt);
        });

        it('should throw an error if an error is thrown from db ', async () => {
            jest.spyOn(daos, 'totalAmtForDate').mockRejectedValue(mockError);
            expect(async () => {
                await getTotalOrderAmtForDate(date);
            }).rejects.toThrow();
        });
    });

    describe('getTotalOrderAmtByDateForCategory function tests', () => {
        it('should return total amount for the day for a category', async () => {
            const spy = jest
                .spyOn(daos, 'totalByDateForCategory')
                .mockResolvedValueOnce(amt);
            const res = await getTotalOrderAmtByDateForCategory(date, category);
            expect(spy).toBeCalledWith(date, category);
            expect(spy).toBeCalledTimes(1);
            expect(res).toBe(amt);
        });

        it('should throw an error if an error is thrown from db', async () => {
            jest.spyOn(daos, 'totalByDateForCategory').mockRejectedValueOnce(
                mockError
            );
            expect(async () => {
                await getTotalOrderAmtByDateForCategory(date, category);
            }).rejects.toThrow(mockError);
        });
    });

    describe('getTotalOrderCountByDate function tests', () => {
        it('should return the count of order for the day ', async () => {
            const spy = jest
                .spyOn(daos, 'countByDate')
                .mockResolvedValueOnce(count);
            const res = await getTotalOrderCountByDate(date);
            expect(spy).toBeCalledTimes(1);
            expect(spy).toBeCalledWith(date);
            expect(res).toBe(count);
        });

        it('should throw an error if an error is thrown from db', async () => {
            jest.spyOn(daos, 'countByDate').mockRejectedValueOnce(mockError);
            expect(async () => {
                await getTotalOrderCountByDate(date);
            }).rejects.toThrow(mockError);
        });
    });

    describe('getTotalOrderCountByDateForCategory functions tests', () => {
        it('should return count for the day for  a category', async () => {
            const spy = jest
                .spyOn(daos, 'countByDateForCategory')
                .mockResolvedValueOnce(count);
            const res = await getTotalOrderCountByDateForCategory(
                date,
                category
            );
            expect(spy).toBeCalledTimes(1);
            expect(spy).toBeCalledWith(date, category);
            expect(res).toBe(count);
        });

        it('should throw an error if an error is thrown  from db', async () => {
            jest.spyOn(daos, 'countByDateForCategory').mockRejectedValueOnce(
                mockError
            );
            expect(async () => {
                await getTotalOrderCountByDateForCategory(date, category);
            }).rejects.toThrow(mockError);
        });
    });

    describe('updateOrderDetailInRedis function tests', () => {
        it('should update the redis whenever a new order is placed', async () => {
            const getSpy = jest.spyOn(redis, 'get');
            const setSpy = jest.spyOn(redis, 'set');
            await updateOrderDetailInRedis(mockOrderDetails);
            expect(getSpy).toBeCalledTimes(2);
            expect(setSpy).toBeCalledTimes(2);
        });
    });

    describe('createOrder api tests', () => {
        it('should create a new order and save it to db', async () => {
            jest.spyOn(
                updateRedis,
                'updateOrderDetailInRedis'
            ).mockImplementation(() => {});
            jest.spyOn(daos, 'createNewOrder').mockResolvedValueOnce(
                mockOrderDetails
            );

            const res = await supertest(app)
                .post('/orders')
                .send(mockOrder)
                .set('Accept', 'application/json');

            expect(res.statusCode).toBe(200);
            expect(res.body.data).toStrictEqual(
                expect.objectContaining(mockOrderDetails)
            );
        });

        it('should ensure it return validation error when proper parameter are not passed', async () => {
            const res = await supertest(app).post('/orders').send({}).set({
                Accept: 'application/json',
                Authorization: 'Bearer dummy-token'
            });
            expect(res.status).toBe(400);
        });
        it('should return error from catch block', async () => {
            const mockError = new Error({ message: 'test' });
            jest.spyOn(
                updateRedis,
                'updateOrderDetailInRedis'
            ).mockImplementation(() => {});
            jest.spyOn(daos, 'createNewOrder').mockImplementationOnce(() => {
                throw mockError;
            });

            const res = await supertest(app)
                .post('/orders')
                .send(mockOrder)
                .set('Accept', 'application/json');
            expect(res.error.text).toBe('{"error":"[object Object]"}');
        });
    });
});
