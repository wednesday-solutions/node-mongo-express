import {
    createItem,
    createUser,
    deleteItem,
    fetchItem,
    fetchItems,
    updateItem
} from '../utils';

describe('utils tests', () => {
    describe('createItem tests', () => {
        it('should createItem successfully create and return item', async () => {
            const model = {
                create: jest.fn(args => Promise.resolve(args))
            };
            const args = { name: 'madara' };
            const item = await createItem(model, args);
            expect(model.create).toBeCalledWith(args);
            expect(item).toEqual(args);
        });

        it('should createItem fail and throw error', async () => {
            const error = new Error('unable to create item');
            const model = {
                create: jest.fn(() => {
                    throw error;
                })
            };
            expect(() => createItem(model)).rejects.toThrow(error);
        });
    });

    describe('fetchItems tests', () => {
        let items;
        let model;

        beforeAll(() => {
            items = [{ name: 'kakashi' }];
        });

        beforeEach(() => {
            model = {};
            model.limit = jest.fn().mockResolvedValue(items);
            model.skip = jest.fn().mockReturnValue(model);
            model.find = jest.fn().mockReturnValue(model);
        });
        it('should fetchItems fetch items with no limit and page passed', async () => {
            const resItems = await fetchItems(model, {});
            expect(resItems).toEqual(items);
            expect(model.find).toBeCalled();
            expect(model.skip).toBeCalledWith(0);
            expect(model.limit).toBeCalledWith(100);
        });

        it('should fetchItems with correct page and limit parameters', async () => {
            const resItems = await fetchItems(model, { limit: 10, page: 1 });
            expect(resItems).toEqual(items);
            expect(model.find).toBeCalled();
            expect(model.skip).toBeCalledWith(10);
            expect(model.limit).toBeCalledWith(10);
        });

        it('should fetchItems should limit the limit parameter <100', async () => {
            const resItems = await fetchItems(model, { limit: 200, page: 1 });
            expect(resItems).toEqual(items);
            expect(model.find).toBeCalled();
            expect(model.skip).toBeCalledWith(100);
            expect(model.limit).toBeCalledWith(100);
        });

        it('should fetchItems fail to fetch and return items', async () => {
            const error = new Error('unable to fetch items');
            const model = {
                find: jest.fn(() => {
                    throw error;
                })
            };
            expect(() => fetchItems(model, {})).rejects.toThrow(error);
        });
    });

    describe('fetchItem tests', () => {
        it('should fetchItem successfully fetch and return item', async () => {
            const model = {
                findOne: jest.fn(args => Promise.resolve(args))
            };
            const args = { name: 'itachi' };
            const item = await fetchItem(model, args);
            expect(model.findOne).toBeCalledWith(args);
            expect(item).toEqual(args);
        });

        it('should fetchItem fail to fetch and return item', async () => {
            const error = new Error('unable to fetch item');
            const model = {
                findOne: jest.fn(() => {
                    throw error;
                })
            };
            expect(() => fetchItem(model)).rejects.toThrow(error);
        });
    });

    describe('updateItem tests', () => {
        it('should updateItem successfully update and return item', async () => {
            const model = {
                findOne: jest.fn(args => Promise.resolve(args)),
                updateOne: jest.fn((_, args) => Promise.resolve(args))
            };
            const where = { chakra: 65 };
            const args = { name: 'obito' };
            const item = await updateItem(model, where, args);
            expect(model.updateOne).toBeCalledWith(where, args);
            expect(model.findOne).toBeCalledWith(where);
            expect(item).toEqual(where);
        });

        it('should updateItem fail to update item', async () => {
            const error = new Error('unable to update item');
            const model = {
                updateOne: jest.fn(() => {
                    throw error;
                })
            };
            expect(() => updateItem(model)).rejects.toThrow(error);
        });
    });

    describe('deleteItem tests', () => {
        it('should deleteItem successfully delete item', async () => {
            const deleteMsg = 'delete success';
            const model = {
                deleteOne: jest.fn(() => Promise.resolve(deleteMsg))
            };
            const args = { name: 'obito' };
            const item = await deleteItem(model, args);
            expect(model.deleteOne).toBeCalledWith(args);
            expect(item).toEqual(deleteMsg);
        });

        it('should deleteItem fail to delete item', async () => {
            const error = new Error('unable to delete item');
            const model = {
                deleteOne: jest.fn(() => {
                    throw error;
                })
            };
            expect(() => deleteItem(model)).rejects.toThrow(error);
        });
    });

    describe('createUser tests', () => {
        it('should createUser successfully create and return item', async () => {
            const model = {
                create: jest.fn(args => Promise.resolve(args))
            };
            const args = { name: 'madara' };
            const item = await createUser(model, args);
            expect(model.create).toBeCalledWith(args);
            expect(item).toEqual(args);
        });

        it('should createUser fail and throw error', async () => {
            const error = new Error('unable to create item');
            const model = {
                create: jest.fn(() => {
                    throw error;
                })
            };
            expect(() => createUser(model)).rejects.toThrow(error);
        });
    });
});
