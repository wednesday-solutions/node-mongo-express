import { getCategories } from '../index';
import * as daos from 'daos/product';
import { mockData } from 'utils/mockData';

const { MOCK_CATEGORIES: mockCategories } = mockData;

describe('categories functions tests', () => {
    it('should return all the distinct categories', async () => {
        const spy = jest
            .spyOn(daos, 'getAllCategories')
            .mockResolvedValueOnce(mockCategories);
        const res = await getCategories();
        expect(res).toBe(mockCategories);
        expect(spy).toBeCalledTimes(1);
    });

    it('should thrown an error if an error  is thrown from db', async () => {
        let mockError = new Error('Mock Error');
        jest.spyOn(daos, 'getAllCategories').mockRejectedValueOnce(mockError);
        expect(async () => {
            await getCategories();
        }).rejects.toThrow(mockError);
    });
});
