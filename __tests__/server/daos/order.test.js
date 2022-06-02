import {
    countByDate,
    countByDateForCategory,
    createNewOrder,
    earliestCreatedDate,
    totalAmtForDate,
    totalByDateForCategory
} from 'daos/order';
import { Orders } from 'models/orders';
import { mockData } from 'utils/mockData';
import moment from 'moment';
const {
    MOCK_TOTAL_AMT: mockTotalAmt,
    MOCK_TOTAL_COUNT: mockTotalCount,
    MOCK_ORDER: mockOrder,
    MOCK_ORDER_DETAILS: mockOrderDetails
} = mockData;
describe('Order daos tests', () => {
    const date = '1994-10-24';
    const model = 'orders';
    const category = 'Sports';
    const mockError = new Error('Mock Error');
    let mockingoose;
    beforeEach(() => {
        mockingoose = require('mockingoose');
    });

    describe('createNewOrder function test', () => {
        it('should ensure it return 200 and create a new order', async () => {
            jest.spyOn(Orders, 'create').mockImplementationOnce(
                () => mockOrderDetails
            );
            const res = await createNewOrder(mockOrder);
            expect(res).toBe(mockOrderDetails);
        });

        it('should throw an error from catch block', async () => {
            jest.spyOn(Orders, 'create').mockImplementationOnce(() => {
                throw mockError;
            });
            expect(async () => {
                await createNewOrder(mockOrder);
            }).rejects.toThrow(mockError);
        });
    });
    describe('totalAmtForDate function tests', () => {
        it('should return total amount for the day', async () => {
            mockingoose(model).toReturn(mockTotalAmt, 'aggregate');
            const res = await totalAmtForDate(date);
            expect(res).toBe(mockTotalAmt[0].totalPrice);
        });

        it('should throw an error if an error is thrown from db', async () => {
            mockingoose(model).toReturn(mockError, 'aggregate');
            expect(async () => {
                await totalAmtForDate(date);
            }).rejects.toThrow(mockError);
        });
        it('should return total amount as 0 for the day as no order is placed on that day', async () => {
            mockingoose(model).toReturn([], 'aggregate');
            const res = await totalAmtForDate(date);
            expect(res).toBe(0);
        });
    });

    describe('earliestCreatedDate functions', () => {
        it('should return the date of the first order', async () => {
            mockingoose(model).toReturn({}, 'findOne');
            const res = await earliestCreatedDate();
            expect(res).toBe(moment.utc().format('YYYY-MM-DD'));
        });
        it('should throw an error if an error is thrown from db', async () => {
            mockingoose(model).toReturn(mockError, 'findOne');
            expect(async () => {
                await earliestCreatedDate();
            }).rejects.toThrow(mockError);
        });
    });

    describe('totalByDateForCategory functions tests', () => {
        it('should return total amt for the day for a category', async () => {
            mockingoose(model).toReturn(mockTotalAmt, 'aggregate');
            const res = await totalByDateForCategory(date, category);
            expect(res).toBe(mockTotalAmt[0].totalPrice);
        });

        it('should throw an error if an error is thrown from db', async () => {
            mockingoose(model).toReturn(mockError, 'aggregate');
            expect(async () => {
                await totalByDateForCategory(date, category);
            }).rejects.toThrow(mockError);
        });
        it('should return total amt as 0 for the day for a category as no order is placed for that category on that day', async () => {
            mockingoose(model).toReturn([], 'aggregate');
            const res = await totalByDateForCategory(date, category);
            expect(res).toBe(0);
        });
    });

    describe('countByDate funnction tests', () => {
        it('should return the total count of order for the day', async () => {
            mockingoose(model).toReturn(mockTotalCount, 'aggregate');
            const res = await countByDate(date);
            expect(res).toBe(mockTotalCount[0].totalOrder);
        });

        it('should throw an error if db throws an error', async () => {
            mockingoose(model).toReturn(mockError, 'aggregate');
            expect(async () => {
                await countByDate(date);
            }).rejects.toThrow(mockError);
        });

        it('should return the total count of order as 0 for the day as no order is placed on that date', async () => {
            mockingoose(model).toReturn([], 'aggregate');
            const res = await countByDate(date);
            expect(res).toBe(0);
        });
    });

    describe('countByDateForCategory functions tests', () => {
        it('should return count for the day for a category', async () => {
            mockingoose(model).toReturn(mockTotalCount, 'aggregate');
            const res = await countByDateForCategory(date, category);
            expect(res).toBe(mockTotalCount[0].totalOrder);
        });

        it('should throw an error if an error is thrown from db ', async () => {
            mockingoose(model).toReturn(mockError, 'aggregate');
            expect(async () => {
                await countByDateForCategory(date, category);
            }).rejects.toThrow(mockError);
        });

        it('should return count for the day for a category as 0 as no order was placed for that category on that day', async () => {
            mockingoose(model).toReturn([], 'aggregate');
            const res = await countByDateForCategory(date, category);
            expect(res).toBe(0);
        });
    });
});
