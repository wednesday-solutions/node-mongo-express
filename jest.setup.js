process.env.ENVIRONMENT_NAME = 'test';
beforeEach(() => {
    process.env = { ...process.env, ENVIRONMENT_NAME: 'test' };
});
afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.resetModules();
});
