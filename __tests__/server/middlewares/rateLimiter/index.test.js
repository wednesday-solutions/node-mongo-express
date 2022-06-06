jest.mock('express-rate-limit');

describe('rateLimiter test', () => {
    it('should call rateLimiter', async () => {
        let options = {
            windowMs: 15 * 60 * 1000,
            max: 100,
            standardHeaders: true,
            legacyHeaders: false
        };
        const limiter = require('express-rate-limit');
        const { rateLimiter } = require('middlewares/rateLimiter');
        rateLimiter(options);
        expect(limiter).toBeCalledWith(expect.objectContaining(options));
    });
});
