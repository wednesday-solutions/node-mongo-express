import { newCircuitBreaker } from '../circuitBreaker';

describe('newCircuitBreaker tests', () => {
    const fallbackMessage = 'Some fallback message';
    it('should return response from the api', async () => {
        const data = 'this is some api response';
        const someFunc = async () => ({ data });
        const testme = 'testme';
        const breaker = new newCircuitBreaker(someFunc, fallbackMessage);
        const res = await breaker.fire(testme);
        expect(res.data).toBe(data);
    });

    it('should return the fallback message if the API throws an error', async () => {
        const customError = 'This is some error';

        const somefunc = async () => {
            throw new Error(customError);
        };
        const testme = 'testme';
        const breaker = newCircuitBreaker(somefunc, fallbackMessage);
        const res = await breaker.fire(testme);
        expect(res).toBe(`${fallbackMessage}. ${customError}`);
    });
    it('should return the fallback message if the API throws an error without a message.', async () => {
        const somefunc = async () => {
            throw new Error();
        };
        const testme = 'testme';
        const breaker = newCircuitBreaker(somefunc, fallbackMessage);
        const res = await breaker.fire(testme);
        expect(res).toBe(`${fallbackMessage}. Error`);
    });
});
