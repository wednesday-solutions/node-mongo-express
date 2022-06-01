import rateLimit from 'express-rate-limit';

export const rateLimiter = options => rateLimit(options);
