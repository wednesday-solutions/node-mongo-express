import { isTestEnv } from '..';

describe('isTestEnv tests', () => {
    it('should give isTestEnv true if ENVIRONMENT_NAME is test', () => {
        process.env.ENVIRONMENT_NAME = 'test';
        expect(isTestEnv()).toBe(true);
    });
    it('should give isTestEnv true if NODE_ENV is test', () => {
        process.env.ENVIRONMENT_NAME = '';
        process.env.NODE_ENV = 'test';
        expect(isTestEnv()).toBe(true);
    });

    it('should give isTestEnv false if neither NODE_ENV nor ENVIRONMENT_NAME is test', () => {
        process.env.ENVIRONMENT_NAME = '';
        process.env.NODE_ENV = '';
        expect(isTestEnv()).toBe(false);
    });
});
