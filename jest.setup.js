require('dotenv').config({
    path: `.env.test`
});
process.env.ENVIRONMENT_NAME = 'test';
beforeEach(() => {
    process.env = { ...process.env, ENVIRONMENT_NAME: 'test' };
});

afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
});

jest.doMock('ioredis', () =>
    jest.fn().mockImplementation(() => ({
        publish: () => ({}),
        set: msg =>
            JSON.stringify({
                msg
            }),
        get: msg =>
            JSON.stringify({
                msg
            })
    }))
);
