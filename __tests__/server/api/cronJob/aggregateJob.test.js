import moment from 'moment';
import * as orderFns from 'api/orders';
import * as categoryFns from 'api/products';
import { redis } from 'services/redis';
import { REDIS_IMPLEMENTATION_DATE } from 'utils/constants';
import { aggregateCheck } from 'api/cronJob/aggregateJob';
import { mockData } from 'utils/mockData';
import log from 'utils/logger';

const { MOCK_CATEGORIES: mockCategories } = mockData;
describe('aggregateCheck function tests', () => {
    const date = moment(REDIS_IMPLEMENTATION_DATE).subtract(1, 'day');
    const amt = 25000;
    const count = 1500;
    const mockError = new Error('Mock Error');

    beforeEach(() => {
        jest.spyOn(orderFns, 'getEarliestOrderCreatedDate').mockResolvedValue(
            date
        );
        jest.spyOn(categoryFns, 'getCategories').mockImplementation(
            () => mockCategories
        );
        jest.spyOn(orderFns, 'getTotalOrderAmtForDate').mockResolvedValue(amt);
        jest.spyOn(orderFns, 'getTotalOrderCountByDate').mockResolvedValue(
            count
        );
        jest.spyOn(
            orderFns,
            'getTotalOrderAmtByDateForCategory'
        ).mockResolvedValue(amt);
        jest.spyOn(
            orderFns,
            'getTotalOrderCountByDateForCategory'
        ).mockResolvedValue(count);
    });
    it('should set values in redis if lastSyncFor date is not present', async () => {
        jest.spyOn(redis, 'get').mockResolvedValue();
        const redisSpy = jest.spyOn(redis, 'set');
        await aggregateCheck();
        expect(redisSpy).toBeCalledTimes(7);
    });

    it('should log redis is upto date when lastSyncFor date is same or after the redis implementation date', async () => {
        const redisSpy = jest
            .spyOn(redis, 'get')
            .mockResolvedValue(REDIS_IMPLEMENTATION_DATE);
        const spy = jest.spyOn(log, 'info');

        await aggregateCheck();
        expect(redisSpy).toBeCalledTimes(1);
        expect(spy).toBeCalledTimes(1);
    });

    it('should set values in redis if the lastSync date is less than end date', async () => {
        jest.spyOn(redis, 'get').mockResolvedValue(date);
        const redisSpy = jest.spyOn(redis, 'set');
        await aggregateCheck();
        expect(redisSpy).toBeCalledTimes(7);
    });

    it('should thrown an error if there is error thrown from db', async () => {
        jest.spyOn(redis, 'get').mockRejectedValueOnce(mockError);
        expect(async () => {
            await aggregateCheck();
        }).rejects.toThrow(mockError);
    });
});
