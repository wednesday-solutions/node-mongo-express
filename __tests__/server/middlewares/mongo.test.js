import mongoose from 'mongoose';
import { getMongoUri } from 'utils/mongoConstants';
import { mongoConnector } from 'middlewares/mongo';

jest.mock('mongoose', () => ({
    connection: {
        readyState: 1,
        on: jest.fn().mockImplementation((_, cb) => cb()),
        once: jest.fn().mockImplementation((_, cb) => cb())
    },
    connect: jest.fn()
}));

describe('mongooseConnector tests', () => {
    it('should create new mongodb connection if the connection is not made', async () => {
        mongoose.connection = {
            ...mongoose.connection,
            readyState: 0
        };

        await mongoConnector();
        expect(mongoose.connect).toBeCalledWith(getMongoUri());
        expect(mongoose.connection.on).toBeCalledWith(
            'error',
            expect.any(Function)
        );
        expect(mongoose.connection.once).toBeCalledWith(
            'open',
            expect.any(Function)
        );
    });

    it('should return mongodb connection if the connection already exists', async () => {
        mongoose.connection = {
            ...mongoose.connection,
            readyState: 1
        };

        await mongoConnector();
        expect(mongoose.connect).not.toBeCalled();
    });
});
