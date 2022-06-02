import { redis } from 'services/redis';
import { mockData } from 'utils/mockData';
import { getAllCategories } from 'daos/product';

const { MOCK_CATEGORIES: mockCategories } = mockData;
describe('Products dao tests', () => {
    let mockingoose;
    let model = 'products';
    let mockError = new Error('Mock Error');
    beforeEach(() => {
        mockingoose = require('mockingoose');
    });
    describe('getAllCategory functions tests', () => {
        it('should return all categories and set value in redis', async () => {
            jest.spyOn(redis, 'get').mockResolvedValueOnce('');
            jest.spyOn(redis, 'set');
            mockingoose(model).toReturn(mockCategories, 'distinct');
            const res = await getAllCategories();
            expect(res).toBe(mockCategories);
        });

        it('should return all categriesfrom redis', async () => {
            jest.spyOn(redis, 'get').mockImplementation(() =>
                JSON.stringify(mockCategories)
            );
            const res = await getAllCategories();
            expect(res).toEqual(mockCategories);
        });

        it('should  throw an error when an error is thrown form db', async () => {
            jest.spyOn(redis, 'get').mockResolvedValueOnce('');
            mockingoose(model).toReturn(mockError, 'distinct');
            expect(async () => {
                await getAllCategories();
            }).rejects.toThrow(mockError);
        });
    });
});
